-- USERS TABLE
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,                     -- Optional display name
  bio TEXT,                      -- Optional short bio
  avatar TEXT,                   -- Path to uploaded profile image
  created_at TIMESTAMP DEFAULT NOW()
);

-- DREAMS TABLE
CREATE TABLE dreams (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title TEXT,
  content TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- DREAM TAGS TABLE
CREATE TABLE dream_tags (
  id SERIAL PRIMARY KEY,
  dream_id UUID REFERENCES dreams(id) ON DELETE CASCADE,
  tagged_user_id INTEGER REFERENCES users(id),
  UNIQUE (dream_id, tagged_user_id)
);

-- FOLLOWS TABLE
CREATE TABLE follows (
  follower_id INTEGER REFERENCES users(id),
  followee_id INTEGER REFERENCES users(id),
  PRIMARY KEY (follower_id, followee_id)
);

-- LIKES TABLE
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  dream_id INTEGER REFERENCES dreams(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, dream_id)
);

-- COMMENTS TABLE
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  dream_id INTEGER REFERENCES dreams(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE, -- null for top-level comments
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

