const express = require('express');
const router = express.Router();
const {
  recommendCrops,
  getCrops,
  createCrop,
  updateCrop,
  deleteCrop,
} = require('../controllers/cropController');
const { protect, authorize } = require('../middleware/auth');

router.post('/recommend', recommendCrops);

router
  .route('/')
  .get(getCrops)
  .post(protect, authorize('admin'), createCrop);

router
  .route('/:id')
  .put(protect, authorize('admin'), updateCrop)
  .delete(protect, authorize('admin'), deleteCrop);

module.exports = router;
