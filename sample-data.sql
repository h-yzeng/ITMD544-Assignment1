-- Hospital Management System - DML 
-- Sample Data for Normalized Tables

-- =====================================================
-- 1. Insert Departments
-- =====================================================
INSERT INTO Department
    (DepartmentID, DepartmentName, DepartmentLocation, DepartmentHead)
VALUES
    ('DEPT01', 'Cardiology Department', 'Building A, Floor 3', 'Dr. James Wilson'),
    ('DEPT02', 'Neurology Department', 'Building B, Floor 2', 'Dr. Emily Chen'),
    ('DEPT03', 'Orthopedics Department', 'Building A, Floor 1', 'Dr. Michael Brown'),
    ('DEPT04', 'Pediatrics Department', 'Building C, Floor 1', 'Dr. Lisa Anderson'),
    ('DEPT05', 'Internal Medicine Department', 'Building B, Floor 3', 'Dr. Robert Taylor');

-- =====================================================
-- 2. Insert Doctors
-- =====================================================
INSERT INTO Doctor
    (DoctorID, DoctorName, DoctorPhone, DoctorEmail, DepartmentID)
VALUES
    ('D101', 'Dr. Sarah Smith', '555-0101', 'smith@hospital.com', 'DEPT01'),
    ('D102', 'Dr. James Wilson', '555-0102', 'wilson@hospital.com', 'DEPT01'),
    ('D103', 'Dr. Emily Chen', '555-0103', 'chen@hospital.com', 'DEPT02'),
    ('D104', 'Dr. Michael Brown', '555-0104', 'brown@hospital.com', 'DEPT03'),
    ('D105', 'Dr. Lisa Anderson', '555-0105', 'anderson@hospital.com', 'DEPT04'),
    ('D106', 'Dr. Robert Taylor', '555-0106', 'taylor@hospital.com', 'DEPT05'),
    ('D107', 'Dr. Jennifer Davis', '555-0107', 'davis@hospital.com', 'DEPT02'),
    ('D108', 'Dr. William Martinez', '555-0108', 'martinez@hospital.com', 'DEPT03');

-- =====================================================
-- 3. Insert Doctor Specializations
-- =====================================================
INSERT INTO DoctorSpecialization
    (DoctorID, Specialization, Certification, CertificationDate)
VALUES
    ('D105', 'Pediatrics', 'ABP-001', '2015-07-20'),
    ('D105', 'Pediatric Cardiology', 'ABP-002', '2020-02-28');

-- =====================================================
-- 4. Insert Clinics
-- =====================================================
INSERT INTO Clinic
    (ClinicID, ClinicName, ClinicAddress, ClinicPhone)
VALUES
    ('CL01', 'Downtown Clinic', '123 Main St', '555-9999'),
    ('CL04', 'Suburban Care Center', '321 Oak Road', '555-6666'),
    ('CL05', 'Community Health Clinic', '654 Pine Street', '555-5555');

-- =====================================================
-- 5. Insert Doctor Clinic Schedules
-- =====================================================
INSERT INTO DoctorClinicSchedule
    (DoctorID, ClinicID, ConsultationDay, ConsultationHours)
VALUES
    ('D101', 'CL01', 'Monday', '9:00-17:00'),
    ('D101', 'CL01', 'Wednesday', '9:00-17:00'),
    ('D101', 'CL01', 'Friday', '9:00-17:00'),
    ('D101', 'CL02', 'Tuesday', '10:00-16:00'),
    ('D101', 'CL02', 'Thursday', '10:00-16:00'),
    ('D102', 'CL01', 'Tuesday', '8:00-16:00'),
    ('D102', 'CL01', 'Thursday', '8:00-16:00'),
    ('D102', 'CL03', 'Monday', '9:00-15:00'),
    ('D102', 'CL03', 'Wednesday', '9:00-15:00'),
    ('D103', 'CL02', 'Monday', '10:00-18:00'),
    ('D103', 'CL02', 'Friday', '10:00-18:00'),
    ('D103', 'CL04', 'Wednesday', '9:00-17:00'),
    ('D104', 'CL03', 'Tuesday', '8:00-14:00'),
    ('D104', 'CL03', 'Thursday', '8:00-14:00'),
    ('D104', 'CL05', 'Monday', '13:00-19:00'),
    ('D105', 'CL04', 'Monday', '9:00-17:00'),
    ('D105', 'CL04', 'Tuesday', '9:00-17:00'),
    ('D105', 'CL04', 'Wednesday', '9:00-17:00'),
    ('D105', 'CL04', 'Thursday', '9:00-17:00'),
    ('D105', 'CL04', 'Friday', '9:00-17:00');

-- =====================================================
-- 6. Insert Patients
-- =====================================================
INSERT INTO Patient
    (PatientID, PatientName, PatientDOB, PatientPhone, PatientEmail, PatientAddress, EmergencyContact, EmergencyPhone)
