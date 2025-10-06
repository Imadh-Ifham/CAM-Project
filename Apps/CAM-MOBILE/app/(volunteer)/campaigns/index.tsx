import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { colors } from "../../../src/styles/colors";
import { spacing } from "../../../src/styles/spacing";
import { typography } from "../../../src/styles/typography";
import { Card, CardContent, CardHeader } from "../../../src/components/ui/Card";
import { Button } from "../../../src/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type CampaignStatus = "Active" | "Available" | "Completed";

type Campaign = {
  id: number;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  agent: string;
  agentPhone: string;
  volunteers: number;
  volunteersNeeded: number;
  status: CampaignStatus;
  locations: number;
  taskTypes: string;
  resourceNeeds: { food: number; clothes: number; funds: number };
};

export default function VolunteerCampaignsIndex() {
  const router = useRouter();

  // Mock data (replace with API later)
  const campaigns: Campaign[] = [
    {
      id: 1,
      name: "Winter Relief 2024",
      description: "Emergency winter supplies for affected families",
      location: "Downtown Community Center",
      startDate: "2024-01-15",
      endDate: "2024-02-28",
      agent: "John Doe",
      agentPhone: "+1234567890",
      volunteers: 12,
      volunteersNeeded: 20,
      status: "Active",
      locations: 8,
      taskTypes: "Collection, packaging, delivery",
      resourceNeeds: { food: 500, clothes: 200, funds: 10000 },
    },
    {
      id: 2,
      name: "Flood Response",
      description: "Flood relief operations in affected areas",
      location: "Regional Emergency Center",
      startDate: "2024-02-01",
      endDate: "2024-03-15",
      agent: "Jane Smith",
      agentPhone: "+1234567891",
      volunteers: 8,
      volunteersNeeded: 15,
      status: "Available",
      locations: 5,
      taskTypes: "Emergency distribution, logistics",
      resourceNeeds: { food: 300, clothes: 150, funds: 8000 },
    },
    {
      id: 3,
      name: "Community Outreach",
      description: "Regular community support activities",
      location: "City Hall",
      startDate: "2024-03-01",
      endDate: "2024-04-30",
      agent: "Mike Johnson",
      agentPhone: "+1234567892",
      volunteers: 15,
      volunteersNeeded: 25,
      status: "Available",
      locations: 12,
      taskTypes: "Door-to-door collection, community events",
      resourceNeeds: { food: 800, clothes: 300, funds: 15000 },
    },
    {
      id: 4,
      name: "Emergency Shelter Setup",
      description: "Temporary shelter establishment for displaced families",
      location: "West Side Community",
      startDate: "2023-12-15",
      endDate: "2024-01-15",
      agent: "Sarah Wilson",
      agentPhone: "+1234567893",
      volunteers: 30,
      volunteersNeeded: 30,
      status: "Completed",
      locations: 6,
      taskTypes: "Setup, maintenance, distribution",
      resourceNeeds: { food: 800, clothes: 400, funds: 20000 },
    },
    {
      id: 5,
      name: "Spring Cleanup Initiative",
      description: "Community cleanup and resource recovery program",
      location: "Multiple Districts",
      startDate: "2024-03-15",
      endDate: "2024-04-30",
      agent: "Tom Davis",
      agentPhone: "+1234567894",
      volunteers: 18,
      volunteersNeeded: 25,
      status: "Available",
      locations: 10,
      taskTypes: "Collection, sorting, environmental cleanup",
      resourceNeeds: { food: 200, clothes: 600, funds: 8000 },
    },
  ];

  type FilterKey = "all" | "available" | "active" | "completed";
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return campaigns;
    if (filter === "available")
      return campaigns.filter((c) => c.status === "Available");
    if (filter === "active")
      return campaigns.filter((c) => c.status === "Active");
    return campaigns.filter((c) => c.status === "Completed");
  }, [filter]);

  const counts = useMemo(
    () => ({
      all: campaigns.length,
      available: campaigns.filter((c) => c.status === "Available").length,
      active: campaigns.filter((c) => c.status === "Active").length,
      completed: campaigns.filter((c) => c.status === "Completed").length,
    }),
    []
  );

  const badgeText =
    filter === "all" ? `${counts.all} Total` : `${filtered.length} Found`;

  const StatusPill = ({ s }: { s: CampaignStatus }) => {
    const bg =
      s === "Active"
        ? colors.blue
        : s === "Completed"
        ? colors.green
        : colors.muted;
    return (
      <View
        style={{
          backgroundColor: bg,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>
          {s}
        </Text>
      </View>
    );
  };

  const FilterButton = ({
    label,
    value,
  }: {
    label: string;
    value: FilterKey;
  }) => {
    const selected = filter === value;
    const style = (() => {
      if (value === "available")
        return selected
          ? { backgroundColor: colors.blue, borderColor: colors.blue }
          : {
              backgroundColor: colors.mutedBackground,
              borderColor: colors.border,
            };
      if (value === "active")
        return selected
          ? { backgroundColor: colors.green, borderColor: colors.green }
          : { backgroundColor: "#ecfdf5", borderColor: colors.border };
      if (value === "completed")
        return selected
          ? { backgroundColor: "#9ca3af", borderColor: "#9ca3af" }
          : {
              backgroundColor: colors.mutedBackground,
              borderColor: colors.border,
            };
      // all
      return selected
        ? {
            backgroundColor: colors.cardForeground,
            borderColor: colors.cardForeground,
          }
        : {
            backgroundColor: colors.mutedBackground,
            borderColor: colors.border,
          };
    })();

    const textColor =
      selected &&
      value !== "active" &&
      value !== "available" &&
      value !== "completed"
        ? colors.card
        : selected
        ? "#fff"
        : colors.cardForeground;

    return (
      <Button
        variant="outline"
        size="sm"
        onPress={() => setFilter(value)}
        style={{
          flex: 1,
          height: 40,
          borderColor: style.borderColor,
          backgroundColor: style.backgroundColor,
        }}
        textStyle={{ color: textColor, fontWeight: "700" }}
      >
        {label}
      </Button>
    );
  };

  const onManage = (c: Campaign) => {
    router.replace(`/(volunteer)/campaigns/${c.id}/overview` as any);
  };

  const onRequestJoin = (c: Campaign) => {
    Alert.alert(
      "Request sent",
      `You've requested to join ${c.name} (Agent: ${c.agent}).`
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xl,
        }}
      >
        {/* Title + count badge */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={typography.h2}>Campaigns</Text>
          <View
            style={{
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              paddingHorizontal: spacing.md,
              paddingVertical: 6,
              borderRadius: 999,
            }}
          >
            <Text style={{ color: colors.muted }}>{badgeText}</Text>
          </View>
        </View>

        {/* Filter Card */}
        <Card style={{ borderRadius: 16, marginTop: spacing.lg }}>
          <CardHeader>
            <Text style={[typography.h3]}>Filter Campaigns</Text>
          </CardHeader>
          <CardContent>
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <FilterButton label={`All (${counts.all})`} value="all" />
              <FilterButton
                label={`Available (${counts.available})`}
                value="available"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: spacing.md,
                marginTop: spacing.md,
              }}
            >
              <FilterButton
                label={`Active (${counts.active})`}
                value="active"
              />
              <FilterButton
                label={`Completed (${counts.completed})`}
                value="completed"
              />
            </View>
          </CardContent>
        </Card>

        {/* Campaign list */}
        <View style={{ marginTop: spacing.lg, gap: spacing.lg }}>
          {filtered.map((c) => (
            <Card key={c.id} style={{ borderRadius: 16 }}>
              <CardContent style={{ padding: spacing.lg }}>
                {/* Title + status */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: spacing.sm,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 16,
                      color: colors.cardForeground,
                    }}
                  >
                    {c.name}
                  </Text>
                  <StatusPill s={c.status} />
                </View>
                <Text style={{ color: colors.muted, marginBottom: spacing.md }}>
                  {c.description}
                </Text>

                {/* Meta rows */}
                <View style={{ gap: 6, marginBottom: spacing.md }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color={colors.muted}
                    />
                    <Text style={{ color: colors.cardForeground }}>
                      {c.location}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={colors.muted}
                    />
                    <Text style={{ color: colors.cardForeground }}>
                      {c.startDate} - {c.endDate}
                    </Text>
                  </View>
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
                        gap: 6,
                      }}
                    >
                      <Ionicons
                        name="person-outline"
                        size={16}
                        color={colors.muted}
                      />
                      <Text style={{ color: colors.cardForeground }}>
                        Agent: {c.agent}
                      </Text>
                    </View>
                    <Text style={{ color: colors.muted }}>
                      {c.volunteers}/{c.volunteersNeeded} volunteers
                    </Text>
                  </View>
                </View>

                {/* Tasks + resources panel */}
                <View
                  style={{
                    backgroundColor: colors.mutedBackground,
                    borderRadius: 12,
                    padding: spacing.md,
                    marginBottom: spacing.md,
                  }}
                >
                  <Text
                    style={{
                      color: colors.muted,
                      fontSize: 12,
                      marginBottom: 6,
                    }}
                  >
                    Tasks: {c.taskTypes}
                  </Text>
                  <View style={{ flexDirection: "row", gap: spacing.lg }}>
                    {!!c.resourceNeeds.food && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Ionicons
                          name="restaurant-outline"
                          size={14}
                          color={colors.cardForeground}
                        />
                        <Text style={{ color: colors.cardForeground }}>
                          {c.resourceNeeds.food} food
                        </Text>
                      </View>
                    )}
                    {!!c.resourceNeeds.clothes && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Ionicons
                          name="shirt-outline"
                          size={14}
                          color={colors.cardForeground}
                        />
                        <Text style={{ color: colors.cardForeground }}>
                          {c.resourceNeeds.clothes} clothes
                        </Text>
                      </View>
                    )}
                    {!!c.resourceNeeds.funds && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Ionicons
                          name="cash-outline"
                          size={14}
                          color={colors.cardForeground}
                        />
                        <Text style={{ color: colors.cardForeground }}>
                          ${c.resourceNeeds.funds}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* CTA */}
                {c.status === "Active" && (
                  <Button
                    onPress={() => onManage(c)}
                    style={{ width: "100%", backgroundColor: colors.green }}
                  >
                    Manage Campaign
                  </Button>
                )}
                {c.status === "Available" && (
                  <Button
                    onPress={() => onRequestJoin(c)}
                    style={{ width: "100%", backgroundColor: colors.orange }}
                  >
                    Request to Join Agent
                  </Button>
                )}
                {c.status === "Completed" && (
                  <Button
                    variant="outline"
                    disabled
                    style={{
                      width: "100%",
                      backgroundColor: colors.mutedBackground,
                      borderColor: colors.mutedBackground,
                    }}
                    textStyle={{ color: colors.muted, fontWeight: "700" }}
                  >
                    Campaign Completed
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
