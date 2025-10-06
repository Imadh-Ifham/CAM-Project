import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { registerVolunteer } from "../controllers/register";

const router = Router();

router.post("/register", authenticate, registerVolunteer);

export default router;
