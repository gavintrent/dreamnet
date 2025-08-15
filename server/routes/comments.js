const express = require('express');
const router = express.Router();
const db = require('../db/db');
const requireAuth = require('../middleware/requireAuth');

// GET comments for a dream
router.get('/:dreamId', async (req, res) => {
  const { dreamId } = req.params;
  const result = await db.query(
    `SELECT c.*, u.username, u.avatar FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.dream_id = $1
     ORDER BY c.created_at ASC`,
    [dreamId]
  );
  res.json(result.rows);
});

// POST new comment or reply
router.post('/:dreamId', requireAuth, async (req, res) => {
  const { content, parent_id } = req.body;
  const { dreamId } = req.params;
  const userId = req.user.id;

  const result = await db.query(
    `INSERT INTO comments (dream_id, user_id, content, parent_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [dreamId, userId, content, parent_id || null]
  );
  res.status(201).json(result.rows[0]);
});

module.exports = router;
