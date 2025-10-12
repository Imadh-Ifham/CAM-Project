import React, { useEffect, useMemo, useState } from "react";
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
import { useRouter } from "expo-router";

import { colors } from "../../../src/styles/colors";
import { spacing } from "../../../src/styles/spacing";
import { typography } from "../../../src/styles/typography";
import { Card, CardContent, CardHeader } from "../../../src/components/ui/Card";
import { Button } from "../../../src/components/ui/Button";

import {
  useGetCampaignsQuery,
  useJoinCampaignMutation,
  useGetMeQuery,
  useGetCoordinatorAssignmentsQuery,
  useLazyGetCoordinatorAssignmentQuery,
  useLazyGetCampaignByIdQuery,
  useGetPendingAgentRequestsQuery,
} from "../../../src/store/services/campaignsApi";
import { useAppSelector } from "../../../src/store/hooks";
import { selectCurrentAgent } from "../../../src/store/selectors/agentSelectors";
import { auth } from "../../../src/services/firebase";

interface UiCampaign {
  id: string;
  name: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  status: "active" | "paused" | "completed" | string;
  volunteersNeeded: number;
  resourceNeeds: { food: number; clothes: number; funds: number };
  resourceChips?: Array<{ label: string; qty: number; unit?: string }>;
  requestedAgent?: string[];
  coordinatorAgentId?: string;
}

type FilterKey =
  | "all"
  | "active"
  | "paused"
  | "completed"
  | "pending"
  | "approved";

