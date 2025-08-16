// server/controllers/authController.js
const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/emailService');
const { uploadAvatar } = require('../utils/supabaseStorage');

const JWT_SECRET = process.env.JWT_SECRET;

exports.registerUser = async (req, res) => {
  const { username, email, password, name, bio } = req.body;
  let avatarUrl = null;

  try {
    // Handle avatar upload if present
    if (req.file) {
      // Upload to Supabase storage
      const uploadResult = await uploadAvatar(req.file, Date.now()); // Using timestamp as temporary userId
      
      if (!uploadResult.success) {
        return res.status(500).json({ error: 'Failed to upload avatar: ' + uploadResult.error });
      }
      
      avatarUrl = uploadResult.url;
    }

    const hash = await bcrypt.hash(password, 10);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const result = await db.query(
      'INSERT INTO users (username, email, password_hash, name, bio, avatar, verification_token, verification_expires) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, username, email',
      [username, email, hash, name || null, bio || null, avatarUrl, verificationToken, verificationExpires]
    );

    const user = result.rows[0];
    
    // Send verification email
    const emailSent = await sendVerificationEmail(email, username, verificationToken);
    
    if (!emailSent) {
      console.warn('Failed to send verification email for user:', username);
    }

    res.status(201).json({ 
      user,
      message: 'Registration successful! Please check your email to verify your account.',
      requiresVerification: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err});
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Check if email is verified
    if (!user.email_verified) {
      return res.status(401).json({ 
        error: 'Please verify your email address before logging in. Check your inbox for a verification link.',
        requiresVerification: true
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '2h' });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Find user with this verification token
    const result = await db.query(
      'SELECT id, username, email, verification_expires FROM users WHERE verification_token = $1 AND email_verified = FALSE',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    const user = result.rows[0];

    // Check if token has expired
    if (new Date() > user.verification_expires) {
      return res.status(400).json({ error: 'Verification token has expired' });
    }

    // Mark user as verified and clear token
    await db.query(
      'UPDATE users SET email_verified = TRUE, verification_token = NULL, verification_expires = NULL WHERE id = $1',
      [user.id]
    );

    res.json({ 
      message: 'Email verified successfully! You can now log in to your account.',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
};