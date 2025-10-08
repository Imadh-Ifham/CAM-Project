import { Request, Response, NextFunction } from "express";
import { CampaignFormData } from "../../../types/campaign.type";

const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Campaign creation validation middleware
export const validateCreateCampaign = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: string[] = [];
  const {
    name,
    description,
    type,
    priority,
    district,
    city,
    startDate,
    endDate,
    requiredVolunteers,
    resources = [],
  }: CampaignFormData = req.body;

  // Basic Info Validation
  if (!name || typeof name !== "string" || name.trim().length < 3) {
    errors.push("Campaign name must be at least 3 characters long");
  }

  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length < 10
  ) {
    errors.push("Campaign description must be at least 10 characters long");
  }

  const validTypes = [
    "disaster-relief",
    "medical-aid",
    "education",
    "food-distribution",
    "emergency-response",
  ];
  if (!type || !validTypes.includes(type)) {
    errors.push("Invalid campaign type");
  }

  const validPriorities = ["low", "medium", "high", "critical"];
  if (!priority || !validPriorities.includes(priority)) {
    errors.push("Invalid priority level");
  }

  // Location Validation
  if (
    !district ||
    typeof district !== "string" ||
    district.trim().length === 0
  ) {
    errors.push("District is required");
  }

  if (!city || typeof city !== "string" || city.trim().length === 0) {
    errors.push("City is required");
  }

  // Date Validation
  if (!startDate || !isValidDate(startDate)) {
    errors.push("Valid start date is required");
  }

  if (!endDate || !isValidDate(endDate)) {
    errors.push("Valid end date is required");
  }

  if (startDate && endDate && isValidDate(startDate) && isValidDate(endDate)) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      errors.push("End date must be after start date");
    }
  }

  // Team Validation
  if (
    !requiredVolunteers ||
    typeof requiredVolunteers !== "number" ||
    requiredVolunteers < 1
  ) {
    errors.push("At least 1 volunteer is required");
  }

  // Resources Validation
  if (Array.isArray(resources)) {
    resources.forEach((resource: any, index: number) => {
      if (!resource.id || typeof resource.id !== "string") {
        errors.push(`Resource ${index + 1}: ID is required`);
      }

      if (
        !resource.name ||
        typeof resource.name !== "string" ||
        resource.name.trim().length === 0
      ) {
        errors.push(`Resource ${index + 1}: Name is required`);
      }

      if (!resource.category || typeof resource.category !== "string") {
        errors.push(`Resource ${index + 1}: Category is required`);
      }

      if (
        !resource.quantity ||
        typeof resource.quantity !== "number" ||
        resource.quantity < 1
      ) {
        errors.push(`Resource ${index + 1}: Valid quantity is required`);
      }

      if (!resource.unit || typeof resource.unit !== "string") {
        errors.push(`Resource ${index + 1}: Unit is required`);
      }

      if (
        resource.estimatedCost === undefined ||
        typeof resource.estimatedCost !== "number" ||
        resource.estimatedCost < 0
      ) {
        errors.push(`Resource ${index + 1}: Valid estimated cost is required`);
      }
    });
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

// Campaign status update validation
export const validateStatusUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { status } = req.body;
  const validStatuses = ["draft", "active", "paused", "completed", "cancelled"];

  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({
      success: false,
      message:
        "Invalid status. Valid statuses are: " + validStatuses.join(", "),
    });
    return;
  }

  next();
};

// Campaign ID parameter validation
export const validateCampaignId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { campaignId } = req.params;

  if (
    !campaignId ||
    typeof campaignId !== "string" ||
    campaignId.trim().length === 0
  ) {
    res.status(400).json({
      success: false,
      message: "Valid campaign ID is required",
    });
    return;
  }

  next();
};
