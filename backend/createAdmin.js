require('dotenv').config();
const mongoose = require('mongoose');
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

const createAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existing = await User.findOne({ email: 'admin@stugig.com' });
    
    if (existing) {
      console.log('\n⚠️  Admin account already exists!');
      console.log('\n📋 Login with:');
      console.log('   Email: admin@stugig.com');
      console.log('   Password: admin123\n');
      process.exit(0);
    }

    // Create admin account
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@stugig.com',
      password: 'admin123',
      role: 'admin',
      bio: 'Platform administrator',
      isVerified: true,
      isEmailVerified: true
    });

    console.log('\n✅ Admin account created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n👨💼 ADMIN LOGIN CREDENTIALS:');
    console.log('\n   Email:    admin@stugig.com');
    console.log('   Password: admin123');
    console.log('\n   Access:   http://localhost:5173/login');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
