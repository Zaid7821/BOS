// // server/db.js
// import pg from 'pg';

// const { Pool } = pg;

// // 🚨 Final hardcoded config – yehi use hoga
// const dbConfig = {
//     connectionString: 'postgresql://bos_user:bos_pass@localhost:5433/bos_db',
// };

// console.log('🔌 Using Postgres config:', {
//     connectionString: dbConfig.connectionString.replace(/bos_pass/g, '********'),
// });

// const pool = new Pool(dbConfig);

// pool.on('error', (err) => {
//     console.error('Unexpected error on idle client', err);
//     process.exit(1);
// });

// export default pool;




// server/db.js
// import pg from "pg";

// const { Pool } = pg;

// const dbConfig = {
//     connectionString:
//         "postgresql://neondb_owner:npg_xIVX8mJlEFQ1@ep-shiny-flower-ahbfi74u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
//     ssl: {
//         rejectUnauthorized: false, // required for Neon SSL
//     },
// };

// console.log("🌐 Using Neon DB for contact messages");

// const pool = new Pool(dbConfig);

// pool.on("connect", () => {
//     console.log("🔗 Successfully connected to Neon Postgres! 🌎");
// });

// pool.on("error", (err) => {
//     console.error("❌ Unexpected error on idle client", err);
//     process.exit(1);
// });

// export default pool;


// -----render---------

// server/db.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config(); // Read DATABASE_URL from env

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    process.exit(1);
});

export default pool;
