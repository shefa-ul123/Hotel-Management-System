const express = require('express');
const router = express.Router();
const {
  createServiceRequest,
  getMyServiceRequests,
  getAllServiceRequests,
  updateServiceRequest,
} = require('../controllers/serviceRequestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('customer'), createServiceRequest)
  .get(protect, authorize('admin', 'staff'), getAllServiceRequests);

router.route('/myrequests')
  .get(protect, authorize('customer'), getMyServiceRequests);

router.route('/:id')
  .put(protect, authorize('admin', 'staff'), updateServiceRequest);

module.exports = router;
