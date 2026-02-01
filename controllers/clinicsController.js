import { query } from '../config/database.js';

export async function getAllClinics(req, res) {
    try {
        const sql = `
            SELECT ClinicID, ClinicName, ClinicAddress, ClinicPhone
            FROM Clinic
            ORDER BY ClinicName
        `;
        const results = await query(sql);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching clinics', error: error.message });
    }
}
