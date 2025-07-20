// Import required modules and route handlers
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import './types/express'; // Ensure custom types are loaded

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();
// Set the server port from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.send('User Service is running!');
});

// Start the server and log the URL
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Register authentication routes under /api
app.use('/api', authRoutes);
// Register user-related routes
app.use('/api/users', userRoutes);
