const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    query: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Query',
      required: true,
      index: true,
    },
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide advice/reply message'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reply', replySchema);
