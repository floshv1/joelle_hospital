import express from "express";
import { NotificationController } from "../controllers/NotificationController.js";

const router = express.Router();

// POST: Create a new notification
router.post("/", NotificationController.createNotification);

// GET: Get all notifications
router.get("/", NotificationController.getAllNotifications);

// GET: Get pending notifications
router.get("/pending", NotificationController.getPendingNotifications);

// GET: Get notifications by status
router.get("/status/:status", NotificationController.getNotificationsByStatus);

// GET: Get notifications by appointment
router.get("/appointment/:appointmentId", NotificationController.getNotificationsByAppointment);

// GET: Get notification by ID
router.get("/:id", NotificationController.getNotificationById);

// PUT: Update notification
router.put("/:id", NotificationController.updateNotification);

// PATCH: Update notification status
router.patch("/:id/status", NotificationController.updateNotificationStatus);

// DELETE: Delete notification
router.delete("/:id", NotificationController.deleteNotification);

export default router;
