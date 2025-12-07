import { query } from '../config/db.js';

// retrieve a user from the database by email
export const findUserByEmail = async (email) => {
  const sql = 'SELECT * FROM users WHERE email = $1';
  // execute the query using the helper imported from config
  const { rows } = await query(sql, [email]);
  return rows[0];
};

// create a new user in the database
export const createUser = async (userData) => {
  const { role, firstName, lastName, email, phone, hashedPassword } = userData;
  
  const sql = `
    INSERT INTO users (role, first_name, last_name, email, phone, hashed_password)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, email, role, created_at;
  `;
  
  const values = [role, firstName, lastName, email, phone, hashedPassword];
  const { rows } = await query(sql, values);
  return rows[0];
};