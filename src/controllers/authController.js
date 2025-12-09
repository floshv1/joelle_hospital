// src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/userModel.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

//Handles user login.
// Verifies credentials and issues a JWT token upon success.
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Retrieve user from the database
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password (compare plain text with stored hash)
    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, role: user.role }, // Payload data
      process.env.JWT_SECRET,               // Secret key from .env
      { expiresIn: '24h' }                  // Token expiration time
    );

    // Send success response
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Handles user registration.
// Validates input, hashes the password, and creates a new user record.
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 2. Check if email already exists
    const userExists = await findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    // 3. Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the user via the model
    const newUser = await createUser({
      role: role || 'patient', // Default to 'patient' if not specified
      firstName,
      lastName,
      email,
      phone,
      hashedPassword // Send the encrypted version
    });

    // 5. Send success response
    res.status(201).json({
      message: "Account created successfully",
      user: newUser
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
};