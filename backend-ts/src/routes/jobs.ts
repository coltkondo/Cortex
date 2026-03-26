import express from 'express';
import { AppDataSource } from '../config/database';
import { Job } from '../models/Job';
import { fetchJobDescriptionFromURL } from '../utils/urlFetcher';
import { formatJobDescription } from '../services/claude/jobDescriptionFormatter';
import { generalRateLimiter } from '../config/rateLimiting';

const router = express.Router();

// Apply general rate limiting to all job endpoints
router.use(generalRateLimiter);

// Fetch job description from URL
router.post('/fetch-from-url', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ detail: 'URL is required' });
    }

    const jobData = await fetchJobDescriptionFromURL(url);
    res.json(jobData);
  } catch (error: any) {
    res.status(400).json({ detail: error.message });
  }
});

// Format job description with AI parsing
router.post('/format-description', async (req, res) => {
  try {
    const { description, company, role } = req.body;

    if (!description || description.trim().length === 0) {
      return res.status(400).json({ detail: 'Job description is required' });
    }

    const formatted = await formatJobDescription(description, company, role);
    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ detail: error.message });
  }
});

// Create job
router.post('', async (req, res) => {
  try {
    const jobRepo = AppDataSource.getRepository(Job);
    const job = jobRepo.create(req.body);
    await jobRepo.save(job);
    res.status(201).json(job);
  } catch (error: any) {
    res.status(500).json({ detail: error.message });
  }
});

// List all jobs
router.get('', async (req, res) => {
  try {
    const jobRepo = AppDataSource.getRepository(Job);
    const jobs = await jobRepo.find({ order: { createdAt: 'DESC' } });
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ detail: error.message });
  }
});

// Get specific job
router.get('/:id', async (req, res) => {
  try {
    const jobRepo = AppDataSource.getRepository(Job);
    const job = await jobRepo.findOne({ where: { id: parseInt(req.params.id) } });

    if (!job) {
      return res.status(404).json({ detail: 'Job not found' });
    }

    res.json(job);
  } catch (error: any) {
    res.status(500).json({ detail: error.message });
  }
});

// Update job
router.patch('/:id', async (req, res) => {
  try {
    const jobRepo = AppDataSource.getRepository(Job);
    const job = await jobRepo.findOne({ where: { id: parseInt(req.params.id) } });

    if (!job) {
      return res.status(404).json({ detail: 'Job not found' });
    }

    jobRepo.merge(job, req.body);
    await jobRepo.save(job);
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ detail: error.message });
  }
});

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    const jobRepo = AppDataSource.getRepository(Job);
    const job = await jobRepo.findOne({ where: { id: parseInt(req.params.id) } });

    if (!job) {
      return res.status(404).json({ detail: 'Job not found' });
    }

    await jobRepo.remove(job);
    res.json({ message: 'Job deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ detail: error.message });
  }
});

export default router;
