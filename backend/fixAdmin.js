require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const createOrUpdateAdmin = async () => {
  try {
    await connectDB();

    // Define User Schema inline
    const userSchema = new mongoose.Schema({
      firstName: String,
      email: String,
      password: String,
      role: String,
      isActive: { type: Boolean, default: true },
      isDeleted: { type: Boolean, default: false },
      isEmailVerified: { type: Boolean, default: true },
      balance: { type: Number, default: 0 },
      earnings: { type: Number, default: 0 },
      spending: { type: Number, default: 0 }
    });

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Hash password manually
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Upsert admin user
    const admin = await User.findOneAndUpdate(
      { email: 'admin@stugig.com' },
      {
        firstName: 'Admin',
        email: 'admin@stugig.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        isDeleted: false,
        isEmailVerified: true,
        balance: 0,
        earnings: 0,
        spending: 0
      },
      { upsert: true, new: true }
    );

    console.log('\n✅ Admin account created/updated successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n👨‍💼 ADMIN LOGIN CREDENTIALS:');
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

createOrUpdateAdmin();
