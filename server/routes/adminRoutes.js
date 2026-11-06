const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  updateUserStatus,
  approveExpert,
  deleteUser,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/approve', approveExpert);
router.delete('/users/:id', deleteUser);

module.exports = router;
