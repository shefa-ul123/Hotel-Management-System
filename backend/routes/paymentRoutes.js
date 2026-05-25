const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middleware/authMiddleware');

// @desc    Process mock payment
// @route   POST /api/payments/mock
// @access  Private
router.post('/mock', protect, async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;
    
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this booking' });
    }

    if (booking.paymentStatus === 'Paid') {
      return res.status(400).json({ message: 'Booking is already paid' });
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    booking.paymentStatus = 'Paid';
    const updatedBooking = await booking.save();

    // Emit real-time event for payment success
    const io = req.app.get('io');
    if (io) {
      io.emit('paymentProcessed', { bookingId: updatedBooking._id, status: 'Paid' });
    }

    res.json({ message: 'Payment successful', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
