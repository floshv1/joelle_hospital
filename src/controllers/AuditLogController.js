import { AuditLog } from "../models/AuditLog.js";

export class AuditLogController {
  // Create a new audit log entry
  static async createAuditLog(req, res) {
    try {
      const { user_id, action, details } = req.body;

      // Validate required fields
      if (!user_id || !action) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const log = await AuditLog.create({
        user_id,
        action,
        details: details || "",
      });

      res.status(201).json(log);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get audit log by ID
  static async getAuditLogById(req, res) {
    try {
      const { id } = req.params;
      const log = await AuditLog.findById(id);

      if (!log) {
        return res.status(404).json({ error: "Audit log not found" });
      }

      res.json(log);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all audit logs
  static async getAllAuditLogs(req, res) {
    try {
      const logs = await AuditLog.findAll();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get audit logs by user ID
  static async getAuditLogsByUser(req, res) {
    try {
      const { userId } = req.params;
      const logs = await AuditLog.findByUserId(userId);

      if (logs.length === 0) {
        return res.status(404).json({ error: "No audit logs found for this user" });
      }

      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get audit logs by action
  static async getAuditLogsByAction(req, res) {
    try {
      const { action } = req.params;
      const logs = await AuditLog.findByAction(action);

      if (logs.length === 0) {
        return res.status(404).json({ error: `No audit logs found for action: ${action}` });
      }

      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get audit logs by date range
  static async getAuditLogsByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: "startDate and endDate query parameters are required" });
      }

      const logs = await AuditLog.findByDateRange(startDate, endDate);

      if (logs.length === 0) {
        return res.status(404).json({ error: "No audit logs found in the specified date range" });
      }

      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete audit log
  static async deleteAuditLog(req, res) {
    try {
      const { id } = req.params;
      const success = await AuditLog.delete(id);

      if (!success) {
        return res.status(404).json({ error: "Audit log not found" });
      }

      res.json({ message: "Audit log deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
