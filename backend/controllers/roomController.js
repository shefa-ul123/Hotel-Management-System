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

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      // Find bookings that overlap with requested dates
      const overlappingBookings = await Booking.find({
        bookingStatus: { $ne: 'Cancelled' },
        $and: [
          { checkInDate: { $lt: checkOutDate } },
          { checkOutDate: { $gt: checkInDate } }
        ]
      });

      const bookedRoomIds = overlappingBookings.map(booking => booking.room);
      query._id = { $nin: bookedRoomIds };
    }

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

    const room = new Room({
      roomNo,
      type,
      price,
      capacity,
      amenities,
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
      room.amenities = req.body.amenities || room.amenities;
      room.description = req.body.description || room.description;

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
