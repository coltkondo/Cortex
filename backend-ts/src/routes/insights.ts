import express from 'express';
import { getInsightsData } from '../services/analytics';

const router = express.Router();

// Get aggregated insights
router.get('', async (req, res) => {
  try {
    const insights = await getInsightsData();
    res.json(insights);
  } catch (error: any) {
    console.error('Get insights error:', error);
    res.status(500).json({ detail: error.message });
  }
});

export default router;
