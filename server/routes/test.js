// server/routes/test.js
const express = require('express');
const router = express.Router();
const db = require('../db/db.js');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
