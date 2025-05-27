const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/usernames', async (req, res) => {
  try {
    const result = await db.query('SELECT username FROM users');
    res.json(result.rows.map(row => row.username));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch usernames' });
  }
});

module.exports = router;