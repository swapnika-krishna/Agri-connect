const express = require('express');
const router = express.Router();
const {
  createQuery,
  getMyQueries,
  getAllQueries,
  getQueryById,
  addReply,
  resolveQuery,
} = require('../controllers/queryController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .post(protect, authorize('farmer'), createQuery)
  .get(protect, authorize('expert', 'admin'), getAllQueries);

router.get('/mine', protect, authorize('farmer'), getMyQueries);

router.route('/:id').get(protect, getQueryById);

router.post('/:id/replies', protect, authorize('expert', 'admin'), addReply);

router.put('/:id/resolve', protect, resolveQuery);

module.exports = router;
