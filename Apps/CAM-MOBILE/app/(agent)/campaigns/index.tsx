import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../src/styles/colors";
import { spacing } from "../../../src/styles/spacing";
import { typography } from "../../../src/styles/typography";
import { Card, CardContent, CardHeader } from "../../../src/components/ui/Card";
import { Button } from "../../../src/components/ui/Button";

type Campaign = {
  id: number;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Available" | "Completed";
  agentRoleRequired: "Collector" | "Distributor" | "Both";
  volunteersNeeded: number;
  resourceNeeds: { food: number; clothes: number; funds: number };
  taskTypes?: string;
};

const CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    name: "Winter Relief 2024",
    status: "Active",
    description: "Emergency winter supplies for affected families",
    location: "Downtown Community Center",
    startDate: "2024-01-15",
    endDate: "2024-02-28",
    agentRoleRequired: "Both",
    volunteersNeeded: 20,
    resourceNeeds: { food: 500, clothes: 200, funds: 10000 },
    taskTypes: "Collection, packaging, delivery",
  },
  {
    id: 2,
    name: "Flood Response",
    status: "Available",
    description: "Flood relief operations in affected areas",
    location: "Regional Emergency Center",
    startDate: "2024-02-01",
    endDate: "2024-03-15",
    agentRoleRequired: "Distributor",
    volunteersNeeded: 15,
    resourceNeeds: { food: 300, clothes: 150, funds: 8000 },
    taskTypes: "Emergency distribution, logistics",
  },
  {
    id: 3,
    name: "Community Health Drive",
    status: "Available",
    description: "Medical supplies and health awareness campaign",
    location: "City Medical Center",
    startDate: "2024-03-01",
    endDate: "2024-04-15",
    agentRoleRequired: "Collector",
    volunteersNeeded: 12,
    resourceNeeds: { food: 0, clothes: 50, funds: 5000 },
    taskTypes: "Medical supply collection, community outreach",
  },
  {
    id: 4,
    name: "Emergency Shelter Setup",
    status: "Completed",
    description: "Temporary shelter establishment for displaced families",
    location: "West Side Community",
    startDate: "2023-12-15",
    endDate: "2024-01-15",
    agentRoleRequired: "Both",
    volunteersNeeded: 30,
    resourceNeeds: { food: 800, clothes: 400, funds: 20000 },
    taskTypes: "Setup, maintenance, distribution",
  },
];

const statusPill = (status: Campaign["status"]) => {
  const map: Record<
    Campaign["status"],
    { bg: string; fg: string; label: string }
  > = {
    Active: { bg: "#e6f7ef", fg: "#065f46", label: "Active" },
    Available: { bg: "#e8f0ff", fg: "#1d4ed8", label: "Available" },
    Completed: { bg: "#eef2f4", fg: "#6b7280", label: "Completed" },
  };
  const s = map[status];
  return (
    <View
      style={{
        backgroundColor: s.bg,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
      }}
    >
      <Text style={{ color: s.fg, fontWeight: "700", fontSize: 12 }}>
        {s.label}
      </Text>
    </View>
  );
};

