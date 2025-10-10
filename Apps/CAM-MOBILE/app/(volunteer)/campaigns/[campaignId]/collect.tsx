import React from "react";
import { View, Text, ScrollView, Alert } from "react-native";
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

type CollectionItem = {
  id: number;
  resource: string;
  target: number;
  location: string;
  assignedBy: string;
  status: "Assigned" | "In Progress" | "Completed";
  dueDate: string;
  instructions: string;
  progress: number; // collected so far
};

export default function VolunteerCampaignCollect() {
  // Mock collections assigned by agent to this volunteer
  const assignedCollections: CollectionItem[] = [
    {
      id: 1,
      resource: "Food Packages",
      target: 25,
      location: "Local Grocery Store",
      assignedBy: "John Doe",
      status: "Assigned",
      dueDate: "2024-01-20",
      instructions:
        "Collect fresh produce and canned goods from the donation area",
      progress: 0,
    },
    {
      id: 2,
      resource: "Clothing Items",
      target: 15,
      location: "Community Center",
      assignedBy: "John Doe",
      status: "In Progress",
      dueDate: "2024-01-19",
      instructions: "Focus on winter coats and warm clothing items",
      progress: 8,
    },
    {
      id: 3,
      resource: "Medical Supplies",
      target: 10,
      location: "City Hospital",
      assignedBy: "John Doe",
      status: "Completed",
      dueDate: "2024-01-17",
      instructions: "Collect first aid kits from the donation desk",
      progress: 10,
    },
  ];

  const activeCount = assignedCollections.filter(
    (c) => c.status !== "Completed"
  ).length;

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

  const StatusBadge = ({ status }: { status: CollectionItem["status"] }) => {
    const styleMap: Record<
      CollectionItem["status"],
      { bg: string; text: string }
    > = {
      Assigned: { bg: "#f59e0b", text: "#fff" },
      "In Progress": { bg: colors.blue, text: "#fff" },
      Completed: { bg: colors.green, text: "#fff" },
    };
    const { bg, text } = styleMap[status];
    return (
      <View
        style={{
          backgroundColor: bg,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
        }}
      >
        <Text style={{ color: text, fontWeight: "700", fontSize: 12 }}>
          {status}
        </Text>
      </View>
    );
  };

  const startCollection = (id: number) => {
    Alert.alert(
      "Start Collection",
      "Collection started! Follow the instructions."
    );
  };
  const updateProgress = (id: number) => {
    Alert.alert("Update Progress", "Progress updated. Keep it up!");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: spacing.md,
          }}
        >
          <Text style={[typography.h2]}>My Collection Tasks</Text>
          <View
            style={{
              borderColor: colors.blue,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 999,
            }}
          >
            <Text
              style={{ color: colors.blue, fontWeight: "700", fontSize: 12 }}
            >
              {activeCount} Active
            </Text>
          </View>
        </View>

        {/* Cards */}
        <View style={{ gap: spacing.lg }}>
          {assignedCollections.map((c) => {
            const percent = Math.min(
              100,
              Math.round((c.progress / c.target) * 100)
            );
            return (
              <Card key={c.id} style={{ borderRadius: 16 }}>
                <CardContent style={{ padding: spacing.lg }}>
                  {/* Title + Status */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: spacing.sm,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontWeight: "700",
                          color: colors.cardForeground,
                        }}
                      >
                        {c.resource}
                      </Text>
                      <Text style={{ color: colors.muted, fontSize: 12 }}>
                        Target: {c.target} items
                      </Text>
                    </View>
                    <StatusBadge status={c.status} />
                  </View>

                  {/* Meta */}
                  <View style={{ gap: 6, marginBottom: spacing.md }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color={colors.muted}
                      />
                      <Text
                        style={{ color: colors.cardForeground, fontSize: 13 }}
                      >
                        {c.location}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Ionicons
                        name="person-outline"
                        size={14}
                        color={colors.muted}
                      />
                      <Text
                        style={{ color: colors.cardForeground, fontSize: 13 }}
                      >
                        Assigned by: {c.assignedBy}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={14}
                        color={colors.muted}
                      />
                      <Text
                        style={{ color: colors.cardForeground, fontSize: 13 }}
                      >
                        Due: {c.dueDate}
                      </Text>
                    </View>
                  </View>

                  {/* Progress (except when only Assigned) */}
                  {c.status !== "Assigned" && (
                    <View style={{ marginBottom: spacing.md }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <Text style={{ color: colors.muted, fontSize: 12 }}>
                          Progress
                        </Text>
                        <Text style={{ color: colors.muted, fontSize: 12 }}>
                          {c.progress}/{c.target}
                        </Text>
                      </View>
                      <ProgressBar percent={percent} color={colors.blue} />
                    </View>
                  )}

                  {/* Instructions */}
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
                        marginBottom: 4,
                      }}
                    >
                      Instructions:
                    </Text>
                    <Text
                      style={{ color: colors.cardForeground, fontSize: 13 }}
                    >
                      {c.instructions}
                    </Text>
                  </View>

                  {/* Actions */}
                  {c.status === "Assigned" && (
                    <Button onPress={() => startCollection(c.id)}>
                      <Text style={{ color: "#fff", fontWeight: "700" }}>
                        Start Collection
                      </Text>
                    </Button>
                  )}
                  {c.status === "In Progress" && (
                    <View style={{ gap: spacing.sm }}>
                      <Button onPress={() => updateProgress(c.id)}>
                        <Text style={{ color: colors.card, fontWeight: "700" }}>
                          Update Progress
                        </Text>
                      </Button>
                    </View>
                  )}
                  {c.status === "Completed" && (
                    <View
                      style={{
                        backgroundColor: "#d1fae5",
                        borderRadius: 12,
                        padding: spacing.md,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#065f46", fontSize: 13 }}>
                        ✅ Collection completed successfully
                      </Text>
                    </View>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
