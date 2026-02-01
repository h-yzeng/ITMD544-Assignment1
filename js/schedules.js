import { schedulesAPI, clinicsAPI } from '../modules/api.js';
import { showNotification } from '../modules/ui.js';

let isInitialized = false;
let allSchedules = [];
let clinics = [];

export async function initSchedules() {
    if (isInitialized) return;

    document.addEventListener('page-changed', (e) => {
        if (e.detail.page === 'schedules') {
            loadSchedules();
        }
    });

    setupEventListeners();
    await loadClinics();
    await loadSchedules();

    isInitialized = true;
}

async function loadClinics() {
    try {
        clinics = await clinicsAPI.getAll();
        populateClinicFilter();
    } catch (error) {
        console.error('Error loading clinics:', error);
    }
}

function populateClinicFilter() {
    const select = document.getElementById('schedule-clinic-filter');
    select.textContent = '';

    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All Clinics';
    select.appendChild(allOption);

    clinics.forEach(clinic => {
        const option = document.createElement('option');
        option.value = clinic.ClinicID;
        option.textContent = clinic.ClinicName;
        select.appendChild(option);
    });
}

function setupEventListeners() {
    document.getElementById('schedule-clinic-filter').addEventListener('change', filterSchedules);
    document.getElementById('schedule-day-filter').addEventListener('change', filterSchedules);
}

async function loadSchedules() {
    const tbody = document.getElementById('schedules-tbody');

    try {
        allSchedules = await schedulesAPI.getAll();
        renderSchedulesTable(allSchedules);
    } catch (error) {
        console.error('Error loading schedules:', error);
        showNotification('Failed to load schedules', 'error');
        tbody.textContent = 'Failed to load schedules';
    }
}

function renderSchedulesTable(schedules) {
    const tbody = document.getElementById('schedules-tbody');
    tbody.textContent = '';

    if (schedules.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', '5');
        td.className = 'text-center text-muted';
        td.textContent = 'No schedules found';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    schedules.forEach(schedule => {
        const tr = document.createElement('tr');

        const doctorTd = document.createElement('td');
        doctorTd.textContent = schedule.DoctorName || '-';
        tr.appendChild(doctorTd);

        const clinicTd = document.createElement('td');
        clinicTd.textContent = schedule.ClinicName || '-';
        tr.appendChild(clinicTd);

        const dayTd = document.createElement('td');
        dayTd.textContent = schedule.ConsultationDay;
        tr.appendChild(dayTd);

        const hoursTd = document.createElement('td');
        hoursTd.textContent = schedule.ConsultationHours;
        tr.appendChild(hoursTd);

        const actionTd = document.createElement('td');
        actionTd.className = 'table-actions';

        const badge = document.createElement('span');
        badge.className = 'badge badge-info';
        badge.textContent = 'Active';
        actionTd.appendChild(badge);

        tr.appendChild(actionTd);
        tbody.appendChild(tr);
    });
}

function filterSchedules() {
    const clinicFilter = document.getElementById('schedule-clinic-filter').value;
    const dayFilter = document.getElementById('schedule-day-filter').value;

    let filtered = allSchedules;

    if (clinicFilter) {
        filtered = filtered.filter(s => s.ClinicID === clinicFilter);
    }

    if (dayFilter) {
        filtered = filtered.filter(s => s.ConsultationDay === dayFilter);
    }

    renderSchedulesTable(filtered);
}
