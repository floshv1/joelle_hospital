import express from "express";
import { AvailabilitySlotController } from "../controllers/AvailabilitySlotController.js";

const router = express.Router();

// POST: Create a new availability slot
router.post("/", AvailabilitySlotController.createAvailabilitySlot);

// GET: Get all availability slots
router.get("/", AvailabilitySlotController.getAllAvailabilitySlots);

// GET: Get available slots for practitioner (by date range)
router.get("/practitioner/:practitionerId/available", AvailabilitySlotController.getAvailableSlots);

// GET: Get all slots by practitioner
router.get("/practitioner/:practitionerId", AvailabilitySlotController.getAvailabilitySlotsByPractitioner);

// GET: Get availability slot by ID
router.get("/:id", AvailabilitySlotController.getAvailabilitySlotById);

// PUT: Update availability slot
router.put("/:id", AvailabilitySlotController.updateAvailabilitySlot);

// DELETE: Delete availability slot
router.delete("/:id", AvailabilitySlotController.deleteAvailabilitySlot);

export default router;
