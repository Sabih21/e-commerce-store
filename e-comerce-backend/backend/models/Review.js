const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'product', // Reference to the Product model
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user', // Reference to the User model
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    flag: {
      type: Number,
      enum: [0, 1], // Only allows 0 or 1 values
      default: null,  // Default value is null
    }, 
    flagReason: { type: String, default: null }, // Reason for flagging
    ipAddress: String, // Track user IP
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
