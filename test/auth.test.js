// test/auth.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/api/app.js'; // Assure-toi que le chemin vers app.js est bon
import pool from '../src/config/db.js';

describe('Authentication Tests (Login)', () => {
  
    // test user data
    const testUser = {
      email: `test.test@test.test`,
      password: 'test',
      firstName: 'test',
      lastName: 'test',
      role: 'admin',
      phone: '0000000000'
    };
    
    // setup before tests
    beforeAll(async () => {
      // preventive cleanup
      await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);

      // password hashing
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(testUser.password, salt);

      // Insert user into DB
      const query = `
        INSERT INTO users (role, first_name, last_name, email, phone, hashed_password)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;

      await pool.query(query, [
        testUser.role,
        testUser.firstName,
        testUser.lastName,
        testUser.email,
        testUser.phone,
        hashed // insert encrypted password
      ]);
    });

    // cleanup after tests
    afterAll(async () => {
      await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
      await pool.end(); // Close connection
    });

    // test 1: authentication success
    it('token returned if credentials ok', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      // expect 200 OK
      expect(res.status).toBe(200);

      // verify response content
      expect(res.body).toHaveProperty('token');
      // ensure this matches the message in authController.js ("Login successful")
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body.user.email).toBe(testUser.email);

      console.log("Token received:", res.body.token.substring(0, 20) + "...");
    });

    // test 2: wrong password 
    it('error 401 if password wrong', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword!'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    // test 3: unknown user
    it('error 401 if unknown user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'ghost@hospital.com',
          password: 'password123'
        });

      expect(res.status).toBe(401);
    });
});