import { Request, Response } from "express";
import CampaignService from "../services/campaign.service";
import { CampaignFormData } from "../../../types/campaign.type";

class CampaignController {
  /**
   * Create a new campaign
   * POST /api/campaigns
   */
  async createCampaign(req: Request, res: Response): Promise<void> {
    try {
      console.log("Received body:", req.body);
      const campaignData = req.body as CampaignFormData;

      // Parse dates
      const startDate = new Date(campaignData.startDate);
      const endDate = new Date(campaignData.endDate);

      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        res.status(400).json({
          success: false,
          message: "Invalid date format. Please use ISO date format.",
        });
        return;
      }

      if (endDate <= startDate) {
        res.status(400).json({
          success: false,
          message: "End date must be after start date",
        });
        return;
      }

      // Prepare service input
      const serviceInput = {
        ...campaignData,
        startDate,
        endDate,
      };

      // Call service to create campaign
      const result = await CampaignService.createCampaign(serviceInput);

      if (result.success) {
        res.status(201).json({
          success: true,
          message: result.message,
          data: {
            campaign: result.data,
            campaignID: result.data?.campaignID,
          },
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
          error: result.error,
        });
      }
    } catch (error: any) {
      console.error("Create campaign error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Get campaign by ID
   * GET /api/campaigns/:campaignId
   */
  async getCampaignById(req: Request, res: Response): Promise<void> {
    try {
      const { campaignId } = req.params;

      console.log("Fetching campaign with ID:", campaignId);
      if (!campaignId) {
        res.status(400).json({
          success: false,
          message: "Campaign ID is required",
        });
        return;
      }

      const result = await CampaignService.getCampaignById(campaignId);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: result.data,
        });
      } else {
        const statusCode = result.message === "Campaign not found" ? 404 : 400;
        res.status(statusCode).json({
          success: false,
          message: result.message,
          error: result.error,
        });
      }
    } catch (error: any) {
      console.error("Get campaign error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Get campaigns with filters and pagination
   * GET /api/campaigns
   */
  async getCampaigns(req: Request, res: Response): Promise<void> {
    try {
      // Extract query parameters
      const {
        page = "1",
        limit = "10",
        sortBy = "createdAt",
        sortOrder = "desc",
        status,
        type,
        priority,
        district,
        city,
        isUrgent,
        startFrom,
        endTo,
        myOnly = "false",
      } = req.query;

      // Parse pagination options
      const paginationOptions = {
        page: parseInt(page as string, 10),
        limit: Math.min(parseInt(limit as string, 10), 100), // Max 100 items per page
        sortBy: sortBy as string,
        sortOrder:
          (sortOrder as string) === "asc"
            ? ("asc" as const)
            : ("desc" as const),
      };

      // Build filters
      const filters: any = {};

      if (status) filters.status = status as string;
      if (type) filters.type = type as string;
      if (priority) filters.priority = priority as string;
      if (district) filters.district = district as string;
      if (city) filters.city = city as string;
      if (isUrgent !== undefined) filters.isUrgent = isUrgent === "true";

      // Date range filter
      if (startFrom || endTo) {
        filters.dateRange = {};
        if (startFrom) {
          const startFromDate = new Date(startFrom as string);
          if (!isNaN(startFromDate.getTime())) {
            filters.dateRange.startFrom = startFromDate;
          }
        }
        if (endTo) {
          const endToDate = new Date(endTo as string);
          if (!isNaN(endToDate.getTime())) {
            filters.dateRange.endTo = endToDate;
          }
        }
      }

      const result = await CampaignService.getCampaigns(
        filters,
        paginationOptions
      );

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: result.data?.data,
          pagination: result.data?.pagination,
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
          error: result.error,
        });
      }
    } catch (error: any) {
      console.error("Get campaigns error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Update campaign status
   * PATCH /api/campaigns/:campaignId/status
   */
  async updateCampaignStatus(req: Request, res: Response): Promise<void> {
    try {
      const { campaignId } = req.params;
      const { status } = req.body;

      if (!campaignId) {
        res.status(400).json({
          success: false,
          message: "Campaign ID is required",
        });
        return;
      }

      if (!status) {
        res.status(400).json({
          success: false,
          message: "Status is required",
        });
        return;
      }

      const result = await CampaignService.updateCampaignStatus(
        campaignId,
        status
      );

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: result.data,
        });
      } else {
        const statusCode = result.message === "Campaign not found" ? 404 : 400;
        res.status(statusCode).json({
          success: false,
          message: result.message,
          error: result.error,
        });
      }
    } catch (error: any) {
      console.error("Update campaign status error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Delete campaign (soft delete)
   * DELETE /api/campaigns/:campaignId
   */
  async deleteCampaign(req: Request, res: Response): Promise<void> {
    try {
      const { campaignId } = req.params;

      if (!campaignId) {
        res.status(400).json({
          success: false,
          message: "Campaign ID is required",
        });
        return;
      }

      const result = await CampaignService.deleteCampaign(campaignId);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
        });
      } else {
        const statusCode = result.message === "Campaign not found" ? 404 : 400;
        res.status(statusCode).json({
          success: false,
          message: result.message,
          error: result.error,
        });
      }
    } catch (error: any) {
      console.error("Delete campaign error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Get campaign statistics
   * GET /api/campaigns/stats
   */
  async getCampaignStats(req: Request, res: Response): Promise<void> {
    try {
      let createdBy: string | undefined;

      const result = await CampaignService.getCampaignStats(createdBy);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: result.data,
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
          error: result.error,
        });
      }
    } catch (error: any) {
      console.error("Get campaign stats error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

export default new CampaignController();
