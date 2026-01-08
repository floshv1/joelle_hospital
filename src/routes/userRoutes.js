import express from 'express';
import { UserController } from '../controllers/UserController.js';

const router = express.Router();


// Récupérer tous les utilisateurs (GET /api/users)
router.get('/', UserController.getAllUsers);

// Récupérer un utilisateur par ID (GET /api/users/:id)
router.get('/:id', UserController.getUserById);

// Supprimer un utilisateur (DELETE /api/users/:id)
router.delete('/:id', UserController.deleteUser);

export default router;