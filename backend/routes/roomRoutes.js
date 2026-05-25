const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getRooms)
  .post(protect, authorize('admin', 'staff'), upload.array('images', 3), createRoom);

router.route('/:id')
  .get(getRoomById)
  .put(protect, authorize('admin', 'staff'), upload.array('images', 3), updateRoom)
  .delete(protect, authorize('admin'), deleteRoom);

module.exports = router;
