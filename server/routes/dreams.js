const express = require('express');
const router = express.Router();
const db = require('../db/db');
const requireAuth = require('../middleware/requireAuth');

router.post('/', requireAuth, async (req, res) => {
  const { title, content, is_public, tagged_usernames = [] } = req.body;
  const userId = req.user.id;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Insert dream
    const result = await client.query(
      'INSERT INTO dreams (user_id, title, content, is_public) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, title, content, is_public]
    );

    const dreamId = result.rows[0].id;

    // Insert tags
    for (const username of tagged_usernames) {
      const res = await client.query('SELECT id FROM users WHERE username = $1', [username]);
      if (res.rows.length > 0) {
        const taggedUserId = res.rows[0].id;
       await client.query(
            'INSERT INTO dream_tags (dream_id, tagged_user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [dreamId, taggedUserId]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json({ dreamId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error posting dream:', err);
    res.status(500).json({ error: 'Failed to post dream' });
  } finally {
    client.release();
  }
});

router.get('/', requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      'SELECT * FROM dreams WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch dreams:', err);
    res.status(500).json({ error: 'Failed to fetch dreams' });
  }
});

router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, content, is_public } = req.body;
  const userId = req.user.id;

  try {
    const result = await db.query(
      'UPDATE dreams SET title = $1, content = $2, is_public = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [title, content, is_public, id, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update dream' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await db.query('DELETE FROM dreams WHERE id = $1 AND user_id = $2', [id, userId]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete dream' });
  }
});

module.exports = router;
