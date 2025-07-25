const fs = require('fs');
const path = require('path');

// Request logging
exports.requestLogger = (req, res, next) => {
  const logEntry = `
    ${new Date().toISOString()}
    ${req.method} ${req.originalUrl}
    Headers: ${JSON.stringify(req.headers)}
    Body: ${JSON.stringify(req.body)}
    IP: ${req.ip}
    User: ${req.user ? req.user._id : 'Unauthenticated'}
    --------------------------
  `;

  fs.appendFile(
    path.join(__dirname, '../logs/requests.log'),
    logEntry,
    (err) => {
      if (err) console.error('Error writing to log file', err);
    }
  );
  next();
};

// Error logging
exports.errorLogger = (err, req, res, next) => {
  const logEntry = `
    ${new Date().toISOString()}
    Error: ${err.message}
    Stack: ${err.stack}
    Route: ${req.method} ${req.originalUrl}
    User: ${req.user ? req.user._id : 'Unauthenticated'}
    --------------------------
  `;

  fs.appendFile(
    path.join(__dirname, '../logs/errors.log'),
    logEntry,
    (err) => {
      if (err) console.error('Error writing to error log', err);
    }
  );
  next(err);
};