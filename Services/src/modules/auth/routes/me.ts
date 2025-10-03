import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import type { IUserDocument } from "../models/User";

const router = Router();

type AuthenticatedRequest = Request & { userDoc?: IUserDocument };

router.get("/me", authenticate, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ user: req.userDoc });
});

export default router;
