import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import inventoryRoutes from "./modules/Inventory/routes/inventoryRoutes";
import agentAuthRoutes from "./modules/auth/agent/routes";
import volunteerAuthRoutes from "./modules/auth/volunteer/routes";
import meRoute from "./modules/auth/routes/me";
import { InventoryService } from "./modules/Inventory/services/inventoryService";
import volunteerCampaignRoutes from './modules/volunteer/routes/campaigns';
// import userRoutes from "./routes/userRoutes";

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
app.use('/api/auth', volunteerAuthRoutes);
app.use('/api/campaigns', volunteerCampaignRoutes);
app.use('/api/auth', volunteerAuthRoutes);
// app.use("/api/users", userRoutes);

export default app;
