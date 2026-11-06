const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'Sowing',
        'Irrigation',
        'Fertilizer',
        'Pesticide',
        'Weeding',
        'Harvest',
        'Other',
      ],
    },
    date: {
      type: String,
      required: [true, 'Please provide activity date (YYYY-MM-DD)'],
    },
    notes: {
      type: String,
      required: [true, 'Please enter activity notes/observations'],
      trim: true,
    },
    cost: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Activity', activitySchema);
