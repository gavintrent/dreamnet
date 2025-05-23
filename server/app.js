// server/app.js
const express = require('express');
const testRoutes = require('./routes/test');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/test', testRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express API!' });
});

// Health check
app.get('/', (req, res) => {
  res.send('Dream Journal API is running');
});

module.exports = app;
