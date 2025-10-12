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
    {
      id: "1",
      name: "Food Packets",
      category: "food",
      requiredQuantity: 1000,
      availableQuantity: 750,
      unit: "packets",
    },
    {
      id: "2",
      name: "Water Bottles",
      category: "water",
      requiredQuantity: 2000,
      availableQuantity: 1500,
      unit: "bottles",
    },
    {
      id: "3",
      name: "Medical Kits",
      category: "medical",
      requiredQuantity: 50,
      availableQuantity: 35,
      unit: "kits",
    },
    {
      id: "4",
      name: "Tents",
      category: "shelter",
      requiredQuantity: 100,
      availableQuantity: 80,
      unit: "tents",
    },
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
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  isUrgent: false,
  expectedDuration: 7,
  requiredVolunteers: 10,
  skillsRequired: [],
};

export type CampaignList = {
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
};

// Mock campaign data
export const mockCampaignList: CampaignList[] = [
  {
    id: "1",
    name: "Flood Relief - Colombo",
    type: "disaster-relief",
    status: "active",
    priority: "critical",
    location: "Colombo, Western Province",
    startDate: "2024-01-15",
    volunteers: 25,
    progress: 75,
    budget: 150000,
  },
  {
    id: "2",
    name: "Medical Aid - Kandy",
    type: "medical-aid",
    status: "planning",
    priority: "high",
    location: "Kandy, Central Province",
    startDate: "2024-01-20",
    volunteers: 12,
    progress: 30,
    budget: 80000,
  },
  {
    id: "3",
    name: "Education Support - Jaffna",
    type: "education",
    status: "completed",
    priority: "medium",
    location: "Jaffna, Northern Province",
    startDate: "2024-01-10",
    volunteers: 8,
    progress: 100,
    budget: 45000,
  },
];
