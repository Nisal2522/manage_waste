// Test script for user stats API
const axios = require('axios');

const testUserStats = async () => {
  try {
    console.log('🧪 Testing User Stats API...');
    
    // Test the user stats endpoint
    const response = await axios.get('http://localhost:5000/api/user-stats', {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
      }
    });
    
    console.log('✅ User Stats API Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing User Stats API:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

// Run the test
testUserStats();
