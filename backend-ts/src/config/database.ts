import { DataSource } from 'typeorm';
import { Resume } from '../models/Resume';
import { Job } from '../models/Job';
import { Application } from '../models/Application';
import { GeneratedContent } from '../models/GeneratedContent';

const databasePath = process.env.DATABASE_PATH || './cortex.db';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: databasePath,
  synchronize: true, // Auto-create tables (use migrations in production)
  logging: false,
  entities: [Resume, Job, Application, GeneratedContent],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};
