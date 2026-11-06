const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide query title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide detailed description'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Crop Disease',
        'Pest Control',
        'Soil',
        'Irrigation',
        'Fertilizer',
        'Market',
        'Weather',
        'General',
      ],
      default: 'General',
      index: true,
    },
    status: {
      type: String,
      enum: ['Open', 'Answered', 'Resolved'],
      default: 'Open',
      index: true,
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for replies
querySchema.virtual('replies', {
  ref: 'Reply',
  localField: '_id',
  foreignField: 'query',
});

module.exports = mongoose.model('Query', querySchema);