VALUES
    ('P1001', 'John Doe', '1980-05-15', '555-1234', 'john@email.com', '456 Oak St', 'Jane Doe', '555-5678'),
    ('P1002', 'Mary Johnson', '1975-08-22', '555-2345', 'mary@email.com', '789 Maple Ave', 'Robert Johnson', '555-6789'),
    ('P1003', 'David Williams', '1990-12-10', '555-3456', 'david@email.com', '321 Elm Street', 'Sarah Williams', '555-7890'),
    ('P1004', 'Susan Brown', '1985-03-28', '555-4567', 'susan@email.com', '654 Pine Road', 'Michael Brown', '555-8901'),
    ('P1005', 'James Miller', '1972-11-05', '555-5678', 'james@email.com', '987 Cedar Lane', 'Patricia Miller', '555-9012'),
    ('P1006', 'Patricia Davis', '1995-07-18', '555-6789', 'patricia@email.com', '147 Birch Court', 'Thomas Davis', '555-0123'),
    ('P1007', 'Robert Garcia', '1988-09-30', '555-7890', 'robert@email.com', '258 Willow Drive', 'Maria Garcia', '555-1234'),
    ('P1008', 'Linda Martinez', '1978-04-12', '555-8901', 'linda@email.com', '369 Spruce Way', 'Carlos Martinez', '555-2345'),
    ('P1009', 'Michael Wilson', '1992-06-25', '555-9012', 'michael@email.com', '741 Ash Boulevard', 'Jennifer Wilson', '555-3456'),
    ('P1010', 'Jennifer Anderson', '1983-01-08', '555-0123', 'jennifer@email.com', '852 Poplar Street', 'Andrew Anderson', '555-4567');

-- =====================================================
-- 7. Insert Medications
-- =====================================================
INSERT INTO Medication
    (MedicationID, MedicationName)
VALUES
    ('MED102', 'Metformin'),
    ('MED108', 'Amoxicillin'),
    ('MED109', 'Ibuprofen'),
    ('MED110', 'Acetaminophen'),
    ('MED111', 'Aspirin');

-- =====================================================
-- 8. Insert Treatments
-- =====================================================
INSERT INTO Treatment
    (DoctorID, PatientID, TreatmentDate, Diagnosis)
VALUES
    ('D101', 'P1001', '2024-01-10', 'Hypertension'),
    ('D101', 'P1002', '2024-01-15', 'Coronary Artery Disease'),
    ('D101', 'P1001', '2024-02-10', 'Hypertension Follow-up'),
    ('D102', 'P1003', '2024-01-20', 'Atrial Fibrillation'),
    ('D102', 'P1004', '2024-01-25', 'Chest Pain Evaluation'),
    ('D103', 'P1005', '2024-01-12', 'Migraine Headaches'),
    ('D103', 'P1006', '2024-01-18', 'Sleep Apnea'),
    ('D103', 'P1005', '2024-02-12', 'Migraine Follow-up'),
    ('D104', 'P1007', '2024-01-22', 'Knee Arthritis'),
    ('D104', 'P1008', '2024-01-28', 'Rotator Cuff Injury'),
    ('D105', 'P1009', '2024-01-14', 'Routine Pediatric Checkup'),
    ('D105', 'P1010', '2024-01-16', 'Asthma Management'),
    ('D106', 'P1002', '2024-02-01', 'Type 2 Diabetes'),
    ('D107', 'P1006', '2024-02-08', 'Peripheral Neuropathy'),
    ('D108', 'P1007', '2024-02-12', 'Lower Back Pain');

-- =====================================================
-- 9. Insert Prescriptions
-- =====================================================
INSERT INTO Prescription
    (TreatmentID, MedicationID, Dosage, Frequency, PrescriptionDate, PrescriptionEndDate)
VALUES
    (1, 'MED101', '10mg', 'Once daily', '2024-01-10', '2024-07-10'),
    (1, 'MED111', '81mg', 'Once daily', '2024-01-10', '2024-07-10'),
    (2, 'MED112', '40mg', 'Once daily', '2024-01-15', '2024-07-15'),
    (2, 'MED111', '81mg', 'Once daily', '2024-01-15', '2024-07-15'),
    (2, 'MED101', '20mg', 'Once daily', '2024-01-15', '2024-07-15'),
    (3, 'MED101', '10mg', 'Once daily', '2024-02-10', '2024-08-10'),
    (3, 'MED111', '81mg', 'Once daily', '2024-02-10', '2024-08-10'),
    (4, 'MED113', '50mg', 'Once daily', '2024-01-20', '2024-07-20'),
    (4, 'MED111', '81mg', 'Once daily', '2024-01-20', '2024-07-20'),
    (5, 'MED109', '400mg', 'As needed for pain', '2024-01-25', '2024-02-25'),
    (6, 'MED114', '300mg', 'Three times daily', '2024-01-12', '2024-04-12'),
    (6, 'MED109', '400mg', 'As needed for pain', '2024-01-12', '2024-02-12'),
    (7, 'MED105', '20mg', 'Once daily', '2024-01-18', NULL),
    (8, 'MED114', '300mg', 'Three times daily', '2024-02-12', '2024-05-12'),
    (9, 'MED109', '600mg', 'Three times daily', '2024-01-22', '2024-02-22'),
    (9, 'MED110', '500mg', 'As needed for pain', '2024-01-22', '2024-02-22'),
    (10, 'MED109', '400mg', 'Three times daily', '2024-01-28', '2024-03-28'),
    (12, 'MED105', '20mg', 'Twice daily', '2024-01-16', NULL),
    (13, 'MED102', '500mg', 'Twice daily', '2024-02-01', NULL),
    (13, 'MED112', '20mg', 'Once daily', '2024-02-01', NULL),
    (14, 'MED104', '20mg', 'Once daily at bedtime', '2024-02-05', NULL),
    (14, 'MED103', '5mg', 'Once daily', '2024-02-05', NULL),
    (15, 'MED114', '100mg', 'Three times daily', '2024-02-08', NULL),
    (16, 'MED109', '400mg', 'As needed for pain', '2024-02-12', '2024-03-12');
