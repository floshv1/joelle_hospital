import { describe, it, expect, afterAll } from 'vitest';
import pool from '../src/config/db.js';

// Test suite to verify the database connection and schema
describe('PostgreSQL Database Verification', () => {

  // Test 1: Verify basic connectivity by executing a simple query
  it('should answer a simple query (SELECT NOW)', async () => {
    try {
      // Execute a simple SQL query to get the current server time
      const result = await pool.query('SELECT NOW() as now');

      // Verify that the query returned a result containing the time
      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0]).toHaveProperty('now');

      console.log("Connection successful. Server time:", result.rows[0].now);
    } catch (error) {
      console.error("Test connection error:", error.message);
      throw error;
    }
  });

  // Test 2: Verify that the required "users" table exists in the database
  it('the "users" table must exist', async () => {
    // SQL query to check the information schema for the table presence
    const checkTableQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users';
    `;

    // Execute the schema check query
    const result = await pool.query(checkTableQuery);

    // Assert that exactly one table named "users" was found
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].table_name).toBe('users');
  });

  // Cleanup: Close the database connection pool after all tests finish
  afterAll(async () => {
    await pool.end();
  });
});