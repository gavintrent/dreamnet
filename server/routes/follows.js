const express = require('express');
const router = express.Router();
const db = require('../db/db');
const requireAuth = require('../middleware/requireAuth');

// Follow a user
router.post('/:username', requireAuth, async (req, res) => {
  const followerId = req.user.id;
  const { username } = req.params;

  try {
    const result = await db.query('SELECT id FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const followeeId = result.rows[0].id;

    await db.query(
      'INSERT INTO follows (follower_id, followee_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [followerId, followeeId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Follow error:', err);
    res.status(500).json({ error: 'Could not follow user' });
  }
});

// Unfollow
router.delete('/:username', requireAuth, async (req, res) => {
  const followerId = req.user.id;
  const { username } = req.params;

  try {
    const result = await db.query('SELECT id FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const followeeId = result.rows[0].id;

    await db.query(
      'DELETE FROM follows WHERE follower_id = $1 AND followee_id = $2',
      [followerId, followeeId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Unfollow error:', err);
    res.status(500).json({ error: 'Could not unfollow user' });
  }
});

// Check if following
router.get('/is-following/:username', requireAuth, async (req, res) => {
  const followerId = req.user.id;
  const { username } = req.params;

  try {
    const result = await db.query('SELECT id FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const followeeId = result.rows[0].id;

    const followCheck = await db.query(
      'SELECT 1 FROM follows WHERE follower_id = $1 AND followee_id = $2',
      [followerId, followeeId]
    );

    res.json({ following: followCheck.rows.length > 0 });
  } catch (err) {
    console.error('Follow check error:', err);
    res.status(500).json({ error: 'Error checking follow status' });
  }
});

module.exports = router;
