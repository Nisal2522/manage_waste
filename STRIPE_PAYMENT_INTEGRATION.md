# Stripe Payment Gateway Integration Guide

## Overview
Integrated Stripe payment gateway to allow residents to pay their waste collection invoices online with credit/debit cards.

## Implementation Complete! ✅

### Features
1. **Stripe Checkout** - Secure hosted payment page
2. **Payment Button** - "Pay" button in invoice table and details dialog
3. **Webhook Integration** - Automatic invoice status update after payment
4. **Payment Verification** - Confirm payment completion
5. **Payment History** - Track paid invoices

## Setup Instructions

### 1. Get Stripe API Keys

1. **Create Stripe Account** (if you don't have one):
   - Go to: https://dashboard.stripe.com/register
   - Sign up for free

2. **Get Test API Keys**:
   - Go to: https://dashboard.stripe.com/test/apikeys
   - Copy your **Publishable key** (starts with `pk_test_`)
   - Copy your **Secret key** (starts with `sk_test_`)

3. **Update Backend `.env` File**:
   ```properties
   STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
   FRONTEND_URL=http://localhost:3000
   ```

### 2. Install Stripe Package

**Backend** (Already done):
```powershell
cd C:\Freelance\WastManagmentAvishka\manage_waste\backend
npm install stripe
```

### 3. Test Card Numbers

Use these test cards in Stripe Checkout:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Visa - Success |
| `4000 0025 0000 3155` | Visa - Requires authentication (3D Secure) |
| `4000 0000 0000 9995` | Visa - Declined |

- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

## Files Created/Modified

### Backend Files

1. **✅ `backend/controllers/paymentController.js`** (NEW)
   - `createCheckoutSession()` - Create Stripe payment session
   - `handleStripeWebhook()` - Handle payment completion
   - `verifyPaymentSession()` - Verify payment after redirect
   - `confirmManualPayment()` - For admin manual confirmation
   - `getPaymentHistory()` - Get user's payment history

2. **✅ `backend/routes/payments.js`** (NEW)
   - `POST /api/payments/create-checkout-session`
   - `POST /api/payments/webhook` (for Stripe)
   - `GET /api/payments/verify/:sessionId`
   - `POST /api/payments/confirm-manual`
   - `GET /api/payments/history`

3. **✅ `backend/server.js`** (MODIFIED)
   - Added payment routes

4. **✅ `backend/package.json`** (MODIFIED)
   - Added `stripe@^14.7.0` dependency

5. **✅ `backend/.env`** (MODIFIED)
   - Added Stripe configuration

### Frontend Files

1. **✅ `frontend/src/utils/api.jsx`** (MODIFIED)
   - Added `createStripeCheckoutSession()`
   - Added `verifyPaymentSession()`
   - Added `getPaymentHistory()`

2. **✅ `frontend/src/pages/dashboard/resident/ResidentInvoices.jsx`** (MODIFIED)
   - Added "Pay" button in invoice table
   - Added "Pay Now" button in invoice details dialog
   - Added `handlePayNow()` function
   - Added payment processing state

3. **✅ `frontend/src/components/Layout/UniversalSidebar.jsx`** (MODIFIED)
   - Updated resident menu: "Payments" → "My Invoices"
   - Fixed path: `/resident/payments` → `/resident/invoices`

## How It Works

### Payment Flow

1. **Resident Clicks "Pay"**
   - Button appears next to pending invoices
   - Can click "Pay" in table or "Pay Now" in details dialog

2. **Create Checkout Session**
   - Frontend calls: `POST /api/payments/create-checkout-session`
   - Backend creates Stripe session with invoice details
   - Returns Stripe checkout URL

3. **Redirect to Stripe**
   - User is redirected to Stripe's secure checkout page
   - Stripe handles all payment processing
   - User enters card details on Stripe (not your site)

4. **Payment Processing**
   - Stripe processes the payment
   - User is redirected back to your site:
     - Success: `/resident/invoices?payment=success&session_id={SESSION_ID}`
     - Cancel: `/resident/invoices?payment=cancelled`

5. **Webhook Notification**
   - Stripe sends webhook to: `POST /api/payments/webhook`
   - Backend verifies webhook signature
   - Invoice status updated to "paid"
   - Payment date and method saved

### Code Example

**Frontend - Initiating Payment:**
```javascript
const handlePayNow = async (invoice) => {
  try {
    setProcessingPayment(true);
    
    // Create Stripe checkout session
    const response = await createStripeCheckoutSession(invoice._id);
    
    if (response.success && response.url) {
      // Redirect to Stripe checkout
      window.location.href = response.url;
    }
  } catch (error) {
    console.error('Payment failed:', error);
  } finally {
    setProcessingPayment(false);
  }
};
```

**Backend - Creating Checkout Session:**
```javascript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: {
        name: `Invoice ${invoice.invoiceNumber}`,
        description: `Waste collection - ${invoice.wasteType} (${invoice.weight} kg)`,
      },
      unit_amount: Math.round(invoice.totalAmount * 100), // Cents
    },
    quantity: 1,
  }],
  mode: 'payment',
  success_url: `http://localhost:3000/resident/invoices?payment=success`,
  cancel_url: `http://localhost:3000/resident/invoices?payment=cancelled`,
  metadata: {
    invoiceId: invoice._id,
    invoiceNumber: invoice.invoiceNumber
  }
});
```

## Testing the Payment System

### Step 1: Create an Invoice (Admin)
1. Login as admin
2. Go to Collections page
3. Click invoice button next to a collection
4. Fill in details and create invoice

### Step 2: View Invoice (Resident)
1. Login as resident (owner of the bin)
2. Go to "My Invoices" in sidebar
3. You should see the pending invoice
4. **"Pay" button should appear** next to the invoice

### Step 3: Make Payment
1. Click the **"Pay"** button
2. You'll be redirected to Stripe Checkout
3. Use test card: `4242 4242 4242 4242`
4. Enter any future expiry, any CVC, any ZIP
5. Click "Pay"
6. You'll be redirected back to invoices page

### Step 4: Verify Payment
1. Invoice status should change to **"Paid"** ✅
2. "Pay" button should disappear
3. Green checkmark should appear
4. Payment date should be recorded

## Webhook Setup (For Production)

### Local Testing with Stripe CLI

1. **Install Stripe CLI**:
   ```powershell
   # Download from: https://github.com/stripe/stripe-cli/releases/latest
   # Or use Scoop:
   scoop install stripe
   ```

2. **Login to Stripe**:
   ```powershell
   stripe login
   ```

3. **Forward Webhooks to Local Server**:
   ```powershell
   stripe listen --forward-to http://localhost:5000/api/payments/webhook
   ```

4. **Copy Webhook Secret**:
   - CLI will display: `whsec_...`
   - Update `.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`

### Production Webhook Setup

1. **Go to Stripe Dashboard**:
   - https://dashboard.stripe.com/webhooks

2. **Add Endpoint**:
   - Click "Add endpoint"
   - URL: `https://yourdomain.com/api/payments/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `checkout.session.expired`
     - `payment_intent.payment_failed`

