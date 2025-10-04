import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { registerAgent } from "../controllers/register";

const router = Router();

router.post("/register", authenticate, registerAgent);

export default router;
