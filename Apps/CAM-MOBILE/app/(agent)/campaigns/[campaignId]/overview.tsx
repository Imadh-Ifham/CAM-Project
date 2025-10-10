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
          target={snapshots.reduce(
            (acc: number, s: any) => acc + (s.targetQty || 0),
            0
          )}
          collected={snapshots.reduce(
            (acc: number, s: any) => acc + (s.collectedQty || 0),
            0
          )}
          distributed={snapshots.reduce(
            (acc: number, s: any) => acc + (s.distributedQty || 0),
            0
          )}
          available={snapshots.reduce(
            (acc: number, s: any) => acc + (s.availableQty || 0),
            0
          )}
        />
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

        {/* Resource Collection Progress */}
        <Card style={{ borderRadius: 16 }}>
          <CardHeader>
            <Text style={[typography.h3]}>Resource Collection Progress</Text>
          </CardHeader>
          <CardContent style={{ gap: spacing.md }}>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons
                    name="restaurant-outline"
                    size={16}
                    color={colors.cardForeground}
                  />
                  <Text>Food Packages</Text>
                </View>
                <Text>
                  {campaign.resourcesCollected.food}/
                  {campaign.resourceNeeds.food}
                </Text>
              </View>
              <View style={{ marginTop: 6 }}>
                <Progress
                  color={colors.green}
                  value={pct(
                    campaign.resourcesCollected.food,
                    campaign.resourceNeeds.food
                  )}
                />
              </View>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>
                {pct(
                  campaign.resourcesCollected.food,
                  campaign.resourceNeeds.food
                )}
                % Complete
              </Text>
            </View>

            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons
                    name="shirt-outline"
                    size={16}
                    color={colors.cardForeground}
                  />
                  <Text>Clothing Items</Text>
                </View>
                <Text>
                  {campaign.resourcesCollected.clothes}/
                  {campaign.resourceNeeds.clothes}
                </Text>
              </View>
              <View style={{ marginTop: 6 }}>
                <Progress
                  color={colors.blue}
                  value={pct(
                    campaign.resourcesCollected.clothes,
                    campaign.resourceNeeds.clothes
                  )}
                />
              </View>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>
                {pct(
                  campaign.resourcesCollected.clothes,
                  campaign.resourceNeeds.clothes
                )}
                % Complete
              </Text>
            </View>

            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons
                    name="cash-outline"
                    size={16}
                    color={colors.cardForeground}
                  />
                  <Text>Funds</Text>
                </View>
                <Text>
                  ${campaign.resourcesCollected.funds}/$
                  {campaign.resourceNeeds.funds}
                </Text>
              </View>
              <View style={{ marginTop: 6 }}>
                <Progress
                  color="#a855f7"
                  value={pct(
                    campaign.resourcesCollected.funds,
                    campaign.resourceNeeds.funds
                  )}
                />
              </View>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>
                {pct(
                  campaign.resourcesCollected.funds,
                  campaign.resourceNeeds.funds
                )}
                % Complete
              </Text>
            </View>
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
