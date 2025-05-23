const jwt = require('jsonwebtoken');
const db = require('../db/db');
const JWT_SECRET = process.env.JWT_SECRET;

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await db.query('SELECT id, username, email FROM users WHERE id = $1', [decoded.userId]);
    const user = result.rows[0];

    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = requireAuth;
