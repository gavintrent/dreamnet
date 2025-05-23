// server/app.js
const express = require('express');
const cors = require('cors');

const testRoutes = require('./routes/test');
const authRoutes = require('./routes/auth');

const app = express();


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// app.options('*', cors())
// app.use(cors());

app.use(express.json());

// Routes
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Dream Journal API is running');
});

module.exports = app;
