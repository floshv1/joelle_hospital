import express from "express";
import { AppointmentController } from "../controllers/AppointmentController.js";

const router = express.Router();

// POST: Create a new appointment
router.post("/", AppointmentController.createAppointment);

// GET: Get all appointments
router.get("/", AppointmentController.getAllAppointments);

// GET: Get appointments by date range
router.get("/range", AppointmentController.getAppointmentsByDateRange);

// GET: Get appointments by patient
router.get("/patient/:patientId", AppointmentController.getAppointmentsByPatient);

// GET: Get appointments by practitioner
router.get("/practitioner/:practitionerId", AppointmentController.getAppointmentsByPractitioner);

// GET: Get appointment by ID
router.get("/:id", AppointmentController.getAppointmentById);

// PUT: Update appointment
router.put("/:id", AppointmentController.updateAppointment);

// PATCH: Update appointment status
router.patch("/:id/status", AppointmentController.updateAppointmentStatus);

// DELETE: Delete appointment
router.delete("/:id", AppointmentController.deleteAppointment);

export default router;
