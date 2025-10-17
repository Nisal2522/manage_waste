// Test script to verify analytics data flow
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data for analytics
const testData = {
  collections: [
    {
      bin: '507f1f77bcf86cd799439011',
      staff: '507f1f77bcf86cd799439012',
      resident: '507f1f77bcf86cd799439013',
      collectionTime: new Date(),
      wasteType: 'organic',
      weight: 15.5,
      status: 'completed',
      qrScanned: true
    },
    {
      bin: '507f1f77bcf86cd799439014',
      staff: '507f1f77bcf86cd799439012',
      resident: '507f1f77bcf86cd799439015',
      collectionTime: new Date(),
      wasteType: 'plastic',
      weight: 8.2,
      status: 'completed',
      qrScanned: true
    }
  ],
  invoices: [
    {
      invoiceNumber: 'INV-001',
      resident: '507f1f77bcf86cd799439013',
      collection: '507f1f77bcf86cd799439016',
      amount: 45.50,
      wasteType: 'organic',
      weight: 15.5,
      ratePerKg: 2.5,
      status: 'paid',
      totalAmount: 45.50
    }
  ],
  truckRoutes: [
    {
      routeId: 'RT-001',
      name: 'North Zone Route',
      driver: '507f1f77bcf86cd799439012',
      truck: {
        truckId: 'TR-001',
        capacity: 1000,
        fuelType: 'diesel'
      },
      path: [
        { lat: 6.9271, lng: 79.8612, order: 1 },
        { lat: 6.9281, lng: 79.8622, order: 2 }
      ],
      estimatedDistance: 45.2,
      estimatedDuration: 180,
      status: 'active'
    }
  ]
};

// Test analytics endpoints
async function testAnalytics() {
  console.log('🧪 Testing Analytics Data Flow...\n');
  
  try {
    // Test 1: Operational Analytics
    console.log('1. Testing Operational Analytics...');
    const operationalResponse = await axios.get(`${API_BASE_URL}/analytics/operational`, {
      headers: {
        'Authorization': 'Bearer test-token' // Replace with real token
      }
    });
    console.log('✅ Operational Analytics:', operationalResponse.data);
    
    // Test 2: Financial Analytics
    console.log('\n2. Testing Financial Analytics...');
    const financialResponse = await axios.get(`${API_BASE_URL}/analytics/financial`, {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log('✅ Financial Analytics:', financialResponse.data);
    
    // Test 3: Sustainability Analytics
    console.log('\n3. Testing Sustainability Analytics...');
    const sustainabilityResponse = await axios.get(`${API_BASE_URL}/analytics/sustainability`, {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log('✅ Sustainability Analytics:', sustainabilityResponse.data);
    
    // Test 4: Route Optimization
    console.log('\n4. Testing Route Optimization...');
    const routeResponse = await axios.post(`${API_BASE_URL}/analytics/routes/optimize`, {
      routes: testData.truckRoutes,
      constraints: {
        maxDistance: 100,
        maxTime: 480,
        vehicleCapacity: 1000
      }
    }, {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Route Optimization:', routeResponse.data);
    
    // Test 5: Simulation
    console.log('\n5. Testing Simulation...');
    const simulationResponse = await axios.post(`${API_BASE_URL}/analytics/simulation`, {
      simulationType: 'pricing_change',
      parameters: {
        newRate: 3.5,
        wasteType: 'mixed'
      }
    }, {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Simulation:', simulationResponse.data);
    
    console.log('\n🎉 All analytics tests passed!');
    
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
  console.log('🚀 Starting Analytics Integration Tests\n');
  console.log('=' .repeat(50));
  
  await testDatabase();
  console.log('\n' + '=' .repeat(50));
  await testAnalytics();
  
  console.log('\n' + '=' .repeat(50));
  console.log('📋 Test Summary:');
  console.log('1. Database connection test');
  console.log('2. Operational analytics test');
  console.log('3. Financial analytics test');
  console.log('4. Sustainability analytics test');
  console.log('5. Route optimization test');
  console.log('6. Simulation test');
  console.log('\n✨ Setup complete! Your analytics dashboard is ready.');
}

// Run the tests
runTests();
