import { doctorsAPI, departmentsAPI } from '../modules/api.js';
import { showNotification, showModal, closeModal, confirmAction, debounce } from '../modules/ui.js';

let isInitialized = false;
let allDoctors = [];
let departments = [];

export async function initDoctors() {
    if (isInitialized) return;

    document.addEventListener('page-changed', (e) => {
        if (e.detail.page === 'doctors') {
            loadDoctors();
        }
    });

    setupEventListeners();
    await loadDepartments();
    await loadDoctors();

    isInitialized = true;
}

async function loadDepartments() {
    try {
        departments = await departmentsAPI.getAll();
    } catch (error) {
        console.error('Error loading departments:', error);
    }
}

function setupEventListeners() {
    document.getElementById('add-doctor-btn').addEventListener('click', showAddDoctorModal);

    const searchInput = document.getElementById('doctor-search');
    searchInput.addEventListener('input', debounce((e) => {
        filterDoctors(e.target.value);
    }, 300));
}

async function loadDoctors() {
    const tbody = document.getElementById('doctors-tbody');

    try {
        allDoctors = await doctorsAPI.getAll();
        renderDoctorsTable(allDoctors);
    } catch (error) {
        console.error('Error loading doctors:', error);
        showNotification('Failed to load doctors', 'error');
        tbody.textContent = 'Failed to load doctors';
    }
}

function renderDoctorsTable(doctors) {
    const tbody = document.getElementById('doctors-tbody');
    tbody.textContent = '';

    if (doctors.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', '7');
        td.className = 'text-center text-muted';
        td.textContent = 'No doctors found';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    doctors.forEach(doctor => {
        const tr = document.createElement('tr');

        const fields = ['DoctorID', 'DoctorName', 'DoctorPhone', 'DoctorEmail', 'DepartmentName', 'Specializations'];
        fields.forEach(field => {
            const td = document.createElement('td');
            td.textContent = doctor[field] || '-';
            tr.appendChild(td);
        });

        const actionTd = document.createElement('td');
        actionTd.className = 'table-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-secondary';
        editBtn.dataset.action = 'edit';
        editBtn.dataset.id = doctor.DoctorID;
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', handleAction);
        actionTd.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger';
        deleteBtn.dataset.action = 'delete';
        deleteBtn.dataset.id = doctor.DoctorID;
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', handleAction);
        actionTd.appendChild(deleteBtn);

        tr.appendChild(actionTd);
        tbody.appendChild(tr);
    });
}

function filterDoctors(searchTerm) {
    const filtered = allDoctors.filter(doctor =>
        doctor.DoctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.DoctorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.DoctorID.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderDoctorsTable(filtered);
}

async function handleAction(e) {
    const action = e.target.dataset.action;
    const id = e.target.dataset.id;

    if (action === 'edit') {
        await showEditDoctorModal(id);
    } else if (action === 'delete') {
        await deleteDoctor(id);
    }
}

function showAddDoctorModal() {
    const content = createDoctorForm();
    const footer = createModalFooter('add-doctor');
    showModal('Add New Doctor', content, footer);

    document.getElementById('save-doctor-btn').addEventListener('click', saveDoctor);
    document.getElementById('cancel-doctor-btn').addEventListener('click', closeModal);
}

async function showEditDoctorModal(id) {
    try {
        const doctor = await doctorsAPI.getById(id);
        const content = createDoctorForm(doctor);
        const footer = createModalFooter('update-doctor');
        showModal('Edit Doctor', content, footer);

        document.getElementById('save-doctor-btn').addEventListener('click', () => updateDoctor(id));
        document.getElementById('cancel-doctor-btn').addEventListener('click', closeModal);
    } catch (error) {
        showNotification('Failed to load doctor details', 'error');
    }
}

function createDoctorForm(doctor = {}) {
    const form = document.createElement('form');
    form.id = 'doctor-form';

    const fields = [
        { label: 'Doctor ID', name: 'DoctorID', type: 'text', required: true, disabled: !!doctor.DoctorID },
        { label: 'Name', name: 'DoctorName', type: 'text', required: true },
        { label: 'Phone', name: 'DoctorPhone', type: 'tel', required: true },
        { label: 'Email', name: 'DoctorEmail', type: 'email', required: true },
        { label: 'Department', name: 'DepartmentID', type: 'select', required: true }
    ];

    fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = field.label;
        formGroup.appendChild(label);

        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            input.name = field.name;

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-- Select Department --';
            input.appendChild(defaultOption);

            departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.DepartmentID;
                option.textContent = dept.DepartmentName;
                if (doctor[field.name] === dept.DepartmentID) {
                    option.selected = true;
                }
                input.appendChild(option);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
            input.name = field.name;
            input.value = doctor[field.name] || '';
            if (field.disabled) input.disabled = true;
        }

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
    cancelBtn.id = 'cancel-doctor-btn';
    cancelBtn.textContent = 'Cancel';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn-primary';
    saveBtn.id = 'save-doctor-btn';
    saveBtn.textContent = context === 'add-doctor' ? 'Add Doctor' : 'Update Doctor';

    footer.appendChild(cancelBtn);
    footer.appendChild(saveBtn);

    return footer;
}

async function saveDoctor() {
    const form = document.getElementById('doctor-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        await doctorsAPI.create(data);
        showNotification('Doctor added successfully', 'success');
        closeModal();
        await loadDoctors();
    } catch (error) {
        showNotification(error.message || 'Failed to add doctor', 'error');
    }
}

async function updateDoctor(id) {
    const form = document.getElementById('doctor-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        await doctorsAPI.update(id, data);
        showNotification('Doctor updated successfully', 'success');
        closeModal();
        await loadDoctors();
    } catch (error) {
        showNotification(error.message || 'Failed to update doctor', 'error');
    }
}

async function deleteDoctor(id) {
    const confirmed = await confirmAction('Are you sure you want to delete this doctor?');

    if (confirmed) {
        try {
            await doctorsAPI.delete(id);
            showNotification('Doctor deleted successfully', 'success');
            await loadDoctors();
        } catch (error) {
            showNotification(error.message || 'Failed to delete doctor', 'error');
        }
    }
}
