import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { colors } from "../../../../src/styles/colors";
import { spacing } from "../../../../src/styles/spacing";
import { typography } from "../../../../src/styles/typography";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../src/components/ui/Card";
import { Button } from "../../../../src/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useGetPendingAgentRequestsQuery } from "../../../../src/store/services/campaignsApi";

type PendingRequest = {
  id: string; // backend ObjectId
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  skills: string[];
  campaignName: string;
  experience: string;
  motivation: string;
  availability: string;
  appliedDate: string; // ISO
};

type ApprovedAgent = {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  campaignName: string;
  campaignType: string;
  role: "Collector" | "Distributor" | "Both";
  joinDate: string;
  status: "active" | "inactive";
  performance: {
    collectionsCompleted: number;
    collectionsTarget: number;
    distributionsCompleted: number;
    distributionsTarget: number;
  };
};

const MOCK = {
  approvedAgents: [
    {
      id: 101,
      name: "John Williams",
      email: "john.williams@email.com",
      phone: "+94 77 456 7890",
      avatar: "",
      campaignName: "Flood Relief - Colombo",
      campaignType: "Disaster Relief",
      role: "Both",
      joinDate: "2024-01-01",
      status: "active",
      performance: {
        collectionsCompleted: 8,
        collectionsTarget: 10,
        distributionsCompleted: 12,
        distributionsTarget: 15,
      },
    },
    {
      id: 102,
      name: "Emma Davis",
      email: "emma.davis@email.com",
      phone: "+94 76 321 0987",
      avatar: "",
      campaignName: "Medical Aid - Kandy",
      campaignType: "Medical Aid",
      role: "Collector",
      joinDate: "2023-12-15",
      status: "active",
      performance: {
        collectionsCompleted: 15,
        collectionsTarget: 18,
        distributionsCompleted: 0,
        distributionsTarget: 0,
      },
    },
    {
      id: 103,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+94 71 888 9999",
      avatar: "",
      campaignName: "Education Initiative - Galle",
      campaignType: "Education",
      role: "Distributor",
      joinDate: "2024-01-03",
      status: "active",
      performance: {
        collectionsCompleted: 0,
        collectionsTarget: 0,
        distributionsCompleted: 6,
        distributionsTarget: 8,
      },
    },
  ] as ApprovedAgent[],
};

const ProgressBar = ({
  percent,
  color,
}: {
  percent: number;
  color: string;
}) => (
  <View style={{ height: 8, backgroundColor: "#1f2937", borderRadius: 999 }}>
    <View
      style={{
        width: `${Math.min(100, Math.max(0, percent))}%`,
        height: 8,
        backgroundColor: color,
        borderRadius: 999,
      }}
    />
  </View>
);

