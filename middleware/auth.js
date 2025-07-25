
// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   // Get token from header
//   const token = req.header('x-auth-token');

//   // Check if no token
//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   // Verify token
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// const adminMiddleware = (req, res, next) => {
//   if (!req.user.isAdmin) {
//     return res.status(403).json({ message: 'Admin access required' });
//   }
//   next();
// };

// module.exports = { authMiddleware, adminMiddleware };

// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// /**
//  * Middleware to protect routes using JWT authentication
//  */
// const authMiddleware = (req, res, next) => {
//   // Get token from Authorization header: Bearer <token>
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Authorization denied. No token provided.' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user; // Attach user payload to request
//     next();
//   } catch (err) {
//     console.error('JWT error:', err.message);
//     res.status(401).json({ message: 'Token is invalid or expired.' });
//   }
// };

// /**
//  * Middleware to restrict access to admin users
//  */
// const adminMiddleware = (req, res, next) => {
//   if (!req.user || !req.user.isAdmin) {
//     return res.status(403).json({ message: 'Access forbidden: Admins only.' });
//   }
//   next();
// };

// module.exports = { authMiddleware, adminMiddleware };

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes using JWT authentication
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Attach decoded object directly, includes id
    next();
  } catch (err) {
    console.error('JWT error:', err.message);
    res.status(401).json({ message: 'Token is invalid or expired.' });
  }
};

/**
 * Middleware to restrict access to admin users
 */
const adminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access forbidden: Admins only.' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };

