const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// Rate limiting for API endpoints
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Slow down repeated requests
exports.speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500 // begin adding 500ms of delay per request above 50
});

// Prevent brute force attacks on auth endpoints
exports.authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again after an hour'
});

// Sanitize data to prevent NoSQL injection
exports.sanitizeData = (req, res, next) => {
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = req.body[key].replace(
        /[\$<>"'`\/\\]/g,
        ''
      );
    }
  }
  next();
};