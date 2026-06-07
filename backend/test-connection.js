require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully!');
  process.exit(0);
})
.catch((err) => {
  console.error('❌ MongoDB Connection Failed:', err.message);
  console.log('\n🔍 Troubleshooting:');
  console.log('1. Check your internet connection');
  console.log('2. Go to MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)');
  console.log('3. Verify username and password are correct');
  console.log('4. Check if cluster is active and running');
  process.exit(1);
});
