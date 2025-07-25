const { validationResult } = require('express-validator');

// Validate request using express-validator rules
exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      errors: errors.array()
    });
  };
};

// Validate object IDs
exports.validateObjectId = (paramName) => {
  return (req, res, next) => {
    if (!req.params[paramName].match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} ID format`
      });
    }
    next();
  };
};