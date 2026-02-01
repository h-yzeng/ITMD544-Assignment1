import { treatmentsAPI, doctorsAPI, patientsAPI } from '../modules/api.js';
import { showNotification, closeModal, formatDate } from '../modules/ui.js';

let isInitialized = false;

export async function initTreatments() {
    if (isInitialized) return;

    document.addEventListener('page-changed', (e) => {
        if (e.detail.page === 'treatments') {
            loadTreatments();
        }
    });

    await loadTreatments();
    isInitialized = true;
}

async function loadTreatments() {
    const tbody = document.getElementById('treatments-tbody');

    try {
        const treatments = await treatmentsAPI.getAll();
        renderTreatmentsTable(treatments);
    } catch (error) {
        console.error('Error loading treatments:', error);
        showNotification('Failed to load treatments', 'error');
        tbody.textContent = 'Failed to load treatments';
    }
}

function renderTreatmentsTable(treatments) {
    const tbody = document.getElementById('treatments-tbody');
    tbody.textContent = '';

    if (treatments.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', '6');
        td.className = 'text-center text-muted';
        td.textContent = 'No treatments found';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    treatments.forEach(treatment => {
        const tr = document.createElement('tr');

        const idTd = document.createElement('td');
        idTd.textContent = treatment.TreatmentID;
        tr.appendChild(idTd);

        const patientTd = document.createElement('td');
        patientTd.textContent = treatment.PatientName || '-';
        tr.appendChild(patientTd);

        const doctorTd = document.createElement('td');
        doctorTd.textContent = treatment.DoctorName || '-';
        tr.appendChild(doctorTd);

        const dateTd = document.createElement('td');
        dateTd.textContent = formatDate(treatment.TreatmentDate);
        tr.appendChild(dateTd);

        const diagnosisTd = document.createElement('td');
        diagnosisTd.textContent = treatment.Diagnosis;
        tr.appendChild(diagnosisTd);

        const actionTd = document.createElement('td');
        actionTd.className = 'table-actions';

        const viewBtn = document.createElement('button');
        viewBtn.className = 'btn btn-sm btn-secondary';
        viewBtn.textContent = 'View';
        viewBtn.addEventListener('click', () => viewTreatmentDetails(treatment.TreatmentID));
        actionTd.appendChild(viewBtn);

        tr.appendChild(actionTd);
        tbody.appendChild(tr);
    });
}

async function viewTreatmentDetails(id) {
    try {
        const treatment = await treatmentsAPI.getById(id);
        console.log('Treatment details:', treatment);
        showNotification('View functionality coming soon', 'info');
    } catch (error) {
        showNotification('Failed to load treatment details', 'error');
    }
}
