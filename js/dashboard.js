import { dashboardAPI } from '../modules/api.js';
import { showNotification, formatDate } from '../modules/ui.js';

let isInitialized = false;

export async function initDashboard() {
    if (isInitialized) return;

    document.addEventListener('page-changed', (e) => {
        if (e.detail.page === 'dashboard') {
            loadDashboard();
        }
    });

    await loadDashboard();
    isInitialized = true;
}

async function loadDashboard() {
    try {
        await Promise.all([
            loadStats(),
            loadRecentTreatments(),
            loadDepartmentStats()
        ]);
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showNotification('Failed to load dashboard data', 'error');
    }
}

async function loadStats() {
    try {
        const stats = await dashboardAPI.getStats();

        document.getElementById('total-doctors').textContent = stats.totalDoctors || 0;
        document.getElementById('total-patients').textContent = stats.totalPatients || 0;
        document.getElementById('total-treatments').textContent = stats.totalTreatments || 0;
        document.getElementById('active-prescriptions').textContent = stats.activePrescriptions || 0;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function createTableHeader(headers) {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        tr.appendChild(th);
    });

    thead.appendChild(tr);
    return thead;
}

async function loadRecentTreatments() {
    const container = document.getElementById('recent-treatments');

    try {
        const treatments = await dashboardAPI.getRecentTreatments();

        if (treatments.length === 0) {
            container.textContent = 'No recent treatments';
            return;
        }

        const table = document.createElement('table');
        table.className = 'data-table';

        table.appendChild(createTableHeader(['Date', 'Patient', 'Doctor', 'Diagnosis']));

        const tbody = document.createElement('tbody');
        treatments.forEach(treatment => {
            const row = document.createElement('tr');

            const dateCell = document.createElement('td');
            dateCell.textContent = formatDate(treatment.TreatmentDate);
            row.appendChild(dateCell);

            const patientCell = document.createElement('td');
            patientCell.textContent = treatment.PatientName;
            row.appendChild(patientCell);

            const doctorCell = document.createElement('td');
            doctorCell.textContent = treatment.DoctorName;
            row.appendChild(doctorCell);

            const diagnosisCell = document.createElement('td');
            diagnosisCell.textContent = treatment.Diagnosis;
            row.appendChild(diagnosisCell);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        container.textContent = '';
        container.appendChild(table);
    } catch (error) {
        console.error('Error loading recent treatments:', error);
        container.textContent = 'Failed to load recent treatments';
    }
}

async function loadDepartmentStats() {
    const container = document.getElementById('department-stats');

    try {
        const stats = await dashboardAPI.getDepartmentStats();

        if (stats.length === 0) {
            container.textContent = 'No department data';
            return;
        }

        const table = document.createElement('table');
        table.className = 'data-table';

        table.appendChild(createTableHeader(['Department', 'Doctors', 'Specializations']));

        const tbody = document.createElement('tbody');
        stats.forEach(dept => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = dept.DepartmentName;
            row.appendChild(nameCell);

            const doctorsCell = document.createElement('td');
            doctorsCell.textContent = dept.NumberOfDoctors;
            row.appendChild(doctorsCell);

            const specsCell = document.createElement('td');
            specsCell.textContent = dept.NumberOfSpecializations;
            row.appendChild(specsCell);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        container.textContent = '';
        container.appendChild(table);
    } catch (error) {
        console.error('Error loading department stats:', error);
        container.textContent = 'Failed to load department statistics';
    }
}
