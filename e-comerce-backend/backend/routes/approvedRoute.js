
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User'); // Ensure User model is imported




// Route to get reviews with flag = 0
router.get('/', async (req, res) => {
    try {
        
        const approvedReviews = await Review.find({ flag: 0 }).populate('user').populate('product');


        if (!approvedReviews || approvedReviews.length === 0) {
            return res.status(404).json({ message: 'No approved reviews found' });
        }

        console.log(approvedReviews);
        res.status(200).json(approvedReviews);
    } catch (error) {
        console.error('Error fetching approved reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
