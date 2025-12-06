// server/db.js
import pg from 'pg';

const { Pool } = pg;

// 🚨 Final hardcoded config – yehi use hoga
const dbConfig = {
    connectionString: 'postgresql://bos_user:bos_pass@localhost:5433/bos_db',
};

console.log('🔌 Using Postgres config:', {
    connectionString: dbConfig.connectionString.replace(/bos_pass/g, '********'),
});

const pool = new Pool(dbConfig);

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(1);
});

export default pool;
