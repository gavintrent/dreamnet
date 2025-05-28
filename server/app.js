// server/app.js
const express = require('express');
const path = require('path');
const cors = require('cors');

const testRoutes = require('./routes/test');
const authRoutes = require('./routes/auth');
const dreamRoutes = require('./routes/dreams');
const userRoutes = require('./routes/users');
const followRoutes = require('./routes/follows');
const feedRoutes = require('./routes/feed');
const likeRoutes = require('./routes/likes');
const commentRoutes = require('./routes/comments');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dreams', dreamRoutes);
app.use('/api/users', userRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);


// Health check
app.get('/', (req, res) => {
  res.send('Dream Journal API is running');
});

module.exports = app;
