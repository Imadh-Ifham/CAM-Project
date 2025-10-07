import React from "react";
import { View, Text, Alert, Linking, ScrollView } from "react-native";
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
import { useLocalSearchParams } from "expo-router";

export default function VolunteerCampaignOverview() {
  const params = useLocalSearchParams();
  const campaignId = String(params.campaignId || "1");

  // Mock campaign data (replace with API later)
  const campaign = {
    id: Number(campaignId),
    name: "Winter Relief 2024",
    description: "Emergency winter supplies for affected families",
    location: "Downtown Community Center",
    startDate: "2024-01-15",
    endDate: "2024-02-28",
    agent: "John Doe",
    agentPhone: "+1234567890",
    volunteers: 12,
    volunteersNeeded: 20,
    status: "Active" as const,
  };

  const ProgressBar = ({
    percent,
    color,
  }: {
    percent: number;
    color: string;
  }) => (
    <View
      style={{
        height: 8,
        backgroundColor: colors.mutedBackground,
        borderRadius: 999,
        marginTop: spacing.xs,
      }}
    >
      <View
        style={{
          height: 8,
          borderRadius: 999,
          width: `${percent}%`,
          backgroundColor: color,
        }}
      />
    </View>
  );

  const callAgent = async () => {
    const url = `tel:${campaign.agentPhone}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert("Unable to start call", campaign.agentPhone);
    } catch (e: any) {
      Alert.alert("Unable to start call", e?.message || "");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Section: Campaign Overview */}
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
                name="radio-button-on-outline"
                size={18}
                color={colors.cardForeground}
              />
              <Text style={[typography.h3]}>Campaign Overview</Text>
            </View>
          </CardHeader>
          <CardContent>
            <Text
              style={{
                fontWeight: "700",
                fontSize: 16,
                color: colors.cardForeground,
                marginBottom: 4,
              }}
            >
              {campaign.name}
            </Text>
            <Text style={{ color: colors.muted, marginBottom: spacing.md }}>
              {campaign.description}
            </Text>

            <View style={{ gap: 8 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={colors.muted}
                />
                <Text style={{ color: colors.cardForeground }}>
                  {campaign.location}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={colors.muted}
                />
                <Text style={{ color: colors.cardForeground }}>
                  {campaign.startDate} - {campaign.endDate}
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
                <Text style={{ color: colors.cardForeground }}>
                  Agent: {campaign.agent}
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
                <Text style={{ color: colors.cardForeground }}>
                  {campaign.volunteers}/{campaign.volunteersNeeded} volunteers
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Section: My Contribution Progress */}
        <Card style={{ borderRadius: 16, marginTop: spacing.lg }}>
          <CardHeader>
            <Text style={[typography.h3]}>My Contribution Progress</Text>
          </CardHeader>
          <CardContent>
            {/* Collections */}
            <View style={{ marginBottom: spacing.md }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons
                    name="cube-outline"
                    size={16}
                    color={colors.cardForeground}
                  />
                  <Text style={{ color: colors.cardForeground }}>
                    Collections Assigned
                  </Text>
                </View>
                <Text style={{ color: colors.cardForeground }}>
                  2 / 3 Active
                </Text>
              </View>
              <ProgressBar percent={67} color={colors.blue} />
              <Text style={{ color: colors.muted, marginTop: 4, fontSize: 12 }}>
                67% of assigned collections in progress
              </Text>
            </View>

            {/* Distributions */}
            <View style={{ marginBottom: spacing.md }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons
                    name="bus-outline"
                    size={16}
                    color={colors.cardForeground}
                  />
                  <Text style={{ color: colors.cardForeground }}>
                    Distributions Assigned
                  </Text>
                </View>
                <Text style={{ color: colors.cardForeground }}>
                  1 / 3 Active
                </Text>
              </View>
              <ProgressBar percent={33} color={colors.green} />
              <Text style={{ color: colors.muted, marginTop: 4, fontSize: 12 }}>
                33% of assigned distributions active
              </Text>
            </View>

            {/* Tasks */}
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons
                    name="clipboard-outline"
                    size={16}
                    color={colors.cardForeground}
                  />
                  <Text style={{ color: colors.cardForeground }}>
                    Tasks Progress
                  </Text>
                </View>
                <Text style={{ color: colors.cardForeground }}>
                  1 / 3 Complete
                </Text>
              </View>
              <ProgressBar percent={33} color={colors.indigo} />
              <Text style={{ color: colors.muted, marginTop: 4, fontSize: 12 }}>
                33% of assigned tasks completed
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Section: Campaign Agent */}
        <Card style={{ borderRadius: 16, marginTop: spacing.lg }}>
          <CardHeader>
            <Text style={[typography.h3]}>Campaign Agent</Text>
          </CardHeader>
          <CardContent>
            <View
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
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.cardForeground,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={colors.card}
                  />
                </View>
                <View>
                  <Text
                    style={{ fontWeight: "700", color: colors.cardForeground }}
                  >
                    {campaign.agent}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>
                    Campaign Leader
                  </Text>
                </View>
              </View>
              <Button variant="outline" onPress={callAgent}>
                <Text
                  style={{ color: colors.cardForeground, fontWeight: "700" }}
                >
                  Contact
                </Text>
              </Button>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}
