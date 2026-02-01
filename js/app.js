import { initNavigation } from './modules/navigation.js';
import { initDashboard } from './pages/dashboard.js';
import { initDoctors } from './pages/doctors.js';
import { initPatients } from './pages/patients.js';
import { initTreatments } from './pages/treatments.js';
import { initPrescriptions } from './pages/prescriptions.js';
import { initSchedules } from './pages/schedules.js';

class HospitalApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    async init() {
        try {
            initNavigation(this.handlePageChange.bind(this));

            await this.initializePages();

            this.loadCurrentPage();
        } catch (error) {
            console.error('Failed to initialize application:', error);
        }
    }

    async initializePages() {
        await initDashboard();
        await initDoctors();
        await initPatients();
        await initTreatments();
        await initPrescriptions();
        await initSchedules();
    }

    handlePageChange(pageName) {
        this.currentPage = pageName;
        this.loadCurrentPage();
    }

    loadCurrentPage() {
        const event = new CustomEvent('page-changed', {
            detail: { page: this.currentPage }
        });
        document.dispatchEvent(event);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HospitalApp();
});
