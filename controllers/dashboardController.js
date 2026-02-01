import { query } from '../config/database.js';

export async function getStats(req, res) {
    try {
        const [doctors] = await query('SELECT COUNT(*) as count FROM Doctor');
        const [patients] = await query('SELECT COUNT(*) as count FROM Patient');
        const [treatments] = await query('SELECT COUNT(*) as count FROM Treatment');
        const [prescriptions] = await query('SELECT COUNT(*) as count FROM Prescription WHERE PrescriptionEndDate IS NULL OR PrescriptionEndDate >= CURDATE()');

        res.json({
            totalDoctors: doctors.count,
            totalPatients: patients.count,
            totalTreatments: treatments.count,
            activePrescriptions: prescriptions.count
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
}

export async function getRecentTreatments(req, res) {
    try {
        const sql = `
            SELECT
                t.TreatmentID,
                t.TreatmentDate,
                t.Diagnosis,
                p.PatientName,
                d.DoctorName
            FROM Treatment t
            JOIN Patient p ON t.PatientID = p.PatientID
            JOIN Doctor d ON t.DoctorID = d.DoctorID
            ORDER BY t.TreatmentDate DESC
            LIMIT 10
        `;
        const results = await query(sql);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent treatments', error: error.message });
    }
}

export async function getDepartmentStats(req, res) {
    try {
        const sql = `
            SELECT
                dept.DepartmentName,
                COUNT(DISTINCT d.DoctorID) AS NumberOfDoctors,
                COUNT(DISTINCT ds.Specialization) AS NumberOfSpecializations
            FROM Department dept
            LEFT JOIN Doctor d ON dept.DepartmentID = d.DepartmentID
            LEFT JOIN DoctorSpecialization ds ON d.DoctorID = ds.DoctorID
            GROUP BY dept.DepartmentID, dept.DepartmentName
            ORDER BY NumberOfDoctors DESC
        `;
        const results = await query(sql);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching department stats', error: error.message });
    }
}
