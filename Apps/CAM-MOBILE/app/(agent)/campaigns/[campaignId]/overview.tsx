import React, { useMemo } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
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

  const assignment = data as any;
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
      startDate: assignment?.startedAt
        ? new Date(assignment.startedAt).toLocaleDateString()
        : "",
      endDate: assignment?.endedAt
        ? new Date(assignment.endedAt).toLocaleDateString()
        : "",
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
    (lots as any[]).forEach((lot: any) => {
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
  }, [lots]);

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
                const pct =
                  r.totalQuantity > 0
                    ? Math.round(
                        ((r.totalQuantity - r.totalConsumed) /
                          r.totalQuantity) *
                          100
                      )
                    : 0;
                return (
                  <View key={r.resourceId} style={{ gap: 6 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontWeight: "600" }}>{name}</Text>
                      <Text style={{ color: colors.muted }}>{pct}%</Text>
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
                          width: `${pct}%`,
                          backgroundColor: colors.green,
                          borderRadius: 999,
                        }}
                      />
                    </View>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>
                      Available {r.totalAvailable}
                      {unit ? ` ${unit}` : ""}
                      {typeof snap?.targetQty === "number"
                        ? ` • Target ${snap.targetQty}`
                        : ""}
                      {typeof snap?.collectedQty === "number"
                        ? ` • Collected ${snap.collectedQty}`
                        : ""}
                      {typeof snap?.distributedQty === "number"
                        ? ` • Distributed ${snap.distributedQty}`
                        : ""}
                      {lastDate
                        ? ` • Last collected ${new Date(
                            lastDate
                          ).toLocaleString()}`
                        : ""}
                    </Text>
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

        {/* Collection Logs (mocked for now) */}
        <Card style={{ borderRadius: 16 }}>
          <CardHeader>
            <Text style={[typography.h3]}>Collection Logs</Text>
          </CardHeader>
          <CardContent style={{ gap: spacing.md }}>
            {[
              {
                time: new Date().toLocaleString(),
                text: "No recent collections. Start collecting to see logs here.",
              },
            ].map((log, i) => (
              <View
                key={i}
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
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontWeight: "600" }}>Info</Text>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>
                    {log.time}
                  </Text>
                </View>
                <Text style={{ color: colors.cardForeground }}>{log.text}</Text>
              </View>
            ))}
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
