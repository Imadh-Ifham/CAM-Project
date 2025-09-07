import { useState } from "react";
import { UserCheck, X, Bell, Search, Check, XCircle, User } from "lucide-react";

// Types definition
interface CAMProgram {
  title: string;
  location: string;
  description: string;
  overview: string;
  keyDetails: string[];
  contact: string[];
}

interface Agent {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  status: "pending" | "approved" | "denied";
  avatar?: string;
  notes?: string;
  numVolunteers?: number;
  startDate?: string;
  resources?: string;
  pitchIdea?: string;
  camProgram?: CAMProgram;
}

export default function AgentManagement() {
  // State management
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "denied">(
    "pending"
  );
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState<
    "approve" | "deny" | null
  >(null);
  const [denyReason, setDenyReason] = useState("");

  // Mock data
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Ahmed Khan",
      email: "ahmed.khan@example.com",
      registrationDate: "2025-08-28",
      status: "pending",
      notes: "Wants to help in the northern region distribution",
      numVolunteers: 10,
      startDate: "2025-09-15",
      resources: "100 packs of clothes, 2 vehicles",
      pitchIdea:
        "I plan to organize a team of volunteers to collect, sort, and distribute clothes to families in need in the northern region. We will coordinate with local authorities and use our vehicles for efficient delivery. Our goal is to reach at least 100 families in the first month.",
      camProgram: {
        title: "Clothing Drive",
        location: "Colombo, Sri Lanka",
        description: "Collecting and distributing clothes to families in need.",
        overview:
          "This program is part of CAM's ongoing initiatives to support communities in need. All activities are coordinated by registered agents and volunteers. For more information, contact your local CAM office or visit our website.",
        keyDetails: [
          "Target Area: Colombo, Sri Lanka",
          "Program Type: Clothing Drive",
          "Status: Active",
          "Last Updated: September 2025",
        ],
        contact: ["Email: info@cam.org", "Phone: +94 11 123 4567"],
      },
    },
    {
      id: "2",
      name: "Fatima Hassan",
      email: "fatima.h@example.com",
      registrationDate: "2025-09-01",
      status: "pending",
      notes: "Experienced in community support",
      numVolunteers: 5,
      startDate: "2025-09-20",
      resources: "Food packs, 1 van",
      pitchIdea:
        "I will mobilize local volunteers to distribute food packs to low-income families. We'll ensure fair distribution and keep records for transparency.",
      camProgram: {
        title: "Food Distribution",
        location: "Gampaha, Sri Lanka",
        description:
          "Distributing essential food items to low-income families.",
        overview:
          "This program aims to provide food security to vulnerable communities in Gampaha. Volunteers will coordinate with local leaders to identify families in need and distribute food packs efficiently. All activities are monitored for transparency and impact.",
        keyDetails: [
          "Target Area: Gampaha, Sri Lanka",
          "Program Type: Food Distribution",
          "Status: Active",
          "Last Updated: September 2025",
        ],
        contact: ["Email: food@cam.org", "Phone: +94 11 987 6543"],
      },
    },
    {
      id: "3",
      name: "Mohammed Ali",
      email: "m.ali@example.com",
      registrationDate: "2025-08-15",
      status: "approved",
      notes: "Works with local NGO",
      numVolunteers: 8,
      startDate: "2025-08-20",
      resources: "Medical kits, 1 ambulance",
      pitchIdea:
        "I will coordinate with local health workers to provide basic medical aid in remote areas.",
    },
    {
      id: "4",
      name: "Aisha Patel",
      email: "aisha@example.com",
      registrationDate: "2025-08-10",
      status: "denied",
      notes: "Incomplete registration details",
    },
  ]);

  // Filter agents based on active tab
  const filteredAgents = agents.filter((agent) => agent.status === activeTab);

  // Handle agent status change
  const handleStatusChange = (id: string, newStatus: "approved" | "denied") => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id ? { ...agent, status: newStatus } : agent
      )
    );
    setShowConfirmModal(null);
    setShowDetailsModal(false);
    setDenyReason("");
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6 w-full" style={{ background: "#23272f" }}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cam-green-500 mb-2 animate-fadeIn">
            Manage Agent Requests
          </h1>
          <p
            className="text-gray-400 animate-fadeIn"
            style={{ animationDelay: "0.1s" }}
          >
            Review and approve/deny agents who requested to join the CAM
            Community.
          </p>
        </div>
        <div className="relative">
          <button className="p-2 bg-cam-bg-800 rounded-full text-gray-400 hover:text-cam-green-500 transition-colors">
            <Bell size={22} />
            <span className="absolute top-0 right-0 w-3 h-3 bg-cam-green-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 mb-6 animate-slideInFromTop border-b border-gray-800"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex gap-6">
          <TabButton
            active={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
          >
            Pending
            <span className="ml-2 text-amber-400">
              {agents.filter((a) => a.status === "pending").length}
            </span>
          </TabButton>
          <TabButton
            active={activeTab === "approved"}
            onClick={() => setActiveTab("approved")}
          >
            Approved
            <span className="ml-2 text-green-400">
              {agents.filter((a) => a.status === "approved").length}
            </span>
          </TabButton>
          <TabButton
            active={activeTab === "denied"}
            onClick={() => setActiveTab("denied")}
          >
            Denied
            <span className="ml-2 text-red-400">
              {agents.filter((a) => a.status === "denied").length}
            </span>
          </TabButton>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search agents..."
            className="pl-10 pr-4 py-2 bg-black border border-gray-800 rounded-lg text-white w-64 focus:outline-none focus:border-cam-green-500 transition-colors"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
        </div>
      </div>

      <div className="py-4"></div>

      {/* Agent List */}
      <div className="space-y-4 mb-6">
        {filteredAgents.length > 0 ? (
          filteredAgents.map((agent, index) => (
            <div
              key={agent.id}
              className="p-6 rounded-xl border border-gray-800 shadow-md hover:border-gray-700 transition-colors"
              style={{
                background: "#23272f",
                animationDelay: `${0.2 + index * 0.1}s`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-cam-green-500">
                    {agent.avatar ? (
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div>
                    <button
                      className="text-white hover:text-cam-green-500 font-medium transition-colors text-lg"
                      onClick={() => {
                        setSelectedAgent(agent);
                        setShowDetailsModal(true);
                      }}
                    >
                      {agent.name}
                    </button>
                    <p className="text-gray-400 text-sm">Agent Request</p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-gray-400 text-xs">{agent.email}</p>
                      <p className="text-gray-500 text-xs">
                        Registered: {formatDate(agent.registrationDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {agent.status === "pending" ? (
                    <>
                      <button
                        onClick={() => {
                          setSelectedAgent(agent);
                          setShowConfirmModal("approve");
                        }}
                        className="px-4 py-2 bg-cam-green-500 text-white rounded-lg hover:bg-cam-green-400 transition-colors flex items-center gap-2"
                      >
                        <Check size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAgent(agent);
                          setShowConfirmModal("deny");
                        }}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                      >
                        <X size={16} />
                        Deny
                      </button>
                    </>
                  ) : agent.status === "approved" ? (
                    <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-lg flex items-center gap-2">
                      <Check size={16} />
                      Approved
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-900/30 text-red-400 rounded-lg flex items-center gap-2">
                      <XCircle size={16} />
                      Denied
                    </span>
                  )}
                  <button
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    onClick={() => {
                      setSelectedAgent(agent);
                      setShowDetailsModal(true);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className="p-8 rounded-xl border border-gray-800 shadow-md text-center"
            style={{ background: "#23272f" }}
          >
            <div className="flex flex-col items-center justify-center py-8">
              <UserCheck className="text-gray-600 mb-4" size={48} />
              <h3 className="text-xl font-medium text-white">
                No {activeTab} agent requests
              </h3>
              <p className="text-gray-400 mt-1">
                {activeTab === "pending"
                  ? "When new agents request to join, they will appear here."
                  : activeTab === "approved"
                  ? "Approved agents will be listed here."
                  : "Denied agent requests will be listed here."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity Panel */}
      <div
        className="mt-8 p-5 rounded-xl border border-gray-800 shadow-md"
        style={{ background: "#23272f" }}
      >
        <h3 className="text-lg font-medium text-cam-green-500 mb-3">
          Recent Actions
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 py-2 border-b border-gray-800">
            <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
              <Check size={16} />
            </div>
            <div>
              <p className="text-sm text-white">Mohammed Ali was approved</p>
              <p className="text-xs text-gray-400">Today at 10:45 AM</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-2 border-b border-gray-800">
            <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
              <X size={16} />
            </div>
            <div>
              <p className="text-sm text-white">Aisha Patel was denied</p>
              <p className="text-xs text-gray-400">
                August 25, 2025 at 2:30 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Details Modal */}
      {showDetailsModal && selectedAgent && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "#23272f" }}
        >
          <div
            className="rounded-xl border border-gray-800 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            style={{ background: "#23272f" }}
          >
            <div className="flex items-center justify-between border-b border-gray-800 p-5">
              <h2 className="text-xl font-bold text-white">Agent Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-cam-green-500">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">
                    {selectedAgent.name}
                  </h3>
                  <p className="text-gray-400">Agent Request</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Email
                  </h4>
                  <p className="text-white font-medium">
                    {selectedAgent.email}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Registration Date
                  </h4>
                  <p className="text-white font-medium">
                    {formatDate(selectedAgent.registrationDate)}
                  </p>
                </div>
                {selectedAgent.numVolunteers !== undefined && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Number of Volunteers
                    </h4>
                    <p className="text-white font-medium">
                      {selectedAgent.numVolunteers}
                    </p>
                  </div>
                )}
                {selectedAgent.startDate && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Start Date
                    </h4>
                    <p className="text-white font-medium">
                      {formatDate(selectedAgent.startDate)}
                    </p>
                  </div>
                )}
                {selectedAgent.resources && (
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Resources/Quantity
                    </h4>
                    <p className="text-white font-medium">
                      {selectedAgent.resources}
                    </p>
                  </div>
                )}
                {selectedAgent.pitchIdea && (
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Pitch Idea
                    </h4>
                    <p className="text-white p-4">{selectedAgent.pitchIdea}</p>
                  </div>
                )}
              </div>

              {/* CAM Program Card if available */}
              {selectedAgent.camProgram && (
                <div className="mb-6">
                  <div className="rounded-xl p-5 bg-green-900/10 border border-green-700 shadow-md">
                    <h3 className="text-xl font-bold text-green-400 mb-2">
                      {selectedAgent.camProgram.title}
                    </h3>
                    <p className="mb-1">
                      <span className="font-semibold text-yellow-400">
                        Location:
                      </span>{" "}
                      {selectedAgent.camProgram.location}
                    </p>
                    <p className="mb-2 text-white">
                      {selectedAgent.camProgram.description}
                    </p>
                    <h4 className="text-green-300 font-semibold mb-1 mt-3">
                      Program Overview:
                    </h4>
                    <p className="text-white mb-2">
                      {selectedAgent.camProgram.overview}
                    </p>
                    <h4 className="text-green-300 font-semibold mb-1 mt-3">
                      Key Details:
                    </h4>
                    <ul className="text-white mb-2 list-disc list-inside">
                      {selectedAgent.camProgram.keyDetails.map(
                        (detail, idx) => (
                          <li key={idx}>{detail}</li>
                        )
                      )}
                    </ul>
                    <h4 className="text-green-300 font-semibold mb-1 mt-3">
                      Contact:
                    </h4>
                    <ul className="text-white">
                      {selectedAgent.camProgram.contact.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Registration Notes
                </h4>
                <p className="text-white p-4">
                  {selectedAgent.notes || "No notes provided"}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Supporting Documents
                </h4>
                <div className="text-center py-4 text-gray-500">
                  <p>No documents uploaded</p>
                </div>
              </div>

              {selectedAgent.status === "pending" && (
                <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-800">
                  <button
                    onClick={() => setShowConfirmModal("deny")}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <X size={16} />
                    Deny Request
                  </button>
                  <button
                    onClick={() => setShowConfirmModal("approve")}
                    className="px-6 py-2.5 bg-cam-green-500 text-white rounded-lg hover:bg-cam-green-400 transition-colors flex items-center gap-2"
                  >
                    <Check size={16} />
                    Approve Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      {showConfirmModal && selectedAgent && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "#23272f" }}
        >
          <div
            className="rounded-xl border border-gray-800 shadow-xl w-full max-w-md p-6"
            style={{ background: "#23272f" }}
          >
            <div className="text-center mb-6">
              {showConfirmModal === "approve" ? (
                <>
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-4">
                    <Check size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Approve Agent Request
                  </h3>
                  <p className="text-gray-400 mt-2">
                    Are you sure you want to approve {selectedAgent.name} as a
                    CAM Agent?
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
                    <X size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Deny Agent Request
                  </h3>
                  <p className="text-gray-400 mt-2">
                    Are you sure you want to deny {selectedAgent.name}'s
                    request?
                  </p>
                </>
              )}
            </div>

            {showConfirmModal === "deny" && (
              <div className="mb-6">
                <label
                  htmlFor="denyReason"
                  className="block text-sm text-gray-400 mb-2"
                >
                  Reason for denial (optional)
                </label>
                <textarea
                  id="denyReason"
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-cam-green-500 transition-colors"
                  rows={3}
                ></textarea>
              </div>
            )}

            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-800">
              <button
                onClick={() => setShowConfirmModal(null)}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleStatusChange(
                    selectedAgent.id,
                    showConfirmModal === "approve" ? "approved" : "denied"
                  )
                }
                className={`px-6 py-2.5 text-white rounded-lg flex items-center gap-2 ${
                  showConfirmModal === "approve"
                    ? "bg-cam-green-500 hover:bg-cam-green-400"
                    : "bg-red-500 hover:bg-red-400"
                }`}
              >
                {showConfirmModal === "approve" ? (
                  <>
                    <Check size={16} />
                    Confirm
                  </>
                ) : (
                  <>
                    <X size={16} />
                    Confirm
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Tab Button Component
interface TabButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function TabButton({ children, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 flex items-center justify-center transition-colors ${
        active
          ? "text-white border-b-2 border-cam-green-500"
          : "text-gray-400 hover:text-gray-300"
      }`}
    >
      {children}
    </button>
  );
}
