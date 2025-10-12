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
  resources: Resources[];
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

export type CampaignListResponseType = Array<{
  id: string;
  name: string;
  type: string;
  status: string;
  priority: string;
  location: string;
  startDate: string;
  volunteers: number;
  progress: number;
  budget: number;
}>;

// Full Campaign type for detailed responses (matches frontend Campaign type)
export type Campaign = {
  campaignID: string;
  name: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  location: string;
  startDate: string;
  endDate: string;
  volunteers: number;
  targetVolunteers: number;
  progress: number;
  budget: number;
  spent: number;
  coordinator: {
    name: string;
    phone: string;
    email: string;
  };
  resources: Resources[];
};

export type Resources = {
  id: string;
  name: string;
  category: string;
  requiredQuantity: number;
  availableQuantity: number;
  unit: string;
};
