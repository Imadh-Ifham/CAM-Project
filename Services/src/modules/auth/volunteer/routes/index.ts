import { Router } from "express";
import { registerVolunteer, loginVolunteer } from "../controllers/auth";

const router = Router();

router.post("/volunteer/register", registerVolunteer);
router.post("/volunteer/login", loginVolunteer);


export default router;
