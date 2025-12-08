import { AvailabilitySlot } from "../models/AvailabilitySlot.js";

export class AvailabilitySlotController {
  // Create a new availability slot
  static async createAvailabilitySlot(req, res) {
    try {
      const { practitioner_id, start_datetime, end_datetime, recurrence_rule, is_exception } = req.body;

      // Validate required fields
      if (!practitioner_id || !start_datetime || !end_datetime) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Validate dates
      const startDate = new Date(start_datetime);
      const endDate = new Date(end_datetime);
      if (startDate >= endDate) {
        return res.status(400).json({ error: "Start datetime must be before end datetime" });
      }

      const slot = await AvailabilitySlot.create({
        practitioner_id,
        start_datetime,
        end_datetime,
        recurrence_rule: recurrence_rule || null,
        is_exception: is_exception || false,
      });

      res.status(201).json(slot);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get availability slot by ID
  static async getAvailabilitySlotById(req, res) {
    try {
      const { id } = req.params;
      const slot = await AvailabilitySlot.findById(id);

      if (!slot) {
        return res.status(404).json({ error: "Availability slot not found" });
      }

      res.json(slot);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all availability slots
  static async getAllAvailabilitySlots(req, res) {
    try {
      const slots = await AvailabilitySlot.findAll();
      res.json(slots);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get availability slots by practitioner ID
  static async getAvailabilitySlotsByPractitioner(req, res) {
    try {
      const { practitionerId } = req.params;
      const slots = await AvailabilitySlot.findByPractitionerId(practitionerId);

      if (slots.length === 0) {
        return res.status(404).json({ error: "No availability slots found for this practitioner" });
      }

      res.json(slots);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get available slots for a practitioner within a date range
  static async getAvailableSlots(req, res) {
    try {
      const { practitionerId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: "startDate and endDate query parameters are required" });
      }

      const slots = await AvailabilitySlot.findAvailableSlots(practitionerId, startDate, endDate);
      res.json(slots);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update availability slot
  static async updateAvailabilitySlot(req, res) {
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

      const success = await AvailabilitySlot.update(id, updates);

      if (!success) {
        return res.status(404).json({ error: "Availability slot not found" });
      }

      const slot = await AvailabilitySlot.findById(id);
      res.json(slot);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete availability slot
  static async deleteAvailabilitySlot(req, res) {
    try {
      const { id } = req.params;
      const success = await AvailabilitySlot.delete(id);

      if (!success) {
        return res.status(404).json({ error: "Availability slot not found" });
      }

      res.json({ message: "Availability slot deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
