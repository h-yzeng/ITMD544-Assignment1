import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });

        console.log('Connected to MySQL server');

        const dbName = process.env.DB_NAME || 'hospital_management';

        await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);
        console.log(`Dropped existing database: ${dbName}`);

        await connection.query(`CREATE DATABASE ${dbName}`);
        console.log(`Created database: ${dbName}`);

        await connection.query(`USE ${dbName}`);
        console.log(`Using database: ${dbName}`);

        const schemaPath = path.join(__dirname, '..', 'schema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        await connection.query(schemaSQL);
        console.log('Schema created successfully');

        const dataPath = path.join(__dirname, '..', 'sample-data.sql');
        const dataSQL = fs.readFileSync(dataPath, 'utf8');
        await connection.query(dataSQL);
        console.log('Sample data inserted successfully');

        console.log('\nDatabase initialization complete!');
        console.log('\nNext steps:');
        console.log('1. Create a .env file based on .env.example');
        console.log('2. Run "npm install" to install dependencies');
        console.log('3. Run "npm start" to start the server');

    } catch (error) {
        console.error('Error initializing database:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

initializeDatabase();
