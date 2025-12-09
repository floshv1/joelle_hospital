import express from "express";
import cors from "cors";
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
import authRoutes from '../routes/authRoutes.js';

// Resolve file paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the Express application
const app = express();

// Serve static files from the public directory (Frontend)
app.use(express.static(path.join(__dirname, "../../public")));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Health check endpoint to verify server status
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
        // Dynamic import of route modules
        const mod = await import(pathToFileURL(full).href);
        const router = mod.default;
        if (router) app.use("/", router);
    }
}

// Mount authentication routes under /api/auth
app.use('/api/auth', authRoutes);

// Register global error handling middleware (must be the last middleware used)
app.use(errorHandler);

// Export the application instance
export default app;