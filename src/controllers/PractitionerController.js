import { Practitioner } from "../models/Practitioner.js";

export class PractitionerController {
  // Create a new practitioner
  static async createPractitioner(req, res) {
    try {
      const { user_id, specialty, title, default_duration, description } = req.body;

      // Validate required fields
      if (!user_id || !specialty || !title) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const practitioner = await Practitioner.create({
        user_id,
        specialty,
        title,
        default_duration: default_duration || 30,
        description: description || "",
      });

      res.status(201).json(practitioner);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get practitioner by ID
  static async getPractitionerById(req, res) {
    try {
      const { id } = req.params;
      const practitioner = await Practitioner.findById(id);

      if (!practitioner) {
        return res.status(404).json({ error: "Practitioner not found" });
      }

      res.json(practitioner);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all practitioners
  static async getAllPractitioners(req, res) {
    try {
      const { specialty } = req.query;
      let practitioners;

      if (specialty) {
        practitioners = await Practitioner.findBySpecialty(specialty);
      } else {
        practitioners = await Practitioner.findAll();
      }

      res.json(practitioners);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get practitioner by user ID
  static async getPractitionerByUserId(req, res) {
    try {
      const { userId } = req.params;
      const practitioner = await Practitioner.findByUserId(userId);

      if (!practitioner) {
        return res.status(404).json({ error: "Practitioner not found for this user" });
      }

      res.json(practitioner);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get practitioners by specialty
  static async getPractitionersBySpecialty(req, res) {
    try {
      const { specialty } = req.params;
      const practitioners = await Practitioner.findBySpecialty(specialty);

      if (practitioners.length === 0) {
        return res.status(404).json({ error: "No practitioners found for this specialty" });
      }

      res.json(practitioners);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update practitioner
  static async updatePractitioner(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const success = await Practitioner.update(id, updates);

      if (!success) {
        return res.status(404).json({ error: "Practitioner not found" });
      }

      const practitioner = await Practitioner.findById(id);
      res.json(practitioner);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete practitioner
  static async deletePractitioner(req, res) {
    try {
      const { id } = req.params;
      const success = await Practitioner.delete(id);

      if (!success) {
        return res.status(404).json({ error: "Practitioner not found" });
      }

      res.json({ message: "Practitioner deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
