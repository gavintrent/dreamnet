const express = require('express');
const router = express.Router();
const db = require('../db/db');

// List of all usernames
router.get('/usernames', async (req, res) => {
  try {
    const result = await db.query('SELECT username FROM users');
    res.json(result.rows.map(row => row.username));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch usernames' });
  }
});

// TODO: list of usernames followed by a user

// Public dreams by username
router.get('/:username/dreams', async (req, res) => {
  const { username } = req.params;

  try {
    const userRes = await db.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRes.rows[0].id;
    const dreamsRes = await db.query(
      'SELECT * FROM dreams WHERE user_id = $1 AND is_public = TRUE ORDER BY created_at DESC',
      [userId]
    );

    res.json(dreamsRes.rows);
  } catch (err) {
    console.error('Error loading public profile dreams:', err);
    res.status(500).json({ error: 'Failed to load dreams' });
  }
});

module.exports = router;