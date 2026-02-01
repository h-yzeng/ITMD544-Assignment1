import express from 'express';
import { getAllSchedules } from '../controllers/schedulesController.js';

const router = express.Router();

router.get('/', getAllSchedules);

export default router;
