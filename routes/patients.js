import express from 'express';
import {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientTreatmentHistory
} from '../controllers/patientsController.js';

const router = express.Router();

router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);
router.get('/:id/treatments', getPatientTreatmentHistory);

export default router;
