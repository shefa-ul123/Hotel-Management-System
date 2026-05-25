const express = require('express');
const router = express.Router();
const { createReview, getRoomReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createReview);

router.route('/:roomId')
  .get(getRoomReviews);

module.exports = router;
