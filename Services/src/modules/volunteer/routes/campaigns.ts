import { Router } from 'express';
import Campaign, { IAssignedVolunteer } from '../models/Campaign';
import CollectionLog from '../models/CollectionLog';
import DistributionLog from '../models/DistributionLog';
import authenticateVolunteer from '../middleware/auth';

const router = Router();

// GET /api/campaigns - list all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find({}).lean();
    res.json({ campaigns });
  } catch (err: any) {
    console.error('List campaigns error', err.message || err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/campaigns/:id - get campaign details + aggregated progress
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Getting campaign with ID:', id); // Debug log
    
    const campaign = await Campaign.findById(id).lean();
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    // Aggregate collected/distributed totals from logs
    const collected = await CollectionLog.find({ campaignId: id }).lean();
    const distributed = await DistributionLog.find({ campaignId: id }).lean();

    res.json({ campaign, collected, distributed });
  } catch (err: any) {
    console.error('Get campaign error:', err.message, err.stack); // Better logging
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/campaigns/:id/collect - log collected items
router.post('/:id/collect', authenticateVolunteer, async (req: any, res) => {
  try {
    const { id } = req.params;
    const volunteer = req.volunteer;
    const { items, note } = req.body;

    // Check assignment
    const campaign = await Campaign.findById(id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    const assigned = (campaign.assignedVolunteers as IAssignedVolunteer[]).some((a) => a.volunteerId.toString() === volunteer._id.toString());
    if (!assigned) return res.status(403).json({ message: 'Not assigned to this campaign' });

    // Add default type to items if not provided
    const itemsWithType = items.map((item: any) => ({
      ...item,
      type: item.type || 'general'
    }));

    const log = new CollectionLog({ campaignId: id, volunteerId: volunteer._id, items: itemsWithType, note });
    await log.save();

    res.status(201).json({ log });
  } catch (err: any) {
    console.error('Collect error FULL:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/campaigns/:id/distribute - log distributed items
router.post('/:id/distribute', authenticateVolunteer, async (req: any, res) => {
  try {
    const { id } = req.params;
    const volunteer = req.volunteer;
    const { items, beneficiaryName, note } = req.body;

    const campaign = await Campaign.findById(id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

  const assigned = (campaign.assignedVolunteers as IAssignedVolunteer[]).some((a) => a.volunteerId.toString() === volunteer._id.toString());
    if (!assigned) return res.status(403).json({ message: 'Not assigned to this campaign' });

    const log = new DistributionLog({ campaignId: id, volunteerId: volunteer._id, items, beneficiaryName, note });
    await log.save();

    // TODO: Update campaign.distributedTotals (can be computed by service)

    res.status(201).json({ log });
  } catch (err: any) {
    console.error('Distribute error', err.message || err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/campaigns/:id/history?type=collection|distribution
router.get('/:id/history', authenticateVolunteer, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    const volunteer = req.volunteer;

    if (type === 'collection') {
      const logs = await CollectionLog.find({ campaignId: id, volunteerId: volunteer._id }).lean();
      return res.json({ logs });
    }

    if (type === 'distribution') {
      const logs = await DistributionLog.find({ campaignId: id, volunteerId: volunteer._id }).lean();
      return res.json({ logs });
    }

    res.status(400).json({ message: 'Invalid type query param' });
  } catch (err: any) {
    console.error('History error', err.message || err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/campaigns/:id/assign - assign volunteer to campaign (for testing)
router.post('/:id/assign', authenticateVolunteer, async (req: any, res) => {
  try {
    const { id } = req.params;
    const volunteer = req.volunteer;

    console.log('=== ASSIGN DEBUG ===');
    console.log('Campaign ID:', id);
    console.log('Volunteer ID:', volunteer._id);
    console.log('===================');

    const campaign = await Campaign.findById(id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    console.log('Campaign found');
    console.log('Current assignedVolunteers:', campaign.assignedVolunteers);

    // Check if already assigned
    const alreadyAssigned = (campaign.assignedVolunteers as IAssignedVolunteer[]).some(
      (a) => a.volunteerId.toString() === volunteer._id.toString()
    );

    if (alreadyAssigned) {
      return res.status(400).json({ message: 'Already assigned to this campaign' });
    }

    // Use findByIdAndUpdate to avoid validation issues
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      id,
      {
        $push: {
          assignedVolunteers: { volunteerId: volunteer._id }
        }
      },
      { new: true }
    );

    res.json({ message: 'Successfully assigned to campaign', campaign: updatedCampaign });
  } catch (err: any) {
    console.error('Assign error FULL:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
