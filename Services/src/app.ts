import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import inventoryRoutes from "./modules/Inventory/routes/inventoryRoutes";
import agentAuthRoutes from "./modules/auth/agent/routes";
import volunteerAuthRoutes from "./modules/volunteer/routes/auth";
import volunteerRoutes from "./modules/volunteer/routes/volunteerRoutes";
import meRoute from "./modules/auth/routes/me";
import { InventoryService } from "./modules/Inventory/services/inventoryService";
import volunteerCampaignRoutes from "./modules/volunteer/routes/campaigns";
import { campaignRoutes } from "./modules/campaign";

const app: Application = express();

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize dummy data (only runs once if database is empty)
const inventoryService = new InventoryService();
// inventoryService.initializeDummyData().catch(console.error);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "CAM Services API is running!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    database: "MongoDB Connected",
  });
});

// Routes
app.use("/api/inventory", inventoryRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/volunteer/campaigns", volunteerCampaignRoutes);
app.use("/api/agent", agentAuthRoutes);
app.use("/api/volunteer", volunteerAuthRoutes); // Auth routes: /register, /login, /me (PUT & GET)
app.use("/api/volunteer", volunteerRoutes); // Volunteer routes: /list, /profile
app.use("/api/auth", meRoute);

export default app;