export default function Campaigns() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>("all");

  const agentId = useAppSelector(selectCurrentAgent)?.id as string | undefined;
  const currentUid = (auth as any)?.currentUser?.uid as string | undefined;
  const [triggerGetAssignment, assignmentState] =
    useLazyGetCoordinatorAssignmentQuery();
  const [triggerGetCampaignById] = useLazyGetCampaignByIdQuery();
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
  const [joinCampaign, { isLoading: isJoining }] = useJoinCampaignMutation();
  const { data: myAssignments } = useGetCoordinatorAssignmentsQuery();
  const assignedCampaignIds = useMemo(
    () => new Set((myAssignments || []).map((a: any) => a.campaignId)),
    [myAssignments]
  );
  // Pending requests list (admin view endpoint reused client-side)
  const { data: pendingRequests } = useGetPendingAgentRequestsQuery();
  const pendingCampaignIds = useMemo(() => {
    const ids = new Set<string>();
    (pendingRequests || []).forEach((r: any) => {
      const matchesAgent = identityCandidates.includes(
        String(r?.agentId || "")
      );
      if (matchesAgent && String(r?.status || "").toLowerCase() === "pending") {
        ids.add(String(r?.campaignId || ""));
      }
    });
    return ids;
  }, [pendingRequests, identityCandidates]);

  // Fetch campaigns by status
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

  // Helper to map server payloads into UI-friendly objects
  const mapServer = (arr: any[] | undefined): UiCampaign[] => {
    if (!Array.isArray(arr)) return [];
    return arr.map((s: any) => {
      // Build location from city/district when available
      const city = s?.city || "";
      const district = s?.district || "";
      const loc = s?.location || [city, district].filter(Boolean).join(", ");
      // Derive resource chips (top 3)
      const chips: UiCampaign["resourceChips"] = Array.isArray(s?.resources)
        ? s.resources
            .filter((r: any) => r && (r.name || r.category))
            .slice(0, 3)
            .map((r: any) => ({
              label: String(r.name || r.category || "item"),
              qty:
                Number(
                  r.quantity ?? r.qty ?? r.required ?? r.target ?? r.amount ?? 0
                ) || 0,
              unit: r.unit ? String(r.unit) : undefined,
            }))
        : [];
      // Fallback aggregates
      const foods = Array.isArray(s?.resources)
        ? s.resources
            .filter((r: any) =>
              String(r.category || r.name || "")
                .toLowerCase()
                .includes("food")
            )
            .reduce(
              (sum: number, r: any) =>
                sum +
                (Number(
                  r.quantity ?? r.qty ?? r.required ?? r.target ?? r.amount ?? 0
                ) || 0),
              0
            )
        : 0;
      const clothes = Array.isArray(s?.resources)
        ? s.resources
            .filter((r: any) => {
              const t = String(r.category || r.name || "").toLowerCase();
              return t.includes("cloth");
            })
            .reduce(
              (sum: number, r: any) =>
                sum +
                (Number(
                  r.quantity ?? r.qty ?? r.required ?? r.target ?? r.amount ?? 0
                ) || 0),
              0
            )
        : 0;
      const funds = Number(s?.estimatedBudget) || 0;

      // Volunteers remaining (if server provides volunteers count)
      const needed = Math.max(
        0,
        (Number(s?.requiredVolunteers) || 0) - (Number(s?.volunteers) || 0)
      );

      const out: UiCampaign = {
        id: String(s?.campaignID || s?._id || s?.id || ""),
        name: String(s?.name || "Untitled Campaign"),
        description: s?.description || "",
        location: loc,
        startDate: s?.startDate || undefined,
        endDate: s?.endDate || undefined,
        status: (s?.status as any) || "active",
        volunteersNeeded: needed,
        resourceNeeds: { food: foods, clothes, funds },
        resourceChips: chips,
        requestedAgent: Array.isArray(s?.requestedAgent)
          ? s.requestedAgent
          : [],
        coordinatorAgentId: s?.coordinatorAgentId || undefined,
      };
      return out;
    });
  };

  const listFromServer: UiCampaign[] = useMemo(() => {
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
        // Prefer explicit pending requests collection
        if (pendingCampaignIds.size > 0) {
          return all.filter((c) => pendingCampaignIds.has(c.id));
        }
        // Fallback to legacy requestedAgent array
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
        // Approved: Active campaigns you can manage (you're the coordinator)
        return all.filter(
          (c) =>
            c.status === "active" &&
            (assignedCampaignIds.has(c.id) ||
              identityCandidates.includes(c.coordinatorAgentId || ""))
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
    identityCandidates,
    pendingCampaignIds,
    assignedCampaignIds,
  ]);

  // Assignment preflight for visible subset
  const [assignmentMap, setAssignmentMap] = useState<Record<string, boolean>>(
    {}
  );
  useEffect(() => {
    let cancelled = false;
    const subset = listFromServer.slice(0, 10);
    Promise.all(
      subset.map(async (x) => {
        try {
          const resp = await triggerGetAssignment(x.id, true).unwrap();
          if (!cancelled && resp) {
            setAssignmentMap((m) => ({ ...m, [x.id]: true }));
          }
        } catch {
          // ignore
        }
      })
    );
    return () => {
      cancelled = true;
    };
  }, [listFromServer, triggerGetAssignment]);

  // Enrich resources for visible subset using detailed campaign fetch
  const [resourcesEnriched, setResourcesEnriched] = useState<
    Record<
      string,
      {
        chips: Array<{ label: string; qty: number; unit?: string }>;
        totals: { food: number; clothes: number; funds: number };
      }
    >
  >({});
  useEffect(() => {
    let cancelled = false;
    const subset = listFromServer.slice(0, 10);
    (async () => {
      for (const c of subset) {
        try {
          const detail = await triggerGetCampaignById(c.id, true).unwrap();
          const res = Array.isArray(detail?.resources) ? detail.resources : [];
          const chips = res
            .filter((r: any) => r && (r.name || r.category))
            .slice(0, 3)
            .map((r: any) => ({
              label: String(r.name || r.category || "item"),
              qty:
                Number(
                  r.quantity ?? r.qty ?? r.required ?? r.target ?? r.amount ?? 0
                ) || 0,
              unit: r.unit ? String(r.unit) : undefined,
            }));
          const foods = res
            .filter((r: any) =>
              String(r.category || r.name || "")
                .toLowerCase()
                .includes("food")
            )
            .reduce(
              (sum: number, r: any) =>
                sum +
                (Number(
                  r.quantity ?? r.qty ?? r.required ?? r.target ?? r.amount ?? 0
                ) || 0),
              0
            );
          const clothes = res
            .filter((r: any) =>
              String(r.category || r.name || "")
                .toLowerCase()
                .includes("cloth")
            )
            .reduce(
              (sum: number, r: any) =>
                sum +
                (Number(
                  r.quantity ?? r.qty ?? r.required ?? r.target ?? r.amount ?? 0
                ) || 0),
              0
            );
          const funds = Number(detail?.estimatedBudget) || 0;
          if (!cancelled) {
            setResourcesEnriched((m) => ({
              ...m,
              [c.id]: { chips, totals: { food: foods, clothes, funds } },
            }));
          }
        } catch {
          // ignore detail fetch errors
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [listFromServer, triggerGetCampaignById]);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<UiCampaign | null>(
    null
  );
  const [joinRequest, setJoinRequest] = useState({
    experience: "",
    motivation: "",
    availability: "",
  });
  // Optimistic local pending: mark immediately after successful join
  const [localPending, setLocalPending] = useState<Record<string, true>>({});

  const list = listFromServer;

  // Counts for pending/approved filters (computed from raw server data)
  const pendingCount = (() => {
    if (pendingCampaignIds.size > 0) {
      // Count only those present in our fetched lists
      const allIds = new Set<string>(
        [
          ...(activeData || []).map((x: any) =>
            String(x?.campaignID || x?._id || x?.id || "")
          ),
          ...(pausedData || []).map((x: any) =>
            String(x?.campaignID || x?._id || x?.id || "")
          ),
          ...(completedData || []).map((x: any) =>
            String(x?.campaignID || x?._id || x?.id || "")
          ),
        ].filter(Boolean)
      );
      let n = 0;
      pendingCampaignIds.forEach((id) => {
        if (allIds.has(id)) n += 1;
      });
      // Include local pending as well (if present in lists)
      Object.keys(localPending).forEach((id) => {
        if (allIds.has(id)) n += 1;
      });
      return n;
    }
    // Fallback legacy logic
    return (activeData || [])
      .concat(pausedData || [], completedData || [])
      .filter((c: any) => {
        const req: string[] = c?.requestedAgent || [];
        const coord: string | undefined = c?.coordinatorAgentId;
        const requested = identityCandidates.some((id) => req.includes(id));
        const approved = identityCandidates.includes(coord || "");
        const locally =
          !!localPending[String(c?.campaignID || c?._id || c?.id || "")];
        return (requested && !approved) || locally;
      }).length;
  })();
  const approvedCount = useMemo(() => {
    const allActive = mapServer(activeData);
    return allActive.filter(
      (c) =>
        c.status === "active" &&
        (assignedCampaignIds.has(c.id) ||
          identityCandidates.includes(c.coordinatorAgentId || ""))
    ).length;
  }, [activeData, assignedCampaignIds, identityCandidates]);

  const statusPill = (label: string) => {
    const tone =
      label === "Active"
        ? { bg: "#ecfdf5", fg: "#16a34a", br: "#a7f3d0" }
        : label === "Paused"
        ? { bg: "#eef2ff", fg: "#2563eb", br: "#bfdbfe" }
        : { bg: "#2a2a2a", fg: "#888", br: "#444" };
    return (
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
          backgroundColor: tone.bg,
          borderWidth: 1,
          borderColor: tone.br,
        }}
      >
        <Text style={{ color: tone.fg, fontWeight: "700", fontSize: 12 }}>
          {label}
        </Text>
      </View>
    );
  };

  const isCoordinator = (c: UiCampaign) => {
    if (assignmentMap[c.id]) return true;
    // If API reports assignment for this campaign, you're the coordinator
    if (assignedCampaignIds.has(c.id)) return true;
    // Otherwise, attempt to match coordinator id to our identities
    const id = c.coordinatorAgentId;
    if (id && identityCandidates.includes(id)) return true;
    return false;
  };

  // (no separate canManage; use isCoordinator directly)

  const handleManagePress = async (c: UiCampaign) => {
    try {
      // Prefetch assignment to ensure access and data exists
      const resp = await triggerGetAssignment(c.id, true).unwrap();
      if (!resp) throw new Error("Assignment not found");
      router.replace(`/(agent)/campaigns/${c.id}/overview` as any);
    } catch (e: any) {
      const status = e?.status;
      const msg =
        e?.data?.message ||
        (status === 403
          ? "You don't have access to manage this campaign."
          : status === 404
          ? "Coordinator assignment not found for this campaign."
          : "Unable to open campaign. Please try again.");
      Alert.alert("Cannot open", String(msg));
    }
  };
  const isRequestedByMe = (c: UiCampaign) => {
    if (localPending[c.id]) return true;
    if (pendingCampaignIds.has(c.id)) return true;
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
        bg: active ? "#1f2937" : "#2a2a2a",
        fg: active ? "#ffffff" : "#fff",
        br: active ? "#1f2937" : "#444",
      },
      blue: {
        bg: active ? "#2563eb" : "#1a2332",
        fg: active ? "#ffffff" : "#3b82f6",
        br: active ? "#2563eb" : "#3b82f6",
      },
      green: {
        bg: active ? "#16a34a" : "#1a2b1f",
        fg: active ? "#ffffff" : "#10b981",
        br: active ? "#16a34a" : "#10b981",
      },
      gray: {
        bg: active ? "#6b7280" : "#2a2a2a",
        fg: active ? "#ffffff" : "#888",
        br: active ? "#6b7280" : "#444",
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
    <View style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
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
              backgroundColor: "#2a2a2a",
              borderWidth: 1,
              borderColor: "#333",
            }}
          >
            <Text style={{ color: "#888" }}>Loading campaigns…</Text>
          </View>
        )}
        {(activeError || pausedError || completedError) && (
          <View
            style={{
              padding: spacing.md,
              borderRadius: 12,
              backgroundColor: "#2a1a1a",
              borderWidth: 1,
              borderColor: "#dc2626",
            }}
          >
            <Text style={{ color: "#ef4444", fontWeight: "700" }}>
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
                  <Text style={{ color: "#ef4444" }}>
                    {`Status ${err.status}${detail ? `: ${detail}` : ""}`}
                  </Text>
                );
              }
              return (
                <Text style={{ color: "#ef4444" }}>
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
          <Text style={[typography.h2, { color: "#fff" }]}>Campaigns</Text>
          <View
            style={{
              backgroundColor: "#2a2a2a",
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: "#333",
            }}
          >
            <Text style={{ color: "#888", fontSize: 12 }}>
              {(activeData?.length || 0) +
                (pausedData?.length || 0) +
                (completedData?.length || 0)}{" "}
              Total
            </Text>
          </View>
        </View>

        {/* Filter block */}
        <Card
          style={{
            borderRadius: 16,
            backgroundColor: "#1a1a1a",
            borderWidth: 1,
            borderColor: "#333",
          }}
        >
          <CardHeader>
            <Text style={[typography.h3, { color: "#fff" }]}>
              Filter Campaigns
            </Text>
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
              borderColor: "#333",
              backgroundColor: "#1a1a1a",
            }}
          >
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#888"
            />
            <Text style={{ color: "#888", marginTop: 8 }}>
              No campaigns found for the selected filter
            </Text>
          </View>
        ) : null}
        {list.map((c, idx) => (
          <Card
            key={`${c.id || "unknown"}-${idx}`}
            style={{
              borderRadius: 16,
              backgroundColor: "#1a1a1a",
              borderWidth: 1,
              borderColor: "#333",
            }}
          >
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
                <Text
                  style={{ fontWeight: "700", fontSize: 16, color: "#fff" }}
                >
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
              <Text style={{ color: "#888", marginBottom: spacing.md }}>
                {c.description}
              </Text>

              {/* Details */}
              <View style={{ gap: 8, marginBottom: spacing.md }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons name="location-outline" size={16} color="#888" />
                  <Text style={{ color: "#888" }}>{c.location}</Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons name="calendar-outline" size={16} color="#888" />
                  <Text style={{ color: "#888" }}>
                    {(() => {
                      const sd = c.startDate ? new Date(c.startDate) : null;
                      const ed = c.endDate ? new Date(c.endDate) : null;
                      const s =
                        sd && !isNaN(sd.getTime())
                          ? sd.toLocaleDateString()
                          : "";
                      const e =
                        ed && !isNaN(ed.getTime())
                          ? ed.toLocaleDateString()
                          : "";
                      return `${s}${s && e ? " - " : s || e ? "" : ""}${e}`;
                    })()}
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons name="people-outline" size={16} color="#888" />
                  <Text style={{ color: "#888" }}>
                    {c.volunteersNeeded} volunteers needed
                  </Text>
                </View>
              </View>

              {/* Resource needed bloc */}
              <View
                style={{
                  backgroundColor: "#2a2a2a",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#444",
                  padding: spacing.md,
                  marginBottom: spacing.md,
                }}
              >
                <Text
                  style={{
                    color: "#888",
                    fontSize: 12,
                    marginBottom: spacing.sm,
                  }}
                >
                  Resources Needed:
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: spacing.md,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {(() => {
                    const enriched = resourcesEnriched[c.id];
                    const baseChips = Array.isArray(c.resourceChips)
                      ? c.resourceChips
                      : [];
                    const chips = enriched?.chips?.length
                      ? enriched.chips
                      : baseChips;
                    const totalQty = chips.reduce(
                      (s, ch) => s + (Number(ch.qty) || 0),
                      0
                    );
                    if (chips.length > 0 && totalQty > 0) {
                      return chips.slice(0, 3).map((chip, idx2) => (
                        <View
                          key={`${c.id}-chip-${idx2}`}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <Ionicons
                            name="cube-outline"
                            size={14}
                            color="#fff"
                          />
                          <Text style={{ fontSize: 12, color: "#fff" }}>
                            {chip.qty} {chip.label}
                            {chip.unit ? ` (${chip.unit})` : ""}
                          </Text>
                        </View>
                      ));
                    }
                    const totals = enriched?.totals || c.resourceNeeds;
                    return (
                      <>
                        {totals.food > 0 && (
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
                              color="#fff"
                            />
                            <Text style={{ fontSize: 12, color: "#fff" }}>
                              {totals.food} food
                            </Text>
                          </View>
                        )}
                        {totals.clothes > 0 && (
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
                              color="#fff"
                            />
                            <Text style={{ fontSize: 12, color: "#fff" }}>
                              {totals.clothes} clothes
                            </Text>
                          </View>
                        )}
                        {totals.funds > 0 && (
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
                              color="#fff"
                            />
                            <Text style={{ fontSize: 12, color: "#fff" }}>
                              LKR {totals.funds}
                            </Text>
                          </View>
                        )}
                        {totals.food <= 0 &&
                          totals.clothes <= 0 &&
                          totals.funds <= 0 && (
                            <Text style={{ fontSize: 12, color: "#888" }}>
                              Details unavailable in list. Open campaign to view
                              more.
                            </Text>
                          )}
                      </>
                    );
                  })()}
                </View>
              </View>

              {/* CTA: Manage if current agent is coordinator */}
              {c.status === "active" && isCoordinator(c) && (
                <Button
                  style={{ width: "100%", backgroundColor: "#16a34a" }}
                  loading={assignmentState.isFetching}
                  onPress={() => handleManagePress(c)}
                >
                  Manage Campaign
                </Button>
              )}
              {/* CTA: Request to Join if active, no coordinator and not already requested */}
              {c.status === "active" &&
                !isCoordinator(c) &&
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
                    style={{
                      width: "100%",
                      backgroundColor: "#2a2a2a",
                      borderColor: "#444",
                    }}
                    textStyle={{ color: "#888" }}
                  >
                    Pending
                  </Button>
                )}
              {c.status === "completed" && (
                <Button
                  variant="outline"
                  style={{
                    width: "100%",
                    backgroundColor: "#2a2a2a",
                    borderColor: "#444",
                  }}
                  textStyle={{ color: "#888" }}
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
                  backgroundColor: "#1a1a1a",
                  borderWidth: 1,
                  borderColor: "#333",
                  overflow: "hidden",
                }}
              >
                {/* Modal Header */}
                <View
                  style={{
                    padding: spacing.lg,
                    borderBottomWidth: 1,
                    borderColor: "#333",
                  }}
                >
                  <Text
                    style={{ fontSize: 18, fontWeight: "700", color: "#fff" }}
                  >
                    Join Campaign: {selectedCampaign?.name}
                  </Text>
                  <Text style={{ marginTop: 4, color: "#888", fontSize: 13 }}>
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
                      backgroundColor: "#2a2a2a",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "#444",
                      padding: spacing.md,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "700",
                        marginBottom: 8,
                        color: "#fff",
                      }}
                    >
                      Campaign Summary
                    </Text>
                    <View style={{ gap: 4 }}>
                      <Text style={{ fontSize: 13, color: "#fff" }}>
                        <Text style={{ fontWeight: "700" }}>Location: </Text>
                        {selectedCampaign?.location}
                      </Text>
                      <Text style={{ fontSize: 13, color: "#fff" }}>
                        <Text style={{ fontWeight: "700" }}>Duration: </Text>
                        {(() => {
                          const sd = selectedCampaign?.startDate
                            ? new Date(selectedCampaign.startDate)
                            : null;
                          const ed = selectedCampaign?.endDate
                            ? new Date(selectedCampaign.endDate)
                            : null;
                          const s =
                            sd && !isNaN(sd.getTime())
                              ? sd.toLocaleDateString()
                              : "";
                          const e =
                            ed && !isNaN(ed.getTime())
                              ? ed.toLocaleDateString()
                              : "";
                          return `${s}${s && e ? " - " : s || e ? "" : ""}${e}`;
                        })()}
                      </Text>
                    </View>
                  </View>

                  {/* Required Agent Type section omitted: not available in UiCampaign */}

                  {/* Experience */}
                  <View style={{ gap: 6 }}>
                    <Text style={{ fontWeight: "600", color: "#fff" }}>
                      Relevant Experience
                    </Text>
                    <TextInput
                      maxLength={1000}
                      value={joinRequest.experience}
                      onChangeText={(t) =>
                        setJoinRequest({ ...joinRequest, experience: t })
                      }
                      placeholder="Describe your experience with aid distribution, logistics, or community work..."
                      placeholderTextColor="#888"
                      multiline
                      numberOfLines={3}
                      style={{
                        minHeight: 80,
                        borderWidth: 1,
                        borderColor: "#444",
                        backgroundColor: "#2a2a2a",
                        color: "#fff",
                        borderRadius: 12,
                        padding: spacing.md,
                        textAlignVertical: "top",
                      }}
                    />
                  </View>

                  {/* Motivation */}
                  <View style={{ gap: 6 }}>
                    <Text style={{ fontWeight: "600", color: "#fff" }}>
                      Why do you want to join?
                    </Text>
                    <TextInput
                      maxLength={500}
                      value={joinRequest.motivation}
                      onChangeText={(t) =>
                        setJoinRequest({ ...joinRequest, motivation: t })
                      }
                      placeholder="Tell us why you're interested in this campaign..."
                      placeholderTextColor="#888"
                      multiline
                      numberOfLines={2}
                      style={{
                        minHeight: 64,
                        borderWidth: 1,
                        borderColor: "#444",
                        borderRadius: 12,
                        padding: spacing.md,
                        backgroundColor: "#2a2a2a",
                        color: "#fff",
                        textAlignVertical: "top",
                      }}
                    />
                  </View>

                  {/* Availability */}
                  <View style={{ gap: 6 }}>
                    <Text style={{ fontWeight: "600", color: "#fff" }}>
                      Availability
                    </Text>
                    <TextInput
                      maxLength={100}
                      value={joinRequest.availability}
                      onChangeText={(t) =>
                        setJoinRequest({ ...joinRequest, availability: t })
                      }
                      placeholder="e.g., Weekends, evenings, full-time"
                      placeholderTextColor="#888"
                      style={{
                        height: 44,
                        borderWidth: 1,
                        borderColor: "#444",
                        backgroundColor: "#2a2a2a",
                        color: "#fff",
                        borderRadius: 12,
                        paddingHorizontal: spacing.md,
                      }}
                    />
                  </View>
                </ScrollView>

                {/* Footer */}
                <View
                  style={{
                    padding: spacing.lg,
                    borderTopWidth: 1,
                    borderColor: "#333",
                    flexDirection: "row",
                    gap: spacing.md,
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="outline"
                    onPress={() => setShowJoinModal(false)}
                    style={{ height: 44 }}
                    textStyle={{ color: "#fff" }}
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
                        // Optimistically mark as pending for instant UI feedback
                        setLocalPending((m) => ({
                          ...m,
                          [selectedCampaign.id]: true,
                        }));
                        // Optionally refetch visible lists to pick up requestedAgent array changes server-side
                        // No-op here since RTK Query invalidation is set up; we rely on that to refresh
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