export default function AgentsList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [roleFilter, setRoleFilter] = useState<
    "all" | "collector" | "distributor" | "both"
  >("all");
  const [campaignFilter, setCampaignFilter] = useState<string>("all");
  const [showFilter, setShowFilter] = useState(false);
  // Load pending requests from server
  const {
    data: pendingServer,
    isFetching: isFetchingPending,
    error: pendingError,
  } = useGetPendingAgentRequestsQuery();

  const pendingMapped: PendingRequest[] = useMemo(() => {
    if (!pendingServer) return [];
    return pendingServer.map((r: any) => ({
      id: String(r._id || `${r.agentId}-${r.campaignId}`),
      name: r.agent?.fullName || r.agentId || "Unknown Agent",
      email: r.agent?.email || "",
      phone: r.agent?.phoneNumber || "",
      avatar: "",
      skills: [],
      campaignName: r.campaign?.name || r.campaignId,
      experience: r.experience || "",
      motivation: r.motivation || "",
      availability: r.availability || "",
      appliedDate: r.createdAt
        ? new Date(r.createdAt).toISOString().slice(0, 10)
        : "",
    }));
  }, [pendingServer]);

  const [approved, setApproved] = useState<ApprovedAgent[]>(
    MOCK.approvedAgents
  );

  const filteredPending = useMemo(
    () =>
      pendingMapped.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.email.toLowerCase().includes(search.toLowerCase()) ||
          r.campaignName.toLowerCase().includes(search.toLowerCase())
      ),
    [pendingMapped, search]
  );

  const filteredApproved = useMemo(() => {
    return approved.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      const matchesRole =
        roleFilter === "all" || a.role.toLowerCase() === roleFilter;
      const matchesCampaign =
        campaignFilter === "all" ||
        a.campaignName.toLowerCase().includes(campaignFilter.toLowerCase());
      return matchesSearch && matchesStatus && matchesRole && matchesCampaign;
    });
  }, [approved, search, statusFilter, roleFilter, campaignFilter]);

  const approve = (id: string) => {
    Alert.alert("Approve", `Approve request ${id} (coming soon)`);
  };

  const rejectReq = (id: string) => {
    Alert.alert("Reject", `Reject request ${id} (coming soon)`);
  };

  const openAgent = (agent: ApprovedAgent) => {
    router.push({
      pathname: "/adminDashboard/components/agents/ApprovedAgent",
      params: { id: String(agent.id) },
    } as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0f15" }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          gap: spacing.lg,
          paddingBottom: spacing.xl,
        }}
      >
        {/* Pending fetch error banner */}
        {pendingError ? (
          <View
            style={{
              padding: spacing.md,
              borderRadius: 12,
              backgroundColor: "#fee2e2",
              borderWidth: 1,
              borderColor: "#ef4444",
            }}
          >
            <Text style={{ color: "#991b1b", fontWeight: "700" }}>
              Failed to load pending agent requests
            </Text>
            <Text style={{ color: "#991b1b" }}>
              {(() => {
                const err: any = pendingError as any;
                const status = err?.status || err?.originalStatus;
                const detail =
                  typeof err?.data === "string"
                    ? err.data
                    : JSON.stringify(err?.data);
                return `Status ${status || "unknown"}${
                  detail ? `: ${detail}` : ""
                }`;
              })()}
            </Text>
          </View>
        ) : null}
        {/* Header */}
        <View style={{ marginTop: spacing.md }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              style={{ padding: 8, marginRight: 8 }}
            >
              <Ionicons name="chevron-back" size={20} color="#d1d5db" />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={[typography.h2, { color: "#fff" }]}>
                Agent Management
              </Text>
              <Text style={{ color: "#9ca3af", marginTop: 2 }}>
                Manage campaign agents and activities
              </Text>
            </View>
          </View>
        </View>

        {/* Search + Filter */}
        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <View style={{ flex: 1, position: "relative" }}>
            <Ionicons
              name="search"
              size={16}
              color="#9ca3af"
              style={{ position: "absolute", left: 12, top: 14 }}
            />
            <TextInput
              placeholder="Search agents..."
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
              style={{
                height: 44,
                backgroundColor: "#111827",
                borderColor: "#374151",
                borderWidth: 1,
                borderRadius: 12,
                paddingLeft: 36,
                paddingRight: 12,
                color: "#fff",
              }}
            />
          </View>
          <Button variant="outline" onPress={() => setShowFilter(true)}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Ionicons name="filter" size={16} color={colors.cardForeground} />
              <Text style={{ color: colors.cardForeground, fontWeight: "700" }}>
                Filter
              </Text>
            </View>
          </Button>
        </View>

        {/* Summary Panel */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Card
            style={{
              width: "48%",
              marginBottom: spacing.md,
              borderRadius: 12,
              backgroundColor: "#111827",
              borderColor: "#374151",
              borderWidth: 1,
            }}
          >
            <CardContent style={{ padding: spacing.md }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                    Active Agents
                  </Text>
                  <Text
                    style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}
                  >
                    {filteredApproved.length}
                  </Text>
                  <Text style={{ color: "#6b7280", fontSize: 12 }}>
                    3 campaigns
                  </Text>
                </View>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#10b98133",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="people" size={18} color="#34d399" />
                </View>
              </View>
            </CardContent>
          </Card>
          <Card
            style={{
              width: "48%",
              marginBottom: spacing.md,
              borderRadius: 12,
              backgroundColor: "#111827",
              borderColor: "#374151",
              borderWidth: 1,
            }}
          >
            <CardContent style={{ padding: spacing.md }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                    Pending Requests
                  </Text>
                  <Text
                    style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}
                  >
                    {filteredPending.length}
                  </Text>
                  <Text style={{ color: "#6b7280", fontSize: 12 }}>
                    Awaiting approval
                  </Text>
                </View>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#f59e0b33",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="time" size={18} color="#fbbf24" />
                </View>
              </View>
            </CardContent>
          </Card>
          <Card
            style={{
              width: "48%",
              marginBottom: spacing.md,
              borderRadius: 12,
              backgroundColor: "#111827",
              borderColor: "#374151",
              borderWidth: 1,
            }}
          >
            <CardContent style={{ padding: spacing.md }}>
              <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                Collections
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 6,
                  marginBottom: 6,
                }}
              >
                <View>
                  <Text
                    style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}
                  >
                    134
                  </Text>
                  <Text style={{ color: "#9ca3af", fontSize: 12 }}>of 156</Text>
                </View>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#1d4ed833",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="cube-outline" size={18} color="#93c5fd" />
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "#9ca3af", fontSize: 12 }}>Progress</Text>
                <Text style={{ color: "#22c55e", fontSize: 12 }}>86%</Text>
              </View>
              <ProgressBar percent={86} color="#10b981" />
            </CardContent>
          </Card>
          <Card
            style={{
              width: "48%",
              marginBottom: spacing.md,
              borderRadius: 12,
              backgroundColor: "#111827",
              borderColor: "#374151",
              borderWidth: 1,
            }}
          >
            <CardContent style={{ padding: spacing.md }}>
              <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                Distributions
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 6,
                  marginBottom: 6,
                }}
              >
                <View>
                  <Text
                    style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}
                  >
                    78
                  </Text>
                  <Text style={{ color: "#9ca3af", fontSize: 12 }}>of 89</Text>
                </View>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#6d28d933",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="bus-outline" size={18} color="#c4b5fd" />
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "#9ca3af", fontSize: 12 }}>Progress</Text>
                <Text style={{ color: "#22c55e", fontSize: 12 }}>88%</Text>
              </View>
              <ProgressBar percent={88} color="#10b981" />
            </CardContent>
          </Card>
        </View>

        {/* Pending Requests Section */}
        <Card
          style={{
            borderRadius: 16,
            backgroundColor: "#0f172a",
            borderColor: "#1f2937",
            borderWidth: 1,
          }}
        >
          <CardHeader>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: "#3b82f633",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="calendar-outline" size={14} color="#60a5fa" />
              </View>
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Pending Agent Requests
              </Text>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 999,
                  backgroundColor: "#1e3a8a",
                }}
              >
                <Text style={{ color: "#60a5fa", fontSize: 12 }}>
                  {filteredPending.length} Pending
                </Text>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            {filteredPending.length === 0 ? (
              <View
                style={{ alignItems: "center", paddingVertical: spacing.lg }}
              >
                <Ionicons name="calendar-outline" size={40} color="#6b7280" />
                <Text style={{ color: "#9ca3af", marginTop: spacing.sm }}>
                  No pending requests at the moment
                </Text>
              </View>
            ) : (
              <View style={{ gap: spacing.md }}>
                {filteredPending.map((r) => (
                  <View
                    key={r.id}
                    style={{
                      backgroundColor: "#111827",
                      borderColor: "#374151",
                      borderWidth: 1,
                      borderRadius: 12,
                      padding: spacing.md,
                    }}
                  >
                    {/* Header */}
                    <View
                      style={{
                        flexDirection: "row",
                        gap: spacing.md,
                        marginBottom: spacing.sm,
                      }}
                    >
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor: "#1f2937",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        <Ionicons name="person" size={20} color="#9ca3af" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#fff", fontWeight: "700" }}>
                          {r.name}
                        </Text>
                        <View
                          style={{
                            marginTop: 4,
                            alignSelf: "flex-start",
                            backgroundColor: "#f59e0b33",
                            borderRadius: 999,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                          }}
                        >
                          <Text style={{ color: "#fbbf24", fontSize: 12 }}>
                            Pending Approval
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Contact */}
                    <View style={{ gap: 6, marginBottom: spacing.sm }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Ionicons
                          name="mail-outline"
                          size={14}
                          color="#34d399"
                        />
                        <Text style={{ color: "#d1d5db" }}>{r.email}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Ionicons
                          name="call-outline"
                          size={14}
                          color="#34d399"
                        />
                        <Text style={{ color: "#d1d5db" }}>{r.phone}</Text>
                      </View>
                    </View>

                    {/* Campaign */}
                    <View style={{ marginBottom: spacing.sm }}>
                      <Text
                        style={{
                          color: "#9ca3af",
                          fontSize: 12,
                          marginBottom: 4,
                        }}
                      >
                        Requesting to join:
                      </Text>
                      <Text style={{ color: "#fff" }}>{r.campaignName}</Text>
                    </View>

                    {/* Details */}
                    <View style={{ marginBottom: spacing.sm, gap: 10 }}>
                      <Text
                        style={{
                          color: "#9ca3af",
                          fontSize: 12,
                          marginBottom: 2,
                        }}
                      >
                        Details
                      </Text>
                      {/* Availability */}
                      {r.availability ? (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: 8,
                          }}
                        >
                          <Ionicons name="time" size={14} color="#60a5fa" />
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                color: "#cbd5e1",
                                fontSize: 12,
                                marginBottom: 4,
                              }}
                            >
                              Availability
                            </Text>
                            <View
                              style={{
                                alignSelf: "flex-start",
                                backgroundColor: "#1e293b",
                                borderColor: "#334155",
                                borderWidth: 1,
                                paddingHorizontal: 8,
                                paddingVertical: 2,
                                borderRadius: 999,
                              }}
                            >
                              <Text style={{ color: "#93c5fd", fontSize: 12 }}>
                                {r.availability}
                              </Text>
                            </View>
                          </View>
                        </View>
                      ) : null}

                      {/* Experience */}
                      {r.experience ? (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: 8,
                          }}
                        >
                          <Ionicons
                            name="book-outline"
                            size={14}
                            color="#a78bfa"
                          />
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                color: "#cbd5e1",
                                fontSize: 12,
                                marginBottom: 4,
                              }}
                            >
                              Experience
                            </Text>
                            <Text style={{ color: "#e5e7eb" }}>
                              {r.experience}
                            </Text>
                          </View>
                        </View>
                      ) : null}

                      {/* Motivation */}
                      {r.motivation ? (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: 8,
                          }}
                        >
                          <Ionicons
                            name="heart-outline"
                            size={14}
                            color="#f472b6"
                          />
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                color: "#cbd5e1",
                                fontSize: 12,
                                marginBottom: 4,
                              }}
                            >
                              Motivation
                            </Text>
                            <Text style={{ color: "#e5e7eb" }}>
                              {r.motivation}
                            </Text>
                          </View>
                        </View>
                      ) : null}

                      {/* Optional Skills chips if provided */}
                      {r.skills && r.skills.length > 0 ? (
                        <View style={{ marginTop: 4 }}>
                          <Text
                            style={{
                              color: "#9ca3af",
                              fontSize: 12,
                              marginBottom: 6,
                            }}
                          >
                            Skills
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              flexWrap: "wrap",
                              gap: 6,
                            }}
                          >
                            {r.skills.slice(0, 4).map((s, idx) => (
                              <View
                                key={idx}
                                style={{
                                  borderColor: "#4b5563",
                                  borderWidth: 1,
                                  borderRadius: 999,
                                  paddingHorizontal: 8,
                                  paddingVertical: 2,
                                }}
                              >
                                <Text
                                  style={{ color: "#d1d5db", fontSize: 12 }}
                                >
                                  {s}
                                </Text>
                              </View>
                            ))}
                            {r.skills.length > 4 && (
                              <View
                                style={{
                                  borderColor: "#4b5563",
                                  borderWidth: 1,
                                  borderRadius: 999,
                                  paddingHorizontal: 8,
                                  paddingVertical: 2,
                                }}
                              >
                                <Text
                                  style={{ color: "#d1d5db", fontSize: 12 }}
                                >
                                  +{r.skills.length - 4} more
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      ) : null}
                    </View>

                    {/* Applied date */}
                    <Text
                      style={{
                        color: "#9ca3af",
                        fontSize: 12,
                        marginBottom: spacing.md,
                      }}
                    >
                      Applied: {new Date(r.appliedDate).toLocaleDateString()}
                    </Text>

                    {/* Actions */}
                    <View style={{ flexDirection: "row", gap: spacing.md }}>
                      <Button
                        onPress={() => approve(r.id)}
                        style={{ flex: 1, backgroundColor: "#16a34a" }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                          }}
                        >
                          <Ionicons name="checkmark" size={16} color="#fff" />
                          <Text style={{ color: "#fff", fontWeight: "700" }}>
                            Approve
                          </Text>
                        </View>
                      </Button>
                      <Button
                        onPress={() => rejectReq(r.id)}
                        variant="outline"
                        style={{
                          flex: 1,
                          backgroundColor: "#ef444433",
                          borderColor: "#ef4444",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                          }}
                        >
                          <Ionicons name="close" size={16} color="#fff" />
                          <Text style={{ color: "#fff", fontWeight: "700" }}>
                            Reject
                          </Text>
                        </View>
                      </Button>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </CardContent>
        </Card>

        {/* Approved Agents */}
        <Card
          style={{
            borderRadius: 16,
            backgroundColor: "#0f172a",
            borderColor: "#1f2937",
            borderWidth: 1,
          }}
        >
          <CardHeader>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: "#16a34a33",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={14}
                  color="#22c55e"
                />
              </View>
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Approved Agents
              </Text>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 999,
                  backgroundColor: "#064e3b",
                }}
              >
                <Text style={{ color: "#22c55e", fontSize: 12 }}>
                  {filteredApproved.length} Active
                </Text>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            {filteredApproved.length === 0 ? (
              <View
                style={{ alignItems: "center", paddingVertical: spacing.lg }}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={40}
                  color="#6b7280"
                />
                <Text style={{ color: "#9ca3af", marginTop: spacing.sm }}>
                  No approved agents found
                </Text>
              </View>
            ) : (
              <View style={{ gap: spacing.md }}>
                {filteredApproved.map((a) => (
                  <Pressable
                    key={a.id}
                    onPress={() => openAgent(a)}
                    style={{
                      backgroundColor: "#111827",
                      borderColor: "#374151",
                      borderWidth: 1,
                      borderRadius: 12,
                    }}
                  >
                    <View
                      style={{
                        padding: spacing.md,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: spacing.md,
                        }}
                      >
                        <View
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: "#1f2937",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                          }}
                        >
                          <Ionicons name="person" size={20} color="#9ca3af" />
                        </View>
                        <View style={{ minWidth: 0 }}>
                          <Text style={{ color: "#fff", fontWeight: "700" }}>
                            {a.name}
                          </Text>
                          <Text
                            numberOfLines={1}
                            style={{
                              color: "#9ca3af",
                              fontSize: 12,
                              marginTop: 4,
                            }}
                          >
                            {a.campaignName}
                          </Text>
                        </View>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text
                          style={{
                            color: "#34d399",
                            fontWeight: "700",
                            fontSize: 12,
                          }}
                        >
                          {a.performance.collectionsCompleted}/
                          {a.performance.collectionsTarget}
                        </Text>
                        <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                          Collections
                        </Text>
                        <Text
                          style={{
                            color: "#60a5fa",
                            fontWeight: "700",
                            fontSize: 12,
                            marginTop: 4,
                          }}
                        >
                          {a.performance.distributionsCompleted}/
                          {a.performance.distributionsTarget}
                        </Text>
                        <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                          Distributions
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </CardContent>
        </Card>
      </ScrollView>

      {/* Filter Sheet (Modal) */}
      <Modal
        visible={showFilter}
        onRequestClose={() => setShowFilter(false)}
        transparent
        animationType="slide"
      >
        <Pressable
          onPress={() => setShowFilter(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View
                style={{
                  backgroundColor: "#111827",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  padding: spacing.lg,
                  borderColor: "#374151",
                  borderWidth: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: spacing.md,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    Filter Agents
                  </Text>
                  <Button
                    variant="ghost"
                    onPress={() => {
                      setStatusFilter("all");
                      setRoleFilter("all");
                      setCampaignFilter("all");
                    }}
                  >
                    <Text style={{ color: "#f87171", fontWeight: "700" }}>
                      Clear All
                    </Text>
                  </Button>
                </View>

                {/* Status */}
                <Text
                  style={{ color: "#fff", fontWeight: "700", marginBottom: 6 }}
                >
                  Status
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    marginBottom: spacing.md,
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    { v: "all", label: "All Status" },
                    { v: "active", label: "Active" },
                    { v: "inactive", label: "Inactive" },
                  ].map((o) => {
                    const selected = statusFilter === (o.v as any);
                    return (
                      <Button
                        key={o.v}
                        variant="outline"
                        onPress={() => setStatusFilter(o.v as any)}
                        style={{
                          backgroundColor: selected ? "#16a34a" : undefined,
                          borderColor: selected ? "#16a34a" : undefined,
                        }}
                      >
                        <Text
                          style={{
                            color: selected ? colors.card : "#d1d5db",
                            fontWeight: "700",
                          }}
                        >
                          {o.label}
                        </Text>
                      </Button>
                    );
                  })}
                </View>

                {/* Role */}
                <Text
                  style={{ color: "#fff", fontWeight: "700", marginBottom: 6 }}
                >
                  Role
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    marginBottom: spacing.md,
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    { v: "all", label: "All Roles" },
                    { v: "collector", label: "Collector" },
                    { v: "distributor", label: "Distributor" },
                    { v: "both", label: "Both" },
                  ].map((o) => {
                    const selected = roleFilter === (o.v as any);
                    return (
                      <Button
                        key={o.v}
                        variant="outline"
                        onPress={() => setRoleFilter(o.v as any)}
                        style={{
                          backgroundColor: selected ? "#16a34a" : undefined,
                          borderColor: selected ? "#16a34a" : undefined,
                        }}
                      >
                        <Text
                          style={{
                            color: selected ? colors.card : "#d1d5db",
                            fontWeight: "700",
                          }}
                        >
                          {o.label}
                        </Text>
                      </Button>
                    );
                  })}
                </View>

                {/* Campaign */}
                <Text
                  style={{ color: "#fff", fontWeight: "700", marginBottom: 6 }}
                >
                  Campaign
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    marginBottom: spacing.md,
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    { v: "all", label: "All Campaigns" },
                    { v: "flood", label: "Flood Relief" },
                    { v: "medical", label: "Medical Aid" },
                    { v: "education", label: "Education" },
                  ].map((o) => {
                    const selected = campaignFilter === o.v;
                    return (
                      <Button
                        key={o.v}
                        variant="outline"
                        onPress={() => setCampaignFilter(o.v)}
                        style={{
                          backgroundColor: selected ? "#16a34a" : undefined,
                          borderColor: selected ? "#16a34a" : undefined,
                        }}
                      >
                        <Text
                          style={{
                            color: selected ? colors.card : "#d1d5db",
                            fontWeight: "700",
                          }}
                        >
                          {o.label}
                        </Text>
                      </Button>
                    );
                  })}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: spacing.md,
                  }}
                >
                  <Button
                    variant="outline"
                    onPress={() => setShowFilter(false)}
                  >
                    <Text
                      style={{
                        color: colors.cardForeground,
                        fontWeight: "700",
                      }}
                    >
                      Close
                    </Text>
                  </Button>
                </View>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </View>
  );
}
