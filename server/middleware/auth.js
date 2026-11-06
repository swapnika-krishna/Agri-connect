const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes: verifies Bearer JWT token from header
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'agriconnect_super_secret_jwt_key_2026_change_in_production'
      );

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      if (!req.user.isActive) {
        return res
          .status(403)
          .json({ success: false, message: 'Account has been deactivated' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }
};

/**
 * Role-Based Access Control (RBAC) middleware
 * @param  {...string} roles - Permitted user roles e.g. 'farmer', 'expert', 'admin'
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this route`,
      });
    }

    // Check expert approval status
    if (req.user.role === 'expert' && req.user.isApproved === false) {
      return res.status(403).json({
        success: false,
        message: 'Expert account is pending approval by the platform administrator',
      });
    }

    next();
  };
};

module.exports = { protect, authorize };
