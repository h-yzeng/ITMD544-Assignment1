import { query } from '../config/database.js';

export async function getAllPatients(req, res) {
    try {
        const sql = `
            SELECT PatientID, PatientName, PatientDOB, PatientPhone, PatientEmail, PatientAddress
            FROM Patient
            ORDER BY PatientName
        `;
        const results = await query(sql);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients', error: error.message });
    }
}

export async function getPatientById(req, res) {
    try {
        const sql = `
            SELECT *
            FROM Patient
            WHERE PatientID = ?
        `;
        const results = await query(sql, [req.params.id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patient', error: error.message });
    }
}

export async function createPatient(req, res) {
    try {
        const {
            PatientID,
            PatientName,
            PatientDOB,
            PatientPhone,
            PatientEmail,
            PatientAddress,
            EmergencyContact,
            EmergencyPhone
        } = req.body;

        if (!PatientID || !PatientName || !PatientDOB || !PatientPhone || !PatientAddress || !EmergencyContact || !EmergencyPhone) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        const sql = `
            INSERT INTO Patient (PatientID, PatientName, PatientDOB, PatientPhone, PatientEmail, PatientAddress, EmergencyContact, EmergencyPhone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await query(sql, [PatientID, PatientName, PatientDOB, PatientPhone, PatientEmail, PatientAddress, EmergencyContact, EmergencyPhone]);

        res.status(201).json({ message: 'Patient created successfully', PatientID });
    } catch (error) {
        res.status(500).json({ message: 'Error creating patient', error: error.message });
    }
}

export async function updatePatient(req, res) {
    try {
        const {
            PatientName,
            PatientDOB,
            PatientPhone,
            PatientEmail,
            PatientAddress,
            EmergencyContact,
            EmergencyPhone
        } = req.body;

        const sql = `
            UPDATE Patient
            SET PatientName = ?, PatientDOB = ?, PatientPhone = ?, PatientEmail = ?, PatientAddress = ?, EmergencyContact = ?, EmergencyPhone = ?
            WHERE PatientID = ?
        `;
        const result = await query(sql, [PatientName, PatientDOB, PatientPhone, PatientEmail, PatientAddress, EmergencyContact, EmergencyPhone, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json({ message: 'Patient updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating patient', error: error.message });
    }
}

export async function deletePatient(req, res) {
    try {
        const sql = 'DELETE FROM Patient WHERE PatientID = ?';
        const result = await query(sql, [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting patient', error: error.message });
    }
}

export async function getPatientTreatmentHistory(req, res) {
    try {
        const sql = `
            SELECT
                t.TreatmentID,
                t.TreatmentDate,
                t.Diagnosis,
                d.DoctorName,
                GROUP_CONCAT(DISTINCT m.MedicationName SEPARATOR ', ') AS Medications
            FROM Treatment t
            JOIN Doctor d ON t.DoctorID = d.DoctorID
            LEFT JOIN Prescription pr ON t.TreatmentID = pr.TreatmentID
            LEFT JOIN Medication m ON pr.MedicationID = m.MedicationID
            WHERE t.PatientID = ?
            GROUP BY t.TreatmentID, t.TreatmentDate, t.Diagnosis, d.DoctorName
            ORDER BY t.TreatmentDate DESC
        `;
        const results = await query(sql, [req.params.id]);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching treatment history', error: error.message });
    }
}
