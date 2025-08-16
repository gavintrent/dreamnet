// server/routes/auth.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyEmail } = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');
const { registerRules, validate } = require('../validators/auth');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      return cb(new Error('Only images allowed'));
    }
    cb(null, true);
  }
});

router.post('/register', upload.single('avatar'), registerRules, validate, registerUser);

router.post('/login', loginUser);

router.get('/verify/:token', verifyEmail);

router.get('/me', requireAuth, (req, res) => {
  res.json(req.user);
});

module.exports = router;