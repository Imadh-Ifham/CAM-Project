import { Request, Response } from "express";
import progressService from "../services/progress.service";

export class ProgressController {
  async postLedger(req: Request, res: Response) {
    try {
      const entry = await progressService.postLedger(req.body);
      res.status(201).json(entry);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}

export default new ProgressController();
