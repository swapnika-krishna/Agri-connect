const Activity = require('../models/Activity');
const Farm = require('../models/Farm');

/**
 * @desc    Get all activities for a specific farm
 * @route   GET /api/farms/:farmId/activities
 * @access  Private
 */
exports.getActivitiesByFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.farmId);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm parcel not found' });
    }

    if (farm.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view these farm activities' });
    }

    const activities = await Activity.find({ farm: req.params.farmId }).sort('-date');
    res.status(200).json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all activities for logged in farmer
 * @route   GET /api/activities
 * @access  Private (Farmer)
 */
exports.getAllMyActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find({ owner: req.user.id }).sort('-date');
    res.status(200).json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new farm activity log
 * @route   POST /api/activities
 * @access  Private (Farmer)
 */
exports.createActivity = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.body.farm);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Referenced farm parcel not found' });
    }

    if (farm.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to log activities for this farm' });
    }

    const activity = await Activity.create({
      ...req.body,
      owner: req.user.id,
    });

    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an activity entry
 * @route   PUT /api/activities/:id
 * @access  Private (Owner only)
 */
exports.updateActivity = async (req, res, next) => {
  try {
    let activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity log not found' });
    }

    if (activity.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this activity' });
    }

    activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an activity entry
 * @route   DELETE /api/activities/:id
 * @access  Private (Owner only)
 */
exports.deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity log not found' });
    }

    if (activity.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this activity' });
    }

    await Activity.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Activity log removed' });
  } catch (error) {
    next(error);
  }
};
