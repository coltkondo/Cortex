import express from 'express';
import multer from 'multer';
import { AppDataSource } from '../config/database';
import { Resume } from '../models/Resume';
import { extractTextFromPDF } from '../utils/pdfParser';
import { uploadRateLimiter } from '../config/rateLimiting';
import { analyzeResume } from '../services/claude/resumeAnalysis';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload resume
router.post('/upload', uploadRateLimiter, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'No file uploaded' });
    }

    if (!req.file.originalname.endsWith('.pdf')) {
      return res.status(400).json({ detail: 'Only PDF files are supported' });
    }

    // Extract text from PDF
    const parsedText = await extractTextFromPDF(req.file.buffer);

    // Delete existing resume (single-user app)
    const resumeRepo = AppDataSource.getRepository(Resume);
    await resumeRepo.clear(); // Clear all resumes

    // Create new resume
    const resume = resumeRepo.create({
      filename: req.file.originalname,
      content: parsedText,
    });

    await resumeRepo.save(resume);

    res.json(resume);
  } catch (error: any) {
    console.error('Resume upload error:', error);
    res.status(500).json({ detail: `Failed to process PDF: ${error.message}` });
  }
});

// Get current resume
router.get('', async (req, res) => {
  try {
    const resumeRepo = AppDataSource.getRepository(Resume);
    const resumes = await resumeRepo.find({
      order: { id: 'DESC' },
      take: 1
    });
    const resume = resumes[0] || null;
    res.json(resume);
  } catch (error: any) {
    console.error('Get resume error:', error);
    res.status(500).json({ detail: error.message });
  }
});

// Delete resume
router.delete('', async (req, res) => {
  try {
    const resumeRepo = AppDataSource.getRepository(Resume);
    await resumeRepo.clear(); // Clear all resumes
    res.json({ message: 'Resume deleted successfully' });
  } catch (error: any) {
    console.error('Delete resume error:', error);
    res.status(500).json({ detail: error.message });
  }
});

// Analyze resume with AI
router.post('/analyze', async (req, res) => {
  try {
    const resumeRepo = AppDataSource.getRepository(Resume);
    const resumes = await resumeRepo.find({
      order: { id: 'DESC' },
      take: 1
    });
    const resume = resumes[0];

    if (!resume) {
      return res.status(404).json({ detail: 'No resume found' });
    }

    const analysis = await analyzeResume(resume.content);
    res.json(analysis);
  } catch (error: any) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ detail: error.message });
  }
});

// Update resume sections
router.patch('/sections', async (req, res) => {
  try {
    const { experienceSection, skillsSection, educationSection, projectsSection } = req.body;

    const resumeRepo = AppDataSource.getRepository(Resume);
    const resumes = await resumeRepo.find({
      order: { id: 'DESC' },
      take: 1
    });
    const resume = resumes[0];

    if (!resume) {
      return res.status(404).json({ detail: 'No resume found' });
    }

    // Update sections
    if (experienceSection !== undefined) resume.experienceSection = experienceSection;
    if (skillsSection !== undefined) resume.skillsSection = skillsSection;
    if (educationSection !== undefined) resume.educationSection = educationSection;
    if (projectsSection !== undefined) resume.projectsSection = projectsSection;

    await resumeRepo.save(resume);
    res.json(resume);
  } catch (error: any) {
    console.error('Update sections error:', error);
    res.status(500).json({ detail: error.message });
  }
});

export default router;
