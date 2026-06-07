const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testSignup() {
  console.log('Testing signup endpoint...\n');
  
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    role: 'student'
  };

  try {
    console.log('Sending request to:', `${API_URL}/auth/register`);
    console.log('Data:', JSON.stringify(testUser, null, 2));
    
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    
    console.log('\n✅ SUCCESS!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.data && response.data.data.token) {
      console.log('\n✅ Token received:', response.data.data.token.substring(0, 20) + '...');
      console.log('✅ User created:', response.data.data.user.email);
    }
    
  } catch (error) {
    console.error('\n❌ ERROR!');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response from server!');
      console.error('Is backend running on port 5000?');
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run test
testSignup();
