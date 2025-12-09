// src/routes/authRoutes.js
import express from 'express';
import { login, register } from '../controllers/authController.js';

const router = express.Router();

// Route POST /api/auth/login and /api/auth/register
router.post('/login', login);
router.post('/register', register);

export default router;