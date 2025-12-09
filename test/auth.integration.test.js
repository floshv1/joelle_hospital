// test/auth.integration.test.js
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../src/api/app.js';
import { User } from '../src/models/User.js';
import { connectToDb, getDb } from '../src/database/mango.js';

describe('Authentication Tests - MongoDB', () => {
  const testUser = {
    first_name: 'Test',
    last_name: 'User',
    email: `test.auth.${Date.now()}@test.com`,
    password: 'test123456',
    phone: '1234567890',
    role: 'patient'
  };

  beforeAll(async () => {
    try {
      await connectToDb();
    } catch (error) {
      console.error('Failed to connect to database:', error.message);
    }
  });

  afterAll(async () => {
    try {
      const db = getDb();
      await db.collection('users').deleteOne({ email: testUser.email });
    } catch (error) {
      console.error('Cleanup error:', error.message);
    }
  });

  describe('POST /api/auth/register', () => {
    it('should successfully register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: testUser.first_name,
          lastName: testUser.last_name,
          email: testUser.email,
          phone: testUser.phone,
          password: testUser.password
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Account created successfully');
      expect(res.body.user).toHaveProperty('email', testUser.email);
      expect(res.body.user).toHaveProperty('_id');
    });

    it('should return 400 for duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: testUser.first_name,
          lastName: testUser.last_name,
          email: testUser.email,
          phone: testUser.phone,
          password: testUser.password
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: testUser.first_name,
          lastName: testUser.last_name,
          email: testUser.email
          // missing password
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      // Create a user for login tests
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testUser.password, salt);

      await User.create({
        first_name: testUser.first_name,
        last_name: testUser.last_name,
        email: testUser.email,
        phone: testUser.phone,
        hashed_password: hashedPassword,
        role: testUser.role
      });
    });

    it('should successfully login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', testUser.email);
    });

    it('should return 401 for incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 for non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for missing email or password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email
          // missing password
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});
