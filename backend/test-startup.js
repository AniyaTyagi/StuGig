require('dotenv').config();
const path = require('path');

console.log('🔍 Verifying StuGig Backend Setup...\n');

// Check environment variables
console.log('✅ Environment Variables:');
console.log(`   PORT: ${process.env.PORT || 5000}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log(`   CLIENT_URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
console.log('');

// Check route files
console.log('✅ Route Files:');
const routeFiles = [
  'admin.routes.js',
  'ai.routes.js',
  'auth.routes.js',
  'bid.routes.js',
  'invitation.routes.js',
  'job.routes.js',
  'message.routes.js',
  'notification.routes.js',
  'payment.routes.js',
  'review.routes.js',
  'service.routes.js',
  'user.routes.js'
];

const fs = require('fs');
let allRoutesExist = true;

routeFiles.forEach(file => {
  const filePath = path.join(__dirname, 'routes', file);
  const exists = fs.existsSync(filePath);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allRoutesExist = false;
});

console.log('');

if (!allRoutesExist) {
  console.error('❌ Some route files are missing!');
  process.exit(1);
}

// Try to load server
try {
  console.log('🚀 Starting server...\n');
  require('./server.js');
} catch (error) {
  console.error('❌ Server failed to start:');
  console.error(error.message);
  console.error('\nStack trace:');
  console.error(error.stack);
  process.exit(1);
}
