import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import inventoryRoutes from "./modules/Inventory/routes/inventoryRoutes";
import agentAuthRoutes from "./modules/auth/agent/routes";
import volunteerAuthRoutes from "./modules/auth/volunteer/routes/index";
import meRoute from "./modules/auth/routes/me";
import { InventoryService } from "./modules/Inventory/services/inventoryService";
import volunteerCampaignRoutes from './modules/volunteer/routes/campaigns';
import volunteerProfileRoutes from './modules/volunteer/routes/volunteer';
// import userRoutes from "./routes/userRoutes";
import volunteerCampaignRoutes from "./modules/volunteer/routes/campaigns";
import { campaignRoutes } from "./modules/campaign";
import userRoutes from "./modules/userManagement/routes/userRoutes";
import agentCampaignRequestRoutes from "./modules/agent/campaign-requests/routes";

const app: Application = express();

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize dummy data (only runs once if database is empty)
const inventoryService = new InventoryService();
// inventoryService.initializeDummyData().catch(console.error);

// Middleware
app.use(cors());
app.use(express.json()); // This MUST be before routes
app.use(express.urlencoded({ extended: true })); // Add this too

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
app.use('/api/auth', volunteerAuthRoutes);
app.use('/api/campaigns', volunteerCampaignRoutes);
app.use('/api/volunteers', volunteerProfileRoutes);
// app.use("/api/users", userRoutes);
app.use("/api/volunteer/campaigns", volunteerCampaignRoutes);
// Specific agent-campaign request endpoints should come before generic campaign routes
app.use("/api/campaigns", agentCampaignRequestRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/agent", agentAuthRoutes);
app.use("/api/volunteer", volunteerAuthRoutes);
app.use("/api/auth", meRoute);
app.use("/api/users", userRoutes);

export default app;
