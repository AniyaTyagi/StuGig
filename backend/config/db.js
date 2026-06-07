const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected:', conn.connection.host);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('⚠️  Check: 1) Internet connection, 2) MongoDB Atlas IP whitelist, 3) Credentials');
    // Don't exit - let app run without DB for testing
  }
};

module.exports = connectDB;
