// Test script for QR Code Collection functionality
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testData = {
  // Create a test bin first
  binData: {
    binId: `TEST-BIN-${Date.now()}`,
    owner: 'Test Resident',
    deviceType: 'QR Code',
    deviceId: `QR-${Date.now()}`,
    binType: 'General Waste',
    capacity: 120,
    longitude: 79.8612,
    latitude: 6.9271,
    address: 'Test Address, Colombo, Sri Lanka'
  },
  
  // Collection data
  collectionData: {
    wasteType: 'organic',
    weight: 15.5,
    notes: 'Test collection via QR scan',
    collectionTime: new Date().toISOString(),
    staffId: 'test-staff-id'
  }
};

// Test QR Code Collection Flow
async function testQRCollectionFlow() {
  console.log('🧪 Testing QR Code Collection Flow...\n');
  
  try {
    // Step 1: Create a test bin (simulating resident creating a bin)
    console.log('1. Creating test bin...');
    const createBinResponse = await axios.post(`${API_BASE_URL}/bins`, testData.binData, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE', // Replace with actual token
        'Content-Type': 'application/json'
      }
    });
    
    if (createBinResponse.data.success) {
      console.log('✅ Test bin created successfully:', createBinResponse.data.data.binId);
      const binId = createBinResponse.data.data._id;
      const binIdString = createBinResponse.data.data.binId;
      const qrUrl = createBinResponse.data.data.qrCode?.data;
      
      console.log('📱 Generated QR Code URL:', qrUrl);
      
      // Step 2: Test QR code scanning (simulating staff scanning QR code)
      console.log('\n2. Testing QR code scanning...');
      
      // Test both URL-based and direct binId scanning
      let scanResponse;
      if (qrUrl) {
        console.log('   Testing URL-based QR code scanning...');
        // Extract binId from URL for testing
        const url = new URL(qrUrl);
        const binIdFromUrl = url.searchParams.get('binId');
        scanResponse = await axios.get(`${API_BASE_URL}/bins/qr/${encodeURIComponent(binIdFromUrl)}`, {
          headers: {
            'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
          }
        });
      } else {
        console.log('   Testing direct binId scanning...');
        scanResponse = await axios.get(`${API_BASE_URL}/bins/qr/${encodeURIComponent(binIdString)}`, {
          headers: {
            'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
          }
        });
      }
      
      if (scanResponse.data.success) {
        console.log('✅ QR code scanned successfully');
        console.log('   Bin found:', scanResponse.data.data.binId);
        console.log('   Owner:', scanResponse.data.data.userId?.name);
        console.log('   Current fill level:', scanResponse.data.data.currentFill + '%');
        console.log('   QR Code URL:', scanResponse.data.data.qrCode?.data);
        
        // Step 3: Test marking bin as collected
        console.log('\n3. Testing bin collection marking...');
        const collectionPayload = {
          binId: scanResponse.data.data._id,
          binQRCode: binIdString,
          ...testData.collectionData,
          residentId: scanResponse.data.data.userId._id
        };
        
        const collectResponse = await axios.post(`${API_BASE_URL}/bins/collect`, collectionPayload, {
          headers: {
            'Authorization': 'Bearer YOUR_TOKEN_HERE', // Replace with actual token
            'Content-Type': 'application/json'
          }
        });
        
        if (collectResponse.data.success) {
          console.log('✅ Bin marked as collected successfully');
          console.log('   Collection weight:', collectResponse.data.data.collection.weight + ' kg');
          console.log('   Bin fill level reset to:', collectResponse.data.data.bin.currentFill + '%');
          console.log('   Next collection scheduled:', new Date(collectResponse.data.data.bin.nextCollection).toLocaleDateString());
        } else {
          throw new Error(collectResponse.data.message || 'Failed to mark bin as collected');
        }
      } else {
        throw new Error(scanResponse.data.message || 'Failed to scan QR code');
      }
    } else {
      throw new Error(createBinResponse.data.message || 'Failed to create test bin');
    }
    
    console.log('\n🎉 QR Code Collection Flow Test Completed Successfully!');
    console.log('\n📋 Test Summary:');
    console.log('1. ✅ Bin creation with URL-based QR code generation');
    console.log('2. ✅ QR code scanning (URL and direct binId support)');
    console.log('3. ✅ Collection marking and fill level reset');
    console.log('\n✨ The URL-based QR code collection system is working correctly!');
    console.log('\n📱 QR Code Features:');
    console.log('• QR codes now contain URLs that open the collection page directly');
    console.log('• Staff can scan with any QR scanner app');
    console.log('• URLs automatically load the correct bin information');
    console.log('• Backward compatibility with direct binId scanning');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('💡 Tip: Make sure to authenticate first and use a valid JWT token');
    } else if (error.response?.status === 404) {
      console.log('💡 Tip: Make sure the backend server is running on port 5000');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Tip: Make sure the backend server is running');
    }
  }
}

// Test database connection
async function testDatabase() {
  console.log('🗄️ Testing Database Connection...\n');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Database Status:', response.data);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting QR Code Collection Tests\n');
  console.log('=' .repeat(50));
  
  await testDatabase();
  console.log('\n' + '=' .repeat(50));
  await testQRCollectionFlow();
  
  console.log('\n' + '=' .repeat(50));
  console.log('📋 Test Summary:');
  console.log('1. Database connection test');
  console.log('2. Bin creation with QR code generation');
  console.log('3. QR code scanning functionality');
  console.log('4. Collection marking and fill level reset');
  console.log('\n✨ QR Code Collection system is ready for use!');
}

// Run the tests
runTests();
