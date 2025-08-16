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
const notificationRoutes = require('./routes/notifications');

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000', // Development
      'https://dreamnet-journal.vercel.app', // Production custom domain
      'https://dreamnet-8tfv9zd7t-gavintrents-projects.vercel.app' // Vercel project URL
    ];
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Log unexpected origins for debugging
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

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
app.use('/api/notifications', notificationRoutes);


// Health check
app.get('/', (req, res) => {
  res.send('Dream Journal API is running');
});

module.exports = app;
