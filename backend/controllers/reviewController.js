const Review = require('../models/Review');

// Mock Sentiment Analysis Engine
const analyzeSentiment = (text) => {
  const lowerText = text.toLowerCase();
  
  const positiveWords = ['excellent', 'great', 'good', 'amazing', 'perfect', 'love', 'clean', 'friendly'];
  const negativeWords = ['bad', 'terrible', 'awful', 'dirty', 'rude', 'poor', 'worst', 'hate'];
  
  let score = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score += 1;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score -= 1;
  });
  
  if (score > 0) return 'Positive';
  if (score < 0) return 'Negative';
  return 'Neutral';
};

// @desc    Create a review with AI sentiment analysis
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { room, rating, comment } = req.body;
    
    // Analyze sentiment using mock AI
    const sentiment = analyzeSentiment(comment);

    const review = new Review({
      user: req.user._id,
      room,
      rating,
      comment,
      sentiment
    });

    const createdReview = await review.save();
    res.status(201).json(createdReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get room reviews
// @route   GET /api/reviews/:roomId
// @access  Public
const getRoomReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ room: req.params.roomId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getRoomReviews
};
