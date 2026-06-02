const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNo: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['Standard', 'Deluxe', 'Suite'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Available', 'Reserved', 'Occupied', 'Cleaning', 'Maintenance', 'Booked'],
    default: 'Available',
  },
  amenities: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
