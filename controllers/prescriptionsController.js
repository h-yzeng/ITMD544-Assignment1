import { query } from '../config/database.js';

export async function getAllPrescriptions(req, res) {
    try {
        const sql = `
            SELECT
                pr.PrescriptionID,
                pr.Dosage,
                pr.Frequency,
                pr.PrescriptionDate,
                pr.PrescriptionEndDate,
                m.MedicationID,
                m.MedicationName,
                p.PatientID,
                p.PatientName
            FROM Prescription pr
            JOIN Medication m ON pr.MedicationID = m.MedicationID
            JOIN Treatment t ON pr.TreatmentID = t.TreatmentID
            JOIN Patient p ON t.PatientID = p.PatientID
            ORDER BY pr.PrescriptionDate DESC
        `;
        const results = await query(sql);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
    }
}

export async function getActivePrescriptions(req, res) {
    try {
        const sql = `
            SELECT
                pr.PrescriptionID,
                pr.Dosage,
                pr.Frequency,
                pr.PrescriptionDate,
                pr.PrescriptionEndDate,
                m.MedicationName,
                p.PatientName
            FROM Prescription pr
            JOIN Medication m ON pr.MedicationID = m.MedicationID
            JOIN Treatment t ON pr.TreatmentID = t.TreatmentID
            JOIN Patient p ON t.PatientID = p.PatientID
            WHERE pr.PrescriptionEndDate IS NULL OR pr.PrescriptionEndDate >= CURDATE()
            ORDER BY pr.PrescriptionDate DESC
        `;
        const results = await query(sql);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching active prescriptions', error: error.message });
    }
}
