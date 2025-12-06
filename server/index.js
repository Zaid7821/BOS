// // server/index.js
// import express from "express";
// import cors from "cors";
// import pg from "pg";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import fs from "fs";

// // Setup __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ✅ Load .env from *server* folder
// dotenv.config({ path: path.join(__dirname, ".env") });

// const app = express();
// // ✅ Use 5000 for backend, taaki React/Vite se clash na ho
// const port = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Database connection
// const { Pool } = pg;

// if (!process.env.DATABASE_URL) {
//     console.error("CRITICAL: DATABASE_URL is not set or .env not loaded");
// }

// console.log("DATABASE_URL =>", process.env.DATABASE_URL);

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
// });

// // Helper to log errors
// const logError = (error) => {
//     try {
//         const timestamp = new Date().toISOString();
//         const message = `${timestamp} - ${error.stack || error}\n`;
//         const logPath = path.join(__dirname, "server_error.log");
//         fs.appendFileSync(logPath, message);
//     } catch (logErr) {
//         console.error("Failed to write to log file:", logErr);
//     }
//     console.error(error);
// };

// // DB init (create table if not exists)
// const initDb = async () => {
//     try {
//         const client = await pool.connect();
//         console.log("Connected to PostgreSQL database");

//         await client.query(`
//       CREATE TABLE IF NOT EXISTS contact_messages (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         email VARCHAR(255) NOT NULL,
//         subject VARCHAR(255),
//         message TEXT NOT NULL,
//         created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//         console.log("Contact messages table ready");
//         client.release();
//     } catch (err) {
//         logError(err);
//         console.error(
//             "CRITICAL: Could not connect to database or create table. Please check .env and Docker."
//         );
//     }
// };

// initDb();

// // ✅ Health / DB test route
// app.get("/api/db-test", async (req, res) => {
//     try {
//         const result = await pool.query("SELECT NOW()");
//         res.json({ ok: true, time: result.rows[0].now });
//     } catch (err) {
//         console.error("DB TEST ERROR =>", err);
//         res.status(500).json({
//             ok: false,
//             error: err.message || String(err),
//         });
//     }
// });

// // ✅ Contact route
// app.post("/api/contact", async (req, res) => {
//     const { name, email, subject, message } = req.body;

//     if (!name || !email || !message) {
//         return res
//             .status(400)
//             .json({ success: false, message: "Please provide name, email, and message" });
//     }

//     try {
//         const query = `
//       INSERT INTO contact_messages (name, email, subject, message)
//       VALUES ($1, $2, $3, $4)
//       RETURNING *
//     `;
//         const values = [name, email, subject, message];

//         const result = await pool.query(query, values);

//         res.status(201).json({
//             success: true,
//             message: "Message sent successfully",
//             data: result.rows[0],
//         });
//     } catch (err) {
//         logError(err);
//         console.error("DB ERROR =>", err);
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: err.message || String(err),
//         });
//     }
// });

// app.listen(port, () => {
//     console.log(`Backend server running on http://localhost:${port}`);
// });


// -------------------------------------------------------------


// server/index.js
import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

// Enable CORS + JSON body parsing
app.use(cors());
app.use(express.json());

// Ensure DB and table exist on startup
async function initDb() {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
        console.log("✅ Connected to DB and ensured contact_messages table exists.");
    } catch (err) {
        console.error("CRITICAL: Could not connect to database or create table. error:");
        console.error(err);
        process.exit(1);
    }
}

// Health check
app.get("/api/health", (req, res) => {
    res.json({ ok: true });
});

// Contact form submission route
app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: "All fields (name, email, subject, message) are required.",
        });
    }

    try {
        await pool.query(
            `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4)`,
            [name, email, subject, message]
        );

        return res.status(200).json({
            success: true,
            message: "Your message has been received. We will contact you soon.",
        });
    } catch (err) {
        console.error("Error saving contact message:", err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while saving your message.",
        });
    }
});

const PORT = process.env.PORT || 5000;

initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Backend server running on port ${PORT}`);
    });
});
