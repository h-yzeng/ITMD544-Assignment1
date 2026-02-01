import { query } from '../config/database.js';

export async function getAllDepartments(req, res) {
    try {
        const sql = `
            SELECT DepartmentID, DepartmentName, DepartmentLocation, DepartmentHead
            FROM Department
            ORDER BY DepartmentName
        `;
        const results = await query(sql);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching departments', error: error.message });
    }
}
