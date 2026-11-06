const User = require('../models/User');
const Farm = require('../models/Farm');
const Query = require('../models/Query');
const Activity = require('../models/Activity');
const Crop = require('../models/Crop');

/**
 * @desc    Get system-wide platform statistics
 * @route   GET /api/admin/stats
 * @access  Private (Admin only)
 */
exports.getStats = async (req, res, next) => {
  try {
    const [
      totalFarmers,
      totalExperts,
      totalFarms,
      totalQueries,
      openQueries,
      resolvedQueries,
      totalActivities,
      totalCrops,
    ] = await Promise.all([
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'expert' }),
      Farm.countDocuments(),
      Query.countDocuments(),
      Query.countDocuments({ status: 'Open' }),
      Query.countDocuments({ status: 'Resolved' }),
      Activity.countDocuments(),
      Crop.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalFarmers,
        totalExperts,
        totalFarms,
        totalQueries,
        openQueries,
        resolvedQueries,
        totalActivities,
        totalCrops,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users with filtering
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort('-createdAt');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle user active status
 * @route   PUT /api/admin/users/:id/status
 * @access  Private (Admin only)
 */
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve expert application
 * @route   PUT /api/admin/users/:id/approve
 * @access  Private (Admin only)
 */
exports.approveExpert = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isApproved = true;
    await user.save();

    res.status(200).json({ success: true, message: 'Expert approved successfully', data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user account and related records
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin only)
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    await Farm.deleteMany({ owner: req.params.id });
    await Activity.deleteMany({ owner: req.params.id });

    res.status(200).json({ success: true, message: 'User and associated records deleted' });
  } catch (error) {
    next(error);
  }
};
