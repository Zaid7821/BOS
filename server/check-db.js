import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const check = async () => {
    console.log('Checking database connection...');
    console.log('URL:', process.env.DATABASE_URL);

    try {
        const client = await pool.connect();
        console.log('Successfully connected to database!');

        const res = await client.query("SELECT to_regclass('public.contact_messages')");
        if (res.rows[0].to_regclass) {
            console.log('Table contact_messages exists.');
        } else {
            console.log('Table contact_messages DOES NOT exist.');
        }

        client.release();
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err.message);
        if (err.code) console.error('Error code:', err.code);
        process.exit(1);
    }
};

check();
