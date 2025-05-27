const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const db = require('../db/db');

router.get('/', requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(`
      SELECT dreams.*, users.username
      FROM dreams
      JOIN users ON dreams.user_id = users.id
      WHERE dreams.is_public = TRUE
      AND dreams.user_id IN (
        SELECT followee_id FROM follows WHERE follower_id = $1
      )
      ORDER BY dreams.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch feed:', err);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

module.exports = router;
