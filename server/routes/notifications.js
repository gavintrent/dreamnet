const express = require('express');
const router = express.Router();
const db = require('../db/db');
const requireAuth = require('../middleware/requireAuth');

// GET /notifications - returns recent mentions of the logged-in user
router.get('/', requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `
      SELECT
        d.id AS dream_id,
        u.username AS from_username,
        d.created_at
      FROM dream_tags dt
      JOIN dreams d ON dt.dream_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE dt.tagged_user_id = $1
      ORDER BY d.created_at DESC
      LIMIT 10
      `,
      [userId]
    );

    const notifications = result.rows.map(row => ({
      from_username: row.from_username,
      dream_id: row.dream_id,
      created_at: row.created_at,
    }));

    res.json(notifications);
  } catch (err) {
    console.error('Failed to fetch notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

module.exports = router;