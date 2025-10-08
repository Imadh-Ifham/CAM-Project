import { CampaignFormData } from "../../../types/campaign.type";
import Campaign, { ICampaign } from "../models/Campaign.model";
import mongoose from "mongoose";

// Interface for service responses
interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

// Interface for create campaign input
interface CreateCampaignInput
  extends Omit<CampaignFormData, "startDate" | "endDate"> {
  startDate: Date;
  endDate: Date;
}

// Interface for campaign search/filter options
interface CampaignFilters {
  status?: string;
  type?: string;
  priority?: string;
  district?: string;
  city?: string;
  isUrgent?: boolean;
  createdBy?: string;
  dateRange?: {
    startFrom?: Date;
    endTo?: Date;
  };
}

// Interface for pagination
interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Interface for paginated response
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

class CampaignService {
  /**
   * Create a new campaign
   */
  async createCampaign(
    campaignData: CreateCampaignInput
  ): Promise<ServiceResponse<ICampaign>> {
    try {
      // Start a MongoDB session for transaction
      const session = await mongoose.startSession();

      try {
        session.startTransaction();

        // Validate required fields
        this.validateCampaignData(campaignData);

        // Generate unique campaign ID
        const campaignID = await this.generateCampaignID(campaignData.type);

        // Calculate estimated budget from resources if not provided
        if (
          campaignData.estimatedBudget === 0 &&
          campaignData.resources.length > 0
        ) {
          campaignData.estimatedBudget = campaignData.resources.reduce(
            (total, resource) =>
              total + resource.quantity * resource.estimatedCost,
            0
          );
        }

        // Create the campaign document
        const campaignDoc = new Campaign({
          campaignID,
          name: campaignData.name,
          description: campaignData.description,
          type: campaignData.type,
          priority: campaignData.priority,
          district: campaignData.district,
          city: campaignData.city,
          resources: campaignData.resources,
          estimatedBudget: campaignData.estimatedBudget,
          startDate: campaignData.startDate,
          endDate: campaignData.endDate,
          isUrgent: campaignData.isUrgent,
          expectedDuration: campaignData.expectedDuration,
          requiredVolunteers: campaignData.requiredVolunteers,
          skillsRequired: campaignData.skillsRequired,
          status: campaignData.isUrgent ? "active" : "draft", // Auto-activate urgent campaigns
        });

        // Save the campaign
        const savedCampaign = await campaignDoc.save({ session });

        // Commit the transaction
        await session.commitTransaction();

        return {
          success: true,
          data: savedCampaign,
          message: "Campaign created successfully",
        };
      } catch (error) {
        // Rollback the transaction
        await session.abortTransaction();
        throw error;
      } finally {
        // End the session
        session.endSession();
      }
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to create campaign",
        error: error.message || "Unknown error occurred",
      };
    }
  }

  /**
   * Get campaign by ID
   */
  async getCampaignById(
    campaignId: string
  ): Promise<ServiceResponse<ICampaign>> {
    try {
      const campaign = await Campaign.findOne({ campaignID: campaignId })
        .populate("assignedAgents", "name email phone role")
        .exec();

      if (!campaign) {
        return {
          success: false,
          message: "Campaign not found",
        };
      }

      return {
        success: true,
        data: campaign,
        message: "Campaign retrieved successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to retrieve campaign",
        error: error.message || "Unknown error occurred",
      };
    }
  }

  /**
   * Get campaigns with filters and pagination
   */
  async getCampaigns(
    filters: CampaignFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<ServiceResponse<PaginatedResponse<ICampaign>>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = pagination;
      const skip = (page - 1) * limit;

      // Build query object
      const query: any = {};

      if (filters.status) query.status = filters.status;
      if (filters.type) query.type = filters.type;
      if (filters.priority) query.priority = filters.priority;
      if (filters.district) query.district = new RegExp(filters.district, "i");
      if (filters.city) query.city = new RegExp(filters.city, "i");
      if (filters.isUrgent !== undefined) query.isUrgent = filters.isUrgent;
      if (filters.createdBy) query.createdBy = filters.createdBy;

      // Date range filter
      if (filters.dateRange) {
        const dateFilter: any = {};
        if (filters.dateRange.startFrom) {
          dateFilter.$gte = filters.dateRange.startFrom;
        }
        if (filters.dateRange.endTo) {
          dateFilter.$lte = filters.dateRange.endTo;
        }
        if (Object.keys(dateFilter).length > 0) {
          query.startDate = dateFilter;
        }
      }

      // Build sort object
      const sort: any = {};
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;

      // Execute queries
      const [campaigns, totalCount] = await Promise.all([
        Campaign.find(query)
          .populate("assignedAgents", "name email phone role")
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),
        Campaign.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      const paginatedResponse: PaginatedResponse<ICampaign> = {
        data: campaigns,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };

      return {
        success: true,
        data: paginatedResponse,
        message: "Campaigns retrieved successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to retrieve campaigns",
        error: error.message || "Unknown error occurred",
      };
    }
  }

  /**
   * Update campaign status
   */
  async updateCampaignStatus(
    campaignId: string,
    status: string
  ): Promise<ServiceResponse<ICampaign>> {
    try {
      const validStatuses = [
        "draft",
        "active",
        "paused",
        "completed",
        "cancelled",
      ];

      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message: "Invalid status value",
        };
      }

      const campaign = await Campaign.findOneAndUpdate(
        { campaignID: campaignId },
        {
          status,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      ).exec();

      if (!campaign) {
        return {
          success: false,
          message: "Campaign not found",
        };
      }

      return {
        success: true,
        data: campaign,
        message: "Campaign status updated successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to update campaign status",
        error: error.message || "Unknown error occurred",
      };
    }
  }

  /**
   * Delete campaign (soft delete by setting status to cancelled)
   */
  async deleteCampaign(campaignId: string): Promise<ServiceResponse<void>> {
    try {
      const campaign = await Campaign.findOneAndUpdate(
        { campaignID: campaignId },
        {
          status: "cancelled",
          updatedAt: new Date(),
        },
        { new: true }
      ).exec();

      if (!campaign) {
        return {
          success: false,
          message: "Campaign not found",
        };
      }

      return {
        success: true,
        message: "Campaign deleted successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to delete campaign",
        error: error.message || "Unknown error occurred",
      };
    }
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStats(createdBy?: string): Promise<ServiceResponse<any>> {
    try {
      const matchStage: any = {};
      if (createdBy) {
        matchStage.createdBy = createdBy;
      }

      const stats = await Campaign.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalCampaigns: { $sum: 1 },
            activeCampaigns: {
              $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
            },
            completedCampaigns: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            urgentCampaigns: {
              $sum: { $cond: ["$isUrgent", 1, 0] },
            },
            totalBudget: { $sum: "$estimatedBudget" },
            totalSpent: { $sum: "$spent" },
            totalVolunteersNeeded: { $sum: "$requiredVolunteers" },
            totalVolunteersAssigned: { $sum: "$volunteers" },
          },
        },
      ]);

      const result = stats[0] || {
        totalCampaigns: 0,
        activeCampaigns: 0,
        completedCampaigns: 0,
        urgentCampaigns: 0,
        totalBudget: 0,
        totalSpent: 0,
        totalVolunteersNeeded: 0,
        totalVolunteersAssigned: 0,
      };

      return {
        success: true,
        data: result,
        message: "Campaign statistics retrieved successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to retrieve campaign statistics",
        error: error.message || "Unknown error occurred",
      };
    }
  }

  /**
   * Private helper methods
   */

  private validateCampaignData(campaignData: CreateCampaignInput): void {
    const errors: string[] = [];

    if (!campaignData.name || campaignData.name.trim().length < 3) {
      errors.push("Campaign name must be at least 3 characters long");
    }

    if (
      !campaignData.description ||
      campaignData.description.trim().length < 10
    ) {
      errors.push("Campaign description must be at least 10 characters long");
    }

    if (!campaignData.district || !campaignData.city) {
      errors.push("District and city are required");
    }

    if (campaignData.endDate <= campaignData.startDate) {
      errors.push("End date must be after start date");
    }

    if (campaignData.requiredVolunteers < 1) {
      errors.push("At least 1 volunteer is required");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }
  }

  private async generateCampaignID(type: string): Promise<string> {
    const prefix = type.substring(0, 3).toUpperCase().replace("-", "");
    const timestamp = Date.now().toString().slice(-6);

    // Ensure uniqueness
    let counter = 0;
    let campaignID = `${prefix}-${timestamp}`;

    while (await Campaign.findOne({ campaignID })) {
      counter++;
      campaignID = `${prefix}-${timestamp}-${counter}`;
    }

    return campaignID;
  }
}

export default new CampaignService();
