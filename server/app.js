// server/app.js
const express = require('express');
const cors = require('cors');

const testRoutes = require('./routes/test');
const authRoutes = require('./routes/auth');
const dreamRoutes = require('./routes/dreams');
const userRoutes = require('./routes/users');
const followRoutes = require('./routes/follows');
const feedRoutes = require('./routes/feed');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dreams', dreamRoutes);
app.use('/api/users', userRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/feed', feedRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Dream Journal API is running');
});

module.exports = app;
