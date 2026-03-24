import express from 'express';
import multer from 'multer';
import { AppDataSource } from '../config/database';
import { Resume } from '../models/Resume';
import { extractTextFromPDF } from '../utils/pdfParser';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload resume
router.post('/upload', upload.single('file'), async (req, res) => {
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
    const resume = await resumeRepo.findOne({
      order: { id: 'DESC' }
    });
    res.json(resume || null);
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

export default router;
