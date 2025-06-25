// server/validators/auth.js
const { check, validationResult } = require('express-validator');

// A chain of checks you can use on /register
const registerRules = [
  check('username')
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage('Username must be between 3 and 15 characters')
    .matches(/^[A-Za-z0-9_.]+$/)
    .withMessage('Letters, numbers, underscores, and periods only'),
  check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
  check('password')
    .isLength({ min: 6, max: 100 })
    .withMessage('Password must be at least 6 characters'),
];

// After the rules run, this middleware will send back 400 + errors if any failed
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Send only the first error per field, or map them however you like
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { registerRules, validate };
