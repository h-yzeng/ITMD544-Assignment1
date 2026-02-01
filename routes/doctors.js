import express from 'express';
import {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorSpecializations,
    addDoctorSpecialization
} from '../controllers/doctorsController.js';

const router = express.Router();

router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.post('/', createDoctor);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);
router.get('/:id/specializations', getDoctorSpecializations);
router.post('/:id/specializations', addDoctorSpecialization);

export default router;
