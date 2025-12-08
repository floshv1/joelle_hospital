import { Appointment } from "../models/Appointment.js";

export class AppointmentController {
  // Create a new appointment
  static async createAppointment(req, res) {
    try {
      const { patient_id, practitioner_id, start_datetime, end_datetime, created_by } = req.body;

      // Validate required fields
      if (!patient_id || !practitioner_id || !start_datetime || !end_datetime || !created_by) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Validate dates
      const startDate = new Date(start_datetime);
      const endDate = new Date(end_datetime);
      if (startDate >= endDate) {
        return res.status(400).json({ error: "Start datetime must be before end datetime" });
      }

      const appointment = await Appointment.create({
        patient_id,
        practitioner_id,
        start_datetime,
        end_datetime,
        created_by,
        status: "booked",
      });

      res.status(201).json(appointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get appointment by ID
  static async getAppointmentById(req, res) {
    try {
      const { id } = req.params;
      const appointment = await Appointment.findById(id);

      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all appointments
  static async getAllAppointments(req, res) {
    try {
      const appointments = await Appointment.findAll();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get appointments by patient ID
  static async getAppointmentsByPatient(req, res) {
    try {
      const { patientId } = req.params;
      const appointments = await Appointment.findByPatientId(patientId);

      if (appointments.length === 0) {
        return res.status(404).json({ error: "No appointments found for this patient" });
      }

      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get appointments by practitioner ID
  static async getAppointmentsByPractitioner(req, res) {
    try {
      const { practitionerId } = req.params;
      const appointments = await Appointment.findByPractitionerId(practitionerId);

      if (appointments.length === 0) {
        return res.status(404).json({ error: "No appointments found for this practitioner" });
      }

      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get appointments by date range
  static async getAppointmentsByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: "startDate and endDate query parameters are required" });
      }

      const appointments = await Appointment.findByDateRange(startDate, endDate);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update appointment status
  static async updateAppointmentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ["booked", "confirmed", "cancelled", "no-show"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
      }

      const success = await Appointment.updateStatus(id, status);

      if (!success) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      const appointment = await Appointment.findById(id);
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update appointment
  static async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Validate date range if both dates are being updated
      if (updates.start_datetime && updates.end_datetime) {
        const startDate = new Date(updates.start_datetime);
        const endDate = new Date(updates.end_datetime);
        if (startDate >= endDate) {
          return res.status(400).json({ error: "Start datetime must be before end datetime" });
        }
      }

      const success = await Appointment.update(id, updates);

      if (!success) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      const appointment = await Appointment.findById(id);
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete appointment
  static async deleteAppointment(req, res) {
    try {
      const { id } = req.params;
      const success = await Appointment.delete(id);

      if (!success) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
