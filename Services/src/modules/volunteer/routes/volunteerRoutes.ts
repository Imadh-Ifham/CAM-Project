import { Router } from 'express';
import { assignVolunteerToCampaign } from '../controllers/volunteerController';
import authMiddleware from '../middleware/auth';

const router = Router();

// POST /api/volunteer/assign - Assign volunteer to campaign
router.post('/assign', authMiddleware, assignVolunteerToCampaign);


export default router;
