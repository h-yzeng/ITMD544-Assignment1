import { query } from '../config/database.js';

export async function getAllSchedules(req, res) {
    try {
        const sql = `
            SELECT
                dcs.ScheduleID,
                dcs.ConsultationDay,
                dcs.ConsultationHours,
                d.DoctorID,
                d.DoctorName,
                c.ClinicID,
                c.ClinicName,
                c.ClinicAddress
            FROM DoctorClinicSchedule dcs
            JOIN Doctor d ON dcs.DoctorID = d.DoctorID
            JOIN Clinic c ON dcs.ClinicID = c.ClinicID
            ORDER BY d.DoctorName, c.ClinicName, dcs.ConsultationDay
        `;
        const results = await query(sql);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedules', error: error.message });
    }
}
