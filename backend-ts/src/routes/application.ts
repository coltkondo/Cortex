import express from 'express';
import { AppDataSource } from '../config/database';
import { Application, ApplicationStage } from '../models/Application';

const router = express.Router();

// Get all applications (with job details)
router.get('', async (req, res) => {
  try {
    const applicationRepo = AppDataSource.getRepository(Application);
    const applications = await applicationRepo.find({
      relations: ['job'],
      order: { createdAt: 'DESC' },
    });
    res.json(applications);
  } catch (error: any) {
    console.error('Get applications error:', error);
    res.status(500).json({ detail: error.message });
  }
});

// Create new application
router.post('', async (req, res) => {
  try {
    const { jobId, stage = ApplicationStage.SAVED, notes } = req.body;

    if (!jobId) {
      return res.status(400).json({ detail: 'jobId is required' });
    }

    const applicationRepo = AppDataSource.getRepository(Application);
    const application = applicationRepo.create({
      jobId,
      stage,
      notes,
    });

    await applicationRepo.save(application);

    // Fetch with job relation
    const applications = await applicationRepo.find({
      where: { id: application.id },
      relations: ['job'],
      take: 1,
    });
    const savedApplication = applications[0];

    res.json(savedApplication);
  } catch (error: any) {
    console.error('Create application error:', error);
    res.status(500).json({ detail: error.message });
  }
});

// Update application (stage, notes, dates)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, notes, appliedDate, screenDate, interviewDate, offerDate } = req.body;

    const applicationRepo = AppDataSource.getRepository(Application);
    const applications = await applicationRepo.find({
      where: { id: parseInt(id) },
      relations: ['job'],
      take: 1,
    });
    const application = applications[0];

    if (!application) {
      return res.status(404).json({ detail: 'Application not found' });
    }

    // Update fields
    if (stage !== undefined) {
      application.stage = stage;

      // Auto-update stage dates
      const now = new Date();
      if (stage === ApplicationStage.APPLIED && !application.appliedDate) {
        application.appliedDate = now;
      } else if (stage === ApplicationStage.SCREEN && !application.screenDate) {
        application.screenDate = now;
      } else if (stage === ApplicationStage.INTERVIEW && !application.interviewDate) {
        application.interviewDate = now;
      } else if (stage === ApplicationStage.OFFER && !application.offerDate) {
        application.offerDate = now;
      }
    }

    if (notes !== undefined) application.notes = notes;
    if (appliedDate !== undefined) application.appliedDate = appliedDate;
    if (screenDate !== undefined) application.screenDate = screenDate;
    if (interviewDate !== undefined) application.interviewDate = interviewDate;
    if (offerDate !== undefined) application.offerDate = offerDate;

    await applicationRepo.save(application);
    res.json(application);
  } catch (error: any) {
    console.error('Update application error:', error);
    res.status(500).json({ detail: error.message });
  }
});

// Delete application
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const applicationRepo = AppDataSource.getRepository(Application);
    const result = await applicationRepo.delete(id);

    if (result.affected === 0) {
      return res.status(404).json({ detail: 'Application not found' });
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (error: any) {
    console.error('Delete application error:', error);
    res.status(500).json({ detail: error.message });
  }
});

export default router;
