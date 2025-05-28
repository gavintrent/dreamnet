const express = require('express');
const router = express.Router();
const db = require('../db/db');
const requireAuth = require('../middleware/requireAuth');

// Like a dream
router.post('/:dreamId', requireAuth, async (req, res) => {
  const { dreamId } = req.params;
  const userId = req.user.id;

  try {
    await db.query(
      'INSERT INTO likes (user_id, dream_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, dreamId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ error: 'Could not like dream' });
  }
});

// Unlike a dream
router.delete('/:dreamId', requireAuth, async (req, res) => {
  const { dreamId } = req.params;
  const userId = req.user.id;

  try {
    await db.query(
      'DELETE FROM likes WHERE user_id = $1 AND dream_id = $2',
      [userId, dreamId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Unlike error:', err);
    res.status(500).json({ error: 'Could not unlike dream' });
  }
});

// Get likes count for a dream
router.get('/:dreamId', async (req, res) => {
  const { dreamId } = req.params;

  try {
    const result = await db.query(
      'SELECT COUNT(*) FROM likes WHERE dream_id = $1',
      [dreamId]
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error('Get likes error:', err);
    res.status(500).json({ error: 'Could not get likes' });
  }
});

// Get whether the current user liked a specific dream
router.get('/:dreamId/user', requireAuth, async (req, res) => {
  const { dreamId } = req.params;
  const userId = req.user.id;

  try {
    const result = await db.query(
      'SELECT 1 FROM likes WHERE dream_id = $1 AND user_id = $2',
      [dreamId, userId]
    );
    res.json({ liked: result.rows.length > 0 });
  } catch (err) {
    console.error('Error checking like status:', err);
    res.status(500).json({ error: 'Failed to check like status' });
  }
});

module.exports = router;
