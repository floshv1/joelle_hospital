import express from "express";
import { PractitionerController } from "../controllers/PractitionerController.js";

const router = express.Router();

// POST: Create a new practitioner
router.post("/", PractitionerController.createPractitioner);

// GET: Get all practitioners (with optional specialty filter)
router.get("/", PractitionerController.getAllPractitioners);

// GET: Get practitioner by user ID
router.get("/user/:userId", PractitionerController.getPractitionerByUserId);

// GET: Get practitioners by specialty
router.get("/specialty/:specialty", PractitionerController.getPractitionersBySpecialty);

// GET: Get practitioner by ID
router.get("/:id", PractitionerController.getPractitionerById);

// PUT: Update practitioner
router.put("/:id", PractitionerController.updatePractitioner);

// DELETE: Delete practitioner
router.delete("/:id", PractitionerController.deletePractitioner);

export default router;
