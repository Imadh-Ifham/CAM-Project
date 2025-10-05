import React from "react";
import { View, Text, ScrollView } from "react-native";
import { colors } from "../../../../src/styles/colors";
import { spacing } from "../../../../src/styles/spacing";
import { typography } from "../../../../src/styles/typography";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../src/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";

export default function CampaignOverview() {
  // TODO: wire to API by campaignId from params
  const campaign = {
    name: "Winter Relief 2024",
    description:
      "Emergency winter supplies distribution for affected families in downtown area",
    location: "Downtown Community Center",
    startDate: "2024-01-15",
    endDate: "2024-02-28",
    volunteersJoined: 12,
    volunteersNeeded: 20,
    resourceNeeds: { food: 500, clothes: 200, funds: 10000 },
    resourcesCollected: { food: 320, clothes: 140, funds: 6500 },
  };

  const pct = (a: number, b: number) => Math.round((a / b) * 100);

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

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xl,
          gap: spacing.lg,
        }}
      >
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
