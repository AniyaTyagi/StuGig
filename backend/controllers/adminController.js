const User = require('../models/User');
const Job = require('../models/Job');
const Service = require('../models/Service');
const Payment = require('../models/Payment');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isDeleted: false });
    const activeJobs = await Job.countDocuments({ status: 'in_progress', isDeleted: false });
    
    const totalRevenue = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const platformRevenue = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$platformFee' } } }
    ]);

    const recentUsers = await User.find({ isDeleted: false })
      .select('firstName lastName email role avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentJobs = await Job.find({ isDeleted: false })
      .populate('client', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        users: { total: totalUsers },
        jobs: { active: activeJobs },
        revenue: {
          platform: platformRevenue[0]?.total || 0,
          total: totalRevenue[0]?.total || 0
        }
      },
      recentUsers,
      recentJobs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isDeleted = true;
    user.isActive = false;
    await user.save();

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
