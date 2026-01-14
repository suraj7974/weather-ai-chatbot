// Express app configuration
import express, { type Express } from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app: Express = express();

// Middleware
app.use(cors({ origin: config.CLIENT_URL }));
app.use(express.json());

// Root route
app.get('/', (_, res) => {
  res.json({ 
    message: 'Weather Travel Chatbot API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      chat: '/api/chat',
      weather: '/api/weather',
      location: '/api/location'
    }
  });
});

// API Routes
app.use('/api', routes);

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use(errorHandler);

export default app;