3. **Get Webhook Secret**:
   - Copy the signing secret
   - Update production `.env`

## API Endpoints

### POST /api/payments/create-checkout-session
**Create Stripe checkout session**

**Request:**
```json
{
  "invoiceId": "68f2ee1a..."
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### POST /api/payments/webhook
**Stripe webhook endpoint (called by Stripe)**

**Headers:**
```
stripe-signature: t=...,v1=...
```

**Body:** Stripe event object

**Response:**
```json
{
  "received": true
}
```

### GET /api/payments/verify/:sessionId
**Verify payment session**

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentStatus": "paid",
    "invoice": {...},
    "amountTotal": 70.00,
    "customerEmail": "resident@example.com"
  }
}
```

### GET /api/payments/history
**Get payment history for current user**

**Response:**
```json
{
  "success": true,
  "data": [...paid invoices...],
  "count": 5
}
```

## Security Features

1. **Webhook Signature Verification**
   - All webhooks verified with Stripe signature
   - Prevents fake webhook calls

2. **User Authorization**
   - Only invoice owner can pay
   - Checked before creating checkout session

3. **HTTPS Required in Production**
   - Stripe requires HTTPS for webhooks
   - Use SSL certificate

4. **PCI Compliance**
   - Card details never touch your server
   - All handled by Stripe

