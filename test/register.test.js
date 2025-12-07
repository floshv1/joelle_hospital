// test/register.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/api/app.js';
import pool from '../src/config/db.js';

describe('📝 Test Inscription (Register)', () => {

  // Test user with dynamic email to avoid conflicts
  const newUser = {
    firstName: 'test3',
    lastName: 'test3',
    email: `test.test3@test.test`, 
    password: 'test3',
    phone: '0612345678',
    role: 'patient'
  };

  // Cleanup before tests
  beforeAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', [newUser.email]);
  });

  // Cleanup after tests
  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', [newUser.email]);
    await pool.end();
  });

  // Test 1: Successful creation
  it('a new account is created (201)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(newUser);

    //check the HTTP response
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('successfully');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(newUser.email);


    // check if the password is hashed in the database
    const dbResult = await pool.query('SELECT * FROM users WHERE email = $1', [newUser.email]);
    const userInDb = dbResult.rows[0];
    expect(userInDb.hashed_password).not.toBe(newUser.password); //sould not be test3
    
    // Verify that the hashed password matches the original password
    const isMatch = await bcrypt.compare(newUser.password, userInDb.hashed_password);
    expect(isMatch).toBe(true);
    
    console.log("password is indeed hashed in the database.");
  });

  // Test 2: Check for duplicate email registration
  it('email already used (400)', async () => {
    // register the same user again
    const res = await request(app)
      .post('/api/auth/register')
      .send(newUser);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already in use/i); // Check that the message mentions "already used"
  });

  // Test 3:  Check if the user isn't completely provided
  it('password missing (400)', async () => {
    const incompleteUser = {
      firstName: 'test',
      lastName: 'test',
      email: 'test@test.test'
      //no password
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send(incompleteUser);

    expect(res.status).toBe(400);
  });
});