const express = require('express');
const router = express.Router();

const User = require('../models/User'); 
const Product = require('../models/Product');

const Review = require('../models/Review');



router.get("/", async (req, res) => {
    const { productId } = req.query; 


    if (!productId) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    try {
      const reviews = await Review.find({ product: productId, flag: 0 })                                             
        .populate("user", "fullName email")  
        .populate("productId", "name");     
  
      if (reviews.length === 0) {
        return res.status(500).json({ message: "No reviews found for this product." });
      }
  
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews for this product." });
    }
  });

  module.exports = router;
