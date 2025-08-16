const express = require('express');
const router = express.Router();
const db = require('../db/db');
const requireAuth = require('../middleware/requireAuth');
const multer = require('multer')
const path = require('path')

const BASE_URL = process.env.BASE_URL;

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      return cb(new Error('Only images allowed'));
    }
    cb(null, true);
  }
});

// List of all usernames
router.get('/usernames', async (req, res) => {
  try {
    const result = await db.query('SELECT username FROM users');
    res.json(result.rows.map(row => row.username));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch usernames' });
  }
});

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
      `SELECT d.*, u.username
      FROM dreams d
      JOIN users u ON d.user_id = u.id
      WHERE d.user_id = $1 AND d.is_public = TRUE
      ORDER BY d.created_at DESC`,
      [userId]
    );

    res.json(dreamsRes.rows);
  } catch (err) {
    console.error('Error loading public profile dreams:', err);
    res.status(500).json({ error: 'Failed to load dreams' });
  }
});

// Search for users, as in search bar
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  try {
    const result = await db.query(
      'SELECT username FROM users WHERE username ILIKE $1 LIMIT 10',
      [`${q}%`]
    );
    res.json(result.rows.map(r => r.username));
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Update profile
router.patch('/me', requireAuth, upload.single('avatar'), async (req, res) => {
  const { name, bio } = req.body;
  const avatarPath = req.file ? `/uploads/${req.file.filename}` : undefined;

  const updates = [];
  const values = [];
  let i = 1;

  if (name) {
    updates.push(`name = $${i++}`);
    values.push(name);
  }
  if (bio) {
    updates.push(`bio = $${i++}`);
    values.push(bio);
  }
  if (avatarPath) {
    updates.push(`avatar = $${i++}`);
    values.push(avatarPath);
  }

  if (updates.length === 0) return res.status(400).json({ error: 'Nothing to update' });

  values.push(req.user.id);
  const setClause = updates.join(', ');

  await db.query(
    `UPDATE users SET ${setClause} WHERE id = $${i}`,
    values
  );

  res.json({ success: true });
});

router.get('/:username/profile', async (req, res) => {
  const { username } = req.params;
  try {
    const result = await db.query(
      'SELECT username, name, bio, avatar FROM users WHERE username = $1',
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return the profile with clean avatar paths (no BASE_URL appending)
    const profile = result.rows[0];
    res.json(profile);
    
  } catch (err) {
    console.error('Failed to get profile:', err);
    res.status(500).json({ error: 'Could not retrieve profile' });
  }
});

router.get('/suggestions', requireAuth, async (req, res) => {
  const userId = req.user.id;

  const query = `
    WITH recent_dreamers AS (
      SELECT 
        u.id, 
        u.username, 
        u.name, 
        u.avatar, 
        MAX(d.created_at) AS last_dream,
        NULL::bigint AS follower_count,
        NULL::timestamp AS joined_at
      FROM users u
      JOIN dreams d ON u.id = d.user_id
      WHERE 
        d.created_at >= NOW() - INTERVAL '1 hour'
        AND u.id != $1
        AND u.id NOT IN (
          SELECT followee_id FROM follows WHERE follower_id = $1
        )
      GROUP BY u.id
      ORDER BY last_dream DESC
      LIMIT 15
    ),
    top_followed AS (
      SELECT 
        u.id, 
        u.username, 
        u.name, 
        u.avatar, 
        NULL::timestamp AS last_dream,
        COUNT(f.follower_id)::bigint AS follower_count,
        NULL::timestamp AS joined_at
      FROM users u
      LEFT JOIN follows f ON u.id = f.followee_id
      WHERE 
        u.id != $1
        AND u.id NOT IN (
          SELECT followee_id FROM follows WHERE follower_id = $1
        )
      GROUP BY u.id
      ORDER BY follower_count DESC
      LIMIT 10
    ),
    newest_users AS (
      SELECT 
        u.id, 
        u.username, 
        u.name, 
        u.avatar, 
        NULL::timestamp AS last_dream,
        NULL::bigint AS follower_count,
        u.created_at AS joined_at
      FROM users u
      WHERE 
        u.id != $1
        AND u.id NOT IN (
          SELECT id FROM recent_dreamers
          UNION
          SELECT id FROM top_followed
        )
        AND u.id NOT IN (
          SELECT followee_id FROM follows WHERE follower_id = $1
        )
      ORDER BY u.created_at DESC
      LIMIT 20
    )
    SELECT * FROM (
      SELECT * FROM recent_dreamers
      UNION
      SELECT * FROM top_followed
      UNION
      SELECT * FROM newest_users
    ) AS combined
    LIMIT 20;
  `;

  try {
    const result = await db.query(query, [userId]);

    // Return suggestions with clean avatar paths (no BASE_URL appending)
    const suggestions = result.rows.map((user) => ({
      ...user,
      // Avatar paths are now handled by the frontend utility
    }));

    res.json(suggestions);
  } catch (err) {
    console.error('Error fetching user suggestions:', err);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

module.exports = router;