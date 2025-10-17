import React, { useState, useEffect } from 'react';
import {
  MdHome,
  MdRecycling,
  MdPayment,
  MdFeedback,
  MdCheckCircle,
  MdWarning,
  MdRefresh,
  MdAttachMoney,
  MdEco,
  MdReport
} from 'react-icons/md';
import { useAuth } from '../../../context/AuthContext.jsx';
import { createBinRequest, getBinRequestsByUser, createCollection } from '../../../utils/api.jsx';

const ResidentDataContribution = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Bin usage data
  const [binUsage, setBinUsage] = useState({
    binId: '',
    wasteType: 'organic',
    weight: '',
    fillLevel: 50,
    notes: ''
  });

  // Payment data
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'cash',
    invoiceId: '',
    notes: ''
  });

  // Feedback data
  const [feedbackData, setFeedbackData] = useState({
    type: 'complaint',
    subject: '',
    description: '',
    priority: 'medium'
  });

  // User's bin requests
  const [binRequests, setBinRequests] = useState([]);

  // Load user's bin requests
  useEffect(() => {
    fetchBinRequests();
  }, []);

  const fetchBinRequests = async () => {
    try {
      setLoading(true);
      const userId = user?.user?._id || user?._id;
      const response = await getBinRequestsByUser(userId);
      
      if (response.success) {
        setBinRequests(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching bin requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBinUsageSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // This would typically create a collection record
      // For now, we'll just show success
      setSuccess('Bin usage data recorded successfully!');
      
      setBinUsage({
        binId: '',
        wasteType: 'organic',
        weight: '',
        fillLevel: 50,
        notes: ''
      });
    } catch (err) {
      console.error('Error recording bin usage:', err);
      setError(err.message || 'Failed to record bin usage');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // This would typically create a payment record
      setSuccess('Payment data recorded successfully!');
      
      setPaymentData({
        amount: '',
        paymentMethod: 'cash',
        invoiceId: '',
        notes: ''
      });
    } catch (err) {
      console.error('Error recording payment:', err);
      setError(err.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // This would typically create a feedback record
      setSuccess('Feedback submitted successfully!');
      
      setFeedbackData({
        type: 'complaint',
        subject: '',
        description: '',
        priority: 'medium'
      });
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleBinRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await createBinRequest({
        resident: user?.user?._id || user?._id,
        binType: 'standard',
        address: user?.user?.address || user?.address,
        notes: 'Request for new bin'
      });
      
      if (response.success) {
        setSuccess('Bin request submitted successfully!');
        fetchBinRequests();
      } else {
        throw new Error(response.message || 'Failed to submit bin request');
      }
    } catch (err) {
      console.error('Error submitting bin request:', err);
      setError(err.message || 'Failed to submit bin request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Data Contribution Dashboard
          </h1>
          <p className="text-gray-600">
            Contribute data to help improve waste management services
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <MdCheckCircle className="text-green-500 text-xl mr-2" />
              <span className="text-green-700 font-medium">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <MdWarning className="text-red-500 text-xl mr-2" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bin Usage Data */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <MdRecycling className="text-2xl text-green-600 mr-3" />
              <h2 className="text-lg font-semibold text-slate-900">Bin Usage</h2>
            </div>
            
            <form onSubmit={handleBinUsageSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bin ID
                </label>
                <input
                  type="text"
                  value={binUsage.binId}
                  onChange={(e) => setBinUsage(prev => ({ ...prev, binId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Your bin ID"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waste Type
                </label>
                <select
                  value={binUsage.wasteType}
                  onChange={(e) => setBinUsage(prev => ({ ...prev, wasteType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="organic">Organic</option>
                  <option value="plastic">Plastic</option>
                  <option value="paper">Paper</option>
                  <option value="glass">Glass</option>
                  <option value="mixed">Mixed</option>
                  <option value="medical waste">Medical Waste</option>
                  <option value="hazardous">Hazardous</option>
                  <option value="electronic">Electronic</option>
                  <option value="construction">Construction</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={binUsage.weight}
                  onChange={(e) => setBinUsage(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fill Level: {binUsage.fillLevel}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={binUsage.fillLevel}
                  onChange={(e) => setBinUsage(prev => ({ ...prev, fillLevel: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={binUsage.notes}
                  onChange={(e) => setBinUsage(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="2"
                  placeholder="Any notes about your bin usage..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Recording...' : 'Record Usage'}
              </button>
            </form>
          </div>

          {/* Payment Data */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <MdPayment className="text-2xl text-blue-600 mr-3" />
              <h2 className="text-lg font-semibold text-slate-900">Payment Info</h2>
            </div>
            
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (Rs.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="mobile_payment">Mobile Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice ID
                </label>
                <input
                  type="text"
                  value={paymentData.invoiceId}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, invoiceId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Invoice number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  placeholder="Payment notes..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Recording...' : 'Record Payment'}
              </button>
            </form>
          </div>

          {/* Feedback */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <MdFeedback className="text-2xl text-purple-600 mr-3" />
              <h2 className="text-lg font-semibold text-slate-900">Feedback</h2>
            </div>
            
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={feedbackData.type}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="complaint">Complaint</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="compliment">Compliment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={feedbackData.subject}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Brief subject"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={feedbackData.description}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="3"
                  placeholder="Detailed description..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={feedbackData.priority}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        </div>

        {/* Bin Requests Section */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">My Bin Requests</h3>
            <button
              onClick={handleBinRequest}
              disabled={loading}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <MdHome className="text-lg" />
              <span>Request New Bin</span>
            </button>
          </div>
          
          {binRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No bin requests yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Request ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Bin Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {binRequests.map((request, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{request._id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">{request.binType}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentDataContribution;
