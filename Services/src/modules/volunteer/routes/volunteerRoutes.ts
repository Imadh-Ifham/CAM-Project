import { Router } from 'express';
import { 
  listVolunteers, 
  getProfile, 
  updateProfile,
  getAssignedCampaigns 
} from '../controllers/volunteerController';
import authMiddleware from '../middleware/auth';

const router = Router();

router.get('/list', listVolunteers);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/assigned-campaigns', authMiddleware, getAssignedCampaigns);

export default router;
