const Booking = require('../models/Booking');
const Room = require('../models/Room');
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'Available' });
    
    const totalBookings = await Booking.countDocuments();
    
    // Revenue calculation
    const bookings = await Booking.find({ paymentStatus: 'Paid' });
    const totalRevenue = bookings.reduce((acc, curr) => acc + curr.totalAmount, 0);

    const activeServiceRequests = await ServiceRequest.countDocuments({ status: { $in: ['Requested', 'Assigned'] } });

    // Mock monthly revenue data for charts
    const monthlyRevenue = [
      { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'May', total: totalRevenue }, // current month actual
    ];

    res.json({
      totalRooms,
      availableRooms,
      occupancyRate: totalRooms === 0 ? 0 : Math.round(((totalRooms - availableRooms) / totalRooms) * 100),
      totalBookings,
      totalRevenue,
      activeServiceRequests,
      monthlyRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
