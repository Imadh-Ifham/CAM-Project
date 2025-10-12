import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { colors } from "../../../../src/styles/colors";
import { spacing } from "../../../../src/styles/spacing";
import { typography } from "../../../../src/styles/typography";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../src/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useGetCoordinatorAssignmentQuery } from "../../../../src/store/services/campaignsApi";
import { useGetCampaignSnapshotsQuery } from "../../../../src/store/services/progressApi";
import ProgressHeader from "../../../../src/components/ui/ProgressHeader";
import {
  useGetTotalsQuery,
  useGetLotsQuery,
} from "../../../../src/store/services/stockApi";
import { useGetDistributionsByCampaignQuery } from "@/src/store/services/distributionsApi";
import { useGetCollectionsByCampaignQuery } from "@/src/store/services/collectionsApi";

export default function CampaignOverview() {
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const { data, isFetching, error } = useGetCoordinatorAssignmentQuery(
    campaignId as string,
    { skip: !campaignId }
  );
  const { data: snapshots = [] } = useGetCampaignSnapshotsQuery(
    (campaignId as string)!,
    { skip: !campaignId, pollingInterval: 15000, refetchOnFocus: true } as any
  );
  const { data: stockTotals = [] } = useGetTotalsQuery(
    (campaignId as string)!,
    {
      skip: !campaignId,
      pollingInterval: 15000,
      refetchOnFocus: true,
    } as any
  );
  const { data: lots = [] } = useGetLotsQuery(
    { campaignId: campaignId as string },
    { skip: !campaignId, pollingInterval: 15000, refetchOnFocus: true } as any
  );
  const { data: distributions = [] } = useGetDistributionsByCampaignQuery(
    { campaignId: (campaignId as string)! },
    { skip: !campaignId }
  );
  const { data: collections = [] } = useGetCollectionsByCampaignQuery(
    { campaignId: (campaignId as string)! },
    { skip: !campaignId } as any
  );

  const assignment = data as any;
  // Resource IDs configured for this campaign (used as fallback scoping)
  const campaignResourceIds = useMemo(() => {
    const ids = new Set<string>();
    (assignment?.campaign?.resources || []).forEach((r: any) => {
      if (r?.id) ids.add(String(r.id));
    });
    return ids;
  }, [assignment]);

  // Strictly filter server lists to the current campaign to avoid bleed-over
  const filteredLots = useMemo(() => {
    const cid = String(campaignId || "");
    return (lots as any[]).filter(
      (l: any) =>
        String(l?.campaignId || "") === cid ||
        (l?.resourceId && campaignResourceIds.has(String(l.resourceId)))
    );
  }, [lots, campaignId, campaignResourceIds]);
  const filteredDistributions = useMemo(() => {
    const cid = String(campaignId || "");
    return (distributions as any[]).filter(
      (d: any) =>
        String(d?.campaignId || "") === cid ||
        (d?.resourceId && campaignResourceIds.has(String(d.resourceId)))
    );
  }, [distributions, campaignId, campaignResourceIds]);
  const filteredCollections = useMemo(() => {
    const cid = String(campaignId || "");
    return (collections as any[]).filter(
      (c: any) =>
        String(c?.campaignId || "") === cid ||
        (c?.resourceId && campaignResourceIds.has(String(c.resourceId)))
    );
  }, [collections, campaignId, campaignResourceIds]);
  const campaign = useMemo(() => {
    return {
      name: assignment?.campaign?.name || "Campaign",
      description:
        assignment?.campaign?.description ||
        "Overview of the campaign progress and key stats",
      location:
        assignment?.campaign?.location ||
        [assignment?.campaign?.city, assignment?.campaign?.district]
          .filter(Boolean)
          .join(", ") ||
        "",
      // Prefer campaign start/end; fall back to assignment
      startDate: assignment?.campaign?.startDate
        ? new Date(assignment.campaign.startDate).toLocaleDateString()
        : assignment?.startedAt
        ? new Date(assignment.startedAt).toLocaleDateString()
        : "",
      endDate: assignment?.campaign?.endDate
        ? new Date(assignment.campaign.endDate).toLocaleDateString()
        : assignment?.endedAt
        ? new Date(assignment.endedAt).toLocaleDateString()
        : "",
      type: assignment?.campaign?.type || "",
      status: assignment?.campaign?.status || "",
      isUrgent: !!assignment?.campaign?.isUrgent,
      expectedDuration: assignment?.campaign?.expectedDuration ?? null,
      volunteersJoined: assignment?.volunteers?.length || 0,
      volunteersNeeded: 0,
      resourceNeeds: {
        food:
          assignment?.stats?.collections?.byResource?.find?.(
            (r: any) => r.name?.toLowerCase?.() === "food"
          )?.targetQty ||
          assignment?.stats?.collections?.target ||
          0,
        clothes:
          assignment?.stats?.collections?.byResource?.find?.(
            (r: any) => r.name?.toLowerCase?.() === "clothes"
          )?.targetQty || 0,
        funds: 0,
      },
      resourcesCollected: {
        food:
          assignment?.stats?.collections?.byResource?.find?.(
            (r: any) => r.name?.toLowerCase?.() === "food"
          )?.collectedQty ||
          assignment?.stats?.collections?.completed ||
          0,
        clothes:
          assignment?.stats?.collections?.byResource?.find?.(
            (r: any) => r.name?.toLowerCase?.() === "clothes"
          )?.collectedQty || 0,
        funds: 0,
      },
    };
  }, [assignment]);

  const pct = (a: number, b: number) => {
    if (!b) return 0;
    return Math.max(0, Math.min(100, Math.round((a / b) * 100)));
  };

  const Row = ({ icon, text }: { icon: any; text: string }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 4,
      }}
    >
      {icon}
      <Text>{text}</Text>
    </View>
  );

  const Progress = ({ color, value }: { color: string; value: number }) => (
    <View
      style={{
        height: 8,
        backgroundColor: colors.mutedBackground,
        borderRadius: 999,
      }}
    >
      <View
        style={{
          height: 8,
          width: `${value}%`,
          backgroundColor: color,
          borderRadius: 999,
        }}
      />
    </View>
  );

  // Build a quick index of latest lot per resource to show readable info
  const latestLotByResource: Record<string, any> = React.useMemo(() => {
    const map: Record<string, any> = {};
    (filteredLots as any[]).forEach((lot: any) => {
      const id = lot?.resourceId;
      if (!id) return;
      const curr = map[id];
      const lotTime = new Date(lot?.createdAt || lot?.updatedAt || 0).getTime();
      const currTime = curr
        ? new Date(curr?.createdAt || curr?.updatedAt || 0).getTime()
        : -1;
      if (!curr || lotTime > currTime) map[id] = lot;
    });
    return map;
  }, [filteredLots]);

  // Track expand/collapse per resource
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleExpanded = (resId: string) =>
    setExpanded((prev) => ({ ...prev, [resId]: !prev[resId] }));

  // Reset UI expansion states when campaign changes to avoid carryover
  useEffect(() => {
    setExpanded({});
    setExpandedLogs({});
  }, [campaignId]);

  // Build unified recent logs (lots + distributions), newest first
  const recentLogs = useMemo(() => {
    type Log = {
      id: string;
      kind: "collection" | "distribution";
      time: number;
      title: string;
      subtitle?: string;
      icon: keyof typeof Ionicons.glyphMap;
      status?: string;
      qty?: number;
      unit?: string;
      resourceName?: string;
      category?: string;
      meta?: string[];
    };
    const resourceName = (resId: string) => {
      const cfg = assignment?.campaign?.resources?.find?.(
        (r: any) => r.id === resId
      );
      const last = (filteredLots as any[]).find((l) => l.resourceId === resId);
      return cfg?.name || last?.resourceSnapshot?.name || resId;
    };
    const resourceUnit = (resId: string) => {
      const cfg = assignment?.campaign?.resources?.find?.(
        (r: any) => r.id === resId
      );
      const last = (filteredLots as any[]).find((l) => l.resourceId === resId);
      return cfg?.unit || last?.resourceSnapshot?.unit || "";
    };

    const logs: Log[] = [];

    // Collection lots (when a collection completes, a lot is created)
    (filteredLots as any[]).forEach((l) => {
      const unit = resourceUnit(l.resourceId);
      const resName = resourceName(l.resourceId);
      const cfg = assignment?.campaign?.resources?.find?.(
        (r: any) => r.id === l.resourceId
      );
      const category = cfg?.category || l.resourceSnapshot?.category;
      logs.push({
        id: `lot:${l._id || l.id}`,
        kind: "collection",
        time: new Date(l.createdAt || l.updatedAt || Date.now()).getTime(),
        title: `Collected ${l.quantity}${unit ? ` ${unit}` : ""} of ${resName}`,
        subtitle: `Lot ${new Date(
          l.createdAt || l.updatedAt
        ).toLocaleString()}`,
        icon: "archive-outline",
        status: l.status,
        qty: l.quantity,
        unit,
        resourceName: resName,
        category,
        meta: [`${l.consumedQty}/${l.quantity} consumed`, l.status].filter(
          Boolean
        ),
      });
    });

    // Distribution jobs
    (filteredDistributions as any[]).forEach((d) => {
      const t =
        d.schedule?.completedAt ||
        d.schedule?.startedAt ||
        d.schedule?.plannedStartAt ||
        d.createdAt ||
        d.updatedAt;
      const unit = d.resourceSnapshot?.unit || resourceUnit(d.resourceId);
      const resName = d.resourceSnapshot?.name || resourceName(d.resourceId);
      const category =
        d.resourceSnapshot?.category ||
        assignment?.campaign?.resources?.find?.(
          (r: any) => r.id === d.resourceId
        )?.category;
      const qty = d.deliveredQty ?? d.targetQty;
      const status =
        d.status ||
        (d.schedule?.completedAt
          ? "completed"
          : d.schedule?.startedAt
          ? "in-progress"
          : "scheduled");
      logs.push({
        id: `dist:${d._id || d.id}`,
        kind: "distribution",
        time: new Date(t || Date.now()).getTime(),
        title: `${status[0].toUpperCase()}${status.slice(
          1
        )} distribution • ${qty}${unit ? ` ${unit}` : ""} ${
          resName ? `of ${resName}` : ""
        }`,
        subtitle:
          [d.receiverName, d.destination?.locationName, d.destination?.address]
            .filter(Boolean)
            .join(" • ") || undefined,
        icon:
          status === "completed"
            ? "checkmark-done-outline"
            : status === "in-progress"
            ? "bicycle-outline"
            : "time-outline",
        status,
        qty,
        unit,
        resourceName: resName,
        category,
        meta: [
          d.receiverName,
          d.destination?.locationName,
          d.destination?.address,
        ].filter(Boolean),
      });
    });

    // Collection jobs
    (filteredCollections as any[]).forEach((c) => {
      const t =
        c.schedule?.completedAt ||
        c.schedule?.startedAt ||
        c.schedule?.plannedStartAt ||
        c.createdAt ||
        c.updatedAt;
      const status =
        c.status ||
        (c.schedule?.completedAt
          ? "completed"
          : c.schedule?.startedAt
          ? "in-progress"
          : "scheduled");
      const unit = c.resourceSnapshot?.unit || resourceUnit(c.resourceId);
      const resName = c.resourceSnapshot?.name || resourceName(c.resourceId);
      const category =
        c.resourceSnapshot?.category ||
        assignment?.campaign?.resources?.find?.(
          (r: any) => r.id === c.resourceId
        )?.category;
      const qty = c.actualQty ?? c.targetQty;
      logs.push({
        id: `coll:${c._id || c.id}`,
        kind: "collection",
        time: new Date(t || Date.now()).getTime(),
        title: `${status[0].toUpperCase()}${status.slice(
          1
        )} collection • ${qty}${unit ? ` ${unit}` : ""} ${
          resName ? `of ${resName}` : ""
        }`,
        subtitle:
          [c.pickup?.locationName, c.pickup?.address]
            .filter(Boolean)
            .join(" • ") || undefined,
        icon:
          status === "completed"
            ? "archive-outline"
            : status === "in-progress"
            ? "walk-outline"
            : "time-outline",
        status,
        qty,
        unit,
        resourceName: resName,
        category,
        meta: [c.pickup?.locationName, c.pickup?.address].filter(Boolean),
      });
    });

    return logs
      .filter((l) => Number.isFinite(l.time))
      .sort((a, b) => b.time - a.time);
  }, [filteredLots, filteredDistributions, filteredCollections, assignment]);

  // Expand/collapse per log card
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const toggleLogExpanded = (id: string) =>
    setExpandedLogs((prev) => ({ ...prev, [id]: !prev[id] }));

  // Helpers for badges and chips
  const statusBadgeStyle = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("complete"))
      return { bg: "#dcfce7", fg: "#166534", border: "#86efac" };
    if (s.includes("progress"))
      return { bg: "#dbeafe", fg: "#1d4ed8", border: "#93c5fd" };
    if (s.includes("schedule"))
      return { bg: "#f3f4f6", fg: "#4b5563", border: "#e5e7eb" };
    if (s.includes("deplet") || s.includes("cancel"))
      return { bg: "#fee2e2", fg: "#991b1b", border: "#fecaca" };
    return { bg: "#f3f4f6", fg: "#374151", border: "#e5e7eb" };
  };
  const categoryColor = (cat?: string) => {
    const c = (cat || "").toLowerCase();
    if (c.includes("food")) return "#16a34a";
    if (c.includes("medical")) return "#0891b2";
    if (c.includes("cloth")) return "#6b7280";
    if (c.includes("fund")) return "#b45309";
    return "#6366f1";
  };

  const Chip = ({ label, color }: { label: string; color: string }) => (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: color,
      }}
    >
      <Text style={{ fontSize: 12, color }}>{label}</Text>
    </View>
  );

  if (isFetching) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8, color: colors.muted }}>
          Loading overview…
        </Text>
      </View>
    );
  }

  if (error) {
    const err: any = error;
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: spacing.lg,
        }}
      >
        <Text style={{ color: "#991b1b", fontWeight: "700", marginBottom: 6 }}>
          Failed to load campaign overview
        </Text>
        <Text style={{ color: colors.muted, textAlign: "center" }}>
          {typeof err?.data === "string"
            ? err.data
            : err?.data?.message || "Unknown error"}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xl,
          gap: spacing.lg,
        }}
      >
        {/* Live progress summary */}
        <ProgressHeader
          title="Campaign Progress"
          target={(() => {
            const snapTotal = snapshots.reduce(
              (acc: number, s: any) => acc + (s.targetQty || 0),
              0
            );
            if (snapTotal > 0) return snapTotal;
            const cfgTotal = (assignment?.campaign?.resources || []).reduce(
              (acc: number, r: any) => acc + (Number(r.quantity) || 0),
              0
            );
            return cfgTotal;
          })()}
          collected={snapshots.reduce(
            (acc: number, s: any) => acc + (s.collectedQty || 0),
            0
          )}
          distributed={snapshots.reduce(
            (acc: number, s: any) => acc + (s.distributedQty || 0),
            0
          )}
          available={
            (stockTotals as any[])?.length
              ? (stockTotals as any[]).reduce(
                  (acc: number, r: any) => acc + (r.totalAvailable || 0),
                  0
                )
              : snapshots.reduce(
                  (acc: number, s: any) => acc + (s.availableQty || 0),
                  0
                )
          }
          campaignId={campaignId as string}
          requiredResources={(assignment?.campaign?.resources || []).map(
            (r: any) => ({
              id: r.id,
              name: r.name,
              unit: r.unit,
              quantity: r.quantity,
            })
          )}
        />
        {!!stockTotals?.length && (
          <Card style={{ borderRadius: 16 }}>
            <CardHeader>
              <Text style={[typography.h3]}>Stock by Resource</Text>
            </CardHeader>
            <CardContent style={{ gap: spacing.md }}>
              {stockTotals.map((r: any) => {
                const snap = (snapshots as any[]).find(
                  (s) => s.resourceId === r.resourceId
                );
                const resourceCfg = assignment?.campaign?.resources?.find?.(
                  (cr: any) => cr.id === r.resourceId
                );
                const latest = latestLotByResource[r.resourceId];
                const unit =
                  resourceCfg?.unit || latest?.resourceSnapshot?.unit || "";
                const name =
                  resourceCfg?.name ||
                  latest?.resourceSnapshot?.name ||
                  r.resourceId;
                const lastDate = latest?.createdAt || latest?.updatedAt;
                // Show progress as collected vs target (not stock %)
                const targetSnap =
                  typeof snap?.targetQty === "number" ? snap.targetQty : 0;
                const targetCfg = Number(resourceCfg?.quantity || 0);
                const targetEff = targetSnap > 0 ? targetSnap : targetCfg;
                const collectedAmt =
                  typeof snap?.collectedQty === "number"
                    ? snap.collectedQty
                    : 0;
                const distributedAmt =
                  typeof snap?.distributedQty === "number"
                    ? snap.distributedQty
                    : 0;
                const pctOfTarget =
                  targetEff > 0
                    ? Math.round((collectedAmt / targetEff) * 100)
                    : 0;
                const isComplete =
                  targetEff > 0 &&
                  collectedAmt >= targetEff &&
                  distributedAmt >= targetEff;
                const isOpen = !!expanded[r.resourceId];
                return (
                  <View key={r.resourceId} style={{ gap: 6 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: spacing.sm,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Text style={{ fontWeight: "600" }}>{name}</Text>
                        {isComplete && (
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={16}
                            color="#16a34a"
                          />
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Text style={{ color: colors.muted }}>
                          {collectedAmt}/{targetEff}
                          {unit ? ` ${unit}` : ""}
                        </Text>
                        <Pressable
                          onPress={() => toggleExpanded(r.resourceId)}
                          style={{ padding: 6, marginRight: -6 }}
                        >
                          <Ionicons
                            name={
                              isOpen
                                ? "chevron-up-outline"
                                : "chevron-down-outline"
                            }
                            size={16}
                            color={colors.muted}
                          />
                        </Pressable>
                      </View>
                    </View>
                    <View
                      style={{
                        height: 8,
                        backgroundColor: colors.mutedBackground,
                        borderRadius: 999,
                      }}
                    >
                      <View
                        style={{
                          height: 8,
                          width: `${pctOfTarget}%`,
                          backgroundColor: colors.green,
                          borderRadius: 999,
                        }}
                      />
                    </View>
                    {!isOpen && (
                      <Text style={{ color: colors.muted, fontSize: 12 }}>
                        Target {targetEff}
                        {unit ? ` ${unit}` : ""} • Collected {collectedAmt}
                        {unit ? ` ${unit}` : ""} • Distributed {distributedAmt}
                        {unit ? ` ${unit}` : ""} • Available {r.totalAvailable}
                        {unit ? ` ${unit}` : ""}
                      </Text>
                    )}
                    {isOpen && (
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: colors.border,
                          borderRadius: 12,
                          padding: spacing.md,
                          gap: spacing.sm,
                        }}
                      >
                        <Text style={{ fontWeight: "700" }}>Details</Text>
                        <Text style={{ color: colors.muted }}>
                          Target {targetEff}
                          {unit ? ` ${unit}` : ""} • Collected {collectedAmt}
                          {unit ? ` ${unit}` : ""} • Distributed{" "}
                          {distributedAmt}
                          {unit ? ` ${unit}` : ""} • Available{" "}
                          {r.totalAvailable}
                          {unit ? ` ${unit}` : ""}
                        </Text>
                        {lastDate && (
                          <Text style={{ color: colors.muted, fontSize: 12 }}>
                            Last collected {new Date(lastDate).toLocaleString()}
                          </Text>
                        )}
                        {/* No extra lists here by request */}
                      </View>
                    )}
                  </View>
                );
              })}
            </CardContent>
          </Card>
        )}
        {/* Campaign Overview */}
        <Card style={{ borderRadius: 16 }}>
          <CardHeader>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              <Ionicons
                name="golf-outline"
                size={18}
                color={colors.cardForeground}
              />
              <Text style={[typography.h3]}>Campaign Overview</Text>
            </View>
          </CardHeader>
          <CardContent>
            <Text style={{ fontWeight: "700", marginBottom: 6 }}>
              {campaign.name}
            </Text>
            <Text style={{ color: colors.muted, marginBottom: spacing.md }}>
              {campaign.description}
            </Text>
            {/* Type */}
            {!!campaign.type && (
              <Row
                icon={
                  <Ionicons
                    name={
                      campaign.type === "medical-aid"
                        ? "medkit-outline"
                        : campaign.type === "education"
                        ? "school-outline"
                        : campaign.type === "emergency-response"
                        ? "flash-outline"
                        : campaign.type === "food-distribution" ||
                          campaign.type === "food-distributiog"
                        ? "fast-food-outline"
                        : "earth-outline"
                    }
                    size={16}
                    color={colors.muted}
                  />
                }
                text={`Type: ${campaign.type}`}
              />
            )}
            {/* Status */}
            {!!campaign.status && (
              <Row
                icon={
                  <Ionicons
                    name="pulse-outline"
                    size={16}
                    color={colors.muted}
                  />
                }
                text={`Status: ${campaign.status}`}
              />
            )}
            {/* Urgency */}
            <Row
              icon={
                <Ionicons
                  name={
                    campaign.isUrgent
                      ? "alert-circle-outline"
                      : "information-circle-outline"
                  }
                  size={16}
                  color={campaign.isUrgent ? "#dc2626" : colors.muted}
                />
              }
              text={`Urgent: ${campaign.isUrgent ? "Yes" : "No"}`}
            />
            {/* Expected duration */}
            {campaign.expectedDuration !== null && (
              <Row
                icon={
                  <Ionicons
                    name="hourglass-outline"
                    size={16}
                    color={colors.muted}
                  />
                }
                text={`Expected duration: ${campaign.expectedDuration} days`}
              />
            )}
            <Row
              icon={
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={colors.muted}
                />
              }
              text={campaign.location}
            />
            <Row
              icon={
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={colors.muted}
                />
              }
              text={`${campaign.startDate} - ${campaign.endDate}`}
            />
            <Row
              icon={
                <Ionicons
                  name="people-outline"
                  size={16}
                  color={colors.muted}
                />
              }
              text={`${campaign.volunteersJoined}/${campaign.volunteersNeeded} volunteers`}
            />
          </CardContent>
        </Card>

        {/* Recent Logs & Details */}
        <Card style={{ borderRadius: 16 }}>
          <CardHeader>
            <Text style={[typography.h3]}>Recent Logs & Details</Text>
          </CardHeader>
          <CardContent style={{ gap: spacing.md }}>
            {recentLogs.length === 0 && (
              <View
                style={{
                  gap: 6,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  padding: spacing.md,
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
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: colors.mutedBackground,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name="information-circle-outline"
                      size={18}
                      color={colors.muted}
                    />
                  </View>
                  <Text style={{ fontWeight: "600" }}>No recent activity</Text>
                </View>
                <Text style={{ color: colors.muted }}>
                  Start collecting or create distributions to see activity here.
                </Text>
              </View>
            )}
            {recentLogs.map((log) => {
              const isOpen = !!expandedLogs[log.id];
              const badge = statusBadgeStyle(log.status);
              const catColor = categoryColor(log.category);
              return (
                <View
                  key={log.id}
                  style={{
                    flexDirection: "row",
                    gap: spacing.md,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: spacing.md,
                    alignItems: "flex-start",
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor:
                        log.kind === "collection" ? "#dbeafe" : "#dcfce7",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={log.icon}
                      size={18}
                      color={log.kind === "collection" ? "#1d4ed8" : "#166534"}
                    />
                  </View>
                  <View style={{ flex: 1, gap: 6 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: spacing.sm,
                      }}
                    >
                      <Text
                        style={{ fontWeight: "600", flex: 1 }}
                        numberOfLines={2}
                      >
                        {log.title}
                      </Text>
                      {!!log.status && (
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 999,
                            backgroundColor: badge.bg,
                            borderWidth: 1,
                            borderColor: badge.border,
                          }}
                        >
                          <Text style={{ fontSize: 12, color: badge.fg }}>
                            {log.status}
                          </Text>
                        </View>
                      )}
                      <Pressable
                        onPress={() => toggleLogExpanded(log.id)}
                        style={{ padding: 4, marginLeft: 4 }}
                      >
                        <Ionicons
                          name={
                            isOpen
                              ? "chevron-up-outline"
                              : "chevron-down-outline"
                          }
                          size={18}
                          color={colors.muted}
                        />
                      </Pressable>
                    </View>

                    {/* Chips row */}
                    <View
                      style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                    >
                      {!!log.resourceName && (
                        <Chip label={log.resourceName} color={catColor} />
                      )}
                      {!!log.qty && (
                        <Chip
                          label={`${log.qty}${log.unit ? ` ${log.unit}` : ""}`}
                          color={"#4b5563"}
                        />
                      )}
                    </View>

                    {/* Collapsible details to avoid overflow */}
                    {isOpen ? (
                      <View style={{ gap: 4 }}>
                        <Text style={{ color: colors.muted, fontSize: 12 }}>
                          {new Date(log.time).toLocaleString()}
                        </Text>
                        {!!log.subtitle && (
                          <Text style={{ color: colors.muted }}>
                            {log.subtitle}
                          </Text>
                        )}
                        {!!log.meta?.length && (
                          <Text style={{ color: colors.muted }}>
                            {log.meta.join(" • ")}
                          </Text>
                        )}
                      </View>
                    ) : (
                      !!log.subtitle && (
                        <Text style={{ color: colors.muted }} numberOfLines={1}>
                          {log.subtitle}
                        </Text>
                      )
                    )}
                  </View>
                </View>
              );
            })}
          </CardContent>
        </Card>

        {/* Volunteer Team (compact) */}
        <Card style={{ borderRadius: 16 }}>
          <CardHeader>
            <Text style={[typography.h3]}>Volunteer Team</Text>
          </CardHeader>
          <CardContent style={{ gap: spacing.md }}>
            {["Alice Johnson", "Bob Wilson", "Carol Davis"].map((name, idx) => (
              <View
                key={idx}
                style={{
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
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: colors.primary,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name="person-outline"
                      size={16}
                      color={colors.primaryForeground}
                    />
                  </View>
                  <View>
                    <Text style={{ fontWeight: "600", fontSize: 14 }}>
                      {name}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>
                      {[8, 5, 12][idx]} tasks completed
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text style={{ fontSize: 12, color: colors.muted }}>
                    Call
                  </Text>
                </View>
              </View>
            ))}
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}
