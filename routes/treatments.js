import express from 'express';
import { getAllTreatments, getTreatmentById } from '../controllers/treatmentsController.js';

const router = express.Router();

router.get('/', getAllTreatments);
router.get('/:id', getTreatmentById);

export default router;
