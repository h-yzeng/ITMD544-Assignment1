import { prescriptionsAPI } from '../modules/api.js';
import { showNotification, formatDate } from '../modules/ui.js';

let isInitialized = false;

export async function initPrescriptions() {
    if (isInitialized) return;

    document.addEventListener('page-changed', (e) => {
        if (e.detail.page === 'prescriptions') {
            loadPrescriptions();
        }
    });

    await loadPrescriptions();
    isInitialized = true;
}

async function loadPrescriptions() {
    const tbody = document.getElementById('prescriptions-tbody');

    try {
        const prescriptions = await prescriptionsAPI.getAll();
        renderPrescriptionsTable(prescriptions);
    } catch (error) {
        console.error('Error loading prescriptions:', error);
        showNotification('Failed to load prescriptions', 'error');
        tbody.textContent = 'Failed to load prescriptions';
    }
}

function renderPrescriptionsTable(prescriptions) {
    const tbody = document.getElementById('prescriptions-tbody');
    tbody.textContent = '';

    if (prescriptions.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', '8');
        td.className = 'text-center text-muted';
        td.textContent = 'No prescriptions found';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    prescriptions.forEach(prescription => {
        const tr = document.createElement('tr');

        const idTd = document.createElement('td');
        idTd.textContent = prescription.PrescriptionID;
        tr.appendChild(idTd);

        const patientTd = document.createElement('td');
        patientTd.textContent = prescription.PatientName || '-';
        tr.appendChild(patientTd);

        const medTd = document.createElement('td');
        medTd.textContent = prescription.MedicationName || '-';
        tr.appendChild(medTd);

        const dosageTd = document.createElement('td');
        dosageTd.textContent = prescription.Dosage;
        tr.appendChild(dosageTd);

        const freqTd = document.createElement('td');
        freqTd.textContent = prescription.Frequency;
        tr.appendChild(freqTd);

        const startTd = document.createElement('td');
        startTd.textContent = formatDate(prescription.PrescriptionDate);
        tr.appendChild(startTd);

        const endTd = document.createElement('td');
        endTd.textContent = formatDate(prescription.PrescriptionEndDate);
        tr.appendChild(endTd);

        const actionTd = document.createElement('td');
        actionTd.className = 'table-actions';

        const badge = document.createElement('span');
        badge.className = 'badge';
        if (!prescription.PrescriptionEndDate || new Date(prescription.PrescriptionEndDate) >= new Date()) {
            badge.className += ' badge-success';
            badge.textContent = 'Active';
        } else {
            badge.className += ' badge-danger';
            badge.textContent = 'Expired';
        }
        actionTd.appendChild(badge);

        tr.appendChild(actionTd);
        tbody.appendChild(tr);
    });
}
