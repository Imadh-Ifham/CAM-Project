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

type Resources = {
  name: string;
  required: number;
  available: number;
  unit: string;
};

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
  startDate: Date;
  endDate: Date;
  isUrgent: boolean;
  expectedDuration: number; // in days

  // Team
  assignedAgents: string[];
  requiredVolunteers: number;
  skillsRequired: string[];
}

export const mockCampaignDetail: Campaign = {
  campaignID: "1",
  name: "Flood Relief - Colombo",
  description:
    "Emergency flood relief operation providing immediate assistance to affected families in Colombo district. This campaign focuses on distributing essential supplies, temporary shelter, and medical aid.",
  type: "disaster-relief",
  status: "active",
  priority: "critical",
  location: "Colombo, Western Province",
  startDate: "2024-01-15",
  endDate: "2024-02-15",
  volunteers: 25,
  targetVolunteers: 50,
  progress: 75,
  budget: 150000,
  spent: 112500,
  coordinator: {
    name: "Dr. Saman Perera",
    phone: "+94 77 123 4567",
    email: "saman.perera@cam.lk",
  },
  resources: [
    { name: "Food Packets", required: 1000, available: 750, unit: "packets" },
    { name: "Water Bottles", required: 2000, available: 1500, unit: "bottles" },
    { name: "Medical Kits", required: 50, available: 35, unit: "kits" },
    { name: "Tents", required: 100, available: 80, unit: "tents" },
  ],
};

export const initialCampaignFormData: CampaignFormData = {
  name: "",
  description: "",
  type: "disaster-relief",
  priority: "medium",
  district: "",
  city: "",
  resources: [],
  estimatedBudget: 0,
  startDate: new Date(),
  endDate: new Date(),
  isUrgent: false,
  expectedDuration: 7,
  assignedAgents: [],
  requiredVolunteers: 10,
  skillsRequired: [],
};
