import express from "express";
import { UserController } from "../controllers/UserController.js";

const router = express.Router();

// POST: Create a new user
router.post("/", UserController.createUser);

// GET: Get all users (with optional role filter)
router.get("/", UserController.getAllUsers);

// GET: Get user by email
router.get("/email/:email", UserController.getUserByEmail);

// GET: Get user by ID
router.get("/:id", UserController.getUserById);

// PUT: Update user
router.put("/:id", UserController.updateUser);

// DELETE: Delete user
router.delete("/:id", UserController.deleteUser);

export default router;
