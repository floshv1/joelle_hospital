import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { errorHandler } from "./utils/errorHandler.js";
import {
    userRoutes,
    practitionerRoutes,
    availabilitySlotRoutes,
    appointmentRoutes,
    notificationRoutes,
    auditLogRoutes,
} from "../routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// JSON body parsing middleware
app.use(express.json());

// Simple root + health endpoints
app.get("/", (_req, res) => res.json({ ok: true, message: "Running !" }));
app.get("/health", (_req, res) => res.status(200).send("OK"));

// Mount API routes
app.use("/api/users", userRoutes);
app.use("/api/practitioners", practitionerRoutes);
app.use("/api/availability-slots", availabilitySlotRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/audit-logs", auditLogRoutes);

// Auto-mount all routers placed under src/routes/auto
const autoDir = path.join(__dirname, "routes", "auto");
if (fs.existsSync(autoDir)) {
    const files = fs.readdirSync(autoDir).filter(f => f.endsWith(".route.js"));
    for (const f of files) {
        const full = path.join(autoDir, f);
        const mod = await import(pathToFileURL(full).href);
        const router = mod.default;
        if (router) app.use("/", router);
    }
}

// Global error middleware last
app.use(errorHandler);

export default app;
