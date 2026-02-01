import { query } from '../config/database.js';

export async function getAllMedications(req, res) {
    try {
        const sql = `
            SELECT MedicationID, MedicationName
            FROM Medication
            ORDER BY MedicationName
        `;
        const results = await query(sql);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching medications', error: error.message });
    }
}
