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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../src/styles/colors";
import { spacing } from "../../../src/styles/spacing";
import { typography } from "../../../src/styles/typography";
import { Card, CardContent, CardHeader } from "../../../src/components/ui/Card";
import { Button } from "../../../src/components/ui/Button";
import { useRouter } from "expo-router";
import {
  useGetCampaignsQuery,
  useJoinCampaignMutation,
  useGetMeQuery,
} from "../../../src/store/services/campaignsApi";
import { useAppSelector } from "../../../src/store/hooks";
import { selectCurrentAgent } from "../../../src/store/selectors/agentSelectors";
import { auth } from "../../../src/services/firebase";

type UiCampaign = {
  id: string; // campaignID
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  status: "active" | "paused" | "completed" | "draft" | "cancelled";
  volunteersNeeded: number;
  resourceNeeds: { food: number; clothes: number; funds: number };
  // Optional UI fields (not guaranteed by backend)
  agentRoleRequired?: "Collector" | "Distributor" | "Both";
  taskTypes?: string;
  // Relations
  requestedAgent?: string[];
  coordinatorAgentId?: string;
};

const statusPill = (status: "Active" | "Paused" | "Completed") => {
  const map: Record<
    "Active" | "Paused" | "Completed",
    { bg: string; fg: string; label: string }
  > = {
    Active: { bg: "#e6f7ef", fg: "#065f46", label: "Active" },
    Paused: { bg: "#fff7ed", fg: "#b45309", label: "Paused" },
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
  const router = useRouter();
  const [filter, setFilter] = useState<
    "all" | "active" | "paused" | "completed" | "pending" | "approved"
  >("all");

  const agentId = useAppSelector(selectCurrentAgent)?.id; // mock agent id in current slice
  const currentUid = (auth as any)?.currentUser?.uid as string | undefined;
  const [joinCampaign, { isLoading: isJoining }] = useJoinCampaignMutation();
  // Resolve authoritative identity from server (contains agentId if mapped)
  const { data: meData } = useGetMeQuery();
  const effectiveAgentId = meData?.user?.agentId || meData?.agentId;
  const effectiveUid = meData?.user?.uid || meData?.uid;
  const identityCandidates = useMemo(
    () =>
      [effectiveAgentId, effectiveUid, agentId, currentUid]
        .filter(Boolean)
        .map(String),
    [effectiveAgentId, effectiveUid, agentId, currentUid]
  );

  // Query server lists by status; rely on backend to derive from token or accept agentId
  const {
    data: activeData,
    isFetching: isFetchingActive,
    error: activeError,
  } = useGetCampaignsQuery({ status: "active" });
  const {
    data: pausedData,
    isFetching: isFetchingPaused,
    error: pausedError,
  } = useGetCampaignsQuery({ status: "paused" });
  const {
    data: completedData,
    isFetching: isFetchingCompleted,
    error: completedError,
  } = useGetCampaignsQuery({ status: "completed" });

  const listFromServer: UiCampaign[] = useMemo(() => {
    const mapServer = (arr: any[] | undefined): UiCampaign[] =>
      (arr || []).map((c) => ({
        id: c.campaignID,
        name: c.name,
        description: c.description,
        location: c.location ?? `${c.city}, ${c.district}`,
        startDate:
          typeof c.startDate === "string"
            ? c.startDate
            : new Date(c.startDate).toISOString(),
        endDate:
          typeof c.endDate === "string"
            ? c.endDate
            : new Date(c.endDate).toISOString(),
        status: c.status,
        volunteersNeeded: c.requiredVolunteers,
        resourceNeeds: {
          food:
            c.resources
              ?.filter?.((r: any) => r.category === "food")
              .reduce((a: number, r: any) => a + (r.quantity || 0), 0) || 0,
          clothes:
            c.resources
              ?.filter?.((r: any) => r.category === "clothing")
              .reduce((a: number, r: any) => a + (r.quantity || 0), 0) || 0,
          funds: c.estimatedBudget || 0,
        },
        requestedAgent: c.requestedAgent,
        coordinatorAgentId: c.coordinatorAgentId,
      }));

    switch (filter) {
      case "active":
        return mapServer(activeData);
      case "paused":
        return mapServer(pausedData);
      case "completed":
        return mapServer(completedData);
      case "pending": {
        const all = [
          ...mapServer(activeData),
          ...mapServer(pausedData),
          ...mapServer(completedData),
        ];
        return all.filter((c) => {
          const reqArr = c.requestedAgent || [];
          const requested = identityCandidates.some((id) =>
            reqArr.includes(id)
          );
          const approved = identityCandidates.includes(
            c.coordinatorAgentId || ""
          );
          return requested && !approved;
        });
      }
      case "approved": {
        const all = [
          ...mapServer(activeData),
          ...mapServer(pausedData),
          ...mapServer(completedData),
        ];
        return all.filter((c) =>
          identityCandidates.includes(c.coordinatorAgentId || "")
        );
      }
      default:
        return [
          ...mapServer(activeData),
          ...mapServer(pausedData),
          ...mapServer(completedData),
        ];
    }
  }, [
    filter,
    activeData,
    pausedData,
    completedData,
    agentId,
    currentUid,
    effectiveAgentId,
    effectiveUid,
  ]);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<UiCampaign | null>(
    null
  );
  const [joinRequest, setJoinRequest] = useState({
    experience: "",
    motivation: "",
    availability: "",
  });

  const list = listFromServer;

  // Counts for pending/approved filters (computed from raw server data)
  const pendingCount = (activeData || [])
    .concat(pausedData || [], completedData || [])
    .filter((c: any) => {
      const req: string[] = c?.requestedAgent || [];
      const coord: string | undefined = c?.coordinatorAgentId;
      const requested = identityCandidates.some((id) => req.includes(id));
      const approved = identityCandidates.includes(coord || "");
      return requested && !approved;
    }).length;
  const approvedCount = (activeData || [])
    .concat(pausedData || [], completedData || [])
    .filter((c: any) => {
      const coord: string | undefined = c?.coordinatorAgentId;
      return identityCandidates.includes(coord || "");
    }).length;

  // Helpers to reconcile server-stored IDs (agentId or Firebase UID)
  const isCoordinator = (c: UiCampaign) => {
    const id = c.coordinatorAgentId;
    if (!id) return false;
    return identityCandidates.includes(id);
  };
  const isRequestedByMe = (c: UiCampaign) => {
    const arr = c.requestedAgent || [];
    return identityCandidates.some((id) => arr.includes(id));
  };

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
        {/* Loading or error banners */}
        {(isFetchingActive || isFetchingPaused || isFetchingCompleted) && (
          <View
            style={{
              padding: spacing.md,
              borderRadius: 12,
              backgroundColor: colors.mutedBackground,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ color: colors.muted }}>Loading campaigns…</Text>
          </View>
        )}
        {(activeError || pausedError || completedError) && (
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
              Failed to load campaigns
            </Text>
            {(() => {
              const err = (activeError || pausedError || completedError) as any;
              if (err?.status) {
                const detail =
                  typeof err?.data === "string"
                    ? err.data
                    : JSON.stringify(err?.data);
                return (
                  <Text style={{ color: "#991b1b" }}>
                    {`Status ${err.status}${detail ? `: ${detail}` : ""}`}
                  </Text>
                );
              }
              return (
                <Text style={{ color: "#991b1b" }}>
                  {JSON.stringify(err) || "Unknown error"}
                </Text>
              );
            })()}
          </View>
        )}
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
              {(activeData?.length || 0) +
                (pausedData?.length || 0) +
                (completedData?.length || 0)}{" "}
              Total
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
                count={
                  (activeData?.length || 0) +
                  (pausedData?.length || 0) +
                  (completedData?.length || 0)
                }
                active={filter === "all"}
                tone="slate"
                onPress={() => setFilter("all")}
              />
              <FilterPill
                label="Active"
                count={activeData?.length || 0}
                active={filter === "active"}
                tone="green"
                onPress={() => setFilter("active")}
              />
              <FilterPill
                label="Pending"
                count={pendingCount}
                active={filter === "pending"}
                tone="blue"
                onPress={() => setFilter("pending")}
              />
              <FilterPill
                label="Approved"
                count={approvedCount}
                active={filter === "approved"}
                tone="green"
                onPress={() => setFilter("approved")}
              />
              <FilterPill
                label="Paused"
                count={pausedData?.length || 0}
                active={filter === "paused"}
                tone="blue"
                onPress={() => setFilter("paused")}
              />
              <FilterPill
                label="Completed"
                count={completedData?.length || 0}
                active={filter === "completed"}
                tone="gray"
                onPress={() => setFilter("completed")}
              />
            </View>
          </CardContent>
        </Card>

        {/* Campaign cards */}
        {list.length === 0 &&
        !isFetchingActive &&
        !isFetchingPaused &&
        !isFetchingCompleted ? (
          <View
            style={{
              padding: spacing.lg,
              borderRadius: 12,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.card,
            }}
          >
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={colors.muted}
            />
            <Text style={{ color: colors.muted, marginTop: 8 }}>
              No campaigns found for the selected filter
            </Text>
          </View>
        ) : null}
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
                {statusPill(
                  c.status === "active"
                    ? "Active"
                    : c.status === "paused"
                    ? "Paused"
                    : "Completed"
                )}
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
                    {new Date(c.startDate).toLocaleDateString()} -{" "}
                    {new Date(c.endDate).toLocaleDateString()}
                  </Text>
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

              {/* CTA: Manage if current agent is coordinator */}
              {c.status === "active" && isCoordinator(c) && (
                <Button
                  style={{ width: "100%", backgroundColor: "#16a34a" }}
                  onPress={() =>
                    router.replace(`/(agent)/campaigns/${c.id}/overview` as any)
                  }
                >
                  Manage Campaign
                </Button>
              )}
              {/* CTA: Request to Join if active, no coordinator and not already requested */}
              {c.status === "active" &&
                !c.coordinatorAgentId &&
                (agentId || currentUid) &&
                !isRequestedByMe(c) && (
                  <Button
                    style={{ width: "100%" }}
                    disabled={isJoining}
                    onPress={() => {
                      setSelectedCampaign(c);
                      setShowJoinModal(true);
                    }}
                  >
                    Request to Join
                  </Button>
                )}
              {/* CTA: Requested state */}
              {c.status === "active" &&
                !c.coordinatorAgentId &&
                (agentId || currentUid) &&
                isRequestedByMe(c) && (
                  <Button
                    variant="outline"
                    style={{ width: "100%", backgroundColor: "#e5e7eb" }}
                    textStyle={{ color: colors.muted }}
                  >
                    Pending
                  </Button>
                )}
              {c.status === "completed" && (
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
                        {selectedCampaign
                          ? `${new Date(
                              selectedCampaign.startDate
                            ).toLocaleDateString()} - ${new Date(
                              selectedCampaign.endDate
                            ).toLocaleDateString()}`
                          : ""}
                      </Text>
                      {!!selectedCampaign?.agentRoleRequired && (
                        <Text style={{ fontSize: 13 }}>
                          <Text style={{ fontWeight: "700" }}>
                            Required Role:{" "}
                          </Text>
                          {selectedCampaign?.agentRoleRequired}
                        </Text>
                      )}
                      {!!selectedCampaign?.taskTypes && (
                        <Text style={{ fontSize: 13 }}>
                          <Text style={{ fontWeight: "700" }}>Tasks: </Text>
                          {selectedCampaign?.taskTypes}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Required Agent Type */}
                  {!!selectedCampaign?.agentRoleRequired && (
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
                          {selectedCampaign?.agentRoleRequired ===
                            "Collector" &&
                            "You will be responsible for collecting donations and resources from the community."}
                          {selectedCampaign?.agentRoleRequired ===
                            "Distributor" &&
                            "You will be responsible for distributing collected resources to target locations."}
                          {selectedCampaign?.agentRoleRequired === "Both" &&
                            "You will handle both collection of donations and distribution to target locations."}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Experience */}
                  <View style={{ gap: 6 }}>
                    <Text style={{ fontWeight: "600" }}>
                      Relevant Experience
                    </Text>
                    <TextInput
                      maxLength={1000}
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
                      maxLength={500}
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
                      maxLength={100}
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
                    disabled={!selectedCampaign || isJoining}
                    loading={isJoining}
                    onPress={async () => {
                      if (!selectedCampaign) return;
                      try {
                        const payload = {
                          campaignId: selectedCampaign.id,
                          experience: joinRequest.experience
                            .trim()
                            .slice(0, 1000),
                          motivation: joinRequest.motivation
                            .trim()
                            .slice(0, 500),
                          availability: joinRequest.availability
                            .trim()
                            .slice(0, 100),
                        };
                        await joinCampaign(payload).unwrap();
                        Alert.alert(
                          "Request sent",
                          "Your join request was submitted successfully."
                        );
                        setShowJoinModal(false);
                        setSelectedCampaign(null);
                        setJoinRequest({
                          experience: "",
                          motivation: "",
                          availability: "",
                        });
                      } catch (e) {
                        const msg =
                          (e as any)?.data?.message ||
                          (e as any)?.error ||
                          "Failed to submit join request";
                        Alert.alert("Request failed", String(msg));
                      }
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
