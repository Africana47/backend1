// const { body } = require('express-validator');

// // Validation for registration
// const validateRegister = [
//   body('name')
//     .trim()
//     .notEmpty()
//     .withMessage('Name is required'),

//   body('email')
//     .trim()
//     .isEmail()
//     .withMessage('Please provide a valid email'),

//   body('password')
//     .isLength({ min: 6 })
//     .withMessage('Password must be at least 6 characters'),

//   body('confirmPassword')
//     .custom((value, { req }) => value === req.body.password)
//     .withMessage('Passwords do not match'),
// ];

// // Validation for login
// const validateLogin = [
//   body('email')
//     .trim()
//     .isEmail()
//     .withMessage('Invalid email address'),

//   body('password')
//     .notEmpty()
//     .withMessage('Password is required'),
// ];

// module.exports = {
//   validateRegister,
//   validateLogin,
// };


const { body } = require('express-validator');

/* ---------- Registration Validation ---------- */
const validateRegister = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),

  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required'),
];

/* ---------- Login Validation ---------- */
const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

module.exports = { validateRegister, validateLogin };

