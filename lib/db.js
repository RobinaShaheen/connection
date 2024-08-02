// lib/db.js
import { createPool } from '@vercel/postgres';

let pool;

if (!pool) {
  pool = createPool({
    connectionString: process.env.POSTGRES_URL, // Ensure this environment variable is set
    ssl: {
      rejectUnauthorized: false
    }
  });
}

export default pool;
