-- Hospital Management System - Sample Queries
-- =====================================================
-- Query 1: Find all doctors with their specializations
-- =====================================================
SELECT
    d.DoctorID,
    d.DoctorName,
    d.DoctorPhone,
    d.DoctorEmail,
    ds.Specialization,
    ds.Certification,
    ds.CertificationDate,
    dept.DepartmentName
FROM Doctor d
JOIN DoctorSpecialization ds ON d.DoctorID = ds.DoctorID
JOIN Department dept ON d.DepartmentID = dept.DepartmentID
ORDER BY d.DoctorName, ds.Specialization;

-- =====================================================
-- Query 2: Get complete prescription history for a patient
-- =====================================================
SELECT
    p.PatientID,
    p.PatientName,
    p.PatientDOB,
    t.TreatmentDate,
    t.Diagnosis,
    d.DoctorName,
    ds.Specialization,
    m.MedicationName,
    pr.Dosage,
    pr.Frequency,
    pr.PrescriptionDate,
    pr.PrescriptionEndDate
FROM Patient p
JOIN Treatment t ON p.PatientID = t.PatientID
JOIN Doctor d ON t.DoctorID = d.DoctorID
LEFT JOIN DoctorSpecialization ds ON d.DoctorID = ds.DoctorID
LEFT JOIN Prescription pr ON t.TreatmentID = pr.TreatmentID
LEFT JOIN Medication m ON pr.MedicationID = m.MedicationID
WHERE p.PatientID = 'P1001'
ORDER BY t.TreatmentDate, pr.PrescriptionDate;

-- =====================================================
-- Query 3: Find all clinics where a specific doctor works
-- =====================================================
SELECT
    d.DoctorID,
    d.DoctorName,
    c.ClinicName,
    c.ClinicAddress,
    c.ClinicPhone,
    dcs.ConsultationDay,
    dcs.ConsultationHours
FROM Doctor d
JOIN DoctorClinicSchedule dcs ON d.DoctorID = dcs.DoctorID
JOIN Clinic c ON dcs.ClinicID = c.ClinicID
WHERE d.DoctorID = 'D101'
ORDER BY
    CASE dcs.ConsultationDay
        WHEN 'Monday' THEN 1
        WHEN 'Tuesday' THEN 2
        WHEN 'Wednesday' THEN 3
        WHEN 'Thursday' THEN 4
        WHEN 'Friday' THEN 5
        WHEN 'Saturday' THEN 6
        WHEN 'Sunday' THEN 7
    END;

-- =====================================================
-- Query 4: List all patients treated by a specific doctor
-- =====================================================
SELECT DISTINCT
    d.DoctorName,
    p.PatientID,
    p.PatientName,
    p.PatientPhone,
    p.PatientEmail,
    COUNT(t.TreatmentID) AS TotalVisits,
    MIN(t.TreatmentDate) AS FirstVisit,
    MAX(t.TreatmentDate) AS LastVisit
FROM Doctor d
JOIN Treatment t ON d.DoctorID = t.DoctorID
JOIN Patient p ON t.PatientID = p.PatientID
WHERE d.DoctorID = 'D101'
GROUP BY d.DoctorName, p.PatientID, p.PatientName, p.PatientPhone, p.PatientEmail
ORDER BY LastVisit DESC;

-- =====================================================
-- Query 5: Find all doctors available at a specific clinic on a specific day
-- =====================================================
SELECT
    c.ClinicName,
    dcs.ConsultationDay,
    d.DoctorID,
    d.DoctorName,
    d.DoctorPhone,
    GROUP_CONCAT(DISTINCT ds.Specialization ORDER BY ds.Specialization SEPARATOR ', ') AS Specializations,
    dcs.ConsultationHours
FROM Clinic c
JOIN DoctorClinicSchedule dcs ON c.ClinicID = dcs.ClinicID
JOIN Doctor d ON dcs.DoctorID = d.DoctorID
LEFT JOIN DoctorSpecialization ds ON d.DoctorID = ds.DoctorID
WHERE c.ClinicID = 'CL01' AND dcs.ConsultationDay = 'Monday'
GROUP BY c.ClinicName, dcs.ConsultationDay, d.DoctorID, d.DoctorName, d.DoctorPhone, dcs.ConsultationHours
ORDER BY d.DoctorName;

