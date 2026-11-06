const Farm = require('../models/Farm');
const Activity = require('../models/Activity');

/**
 * @desc    Get all farms owned by the logged-in farmer
 * @route   GET /api/farms
 * @access  Private (Farmer)
 */
exports.getFarms = async (req, res, next) => {
  try {
    const farms = await Farm.find({ owner: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: farms.length, data: farms });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single farm by ID
 * @route   GET /api/farms/:id
 * @access  Private
 */
exports.getFarmById = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm parcel not found' });
    }

    // Ensure farmer owns farm or user is admin
    if (farm.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to access this farm' });
    }

    res.status(200).json({ success: true, data: farm });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new farm parcel
 * @route   POST /api/farms
 * @access  Private (Farmer)
 */
exports.createFarm = async (req, res, next) => {
  try {
    const farmData = {
      ...req.body,
      owner: req.user.id,
    };

    const farm = await Farm.create(farmData);
    res.status(201).json({ success: true, data: farm });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing farm parcel
 * @route   PUT /api/farms/:id
 * @access  Private (Owner only)
 */
exports.updateFarm = async (req, res, next) => {
  try {
    let farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    // Owner check
    if (farm.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this farm parcel' });
    }

    farm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: farm });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a farm parcel and its activities
 * @route   DELETE /api/farms/:id
 * @access  Private (Owner only)
 */
exports.deleteFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    if (farm.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this farm' });
    }

    await Farm.findByIdAndDelete(req.params.id);
    await Activity.deleteMany({ farm: req.params.id });

    res.status(200).json({ success: true, message: 'Farm parcel and associated activities removed' });
  } catch (error) {
    next(error);
  }
};
