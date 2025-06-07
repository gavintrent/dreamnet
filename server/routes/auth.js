// server/routes/auth.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');
const { registerRules, validate } = require('../validators/auth');

router.post('/register', registerRules, validate, registerUser);
router.post('/login', loginUser);

router.get('/me', requireAuth, (req, res) => {
  res.json(req.user);
});

module.exports = router;