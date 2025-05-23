// server/app.js
const express = require('express');
const testRoutes = require('./routes/test');

const app = express();

// Controllers
const authRoutes = require('./routes/auth');

// Middleware
app.use(express.json());

// Routes
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Dream Journal API is running');
});

module.exports = app;
