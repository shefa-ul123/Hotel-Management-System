const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Booking',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  serviceType: {
    type: String,
    enum: ['Food', 'Cleaning', 'Laundry', 'Transportation', 'Maintenance'],
    required: true,
  },
  details: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Requested', 'Assigned', 'Completed', 'Cancelled'],
    default: 'Requested',
  },
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
