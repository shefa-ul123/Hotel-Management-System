const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { getDynamicPrice } = require('../utils/pricingEngine');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res) => {
  try {
    const { type, status, capacity, checkIn, checkOut } = req.query;
    let query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (capacity) query.capacity = { $gte: Number(capacity) };

    let checkInDate, checkOutDate;
    if (checkIn && checkOut) {
      checkInDate = new Date(checkIn);
      checkOutDate = new Date(checkOut);
    } else {
      // Default to current date to show real-time booked status
      checkInDate = new Date();
      checkOutDate = new Date();
    }

    // Find bookings that overlap with requested or current dates
    const overlappingBookings = await Booking.find({
      bookingStatus: { $ne: 'Cancelled' },
      $and: [
        { checkInDate: { $lt: checkOutDate } },
        { checkOutDate: { $gt: checkInDate } }
      ]
    });

    const bookedRoomIds = overlappingBookings.map(booking => booking.room.toString());

    const rooms = await Room.find(query);
    
    // Mock calculating global occupancy rate
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'Available' });
    const occupancyRate = totalRooms === 0 ? 0 : (totalRooms - availableRooms) / totalRooms;

    // Apply dynamic pricing to each room
    const dynamicallyPricedRooms = rooms.map(room => {
      const pricingData = getDynamicPrice(room.price, room.status, occupancyRate);
      
      // Return a plain object with the modified price
      const roomObj = room.toObject();
      roomObj.price = pricingData.dynamicPrice;
      roomObj.originalPrice = pricingData.originalPrice;
      roomObj.surgeActive = pricingData.surgeActive;
      roomObj.discountActive = pricingData.discountActive;
      
      // Override status to 'Booked' if there is an overlapping booking
      if (bookedRoomIds.includes(roomObj._id.toString())) {
        if (roomObj.status !== 'Maintenance' && roomObj.status !== 'Occupied') {
          roomObj.status = 'Booked';
        }
      }
      
      return roomObj;
    });

    res.json(dynamicallyPricedRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room) {
      // Apply mock dynamic pricing
      const totalRooms = await Room.countDocuments();
      const availableRooms = await Room.countDocuments({ status: 'Available' });
      const occupancyRate = totalRooms === 0 ? 0 : (totalRooms - availableRooms) / totalRooms;
      
      const pricingData = getDynamicPrice(room.price, room.status, occupancyRate);
      
      const roomObj = room.toObject();
      roomObj.price = pricingData.dynamicPrice;
      roomObj.originalPrice = pricingData.originalPrice;
      roomObj.surgeActive = pricingData.surgeActive;
      roomObj.discountActive = pricingData.discountActive;

      // Check real-time booking status
      const now = new Date();
      const overlappingBookings = await Booking.find({
        room: room._id,
        bookingStatus: { $ne: 'Cancelled' },
        $and: [
          { checkInDate: { $lt: now } },
          { checkOutDate: { $gt: now } }
        ]
      });

      if (overlappingBookings.length > 0 && roomObj.status !== 'Maintenance' && roomObj.status !== 'Occupied') {
        roomObj.status = 'Booked';
      }

      res.json(roomObj);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res) => {
  try {
    const { roomNo, type, price, capacity, amenities, description } = req.body;
    
    const roomExists = await Room.findOne({ roomNo });
    if (roomExists) {
      return res.status(400).json({ message: 'Room number already exists' });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
    }

    let parsedAmenities = [];
    if (amenities) {
      if (Array.isArray(amenities)) parsedAmenities = amenities;
      else if (typeof amenities === 'string') parsedAmenities = amenities.split(',').map(a => a.trim()).filter(a => a);
    }

    const room = new Room({
      roomNo,
      type,
      price,
      capacity,
      amenities: parsedAmenities,
      description,
      images: imageUrls
    });

    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      room.roomNo = req.body.roomNo || room.roomNo;
      room.type = req.body.type || room.type;
      room.price = req.body.price || room.price;
      room.capacity = req.body.capacity || room.capacity;
      room.status = req.body.status || room.status;
      room.description = req.body.description || room.description;

      if (req.body.amenities) {
        if (Array.isArray(req.body.amenities)) {
          room.amenities = req.body.amenities;
        } else if (typeof req.body.amenities === 'string') {
          room.amenities = req.body.amenities.split(',').map(a => a.trim()).filter(a => a);
        }
      }

      if (req.files && req.files.length > 0) {
        room.images = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
      }

      const updatedRoom = await room.save();
      res.json(updatedRoom);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      await room.deleteOne();
      res.json({ message: 'Room removed' });
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
