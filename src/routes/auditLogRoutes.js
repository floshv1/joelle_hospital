import express from "express";
import { AuditLogController } from "../controllers/AuditLogController.js";

const router = express.Router();

// POST: Create a new audit log entry
router.post("/", AuditLogController.createAuditLog);

// GET: Get all audit logs
router.get("/", AuditLogController.getAllAuditLogs);

// GET: Get audit logs by date range
router.get("/range", AuditLogController.getAuditLogsByDateRange);

// GET: Get audit logs by user
router.get("/user/:userId", AuditLogController.getAuditLogsByUser);

// GET: Get audit logs by action
router.get("/action/:action", AuditLogController.getAuditLogsByAction);

// GET: Get audit log by ID
router.get("/:id", AuditLogController.getAuditLogById);

// DELETE: Delete audit log
router.delete("/:id", AuditLogController.deleteAuditLog);

export default router;
