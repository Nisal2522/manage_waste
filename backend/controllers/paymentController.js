import Stripe from 'stripe';
import Invoice from '../models/Invoice.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key');

// Create Stripe checkout session for invoice payment
export const createCheckoutSession = async (req, res) => {
  try {
    const { invoiceId } = req.body;
    const userId = req.user.userId;

    console.log('💳 Creating Stripe checkout session for invoice:', invoiceId);
    console.log('User ID:', userId);

    // Get invoice details
    const invoice = await Invoice.findById(invoiceId)
      .populate('resident', 'name email')
      .populate('collection');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Verify the invoice belongs to the requesting user
    if (invoice.resident._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to pay this invoice'
      });
    }

    // Check if invoice is already paid
    if (invoice.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Invoice is already paid'
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Invoice ${invoice.invoiceNumber}`,
              description: `Waste collection - ${invoice.wasteType} (${invoice.weight} kg)`,
            },
            unit_amount: Math.round(invoice.totalAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/resident/invoices?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/resident/invoices?payment=cancelled`,
      client_reference_id: invoiceId,
      customer_email: invoice.resident.email,
      metadata: {
        invoiceId: invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        userId: userId,
      },
    });

    console.log('✅ Stripe session created:', session.id);

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('❌ Error creating Stripe checkout session:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment session',
      error: error.message
    });
  }
};

// Webhook to handle Stripe events
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature (skip if no webhook secret in development)
    if (webhookSecret && webhookSecret !== 'optional_for_local_testing') {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // For local testing without webhook secret
      event = JSON.parse(req.body.toString());
    }
    console.log('🔔 Stripe webhook received:', event.type);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('✅ Payment succeeded for session:', session.id);
      
      // Update invoice status
      const invoiceId = session.metadata.invoiceId;
      if (invoiceId) {
        try {
          const invoice = await Invoice.findByIdAndUpdate(
            invoiceId,
            {
              status: 'paid',
              paidDate: new Date(),
              paymentMethod: 'card'
            },
            { new: true }
          );
          console.log('✅ Invoice updated:', invoice.invoiceNumber);
        } catch (error) {
          console.error('❌ Error updating invoice:', error);
        }
      }
      break;

    case 'checkout.session.expired':
      console.log('⏱️ Payment session expired');
      break;

    case 'payment_intent.payment_failed':
      console.log('❌ Payment failed');
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};

// Verify payment session after redirect
export const verifyPaymentSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    console.log('🔍 Verifying payment session:', sessionId);

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log('📋 Stripe session retrieved:', {
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Payment session not found'
      });
    }

    // Get invoice details
    const invoiceId = session.metadata.invoiceId;
    console.log('📄 Invoice ID from metadata:', invoiceId);

    const invoice = await Invoice.findById(invoiceId)
      .populate('resident', 'name email')
      .populate('collection');

    console.log('📄 Invoice found:', invoice ? invoice.invoiceNumber : 'NOT FOUND');
    console.log('📄 Current invoice status:', invoice ? invoice.status : 'N/A');

    // If payment is successful, update invoice status
    if (session.payment_status === 'paid' && invoice && invoice.status !== 'paid') {
      invoice.status = 'paid';
      invoice.paidDate = new Date();
      invoice.paymentMethod = 'card';
      await invoice.save();
      console.log('✅ Invoice status updated to paid:', invoice.invoiceNumber);
    } else {
      console.log('⚠️ Invoice NOT updated. Payment status:', session.payment_status, 'Invoice already paid:', invoice?.status === 'paid');
    }

    res.json({
      success: true,
      data: {
        paymentStatus: session.payment_status,
        invoice: invoice,
        amountTotal: session.amount_total / 100, // Convert from cents
        customerEmail: session.customer_email
      }
    });
  } catch (error) {
    console.error('❌ Error verifying payment session:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

// Manual payment confirmation (for cash/bank transfer)
export const confirmManualPayment = async (req, res) => {
  try {
    const { invoiceId, paymentMethod, transactionId, notes } = req.body;

    console.log('💰 Confirming manual payment for invoice:', invoiceId);

    const invoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      {
        status: 'paid',
        paidDate: new Date(),
        paymentMethod: paymentMethod || 'manual',
        notes: notes ? `${invoice.notes || ''}\nPayment: ${notes} (Transaction: ${transactionId || 'N/A'})` : invoice.notes
      },
      { new: true }
    ).populate('resident', 'name email');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    console.log('✅ Manual payment confirmed for invoice:', invoice.invoiceNumber);

    res.json({
      success: true,
      data: invoice,
      message: 'Payment confirmed successfully'
    });
  } catch (error) {
    console.error('❌ Error confirming manual payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming payment',
      error: error.message
    });
  }
};

// Get payment history for a resident
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log('📜 Getting payment history for user:', userId);

    const paidInvoices = await Invoice.find({
      resident: userId,
      status: 'paid'
    })
      .populate('collection')
      .sort({ paidDate: -1 });

    res.json({
      success: true,
      data: paidInvoices,
      count: paidInvoices.length
    });
  } catch (error) {
    console.error('❌ Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history',
      error: error.message
    });
  }
};
