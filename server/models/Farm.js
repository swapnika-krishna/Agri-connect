const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please enter farm name'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please specify state'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'Please specify district'],
      trim: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Please provide latitude coordinates'],
    },
    longitude: {
      type: Number,
      required: [true, 'Please provide longitude coordinates'],
    },
    sizeInAcres: {
      type: Number,
      required: [true, 'Please specify farm size in acres'],
      min: [0.1, 'Farm size must be greater than 0'],
    },
    soilType: {
      type: String,
      required: true,
      enum: ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy', 'Clay', 'Loamy'],
    },
    waterSource: {
      type: String,
      required: true,
      enum: ['Rainfed', 'Borewell', 'Canal', 'River', 'Tank'],
    },
    currentCrops: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Farm', farmSchema);
