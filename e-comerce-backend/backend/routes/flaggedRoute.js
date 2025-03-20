const express = require('express');
const router = express.Router();

const User = require('../models/User'); 
const Product = require('../models/Product');

const Review = require('../models/Review');


// Route to get flagged reviews (flag = 1)
router.get('/', async (req, res) => {
    try {
        const flaggedReviews = await Review.find({ flag: 1 })
            .populate('user') // Ensure the field name matches your schema           
            .populate('product').sort({ createdAt: -1 });// If reviews also reference a product, you might need this

        if (!flaggedReviews || flaggedReviews.length === 0) {
            return res.status(404).json({ message: 'No flagged reviews found' });
        }

        console.log(flaggedReviews);
        res.status(200).json(flaggedReviews);
    } catch (error) {
        console.error('Error fetching flagged reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// In your Express route for approving a review
router.post('/approved', async (req, res) => {
    const { id } = req.body;
    // return res.status(500).json({ success: false, message: 'Review not found1231' });

    try {
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }
  
      review.flag = 0;  // Set flag to 0 (approved)
      await review.save();
      
      res.json({ success: true, message: 'Review marked as approved' });
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  

module.exports = router;
 