const Booking = require('../models/Booking');
const Room = require('../models/Room');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, totalAmount } = req.body;

    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      room: room,
      bookingStatus: { $ne: 'Cancelled' },
      $and: [
        { checkInDate: { $lt: checkOut } },
        { checkOutDate: { $gt: checkIn } }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Room is already booked for these dates' });
    }

    const booking = new Booking({
      user: req.user._id,
      room,
      checkInDate,
      checkOutDate,
      totalAmount,
    });

    const createdBooking = await booking.save();

    // Emit real-time event if io exists
    const io = req.app.get('io');
    if(io) {
      io.emit('bookingCreated', createdBooking);
      // Optional: io.emit('roomStatusUpdated', ...) if we want to notify clients to refetch availability
    }

    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin/Staff view all, User views own)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'customer') {
      query.user = req.user._id;
    }

    const bookings = await Booking.find(query).populate('user', 'name email').populate('room', 'roomNo type');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', 'name email').populate('room', 'roomNo type');

    if (booking) {
      // Check if user is authorized to view this booking
      if (req.user.role === 'customer' && booking.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this booking' });
      }
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin/Staff
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      if (bookingStatus) booking.bookingStatus = bookingStatus;
      if (paymentStatus) booking.paymentStatus = paymentStatus;

      const updatedBooking = await booking.save();
      
      // Update room status if needed
      if (bookingStatus === 'CheckedIn') {
         await Room.findByIdAndUpdate(booking.room, { status: 'Occupied' });
      } else if (bookingStatus === 'CheckedOut' || bookingStatus === 'Cancelled') {
         await Room.findByIdAndUpdate(booking.room, { status: 'Available' });
      }

      // Emit real-time event
      const io = req.app.get('io');
      if(io) {
         io.emit('bookingUpdated', updatedBooking);
      }

      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
};
