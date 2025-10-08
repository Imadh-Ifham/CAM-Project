export interface CampaignFormData {
  // Basic Info
  name: string;
  description: string;
  type:
    | "disaster-relief"
    | "medical-aid"
    | "education"
    | "food-distribution"
    | "emergency-response";
  priority: "low" | "medium" | "high" | "critical";

  // Location
  district: string;
  city: string;

  // Resources
  resources: Array<{
    id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    estimatedCost: number;
    description?: string;
  }>;
  estimatedBudget: number;

  // Schedule
  startDate: string;
  endDate: string;
  isUrgent: boolean;
  expectedDuration: number; // in days

  // Team
  requiredVolunteers: number;
  skillsRequired: string[];
}
