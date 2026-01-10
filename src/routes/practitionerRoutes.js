import express from 'express';
import { PractitionerController } from '../controllers/PractitionerController.js';

const router = express.Router();

// Créer un praticien (POST /api/practitioners)
router.post('/', PractitionerController.createPractitioner);

// Récupérer tous les praticiens (GET /api/practitioners)
router.get('/', PractitionerController.getAllPractitioners);

// Récupérer un praticien par ID (GET /api/practitioners/:id)
router.get('/:id', PractitionerController.getPractitionerById);

// Supprimer un praticien (DELETE /api/practitioners/:id)
router.delete('/:id', PractitionerController.deletePractitioner);

export default router;