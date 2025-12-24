const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

/// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); // Enable CORS with deployment-safe config

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


// Import routes
const authRoutes = require('./routes/authRoutes');
const flashcardRoutes = require('./routes/flashcardRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Basic test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Flashcard Generator API is running!',
    status: 'success' 
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

module.exports = app;