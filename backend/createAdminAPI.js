const http = require('http');

const createAdminViaAPI = () => {
  console.log('\n🔄 Creating admin account via API...\n');
  
  const data = JSON.stringify({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@stugig.com',
    password: 'admin123',
    role: 'admin'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    
    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 201) {
        console.log('✅ Admin account created successfully!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n👨💼 ADMIN LOGIN CREDENTIALS:');
        console.log('\n   Email:    admin@stugig.com');
        console.log('   Password: admin123');
        console.log('\n   Access:   http://localhost:5173/login');
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      } else if (res.statusCode === 400) {
        console.log('\n⚠️  Admin account already exists!');
        console.log('\n📋 Login with:');
        console.log('   Email: admin@stugig.com');
        console.log('   Password: admin123\n');
      } else {
        console.log('❌ Error:', body);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 5000');
    console.log('   Run: npm run dev\n');
  });

  req.write(data);
  req.end();
};

createAdminViaAPI();
