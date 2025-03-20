const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: String,
    lastReviewTime: Date, // To track last review timestamp
    reviewCount: { type: Number, default: 0 }, // Track number of reviews
    ipAddress: String, // Track user IP
  },
  {
    timestamps: true,
  },
  
)

const User = mongoose.model('user', userSchema)
module.exports = User
