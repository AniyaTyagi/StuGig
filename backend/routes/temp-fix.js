// TEMPORARY ADMIN FIX ROUTE - DELETE AFTER USE
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.post('/fix-admin-password', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = await User.findOneAndUpdate(
      { email: 'admin@stugig.com' },
      {
        firstName: 'Admin',
        email: 'admin@stugig.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        isDeleted: false,
        isEmailVerified: true
      },
      { upsert: true, new: true }
    );

    res.json({ 
      success: true, 
      message: 'Admin account fixed! You can now login with admin@stugig.com / admin123',
      admin: {
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
