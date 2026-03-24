import express from 'express';
import { AppDataSource } from '../config/database';
import { Resume } from '../models/Resume';
import { Job } from '../models/Job';
import { analyzeFit } from '../services/claude/fitScoring';
import { generateBullets } from '../services/claude/bulletSuggestions';
import { generateCoverLetter } from '../services/claude/coverLetter';
import { generateInterviewPrep } from '../services/claude/interviewPrep';

const router = express.Router();

// Analyze fit score
router.post('/fit-score/:jobId', async (req, res) => {
  try {
    const resumeRepo = AppDataSource.getRepository(Resume);
    const jobRepo = AppDataSource.getRepository(Job);

    const resume = await resumeRepo.findOne({ where: {}, order: { id: 'DESC' } });
    if (!resume) {
      return res
        .status(404)
        .json({ detail: 'Resume not found. Please upload a resume first.' });
    }

    const job = await jobRepo.findOne({ where: { id: parseInt(req.params.jobId) } });
    if (!job) {
      return res.status(404).json({ detail: 'Job not found' });
    }

    const fitAnalysisResult = await analyzeFit(resume.content, job.description, job.companyStage);

    res.json({
      job_id: job.id,
      ...fitAnalysisResult,
    });
  } catch (error: any) {
    res.status(500).json({ detail: error.message });
  }
});

// Generate bullet suggestions
router.post('/bullets/:jobId', async (req, res) => {
  try {
    const resumeRepo = AppDataSource.getRepository(Resume);
    const jobRepo = AppDataSource.getRepository(Job);

    const resume = await resumeRepo.findOne({ where: {}, order: { id: 'DESC' } });
    if (!resume) {
      return res
        .status(404)
        .json({ detail: 'Resume not found. Please upload a resume first.' });
    }

    const job = await jobRepo.findOne({ where: { id: parseInt(req.params.jobId) } });
    if (!job) {
      return res.status(404).json({ detail: 'Job not found' });
    }

    const suggestions = await generateBullets(resume.content, job.description);

    res.json({
      job_id: job.id,
      suggestions,
    });
  } catch (error: any) {
    res.status(500).json({ detail: error.message });
  }
});

// Generate cover letter
router.post('/cover-letter/:jobId', async (req, res) => {
  try {
    const resumeRepo = AppDataSource.getRepository(Resume);
    const jobRepo = AppDataSource.getRepository(Job);

    const resume = await resumeRepo.findOne({ where: {}, order: { id: 'DESC' } });
    if (!resume) {
      return res
        .status(404)
        .json({ detail: 'Resume not found. Please upload a resume first.' });
    }

    const job = await jobRepo.findOne({ where: { id: parseInt(req.params.jobId) } });
    if (!job) {
      return res.status(404).json({ detail: 'Job not found' });
    }

    const { tone = 'professional' } = req.body;

    const content = await generateCoverLetter(
      resume.content,
      job.description,
      job.company,
      job.role,
      tone
    );

    res.json({
      job_id: job.id,
      content,
      tone,
    });
  } catch (error: any) {
    res.status(500).json({ detail: error.message });
  }
});

// Generate interview prep
router.post('/interview-prep/:jobId', async (req, res) => {
  try {
    const resumeRepo = AppDataSource.getRepository(Resume);
    const jobRepo = AppDataSource.getRepository(Job);

    const resume = await resumeRepo.findOne({ where: {}, order: { id: 'DESC' } });
    if (!resume) {
      return res
        .status(404)
        .json({ detail: 'Resume not found. Please upload a resume first.' });
    }

    const job = await jobRepo.findOne({ where: { id: parseInt(req.params.jobId) } });
    if (!job) {
      return res.status(404).json({ detail: 'Job not found' });
    }

    const interviewPrepResult = await generateInterviewPrep(
      resume.content,
      job.description,
      job.company,
      job.role
    );

    res.json({
      job_id: job.id,
      ...interviewPrepResult,
    });
  } catch (error: any) {
    res.status(500).json({ detail: error.message });
  }
});

export default router;
