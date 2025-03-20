const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User'); // Ensure User model is imported
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit'); // For limiting review requests
const BlacklistedIP = require('../models/BlacklistedIP'); // New schema for blacklisted IPs

const spamWords = ["scam", "fraud", "fake", "untrustworthy", "spammy"];

const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: "Too many reviews from this IP, please try again later."
});

// Route to create a review
// router.post('/', reviewLimiter, async (req, res) => {
  router.post('/', reviewLimiter, async (req, res) => {
  let { productId, rating, comment, user,ipAddress  } = req.body; // userId must be sent in the request

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user exists
    let userid = await User.findById(user);

    if (!userid) {
      console.log(`User with ID ${userid} not found. Assigning default user.`);
      // userId = '67d7f648d8a53c3a34dbc4cf'; // Assign default user ID
      // user = await User.findById(userId); // Fetch default user
    }
    
    const userCreatedAt = userid.createdAt;
    const now = new Date();
    // const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let flag = 0;
    let flagErrorReasons = [];
    let GoodReasons = [];

    // Condition 1: IP Blacklist
    const isBlacklisted = await BlacklistedIP.findOne({ ipAddress });
    if (isBlacklisted) {
      flagErrorReasons.push("IP is blacklisted due to spam activity.");
      // return res.status(403).json({ message: "IP is blacklisted due to spam activity." });
    }else{
      GoodReasons.push("IP isn't included in blacklisted by AI");
    }

    // Condition 2: Account age is less than 10 minutes
    const timeDifferenceInMinutes = (now - userCreatedAt) / (1000 * 60);
    if (timeDifferenceInMinutes <= 10) {
      flag = 1;
      flagErrorReasons.push("User account is too new.");
    }else{
      GoodReasons.push("The User account is NOT new, under review or blocked.");
    }

    // Condition 3: Check for duplicate IP reviews in the last 30 minutes
    const recentIPReviews = await Review.countDocuments({ 
      ipAddress: ipAddress, 
      createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) } 
    });

    if (recentIPReviews > 3) {
      flag = 1;
      flagErrorReasons.push("Multiple reviews from the same IP.");
    }else{
      GoodReasons.push("The IP is NOT included in spam reviews.");
    }

    // Condition 4: Detect sudden review spikes
    const recentProductReviews = await Review.countDocuments({ 
      product: productId, 
      createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) } 
    });
    if (recentProductReviews > 10) {
      flag = 1;
      flagErrorReasons.push("Unusual spike in reviews for this product.");
    }else{
      GoodReasons.push("NO Unusual spike detected for this product.");
    }

    // Condition 5: Check for identical reviews
    const duplicateReview = await Review.findOne({ comment });
    if (duplicateReview) {
      flag = 1;
      flagErrorReasons.push("Duplicate or copy-pasted review detected.");
    }else{
      GoodReasons.push("NO Duplicate or copy-pasted review detected.");
    }


    // Condition 6: User's last review was less than 10 minutes ago
    if (userid.lastReviewTime) {
      const lastReviewDiff = (now - userid.lastReviewTime) / (1000 * 60);
      if (lastReviewDiff < 10) {
        flag = 1;
        flagErrorReasons.push("User is posting reviews too quickly.");
      }
    }
    else{
      GoodReasons.push("User recent activity is good.");
    }

    // Condition 7: Check if review contains flagged words
    if (spamWords.some(word => comment.toLowerCase().includes(word))) {
      flag = 1;
      flagErrorReasons.push("Review contains flagged or spam words.");
    }
    else{
      GoodReasons.push("Review does NOT contains flagged or spam words.");
    }

    

    // Condition 8: Multiple accounts on the same IP
    const usersWithSameIP = await User.countDocuments({ ipAddress });
    if (usersWithSameIP > 2) { // Adjust threshold
      flag = 1;
      flagErrorReasons.push("Multiple accounts detected from the same IP.");
    }else{
      GoodReasons.push("NO Multiple accounts detected from the same IP.");
    }

    //Condition 9
    const commentProcessed = comment.toLowerCase().trim();
    const isMeaningful = commentProcessed.split(" ").length > 3;

    if (!isMeaningful) {
      flag = 1;
      flagErrorReasons.push("Review is too short or not meaningful.");
    } else {
      GoodReasons.push("Review is NOT short and IS meaningful.");
    }

    
    // Create a new review
    const review = new Review({
      product: productId,
      user,
      rating,
      comment,
      flag,
      flagReason: flag ? flagErrorReasons.join(", ") : null, // Store the flag reasons
      ipAddress,
    });

    await review.save();

    // Update user's last review time
    userid.lastReviewTime = now;
    await userid.save();

    res.status(201).json({
      message: 'Review added successfully',
      ipAddress,
      flag,
      flagErrorReasons,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

});

router.get('/api/flagged', async (req, res) => {
  try {
    // Find all reviews where flag is 1
    const flaggedReviews = await Review.find({ flag: 1 }).populate('User', 'email name'); // Populate user field correctly

    if (!flaggedReviews || flaggedReviews.length === 0) {
      return res.status(404).json({ message: 'No flagged reviews found' });
    }

    console.log(flaggedReviews);
    // Return the flagged reviews
    res.status(200).json(flaggedReviews);
  } catch (error) {
    console.error('Error fetching flagged reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