-- =====================================================
-- Query 6: Get all active prescriptions for all patients
-- =====================================================
SELECT
    p.PatientID,
    p.PatientName,
    p.PatientPhone,
    m.MedicationName,
    pr.Dosage,
    pr.Frequency,
    pr.PrescriptionDate,
    pr.PrescriptionEndDate,
    d.DoctorName,
    t.Diagnosis
FROM Patient p
JOIN Treatment t ON p.PatientID = t.PatientID
JOIN Prescription pr ON t.TreatmentID = pr.TreatmentID
JOIN Medication m ON pr.MedicationID = m.MedicationID
JOIN Doctor d ON t.DoctorID = d.DoctorID
WHERE pr.PrescriptionEndDate IS NULL OR pr.PrescriptionEndDate >= CURRENT_DATE
ORDER BY p.PatientName, m.MedicationName;

-- =====================================================
-- Query 7: Department-wise doctor count with specializations
-- =====================================================
SELECT
    dept.DepartmentName,
    dept.DepartmentHead,
    COUNT(DISTINCT d.DoctorID) AS NumberOfDoctors,
    GROUP_CONCAT(DISTINCT d.DoctorName ORDER BY d.DoctorName SEPARATOR ', ') AS Doctors,
    COUNT(DISTINCT ds.Specialization) AS NumberOfSpecializations
FROM Department dept
LEFT JOIN Doctor d ON dept.DepartmentID = d.DepartmentID
LEFT JOIN DoctorSpecialization ds ON d.DoctorID = ds.DoctorID
GROUP BY dept.DepartmentName, dept.DepartmentHead
ORDER BY NumberOfDoctors DESC;

-- =====================================================
-- Query 8: Most prescribed medications
-- =====================================================
SELECT
    m.MedicationID,
    m.MedicationName,
    COUNT(pr.PrescriptionID) AS TotalPrescriptions,
    COUNT(DISTINCT t.PatientID) AS UniquePatients,
    COUNT(DISTINCT t.DoctorID) AS PrescribingDoctors
FROM Medication m
JOIN Prescription pr ON m.MedicationID = pr.MedicationID
JOIN Treatment t ON pr.TreatmentID = t.TreatmentID
GROUP BY m.MedicationID, m.MedicationName
ORDER BY TotalPrescriptions DESC
LIMIT 10;

-- =====================================================
-- Query 9: Patient treatment summary with medication count
-- =====================================================
SELECT
    p.PatientID,
    p.PatientName,
    TIMESTAMPDIFF(YEAR, p.PatientDOB, CURRENT_DATE) AS Age,
    COUNT(DISTINCT t.TreatmentID) AS TotalTreatments,
    COUNT(DISTINCT pr.PrescriptionID) AS TotalPrescriptions,
    COUNT(DISTINCT t.DoctorID) AS DoctorsSeen,
    MIN(t.TreatmentDate) AS FirstVisit,
    MAX(t.TreatmentDate) AS LastVisit
FROM Patient p
LEFT JOIN Treatment t ON p.PatientID = t.PatientID
LEFT JOIN Prescription pr ON t.TreatmentID = pr.TreatmentID
GROUP BY p.PatientID, p.PatientName, p.PatientDOB
ORDER BY TotalTreatments DESC, p.PatientName;

-- =====================================================
-- Query 10: Doctors with their clinic coverage
-- =====================================================
SELECT
    d.DoctorID,
    d.DoctorName,
    dept.DepartmentName,
    COUNT(DISTINCT dcs.ClinicID) AS ClinicsServed,
    COUNT(DISTINCT dcs.ConsultationDay) AS DaysWorking,
    GROUP_CONCAT(DISTINCT c.ClinicName ORDER BY c.ClinicName SEPARATOR ', ') AS Clinics
FROM Doctor d
JOIN Department dept ON d.DepartmentID = dept.DepartmentID
LEFT JOIN DoctorClinicSchedule dcs ON d.DoctorID = dcs.DoctorID
LEFT JOIN Clinic c ON dcs.ClinicID = c.ClinicID
GROUP BY d.DoctorID, d.DoctorName, dept.DepartmentName
ORDER BY ClinicsServed DESC, DaysWorking DESC;
