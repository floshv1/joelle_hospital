import { User } from "../models/User.js";
import bcrypt from "bcrypt";

export class UserController {
  // Create a new user
  static async createUser(req, res) {
    try {
      const { first_name, last_name, email, phone, password, role } = req.body;

      // Validate required fields
      if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "User with this email already exists" });
      }

      // Hash password
      const hashed_password = await bcrypt.hash(password, 10);

      const user = await User.create({
        first_name,
        last_name,
        email,
        phone,
        hashed_password,
        role: role || "patient",
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Don't return hashed password
      const { hashed_password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all users
  static async getAllUsers(req, res) {
    try {
      const { role } = req.query;
      const filter = role ? { role } : {};
      const users = await User.findAll(filter);

      // Remove hashed passwords
      const usersWithoutPasswords = users.map(({ hashed_password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update user
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Don't allow direct password updates here
      if (updates.hashed_password) {
        delete updates.hashed_password;
      }

      const success = await User.update(id, updates);

      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = await User.findById(id);
      const { hashed_password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete user
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const success = await User.delete(id);

      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get user by email
  static async getUserByEmail(req, res) {
    try {
      const { email } = req.params;
      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { hashed_password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
