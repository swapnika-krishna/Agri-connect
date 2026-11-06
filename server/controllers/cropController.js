const Crop = require('../models/Crop');
const { scoreCrops } = require('../utils/cropScorer');

/**
 * @desc    Score crops based on soil, season, rainfall, temperature, and pH
 * @route   POST /api/crops/recommend
 * @access  Public / Private
 */
exports.recommendCrops = async (req, res, next) => {
  try {
    const { soilType, season, rainfall, temperature, ph } = req.body;

    if (!soilType || !season) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least soilType and season for recommendations',
      });
    }

    const crops = await Crop.find({});
    const input = {
      soilType,
      season,
      rainfall: parseFloat(rainfall) || 500,
      temperature: parseFloat(temperature) || 24,
      ph: parseFloat(ph) || 6.8,
    };

    const ranked = scoreCrops(crops, input);
    // Return top 5 ranked
    const top5 = ranked.slice(0, 5);

    res.status(200).json({
      success: true,
      count: top5.length,
      data: top5,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all crops from knowledge base
 * @route   GET /api/crops
 * @access  Public
 */
exports.getCrops = async (req, res, next) => {
  try {
    const crops = await Crop.find({}).sort('name');
    res.status(200).json({ success: true, count: crops.length, data: crops });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new crop in catalog
 * @route   POST /api/crops
 * @access  Private (Admin only)
 */
exports.createCrop = async (req, res, next) => {
  try {
    const crop = await Crop.create(req.body);
    res.status(201).json({ success: true, data: crop });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a crop in catalog
 * @route   PUT /api/crops/:id
 * @access  Private (Admin only)
 */
exports.updateCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    res.status(200).json({ success: true, data: crop });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a crop from catalog
 * @route   DELETE /api/crops/:id
 * @access  Private (Admin only)
 */
exports.deleteCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    res.status(200).json({ success: true, message: 'Crop removed from catalog' });
  } catch (error) {
    next(error);
  }
};
