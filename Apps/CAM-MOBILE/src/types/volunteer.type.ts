import { Agent } from "./agent.type";

export interface Volunteer {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  joinDate: string;
}

export interface TeamMembers {
  campaignID: String;
  coordinator: Agent;
  volunteers: Volunteer[];
}

export const mockTeamMembers: TeamMembers = {
  campaignID: "1234",
  coordinator: {
    id: "1",
    name: "Dr. Saman Perera",
    role: "Campaign Coordinator",
    phone: "+94 77 123 4567",
    email: "saman.perera@cam.lk",
    status: "active",
    joinDate: "2024-01-15",
  },
  volunteers: [
    {
      id: "1",
      name: "Dr. Saman Perera",
      role: "Campaign Coordinator",
      phone: "+94 77 123 4567",
      email: "saman.perera@cam.lk",
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Nimal Silva",
      role: "Field Supervisor",
      phone: "+94 71 234 5678",
      email: "nimal.silva@cam.lk",
      status: "active",
      joinDate: "2024-01-16",
    },
    {
      id: "3",
      name: "Kamala Jayawardena",
      role: "Medical Officer",
      phone: "+94 76 345 6789",
      email: "kamala.j@cam.lk",
      status: "active",
      joinDate: "2024-01-18",
    },
    {
      id: "4",
      name: "Ruwan Fernando",
      role: "Logistics Coordinator",
      phone: "+94 78 456 7890",
      email: "ruwan.fernando@cam.lk",
      status: "inactive",
      joinDate: "2024-01-20",
    },
  ],
};
