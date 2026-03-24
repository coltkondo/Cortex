import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { initializeDatabase } from './config/database';
import resumeRouter from './routes/resume';
import jobsRouter from './routes/jobs';
import analysisRouter from './routes/analysis';

const app = express();

// Middleware
app.use(cors({ origin: config.corsOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Cortex API',
    version: '0.1.0',
    status: 'running',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.use('/api/resume', resumeRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/analysis', analysisRouter);

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(config.port, () => {
      console.log(`\n🚀 Cortex API running on http://localhost:${config.port}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`🔗 CORS enabled for: ${config.corsOrigins.join(', ')}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
