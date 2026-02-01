import express from 'express';
import { getStats, getRecentTreatments, getDepartmentStats } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', getStats);
router.get('/recent-treatments', getRecentTreatments);
router.get('/department-stats', getDepartmentStats);

export default router;
