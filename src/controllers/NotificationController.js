import { Notification } from "../models/Notification.js";

export class NotificationController {
  // Create a new notification
  static async createNotification(req, res) {
    try {
      const { appointment_id, type, status } = req.body;

      // Validate required fields
      if (!appointment_id || !type) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const validTypes = ["confirmation", "reminder", "cancellation"];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ error: `Invalid type. Must be one of: ${validTypes.join(", ")}` });
      }

      const notification = await Notification.create({
        appointment_id,
        type,
        status: status || "pending",
      });

      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get notification by ID
  static async getNotificationById(req, res) {
    try {
      const { id } = req.params;
      const notification = await Notification.findById(id);

      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all notifications
  static async getAllNotifications(req, res) {
    try {
      const notifications = await Notification.findAll();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get notifications by appointment ID
  static async getNotificationsByAppointment(req, res) {
    try {
      const { appointmentId } = req.params;
      const notifications = await Notification.findByAppointmentId(appointmentId);

      if (notifications.length === 0) {
        return res.status(404).json({ error: "No notifications found for this appointment" });
      }

      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get notifications by status
  static async getNotificationsByStatus(req, res) {
    try {
      const { status } = req.params;

      const validStatuses = ["pending", "sent", "failed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
      }

      const notifications = await Notification.findByStatus(status);

      if (notifications.length === 0) {
        return res.status(404).json({ error: `No notifications found with status: ${status}` });
      }

      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get pending notifications
  static async getPendingNotifications(req, res) {
    try {
      const notifications = await Notification.findPending();

      if (notifications.length === 0) {
        return res.status(404).json({ error: "No pending notifications" });
      }

      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update notification status
  static async updateNotificationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, sentAt } = req.body;

      const validStatuses = ["pending", "sent", "failed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
      }

      const success = await Notification.updateStatus(id, status, sentAt);

      if (!success) {
        return res.status(404).json({ error: "Notification not found" });
      }

      const notification = await Notification.findById(id);
      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update notification
  static async updateNotification(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const success = await Notification.update(id, updates);

      if (!success) {
        return res.status(404).json({ error: "Notification not found" });
      }

      const notification = await Notification.findById(id);
      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete notification
  static async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      const success = await Notification.delete(id);

      if (!success) {
        return res.status(404).json({ error: "Notification not found" });
      }

      res.json({ message: "Notification deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
