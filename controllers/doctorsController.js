import { query } from '../config/database.js';

export async function getAllDoctors(req, res) {
    try {
        const sql = `
            SELECT
                d.DoctorID,
                d.DoctorName,
                d.DoctorPhone,
                d.DoctorEmail,
                d.DepartmentID,
                dept.DepartmentName,
                GROUP_CONCAT(DISTINCT ds.Specialization SEPARATOR ', ') AS Specializations
            FROM Doctor d
            LEFT JOIN Department dept ON d.DepartmentID = dept.DepartmentID
            LEFT JOIN DoctorSpecialization ds ON d.DoctorID = ds.DoctorID
            GROUP BY d.DoctorID, d.DoctorName, d.DoctorPhone, d.DoctorEmail, d.DepartmentID, dept.DepartmentName
            ORDER BY d.DoctorName
        `;
        const results = await query(sql);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error: error.message });
    }
}

export async function getDoctorById(req, res) {
    try {
        const sql = `
            SELECT
                d.DoctorID,
                d.DoctorName,
                d.DoctorPhone,
                d.DoctorEmail,
                d.DepartmentID,
                dept.DepartmentName
            FROM Doctor d
            LEFT JOIN Department dept ON d.DepartmentID = dept.DepartmentID
            WHERE d.DoctorID = ?
        `;
        const results = await query(sql, [req.params.id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctor', error: error.message });
    }
}

export async function createDoctor(req, res) {
    try {
        const { DoctorID, DoctorName, DoctorPhone, DoctorEmail, DepartmentID } = req.body;

        if (!DoctorID || !DoctorName || !DoctorPhone || !DoctorEmail || !DepartmentID) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const sql = `
            INSERT INTO Doctor (DoctorID, DoctorName, DoctorPhone, DoctorEmail, DepartmentID)
            VALUES (?, ?, ?, ?, ?)
        `;
        await query(sql, [DoctorID, DoctorName, DoctorPhone, DoctorEmail, DepartmentID]);

        res.status(201).json({ message: 'Doctor created successfully', DoctorID });
    } catch (error) {
        res.status(500).json({ message: 'Error creating doctor', error: error.message });
    }
}

export async function updateDoctor(req, res) {
    try {
        const { DoctorName, DoctorPhone, DoctorEmail, DepartmentID } = req.body;

        const sql = `
            UPDATE Doctor
            SET DoctorName = ?, DoctorPhone = ?, DoctorEmail = ?, DepartmentID = ?
            WHERE DoctorID = ?
        `;
        const result = await query(sql, [DoctorName, DoctorPhone, DoctorEmail, DepartmentID, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json({ message: 'Doctor updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating doctor', error: error.message });
    }
}

export async function deleteDoctor(req, res) {
    try {
        const sql = 'DELETE FROM Doctor WHERE DoctorID = ?';
        const result = await query(sql, [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting doctor', error: error.message });
    }
}

export async function getDoctorSpecializations(req, res) {
    try {
        const sql = `
            SELECT Specialization, Certification, CertificationDate
            FROM DoctorSpecialization
            WHERE DoctorID = ?
        `;
        const results = await query(sql, [req.params.id]);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching specializations', error: error.message });
    }
}

export async function addDoctorSpecialization(req, res) {
    try {
        const { Specialization, Certification, CertificationDate } = req.body;

        const sql = `
            INSERT INTO DoctorSpecialization (DoctorID, Specialization, Certification, CertificationDate)
            VALUES (?, ?, ?, ?)
        `;
        await query(sql, [req.params.id, Specialization, Certification, CertificationDate]);

        res.status(201).json({ message: 'Specialization added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding specialization', error: error.message });
    }
}
