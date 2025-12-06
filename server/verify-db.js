import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server folder
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("Testing DB connection...");
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const check = async () => {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to database!');
        const res = await client.query('SELECT NOW()');
        console.log('Database time:', res.rows[0].now);
        client.release();
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err.message);
        if (err.code) console.error('Error code:', err.code);
        process.exit(1);
    }
};

check();
