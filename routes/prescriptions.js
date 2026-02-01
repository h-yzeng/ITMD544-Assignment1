import express from 'express';
import { getAllPrescriptions, getActivePrescriptions } from '../controllers/prescriptionsController.js';

const router = express.Router();

router.get('/', getAllPrescriptions);
router.get('/active', getActivePrescriptions);

export default router;
