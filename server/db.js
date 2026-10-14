// server/db.js
import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load server/.env no matter which folder the server is started from.
dotenv.config({ path: path.join(__dirname, ".env") });

if (!process.env.DATABASE_URL) {
  console.error("CRITICAL: DATABASE_URL is not set. Copy server/.env.example to server/.env.");
  process.exit(1);
}

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle database client", err);
  process.exit(1);
});

export default pool;
