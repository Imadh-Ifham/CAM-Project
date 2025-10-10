import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import inventoryRoutes from "./modules/Inventory/routes/inventoryRoutes";
import agentAuthRoutes from "./modules/auth/agent/routes";
import volunteerAuthRoutes from "./modules/auth/volunteer/routes";
import meRoute from "./modules/auth/routes/me";
import { InventoryService } from "./modules/Inventory/services/inventoryService";
import volunteerCampaignRoutes from "./modules/volunteer/routes/campaigns";
import { campaignRoutes } from "./modules/campaign";
import userRoutes from "./modules/userManagement/routes/userRoutes";
import agentCampaignRequestRoutes from "./modules/agent/campaign-requests/routes";
import { collectionRoutes } from "./modules/collections";
import { distributionRoutes } from "./modules/distributions";
import { progressRoutes } from "./modules/progress";

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
app.use("/api/volunteer/campaigns", volunteerCampaignRoutes);

// NOTE: After finishing all campaign-header related routes, we can consolidate these into a single campaignsRouter and mount once at /api/campaigns
app.use("/api/campaigns", agentCampaignRequestRoutes);
app.use("/api/campaigns", collectionRoutes);
app.use("/api/campaigns", distributionRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/agent", agentAuthRoutes);
app.use("/api/volunteer", volunteerAuthRoutes);
app.use("/api/auth", meRoute);
app.use("/api/users", userRoutes);

export default app;
