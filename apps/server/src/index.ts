import './config/env'; // validate env first
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db';
import { getRedis } from './config/redis';
import { setupWebSocket } from './websocket/wsServer';
import { startWorker } from './workers/questionWorker';
import assignmentRoutes from './routes/assignments';
import jobRoutes from './routes/jobs';
import { errorHandler, notFound } from './middleware/errorHandler';
import { env } from './config/env';

const app = express();
const httpServer = http.createServer(app);

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/assignments', assignmentRoutes);
app.use('/api/jobs', jobRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// WebSocket
setupWebSocket(httpServer);

// Start
async function bootstrap(): Promise<void> {
  await connectDB();
  getRedis(); // initialize connection

  startWorker();

  httpServer.listen(Number(env.PORT), () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
    console.log(`WebSocket on ws://localhost:${env.PORT}/ws`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
