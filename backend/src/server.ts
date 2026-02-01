import express from 'express';
import { createServer } from 'http';
import { env } from './config/env.js';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import healthRouter from './routes/health.js';
import { initWebSocketServer } from './websocket/server.js';
import { logger } from './utils/logger.js';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Routes
app.use('/', healthRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize WebSocket server
const wss = initWebSocketServer(httpServer);

// Start server
httpServer.listen(env.port, () => {
  logger.info(`Server running on port ${env.port}`);
  logger.info(`Environment: ${env.nodeEnv}`);
  logger.info(`CORS origin: ${env.corsOrigin}`);
  logger.info(`WebSocket endpoint: ws://localhost:${env.port}/ws/chat`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  wss.close(() => {
    httpServer.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });
});

export { app, httpServer, wss };
