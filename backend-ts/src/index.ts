import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { initializeDatabase } from './config/database';
import { initializeRedis, closeRedis, isRedisAvailable } from './config/redis';
import { getCacheStats, clearAICaches } from './services/cache';
import resumeRouter from './routes/resume';
import jobsRouter from './routes/jobs';
import analysisRouter from './routes/analysis';
import applicationRouter from './routes/application';
import insightsRouter from './routes/insights';

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

app.get('/health', async (req, res) => {
  const cacheStats = await getCacheStats();
  res.json({
    status: 'healthy',
    cache: {
      available: cacheStats.available,
      cachedResponses: cacheStats.keyCount,
    },
  });
});

// Cache management endpoints
app.get('/api/cache/stats', async (req, res) => {
  try {
    const stats = await getCacheStats();
    res.json({
      available: stats.available,
      cachedResponses: stats.keyCount,
      message: stats.available
        ? `Redis cache active with ${stats.keyCount} cached AI responses`
        : 'Redis cache not available - running without caching',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/cache', async (req, res) => {
  try {
    if (!isRedisAvailable()) {
      return res.status(503).json({ message: 'Redis cache not available' });
    }
    const cleared = await clearAICaches();
    res.json({
      message: `Successfully cleared ${cleared} cached AI responses`,
      clearedCount: cleared,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/resume', resumeRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/insights', insightsRouter);

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    await initializeRedis();

    const server = app.listen(config.port, () => {
      console.log(`\n🚀 Cortex API running on http://localhost:${config.port}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`🔗 CORS enabled for: ${config.corsOrigins.join(', ')}`);
      console.log(`💾 Cache: ${isRedisAvailable() ? 'Redis enabled' : 'Disabled (no Redis URL)'}\n`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        console.log('HTTP server closed');
        await closeRedis();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
