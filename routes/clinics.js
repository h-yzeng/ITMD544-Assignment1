import express from 'express';
import { getAllClinics } from '../controllers/clinicsController.js';

const router = express.Router();

router.get('/', getAllClinics);

export default router;