export default function AgentCampaigns() {
  const [filter, setFilter] = useState<
    "all" | "available" | "active" | "completed"
  >("all");

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [joinRequest, setJoinRequest] = useState({
    experience: "",
    motivation: "",
    availability: "",
  });

  const list = useMemo(() => {
    switch (filter) {
      case "active":
        return CAMPAIGNS.filter((c) => c.status === "Active");
      case "available":
        return CAMPAIGNS.filter((c) => c.status === "Available");
      case "completed":
        return CAMPAIGNS.filter((c) => c.status === "Completed");
      default:
        return CAMPAIGNS;
    }
  }, [filter]);

  const FilterPill: React.FC<{
    label: string;
    count?: number;
    active?: boolean;
    tone?: "slate" | "blue" | "green" | "gray";
    onPress: () => void;
  }> = ({ label, count, active, tone = "slate", onPress }) => {
    const tones = {
      slate: {
        bg: active ? "#1f2937" : "#f8fafc",
        fg: active ? "#ffffff" : "#1f2937",
        br: active ? "#1f2937" : colors.border,
      },
      blue: {
        bg: active ? "#2563eb" : "#eef2ff",
        fg: active ? "#ffffff" : "#2563eb",
        br: active ? "#2563eb" : "#bfdbfe",
      },
      green: {
        bg: active ? "#16a34a" : "#ecfdf5",
        fg: active ? "#ffffff" : "#16a34a",
        br: active ? "#16a34a" : "#a7f3d0",
      },
      gray: {
        bg: active ? "#6b7280" : "#f3f4f6",
        fg: active ? "#ffffff" : "#6b7280",
        br: active ? "#6b7280" : colors.border,
      },
    } as const;
    const t = tones[tone];
    return (
      <Button
        variant="outline"
        size="sm"
        onPress={onPress}
        style={{
          height: 40,
          backgroundColor: t.bg,
          borderColor: t.br,
          borderWidth: 1,
          borderRadius: 12,
          paddingHorizontal: spacing.lg,
        }}
        textStyle={{ color: t.fg, fontWeight: "700" }}
      >
        {`${label}${typeof count === "number" ? ` (${count})` : ""}`}
      </Button>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          gap: spacing.lg,
          paddingBottom: spacing.xl,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[typography.h2]}>Campaigns</Text>
          <View
            style={{
              backgroundColor: colors.accent,
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              {CAMPAIGNS.length} Total
            </Text>
          </View>
        </View>

        {/* Filter block */}
        <Card style={{ borderRadius: 16 }}>
          <CardHeader>
            <Text style={[typography.h3]}>Filter Campaigns</Text>
          </CardHeader>
          <CardContent>
            <View
              style={{
                flexDirection: "row",
                gap: spacing.md,
                flexWrap: "wrap",
              }}
            >
              <FilterPill
                label="All"
                count={CAMPAIGNS.length}
                active={filter === "all"}
                tone="slate"
                onPress={() => setFilter("all")}
              />
              <FilterPill
                label="Available"
                count={CAMPAIGNS.filter((c) => c.status === "Available").length}
                active={filter === "available"}
                tone="blue"
                onPress={() => setFilter("available")}
              />
              <FilterPill
                label="Active"
                count={CAMPAIGNS.filter((c) => c.status === "Active").length}
                active={filter === "active"}
                tone="green"
                onPress={() => setFilter("active")}
              />
              <FilterPill
                label="Completed"
                count={CAMPAIGNS.filter((c) => c.status === "Completed").length}
                active={filter === "completed"}
                tone="gray"
                onPress={() => setFilter("completed")}
              />
            </View>
          </CardContent>
        </Card>

        {/* Campaign cards */}
        {list.map((c) => (
          <Card key={c.id} style={{ borderRadius: 16 }}>
            <CardContent>
              {/* Header row */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: spacing.sm,
                }}
              >
                <Text style={{ fontWeight: "700", fontSize: 16 }}>
                  {c.name}
                </Text>
                {statusPill(c.status)}
              </View>
              <Text style={{ color: colors.muted, marginBottom: spacing.md }}>
                {c.description}
              </Text>

              {/* Details */}
              <View style={{ gap: 8, marginBottom: spacing.md }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={colors.muted}
                  />
                  <Text>{c.location}</Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={colors.muted}
                  />
                  <Text>
                    {c.startDate} - {c.endDate}
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons
                    name="person-outline"
                    size={16}
                    color={colors.muted}
                  />
                  <Text>Agent Role: {c.agentRoleRequired}</Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons
                    name="people-outline"
                    size={16}
                    color={colors.muted}
                  />
                  <Text>{c.volunteersNeeded} volunteers needed</Text>
                </View>
              </View>

              {/* Resource needed bloc */}
              <View
                style={{
                  backgroundColor: colors.mutedBackground,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: spacing.md,
                  marginBottom: spacing.md,
                }}
              >
                <Text
                  style={{
                    color: colors.muted,
                    fontSize: 12,
                    marginBottom: spacing.sm,
                  }}
                >
                  Resources Needed:
                </Text>
                <View style={{ flexDirection: "row", gap: spacing.md }}>
                  {c.resourceNeeds.food > 0 && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Ionicons
                        name="restaurant-outline"
                        size={14}
                        color={colors.cardForeground}
                      />
                      <Text style={{ fontSize: 12 }}>
                        {c.resourceNeeds.food} food
                      </Text>
                    </View>
                  )}
                  {c.resourceNeeds.clothes > 0 && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Ionicons
                        name="shirt-outline"
                        size={14}
                        color={colors.cardForeground}
                      />
                      <Text style={{ fontSize: 12 }}>
                        {c.resourceNeeds.clothes} clothes
                      </Text>
                    </View>
                  )}
                  {c.resourceNeeds.funds > 0 && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Ionicons
                        name="cash-outline"
                        size={14}
                        color={colors.cardForeground}
                      />
                      <Text style={{ fontSize: 12 }}>
                        ${c.resourceNeeds.funds}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* CTA */}
              {c.status === "Active" && (
                <Button style={{ width: "100%", backgroundColor: "#16a34a" }}>
                  Manage Campaign
                </Button>
              )}
              {c.status === "Available" && (
                <Button
                  style={{ width: "100%", backgroundColor: colors.blue }}
                  onPress={() => {
                    setSelectedCampaign(c);
                    setShowJoinModal(true);
                  }}
                >
                  Request to Join
                </Button>
              )}
              {c.status === "Completed" && (
                <Button
                  variant="outline"
                  style={{ width: "100%", backgroundColor: "#e5e7eb" }}
                  textStyle={{ color: colors.muted }}
                >
                  Campaign Completed
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </ScrollView>

      {/* Join Campaign Modal */}
      <Modal
        visible={showJoinModal}
        onRequestClose={() => setShowJoinModal(false)}
        transparent
        animationType="fade"
      >
        <Pressable
          onPress={() => setShowJoinModal(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            padding: spacing.lg,
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={{ width: "100%", alignItems: "center" }}
            >
              <View
                style={{
                  width: "110%",
                  maxWidth: 500,
                  borderRadius: 16,
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                  overflow: "hidden",
                }}
              >
                {/* Modal Header */}
                <View
                  style={{
                    padding: spacing.lg,
                    borderBottomWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: "700" }}>
                    Join Campaign: {selectedCampaign?.name}
                  </Text>
                  <Text
                    style={{ marginTop: 4, color: colors.muted, fontSize: 13 }}
                  >
                    Submit your request to join this campaign as an agent.
                  </Text>
                </View>

                {/* Modal Content */}
                <ScrollView
                  contentContainerStyle={{
                    padding: spacing.lg,
                    gap: spacing.lg,
                  }}
                  style={{ maxHeight: 520 }}
                >
                  {/* Campaign Summary */}
                  <View
                    style={{
                      backgroundColor: colors.mutedBackground,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.border,
                      padding: spacing.md,
                    }}
                  >
                    <Text style={{ fontWeight: "700", marginBottom: 8 }}>
                      Campaign Summary
                    </Text>
                    <View style={{ gap: 4 }}>
                      <Text style={{ fontSize: 13 }}>
                        <Text style={{ fontWeight: "700" }}>Location: </Text>
                        {selectedCampaign?.location}
                      </Text>
                      <Text style={{ fontSize: 13 }}>
                        <Text style={{ fontWeight: "700" }}>Duration: </Text>
                        {selectedCampaign?.startDate} -{" "}
                        {selectedCampaign?.endDate}
                      </Text>
                      <Text style={{ fontSize: 13 }}>
                        <Text style={{ fontWeight: "700" }}>
                          Required Role:{" "}
                        </Text>
                        {selectedCampaign?.agentRoleRequired}
                      </Text>
                      {!!selectedCampaign?.taskTypes && (
                        <Text style={{ fontSize: 13 }}>
                          <Text style={{ fontWeight: "700" }}>Tasks: </Text>
                          {selectedCampaign?.taskTypes}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Required Agent Type */}
                  <View style={{ gap: 6 }}>
                    <Text style={{ fontWeight: "600" }}>
                      Required Agent Type
                    </Text>
                    <View
                      style={{
                        backgroundColor: colors.mutedBackground,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: colors.border,
                        padding: spacing.md,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ fontWeight: "700" }}>
                          {selectedCampaign?.agentRoleRequired}
                        </Text>
                        <View
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 999,
                            borderWidth: 1,
                            borderColor: "#2563eb",
                            backgroundColor: "#eef2ff",
                          }}
                        >
                          <Text
                            style={{
                              color: "#2563eb",
                              fontSize: 12,
                              fontWeight: "700",
                            }}
                          >
                            Required
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={{
                          color: colors.muted,
                          marginTop: 6,
                          fontSize: 13,
                        }}
                      >
                        {selectedCampaign?.agentRoleRequired === "Collector" &&
                          "You will be responsible for collecting donations and resources from the community."}
                        {selectedCampaign?.agentRoleRequired ===
                          "Distributor" &&
                          "You will be responsible for distributing collected resources to target locations."}
                        {selectedCampaign?.agentRoleRequired === "Both" &&
                          "You will handle both collection of donations and distribution to target locations."}
                      </Text>
                    </View>
                  </View>

                  {/* Experience */}
                  <View style={{ gap: 6 }}>
                    <Text style={{ fontWeight: "600" }}>
                      Relevant Experience
                    </Text>
                    <TextInput
                      value={joinRequest.experience}
                      onChangeText={(t) =>
                        setJoinRequest({ ...joinRequest, experience: t })
                      }
                      placeholder="Describe your experience with aid distribution, logistics, or community work..."
                      multiline
                      numberOfLines={3}
                      style={{
                        minHeight: 80,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 12,
                        padding: spacing.md,
                        backgroundColor: colors.card,
                        textAlignVertical: "top",
                      }}
                    />
                  </View>

                  {/* Motivation */}
                  <View style={{ gap: 6 }}>
                    <Text style={{ fontWeight: "600" }}>
                      Why do you want to join?
                    </Text>
                    <TextInput
                      value={joinRequest.motivation}
                      onChangeText={(t) =>
                        setJoinRequest({ ...joinRequest, motivation: t })
                      }
                      placeholder="Tell us why you're interested in this campaign..."
                      multiline
                      numberOfLines={2}
                      style={{
                        minHeight: 64,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 12,
                        padding: spacing.md,
                        backgroundColor: colors.card,
                        textAlignVertical: "top",
                      }}
                    />
                  </View>

                  {/* Availability */}
                  <View style={{ gap: 6 }}>
                    <Text style={{ fontWeight: "600" }}>Availability</Text>
                    <TextInput
                      value={joinRequest.availability}
                      onChangeText={(t) =>
                        setJoinRequest({ ...joinRequest, availability: t })
                      }
                      placeholder="e.g., Weekends, evenings, full-time"
                      style={{
                        height: 44,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 12,
                        paddingHorizontal: spacing.md,
                        backgroundColor: colors.card,
                      }}
                    />
                  </View>
                </ScrollView>

                {/* Footer */}
                <View
                  style={{
                    padding: spacing.lg,
                    borderTopWidth: 1,
                    borderColor: colors.border,
                    flexDirection: "row",
                    gap: spacing.md,
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="outline"
                    onPress={() => setShowJoinModal(false)}
                    style={{ height: 44 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={() => {
                      // In real app, call API
                      // Simple UX: close & reset
                      setShowJoinModal(false);
                      setSelectedCampaign(null);
                      setJoinRequest({
                        experience: "",
                        motivation: "",
                        availability: "",
                      });
                    }}
                    style={{ height: 44, backgroundColor: colors.green }}
                  >
                    Submit Request
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
