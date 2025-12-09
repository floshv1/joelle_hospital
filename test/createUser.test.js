// test/createUser.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import bcrypt from 'bcrypt';
import pool from '../src/config/db.js';
import { createUser } from '../src/models/userModel.js';

describe('User Model Tests', () => {   
    const testEmail = "test.test@test.test";

    // cleanup before tests to ensure a clean state
    beforeAll(async () => {
        await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
    });

    // cleanup after tests and close the database connection
    afterAll(async () => {
        await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
        await pool.end();
    });

    // Test: Create a valid user and verify properties
    it('valid user created with hashed password', async () => {
        // preparation: Hash the password using bcrypt
        const plainPassword = "test";
        const saltRounds = 10;
        const hash = await bcrypt.hash(plainPassword, saltRounds);

        // define user data (Ensure ENUM types match your SQL definition)
        const newUser = {
        role: 'admin',       // must be either 'patient', 'practitioner', 'admin', or 'staff'
        firstName: 'test',
        lastName: 'test',
        email: testEmail,
        phone: '000000000',
        hashedPassword: hash // dass the hashed password, not the plain text one
        };

        try {
        // execution: call the model function to insert the user
        const createdUser = await createUser(newUser);

        // verifications
        expect(createdUser).toHaveProperty('id');         // verify Postgres generated an UUID
        expect(createdUser).toHaveProperty('created_at'); // verify Postgres set the creation timestamp
        expect(createdUser.email).toBe(newUser.email);
        expect(createdUser.role).toBe('admin');

        console.log("User created successfully! ID:", createdUser.id);

        } catch (error) {
        console.error("Error during creation:", error.message);
        throw error;
        }
    });
});