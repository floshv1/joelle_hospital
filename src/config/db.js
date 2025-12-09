import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Destructure Pool from the pg module
const { Pool } = pg;

// Create a new pool instance to manage database connections
const connection = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS || '', // Default to empty string if not defined
  port: process.env.DB_PORT || 5432,   // Default PostgreSQL port
});

// Log connection configuration for debugging (hiding the actual password)
console.log("Connection Info:", {
  user: process.env.DB_USER,
  db: process.env.DB_NAME,
  hasPassword: !!process.env.DB_PASS // Returns 'true' if password is present
});

// Event listener to confirm successful connection
connection.on('connect', () => {
  console.log('Database connected successfully (PostgreSQL)');
});

// Export a wrapper function to execute queries on the pool
export const query = (text, params) => connection.query(text, params);

// Export the connection pool for use in other modules
export default connection;