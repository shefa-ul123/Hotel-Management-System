const ServiceRequest = require('../models/ServiceRequest');
const Booking = require('../models/Booking');

// @desc    Create new service request
// @route   POST /api/services
// @access  Private (Customer only)
const createServiceRequest = async (req, res) => {
  try {
    const { bookingId, serviceType, details } = req.body;

    // Verify booking belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role === 'customer') {
      return res.status(403).json({ message: 'Not authorized for this booking' });
    }

    const serviceRequest = new ServiceRequest({
      bookingId,
      userId: req.user._id,
      serviceType,
      details,
    });

    const createdRequest = await serviceRequest.save();

    // Emit real-time event for Staff
    const io = req.app.get('io');
    if (io) {
      io.emit('newServiceRequest', createdRequest);
    }

    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's service requests
// @route   GET /api/services/myrequests
// @access  Private (Customer)
const getMyServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ userId: req.user._id }).populate('bookingId', 'room').sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all service requests
// @route   GET /api/services
// @access  Private (Staff/Admin)
const getAllServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate('userId', 'name roomNo')
      .populate({ path: 'bookingId', populate: { path: 'room' } })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update service request status
// @route   PUT /api/services/:id
// @access  Private (Staff/Admin)
const updateServiceRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (request) {
      request.status = req.body.status || request.status;

      const updatedRequest = await request.save();

      // Emit real-time event for Customer
      const io = req.app.get('io');
      if (io) {
        io.emit('serviceRequestUpdated', updatedRequest);
      }

      res.json(updatedRequest);
    } else {
      res.status(404).json({ message: 'Service request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createServiceRequest,
  getMyServiceRequests,
  getAllServiceRequests,
  updateServiceRequest,
};
