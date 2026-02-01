import { patientsAPI } from '../modules/api.js';
import { showNotification, showModal, closeModal, confirmAction, debounce, formatDate } from '../modules/ui.js';

let isInitialized = false;
let allPatients = [];

export async function initPatients() {
    if (isInitialized) return;

    document.addEventListener('page-changed', (e) => {
        if (e.detail.page === 'patients') {
            loadPatients();
        }
    });

    setupEventListeners();
    await loadPatients();

    isInitialized = true;
}

function setupEventListeners() {
    document.getElementById('add-patient-btn').addEventListener('click', showAddPatientModal);

    const searchInput = document.getElementById('patient-search');
    searchInput.addEventListener('input', debounce((e) => {
        filterPatients(e.target.value);
    }, 300));
}

async function loadPatients() {
    const tbody = document.getElementById('patients-tbody');

    try {
        allPatients = await patientsAPI.getAll();
        renderPatientsTable(allPatients);
    } catch (error) {
        console.error('Error loading patients:', error);
        showNotification('Failed to load patients', 'error');
        tbody.textContent = 'Failed to load patients';
    }
}

function renderPatientsTable(patients) {
    const tbody = document.getElementById('patients-tbody');
    tbody.textContent = '';

    if (patients.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', '6');
        td.className = 'text-center text-muted';
        td.textContent = 'No patients found';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    patients.forEach(patient => {
        const tr = document.createElement('tr');

        ['PatientID', 'PatientName'].forEach(field => {
            const td = document.createElement('td');
            td.textContent = patient[field] || '-';
            tr.appendChild(td);
        });

        const dobTd = document.createElement('td');
        dobTd.textContent = formatDate(patient.PatientDOB);
        tr.appendChild(dobTd);

        ['PatientPhone', 'PatientEmail'].forEach(field => {
            const td = document.createElement('td');
            td.textContent = patient[field] || '-';
            tr.appendChild(td);
        });

        const actionTd = document.createElement('td');
        actionTd.className = 'table-actions';

        const viewBtn = document.createElement('button');
        viewBtn.className = 'btn btn-sm btn-secondary';
        viewBtn.textContent = 'View';
        viewBtn.addEventListener('click', () => viewPatientDetails(patient.PatientID));
        actionTd.appendChild(viewBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deletePatient(patient.PatientID));
        actionTd.appendChild(deleteBtn);

        tr.appendChild(actionTd);
        tbody.appendChild(tr);
    });
}

function filterPatients(searchTerm) {
    const filtered = allPatients.filter(patient =>
        patient.PatientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.PatientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.PatientID.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderPatientsTable(filtered);
}

function showAddPatientModal() {
    const content = createPatientForm();
    const footer = createModalFooter('add-patient');
    showModal('Add New Patient', content, footer);

    document.getElementById('save-patient-btn').addEventListener('click', savePatient);
    document.getElementById('cancel-patient-btn').addEventListener('click', closeModal);
}

function createPatientForm(patient = {}) {
    const form = document.createElement('form');
    form.id = 'patient-form';

    const fields = [
        { label: 'Patient ID', name: 'PatientID', type: 'text', required: true, disabled: !!patient.PatientID },
        { label: 'Name', name: 'PatientName', type: 'text', required: true },
        { label: 'Date of Birth', name: 'PatientDOB', type: 'date', required: true },
        { label: 'Phone', name: 'PatientPhone', type: 'tel', required: true },
        { label: 'Email', name: 'PatientEmail', type: 'email', required: false },
        { label: 'Address', name: 'PatientAddress', type: 'text', required: true },
        { label: 'Emergency Contact', name: 'EmergencyContact', type: 'text', required: true },
        { label: 'Emergency Phone', name: 'EmergencyPhone', type: 'tel', required: true }
    ];

    fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = field.label;
        formGroup.appendChild(label);

        const input = document.createElement('input');
        input.type = field.type;
        input.name = field.name;
        input.value = patient[field.name] || '';
        if (field.disabled) input.disabled = true;
        if (field.required) input.required = true;

        formGroup.appendChild(input);
        form.appendChild(formGroup);
    });

    return form;
}

function createModalFooter(context) {
    const footer = document.createElement('div');

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.id = 'cancel-patient-btn';
    cancelBtn.textContent = 'Cancel';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn-primary';
    saveBtn.id = 'save-patient-btn';
    saveBtn.textContent = context === 'add-patient' ? 'Add Patient' : 'Update Patient';

    footer.appendChild(cancelBtn);
    footer.appendChild(saveBtn);

    return footer;
}

async function savePatient() {
    const form = document.getElementById('patient-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        await patientsAPI.create(data);
        showNotification('Patient added successfully', 'success');
        closeModal();
        await loadPatients();
    } catch (error) {
        showNotification(error.message || 'Failed to add patient', 'error');
    }
}

async function viewPatientDetails(id) {
    try {
        const patient = await patientsAPI.getById(id);
        const treatments = await patientsAPI.getTreatmentHistory(id);

        const content = createPatientDetailsView(patient, treatments);
        showModal('Patient Details', content);
    } catch (error) {
        showNotification('Failed to load patient details', 'error');
    }
}

function createPatientDetailsView(patient, treatments) {
    const container = document.createElement('div');

    const info = document.createElement('div');
    info.className = 'patient-info';

    const fields = [
        { label: 'Patient ID', value: patient.PatientID },
        { label: 'Name', value: patient.PatientName },
        { label: 'Date of Birth', value: formatDate(patient.PatientDOB) },
        { label: 'Phone', value: patient.PatientPhone },
        { label: 'Email', value: patient.PatientEmail || '-' },
        { label: 'Address', value: patient.PatientAddress },
        { label: 'Emergency Contact', value: patient.EmergencyContact },
        { label: 'Emergency Phone', value: patient.EmergencyPhone }
    ];

    fields.forEach(field => {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = field.label + ': ';
        p.appendChild(strong);
        p.appendChild(document.createTextNode(field.value));
        info.appendChild(p);
    });

    container.appendChild(info);

    if (treatments && treatments.length > 0) {
        const treatmentsHeader = document.createElement('h4');
        treatmentsHeader.textContent = 'Treatment History';
        container.appendChild(treatmentsHeader);

        treatments.forEach(treatment => {
            const treatmentDiv = document.createElement('div');
            const p = document.createElement('p');
            p.textContent = `${formatDate(treatment.TreatmentDate)} - ${treatment.Diagnosis} (Dr. ${treatment.DoctorName})`;
            treatmentDiv.appendChild(p);
            container.appendChild(treatmentDiv);
        });
    }

    return container;
}

async function deletePatient(id) {
    const confirmed = await confirmAction('Are you sure you want to delete this patient?');

    if (confirmed) {
        try {
            await patientsAPI.delete(id);
            showNotification('Patient deleted successfully', 'success');
            await loadPatients();
        } catch (error) {
            showNotification(error.message || 'Failed to delete patient', 'error');
        }
    }
}
