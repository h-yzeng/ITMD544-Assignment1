const API_BASE_URL = 'http://localhost:3000/api';

class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Request failed');
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error: ${endpoint}`, error);
            throw error;
        }
    }

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

const api = new APIClient(API_BASE_URL);

export const doctorsAPI = {
    getAll: () => api.get('/doctors'),
    getById: (id) => api.get(`/doctors/${id}`),
    create: (data) => api.post('/doctors', data),
    update: (id, data) => api.put(`/doctors/${id}`, data),
    delete: (id) => api.delete(`/doctors/${id}`),
    getSpecializations: (id) => api.get(`/doctors/${id}/specializations`),
    addSpecialization: (id, data) => api.post(`/doctors/${id}/specializations`, data),
};

export const patientsAPI = {
    getAll: () => api.get('/patients'),
    getById: (id) => api.get(`/patients/${id}`),
    create: (data) => api.post('/patients', data),
    update: (id, data) => api.put(`/patients/${id}`, data),
    delete: (id) => api.delete(`/patients/${id}`),
    getTreatmentHistory: (id) => api.get(`/patients/${id}/treatments`),
};

export const treatmentsAPI = {
    getAll: () => api.get('/treatments'),
    getById: (id) => api.get(`/treatments/${id}`),
    create: (data) => api.post('/treatments', data),
    update: (id, data) => api.put(`/treatments/${id}`, data),
    delete: (id) => api.delete(`/treatments/${id}`),
};

export const prescriptionsAPI = {
    getAll: () => api.get('/prescriptions'),
    getById: (id) => api.get(`/prescriptions/${id}`),
    create: (data) => api.post('/prescriptions', data),
    update: (id, data) => api.put(`/prescriptions/${id}`, data),
    delete: (id) => api.delete(`/prescriptions/${id}`),
    getActive: () => api.get('/prescriptions/active'),
};

export const schedulesAPI = {
    getAll: () => api.get('/schedules'),
    getById: (id) => api.get(`/schedules/${id}`),
    create: (data) => api.post('/schedules', data),
    update: (id, data) => api.put(`/schedules/${id}`, data),
    delete: (id) => api.delete(`/schedules/${id}`),
    getByClinic: (clinicId) => api.get(`/schedules/clinic/${clinicId}`),
    getByDoctor: (doctorId) => api.get(`/schedules/doctor/${doctorId}`),
};

export const departmentsAPI = {
    getAll: () => api.get('/departments'),
    getById: (id) => api.get(`/departments/${id}`),
};

export const clinicsAPI = {
    getAll: () => api.get('/clinics'),
    getById: (id) => api.get(`/clinics/${id}`),
};

export const medicationsAPI = {
    getAll: () => api.get('/medications'),
    getById: (id) => api.get(`/medications/${id}`),
};

export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats'),
    getRecentTreatments: () => api.get('/dashboard/recent-treatments'),
    getDepartmentStats: () => api.get('/dashboard/department-stats'),
};
