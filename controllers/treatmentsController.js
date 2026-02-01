import { query } from '../config/database.js';

export async function getAllTreatments(req, res) {
    try {
        const sql = `
            SELECT
                t.TreatmentID,
                t.TreatmentDate,
                t.Diagnosis,
                p.PatientID,
                p.PatientName,
                d.DoctorID,
                d.DoctorName
            FROM Treatment t
            JOIN Patient p ON t.PatientID = p.PatientID
            JOIN Doctor d ON t.DoctorID = d.DoctorID
            ORDER BY t.TreatmentDate DESC
        `;
        const results = await query(sql);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching treatments', error: error.message });
    }
}

export async function getTreatmentById(req, res) {
    try {
        const sql = `
            SELECT
                t.TreatmentID,
                t.TreatmentDate,
                t.Diagnosis,
                p.PatientID,
                p.PatientName,
                d.DoctorID,
                d.DoctorName
            FROM Treatment t
            JOIN Patient p ON t.PatientID = p.PatientID
            JOIN Doctor d ON t.DoctorID = d.DoctorID
            WHERE t.TreatmentID = ?
        `;
        const results = await query(sql, [req.params.id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Treatment not found' });
        }

        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching treatment', error: error.message });
    }
}
