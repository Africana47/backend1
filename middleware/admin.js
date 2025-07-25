// const jwt = require('jsonwebtoken');
// const User = require('../models/User'); // Adjust the path as necessary

// /**
//  * Middleware to protect routes for admin users only
//  */
// const adminMiddleware = async (req, res, next) => {
//   try {
//     // Check for token in headers
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Access denied. No token provided.' });
//     }

//     const token = authHeader.split(' ')[1];

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Fetch user from DB
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(401).json({ message: 'User not found.' });
//     }

//     if (user.role !== 'admin') {
//       return res.status(403).json({ message: 'Access forbidden: Admins only.' });
//     }

//     // Attach user info to request
//     req.user = user;

//     next(); // Proceed to the route handler
//   } catch (err) {
//     console.error('Admin middleware error:', err);
//     return res.status(401).json({ message: 'Invalid or expired token.' });
//   }
// };

// module.exports = adminMiddleware;

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes for admin users only
 */
const adminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access forbidden: Admins only.' });
    }

    if (user.status && user.status !== 'active') {
      return res.status(403).json({ message: `Access denied. Your account is ${user.status}.` });
    }

    req.user = user; // Attach admin user object to request
    next();
  } catch (err) {
    console.error('Admin middleware error:', err.message || err);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = adminMiddleware;

