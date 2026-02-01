-- Hospital Management System - DDL (Data Definition Language)
-- Final 4NF Normalized Schema

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS Prescription;
DROP TABLE IF EXISTS Treatment;
DROP TABLE IF EXISTS DoctorClinicSchedule;
DROP TABLE IF EXISTS DoctorSpecialization;
DROP TABLE IF EXISTS Patient;
DROP TABLE IF EXISTS Medication;
DROP TABLE IF EXISTS Clinic;
DROP TABLE IF EXISTS Doctor;
DROP TABLE IF EXISTS Department;

-- =====================================================
-- 1. DEPARTMENT Table
-- =====================================================
CREATE TABLE Department
(
    DepartmentID VARCHAR(10) PRIMARY KEY,
    DepartmentName VARCHAR(100) NOT NULL,
    DepartmentLocation VARCHAR(200) NOT NULL,
    DepartmentHead VARCHAR(100),
    CONSTRAINT chk_dept_id CHECK (DepartmentID LIKE 'DEPT%')
);

-- =====================================================
-- 2. DOCTOR Table
-- =====================================================
CREATE TABLE Doctor (
    DoctorID VARCHAR(10) PRIMARY KEY,
    DoctorName VARCHAR(100) NOT NULL,
    DoctorPhone VARCHAR(20) NOT NULL,
    DoctorEmail VARCHAR(100) NOT NULL UNIQUE,
    DepartmentID VARCHAR(10) NOT NULL,
    CONSTRAINT fk_doctor_department FOREIGN KEY (DepartmentID)
        REFERENCES Department(DepartmentID)
        ON DELETE RESTRICT
        ON
UPDATE CASCADE,
    CONSTRAINT chk_doctor_id CHECK
(DoctorID LIKE 'D%'),
    CONSTRAINT chk_doctor_email CHECK
(DoctorEmail LIKE '%@%')
);

