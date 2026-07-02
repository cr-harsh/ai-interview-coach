const express = require('express');
const cors = require('cors');
const interviewRoutes = require('./routes/interview.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/interviews', interviewRoutes);

// Basic health route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server running' });
});

module.exports = app;
