import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './config/database.js';

import doctorsRouter from './routes/doctors.js';
import patientsRouter from './routes/patients.js';
import treatmentsRouter from './routes/treatments.js';
import prescriptionsRouter from './routes/prescriptions.js';
import schedulesRouter from './routes/schedules.js';
import departmentsRouter from './routes/departments.js';
import clinicsRouter from './routes/clinics.js';
import medicationsRouter from './routes/medications.js';
import dashboardRouter from './routes/dashboard.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.use('/api/doctors', doctorsRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/treatments', treatmentsRouter);
app.use('/api/prescriptions', prescriptionsRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/clinics', clinicsRouter);
app.use('/api/medications', medicationsRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

async function startServer() {
    const isConnected = await testConnection();

    if (!isConnected) {
        console.error('Failed to connect to database. Please check your configuration.');
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();
