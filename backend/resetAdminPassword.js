require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const resetAdminPassword = async () => {
  try {
    await connectDB();

    // Find admin account
    const admin = await User.findOne({ email: 'admin@stugig.com' });
    
    if (!admin) {
      console.log('\n❌ Admin account not found!');
      console.log('   Create it first at: http://localhost:5173/signup\n');
      process.exit(1);
    }

    // Reset password
    admin.password = 'admin123';
    admin.isActive = true;
    admin.isDeleted = false;
    await admin.save();

    console.log('\n✅ Admin password reset successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n👨💼 ADMIN LOGIN:');
    console.log('\n   Email:    admin@stugig.com');
    console.log('   Password: admin123');
    console.log('\n   Login at: http://localhost:5173/login');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetAdminPassword();
