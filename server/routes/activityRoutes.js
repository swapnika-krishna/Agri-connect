const express = require('express');
const router = express.Router();
const {
  getAllMyActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} = require('../controllers/activityController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, authorize('farmer', 'admin'), getAllMyActivities)
  .post(protect, authorize('farmer', 'admin'), createActivity);

router
  .route('/:id')
  .put(protect, authorize('farmer', 'admin'), updateActivity)
  .delete(protect, authorize('farmer', 'admin'), deleteActivity);

module.exports = router;