-- =====================================================
-- 3. DOCTOR_SPECIALIZATION Table
-- =====================================================
CREATE TABLE DoctorSpecialization
(
    DoctorID VARCHAR(10),
    Specialization VARCHAR(100),
    Certification VARCHAR(50) NOT NULL,
    CertificationDate DATE NOT NULL,
    PRIMARY KEY (DoctorID, Specialization),
    CONSTRAINT fk_spec_doctor FOREIGN KEY (DoctorID)
        REFERENCES Doctor(DoctorID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =====================================================
-- 4. CLINIC Table
-- =====================================================
CREATE TABLE Clinic
(
    ClinicID VARCHAR(10) PRIMARY KEY,
    ClinicName VARCHAR(100) NOT NULL,
    ClinicAddress VARCHAR(200) NOT NULL,
    ClinicPhone VARCHAR(20) NOT NULL,
    CONSTRAINT chk_clinic_id CHECK (ClinicID LIKE 'CL%')
);

-- =====================================================
-- 5. DOCTOR_CLINIC_SCHEDULE Table
-- =====================================================
CREATE TABLE DoctorClinicSchedule
(
    ScheduleID INT
    AUTO_INCREMENT PRIMARY KEY,
    DoctorID VARCHAR
    (10) NOT NULL,
    ClinicID VARCHAR
    (10) NOT NULL,
    ConsultationDay VARCHAR
    (10) NOT NULL,
    ConsultationHours VARCHAR
    (20) NOT NULL,
    CONSTRAINT fk_schedule_doctor FOREIGN KEY
    (DoctorID)
        REFERENCES Doctor
    (DoctorID)
        ON
    DELETE CASCADE
        ON
    UPDATE CASCADE,
    CONSTRAINT fk_schedule_clinic FOREIGN KEY
    (ClinicID)
        REFERENCES Clinic
    (ClinicID)
        ON
    DELETE CASCADE
        ON
    UPDATE CASCADE,
    CONSTRAINT chk_day CHECK
    (ConsultationDay IN
    ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    CONSTRAINT uq_doctor_clinic_day UNIQUE
    (DoctorID, ClinicID, ConsultationDay)
);

    -- =====================================================
    -- 6. PATIENT Table
    -- =====================================================
    CREATE TABLE Patient
    (
        PatientID VARCHAR(10) PRIMARY KEY,
        PatientName VARCHAR(100) NOT NULL,
        PatientDOB DATE NOT NULL,
        PatientPhone VARCHAR(20) NOT NULL,
        PatientEmail VARCHAR(100),
        PatientAddress VARCHAR(200) NOT NULL,
        EmergencyContact VARCHAR(100) NOT NULL,
        EmergencyPhone VARCHAR(20) NOT NULL,
        CONSTRAINT chk_patient_id CHECK (PatientID LIKE 'P%'),
        CONSTRAINT chk_patient_email CHECK (PatientEmail IS NULL OR PatientEmail LIKE '%@%')
    );

    -- =====================================================
    -- 7. MEDICATION Table
    -- =====================================================
    CREATE TABLE Medication
    (
        MedicationID VARCHAR(10) PRIMARY KEY,
        MedicationName VARCHAR(100) NOT NULL UNIQUE,
        CONSTRAINT chk_medication_id CHECK (MedicationID LIKE 'MED%')
    );

    -- =====================================================
    -- 8. TREATMENT Table
    -- =====================================================
    CREATE TABLE Treatment
    (
        TreatmentID INT
        AUTO_INCREMENT PRIMARY KEY,
    DoctorID VARCHAR
        (10) NOT NULL,
    PatientID VARCHAR
        (10) NOT NULL,
    TreatmentDate DATE NOT NULL,
    Diagnosis TEXT NOT NULL,
    CONSTRAINT fk_treatment_doctor FOREIGN KEY
        (DoctorID)
        REFERENCES Doctor
        (DoctorID)
        ON
        DELETE RESTRICT
        ON
        UPDATE CASCADE,
    CONSTRAINT fk_treatment_patient FOREIGN KEY
        (PatientID)
        REFERENCES Patient
        (PatientID)
        ON
        DELETE RESTRICT
        ON
        UPDATE CASCADE,
    INDEX idx_treatment_patient (PatientID),
    INDEX idx_treatment_doctor (DoctorID),
    INDEX idx_treatment_date (TreatmentDate)
        );

        -- =====================================================
        -- 9. PRESCRIPTION Table
        -- =====================================================
        CREATE TABLE Prescription
        (
            PrescriptionID INT
            AUTO_INCREMENT PRIMARY KEY,
    TreatmentID INT NOT NULL,
    MedicationID VARCHAR
            (10) NOT NULL,
    Dosage VARCHAR
            (50) NOT NULL,
    Frequency VARCHAR
            (50) NOT NULL,
    PrescriptionDate DATE NOT NULL,
    PrescriptionEndDate DATE,
    CONSTRAINT fk_prescription_treatment FOREIGN KEY
            (TreatmentID)
        REFERENCES Treatment
            (TreatmentID)
        ON
            DELETE CASCADE
        ON
            UPDATE CASCADE,
    CONSTRAINT fk_prescription_medication FOREIGN KEY
            (MedicationID)
        REFERENCES Medication
            (MedicationID)
        ON
            DELETE RESTRICT
        ON
            UPDATE CASCADE,
    CONSTRAINT chk_prescription_dates CHECK
            (PrescriptionEndDate IS NULL OR PrescriptionEndDate >= PrescriptionDate),
    CONSTRAINT uq_treatment_medication UNIQUE
            (TreatmentID, MedicationID),
    INDEX idx_prescription_treatment
            (TreatmentID),
    INDEX idx_prescription_medication
            (MedicationID)
);

            -- =====================================================
            -- Create Indexes for Performance
            -- =====================================================
            CREATE INDEX idx_doctor_department ON Doctor(DepartmentID);
            CREATE INDEX idx_doctor_email ON Doctor(DoctorEmail);
            CREATE INDEX idx_patient_name ON Patient(PatientName);
            CREATE INDEX idx_patient_email ON Patient(PatientEmail);

            -- View: Complete Doctor Information with Department
            CREATE VIEW vw_DoctorDetails
            AS
                SELECT
                    d.DoctorID,
                    d.DoctorName,
                    d.DoctorPhone,
                    d.DoctorEmail,
                    dept.DepartmentID,
                    dept.DepartmentName,
                    dept.DepartmentLocation,
                    dept.DepartmentHead
                FROM Doctor d
                    JOIN Department dept ON d.DepartmentID = dept.DepartmentID;

            -- View: Doctor Specializations
            CREATE VIEW vw_DoctorSpecializations
            AS
                SELECT
                    d.DoctorID,
                    d.DoctorName,
                    ds.Specialization,
                    ds.Certification,
                    ds.CertificationDate
                FROM Doctor d
                    JOIN DoctorSpecialization ds ON d.DoctorID = ds.DoctorID;

            -- View: Complete Patient Treatment History
            CREATE VIEW vw_PatientTreatmentHistory
            AS
                SELECT
                    p.PatientID,
                    p.PatientName,
                    t.TreatmentID,
                    t.TreatmentDate,
                    t.Diagnosis,
                    d.DoctorID,
                    d.DoctorName,
                    pr.PrescriptionID,
                    m.MedicationName,
                    pr.Dosage,
                    pr.Frequency,
                    pr.PrescriptionDate,
                    pr.PrescriptionEndDate
                FROM Patient p
                    JOIN Treatment t ON p.PatientID = t.PatientID
                    JOIN Doctor d ON t.DoctorID = d.DoctorID
                    LEFT JOIN Prescription pr ON t.TreatmentID = pr.TreatmentID
                    LEFT JOIN Medication m ON pr.MedicationID = m.MedicationID;
