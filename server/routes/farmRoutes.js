const express = require('express');
const router = express.Router();
const {
  getFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm,
} = require('../controllers/farmController');
const { getActivitiesByFarm } = require('../controllers/activityController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, authorize('farmer', 'admin'), getFarms)
  .post(protect, authorize('farmer', 'admin'), createFarm);

router
  .route('/:id')
  .get(protect, getFarmById)
  .put(protect, authorize('farmer', 'admin'), updateFarm)
  .delete(protect, authorize('farmer', 'admin'), deleteFarm);

router.get('/:farmId/activities', protect, getActivitiesByFarm);

module.exports = router;
