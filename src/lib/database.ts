import { Pool } from 'pg';

// Database connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'school_db',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Query interface
interface UserQuery {
  name: string;
  email: string;
  subject?: string;
  message: string;
  status?: string;
}

// Create user_queries table
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS user_queries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(100),
      message TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_user_queries_email ON user_queries(email);
    CREATE INDEX IF NOT EXISTS idx_user_queries_status ON user_queries(status);
  `;
  await pool.query(query);
};

// Save user query
const saveQuery = async (query: UserQuery) => {
  const { name, email, subject, message } = query;
  const text = `
    INSERT INTO user_queries(name, email, subject, message)
    VALUES($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [name, email, subject, message];
  try {
    const result = await pool.query(text, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Database Error: ${err.message}`);
  }
};

// Get all queries (for admin)
const getQueries = async (status?: string) => {
  let text = 'SELECT * FROM user_queries';
  const values = [];
  if (status) {
    text += ' WHERE status = $1';
    values.push(status);
  }
  text += ' ORDER BY created_at DESC';
  
  try {
    const result = await pool.query(text, values);
    return result.rows;
  } catch (err) {
    throw new Error(`Database Error: ${err.message}`);
  }
};

// Update query status
const updateQueryStatus = async (id: number, status: string) => {
  const text = `
    UPDATE user_queries
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;
  const values = [status, id];
  
  try {
    const result = await pool.query(text, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Database Error: ${err.message}`);
  }
};

// Initialize database
const initDB = async () => {
  await createTable();
};

export { initDB, saveQuery, getQueries, updateQueryStatus };