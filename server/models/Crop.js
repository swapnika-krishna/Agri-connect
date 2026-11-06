const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Crop name is required'],
      unique: true,
      trim: true,
    },
    soilTypes: {
      type: [String],
      required: true,
      validate: [
        (val) => val.length > 0,
        'At least one suitable soil type must be specified',
      ],
    },
    seasons: {
      type: [String],
      required: true,
      enum: ['Kharif', 'Rabi', 'Zaid'],
      validate: [
        (val) => val.length > 0,
        'At least one cropping season must be specified',
      ],
    },
    minRainfall: {
      type: Number,
      required: true,
      default: 300,
    },
    maxRainfall: {
      type: Number,
      required: true,
      default: 1000,
    },
    minTemp: {
      type: Number,
      required: true,
      default: 15,
    },
    maxTemp: {
      type: Number,
      required: true,
      default: 35,
    },
    minPh: {
      type: Number,
      required: true,
      default: 6.0,
    },
    maxPh: {
      type: Number,
      required: true,
      default: 7.5,
    },
    durationDays: {
      type: Number,
      required: true,
      default: 120,
    },
    description: {
      type: String,
      default: '',
    },
    tips: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Crop', cropSchema);