5. **Idempotency**
   - Duplicate invoices prevented
   - Only one payment per invoice

## Troubleshooting

### Issue: "Pay" button not showing
**Check:**
- Invoice status is "pending"
- Resident is logged in
- Invoice belongs to the logged-in resident
- Frontend is refreshed

### Issue: Payment not completing
**Check:**
1. Backend server is running
2. Stripe secret key is correct in `.env`
3. Test mode keys are used (start with `pk_test_` and `sk_test_`)
4. Browser console for errors

### Issue: Invoice not updating after payment
**Check:**
1. Webhook secret is correct
2. Stripe webhook is reaching your server
3. Backend logs for webhook errors
4. Use Stripe CLI for local testing

### Issue: Redirect URL not working
**Check:**
- `FRONTEND_URL` in `.env` matches your frontend URL
- Success/cancel URLs are accessible

## Cost

### Stripe Fees
- **2.9% + $0.30** per successful card charge
- Example: $70 invoice = $70 × 0.029 + $0.30 = **$2.33 fee**
- You receive: **$67.67**

### Test Mode
- **FREE** - No charges in test mode
- Unlimited test transactions

## UI Components

### Payment Button in Table
```javascript
{invoice.status === 'pending' && (
  <Button
    size="small"
    variant="contained"
    onClick={() => handlePayNow(invoice)}
    disabled={processingPayment}
    sx={{
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      textTransform: 'none',
      minWidth: '70px',
    }}
  >
    {processingPayment ? <CircularProgress size={16} /> : 'Pay'}
  </Button>
)}
```

### Payment Button in Dialog
```javascript
{selectedInvoice?.status === 'pending' && (
  <Button 
    variant="contained"
    onClick={() => handlePayNow(selectedInvoice)}
    disabled={processingPayment}
    sx={{
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    }}
  >
    {processingPayment ? <CircularProgress size={24} /> : 'Pay Now'}
  </Button>
)}
```

## Database Updates

### Invoice Status Flow
```
pending → (payment successful) → paid
         ↓
    (payment failed) → pending (remains)
         ↓
    (webhook error) → pending (remains, can retry)
```

### Fields Updated After Payment
```javascript
{
  status: 'paid',
  paidDate: new Date(),
  paymentMethod: 'card'
}
```

## Next Steps

### 1. Get Real Stripe Account
- Sign up: https://dashboard.stripe.com/register
- Complete business verification
- Switch to live API keys

### 2. Configure Live Keys
- Replace `sk_test_` with `sk_live_`
- Update `.env` with live keys
- Test in production

### 3. Set Up Webhooks
- Add production webhook endpoint
- Configure events
- Update webhook secret

### 4. Add Payment Receipts
- Email receipts to residents
- PDF invoice generation
- Payment confirmation page

### 5. Add Payment Methods
- Bank transfers (ACH)
- Digital wallets (Apple Pay, Google Pay)
- Alternative payment methods

## Summary

✅ **Stripe Integration Complete**
- Payment controller created
- Payment routes added
- Frontend payment buttons added
- Webhook handler implemented
- Invoice auto-update on payment
- Secure payment flow
- Test mode ready

**🎉 Residents can now pay their invoices online with credit/debit cards!**

---

**Date**: October 18, 2025
**Version**: 1.0.0
**Status**: ✅ Ready for Testing
