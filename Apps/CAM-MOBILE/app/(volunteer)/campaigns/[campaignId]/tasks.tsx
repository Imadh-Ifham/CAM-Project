import React from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { colors } from "../../../../src/styles/colors";
import { spacing } from "../../../../src/styles/spacing";
import { typography } from "../../../../src/styles/typography";
import { Card, CardContent } from "../../../../src/components/ui/Card";
import { Button } from "../../../../src/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";

type TaskItem = {
  id: number;
  title: string;
  description: string;
  assignedBy: string;
  status: "Active" | "Pending" | "Completed";
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  location: string;
  estimatedTime: string;
  taskType: string;
  instructions: string;
};

export default function VolunteerCampaignTasks() {
  const assignedTasks: TaskItem[] = [
    {
      id: 1,
      title: "Pack Food Packages",
      description:
        "Help pack 30 food packages for distribution to local families",
      assignedBy: "John Doe",
      status: "Active",
      priority: "High",
      dueDate: "2024-01-22",
      location: "Community Center Warehouse",
      estimatedTime: "3 hours",
      taskType: "Packaging",
      instructions:
        "Work with the packaging team. Focus on family-sized portions.",
    },
    {
      id: 2,
      title: "Community Survey",
      description: "Conduct needs assessment survey in the downtown area",
      assignedBy: "John Doe",
      status: "Pending",
      priority: "Medium",
      dueDate: "2024-01-25",
      location: "Downtown District",
      estimatedTime: "4 hours",
      taskType: "Other",
      instructions:
        "Use the provided tablet and survey forms. Focus on elderly residents.",
    },
    {
      id: 3,
      title: "Transport Supplies",
      description:
        "Assist with transportation of collected items to storage facility",
      assignedBy: "John Doe",
      status: "Completed",
      priority: "Low",
      dueDate: "2024-01-18",
      location: "Storage Facility B",
      estimatedTime: "2 hours",
      taskType: "Delivery",
      instructions:
        "Completed successfully. Items safely transported and cataloged.",
    },
  ];

  const activeCount = assignedTasks.filter(
    (t) => t.status !== "Completed"
  ).length;

  const StatusBadge = ({ status }: { status: TaskItem["status"] }) => {
    const map: Record<TaskItem["status"], string> = {
      Pending: "#f59e0b",
      Active: colors.blue,
      Completed: colors.green,
    };
    const bg = map[status];
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
          {status}
        </Text>
      </View>
    );
  };

  const PriorityBadge = ({ priority }: { priority: TaskItem["priority"] }) => {
    const map: Record<TaskItem["priority"], { bg: string; text: string }> = {
      High: { bg: "#fee2e2", text: "#dc2626" },
      Medium: { bg: "#fef3c7", text: "#d97706" },
      Low: { bg: "#dcfce7", text: "#16a34a" },
    };
    const { bg, text } = map[priority];
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
          {priority}
        </Text>
      </View>
    );
  };

  const acceptTask = (id: number) => {
    Alert.alert("Accept Task", "Task accepted! You can start working on it.");
  };
  const markComplete = (id: number) => {
    Alert.alert(
      "Mark Complete",
      "Task marked as complete! Your agent will review it."
    );
  };
  const contactAgent = (id: number) => {
    Alert.alert("Contact Agent", "Contact details coming soon.");
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
          <Text style={[typography.h2]}>My Assigned Tasks</Text>
          <View
            style={{
              borderColor: colors.indigo,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 999,
            }}
          >
            <Text
              style={{ color: colors.indigo, fontWeight: "700", fontSize: 12 }}
            >
              {activeCount} Active
            </Text>
          </View>
        </View>

        {/* List */}
        <View style={{ gap: spacing.lg }}>
          {assignedTasks.map((t) => (
            <Card key={t.id} style={{ borderRadius: 16 }}>
              <CardContent style={{ padding: spacing.lg }}>
                {/* Title + badges */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
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
                      {t.title}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>
                      {t.description}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end", gap: 6 }}>
                    <StatusBadge status={t.status} />
                    <PriorityBadge priority={t.priority} />
                  </View>
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
                      name="person-outline"
                      size={14}
                      color={colors.muted}
                    />
                    <Text
                      style={{ color: colors.cardForeground, fontSize: 13 }}
                    >
                      Assigned by: {t.assignedBy}
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
                      name="location-outline"
                      size={14}
                      color={colors.muted}
                    />
                    <Text
                      style={{ color: colors.cardForeground, fontSize: 13 }}
                    >
                      {t.location}
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
                      Due: {t.dueDate}
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
                      name="time-outline"
                      size={14}
                      color={colors.muted}
                    />
                    <Text
                      style={{ color: colors.cardForeground, fontSize: 13 }}
                    >
                      Est. time: {t.estimatedTime}
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
                      name="clipboard-outline"
                      size={14}
                      color={colors.muted}
                    />
                    <Text
                      style={{ color: colors.cardForeground, fontSize: 13 }}
                    >
                      Type: {t.taskType}
                    </Text>
                  </View>
                </View>

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
                  <Text style={{ color: colors.cardForeground, fontSize: 13 }}>
                    {t.instructions}
                  </Text>
                </View>

                {/* Actions */}
                {t.status === "Pending" && (
                  <Button
                    onPress={() => acceptTask(t.id)}
                    style={{ backgroundColor: "#7c3aed" }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "700" }}>
                      Accept Task
                    </Text>
                  </Button>
                )}
                {t.status === "Active" && (
                  <View style={{ gap: spacing.sm }}>
                    <Button onPress={() => markComplete(t.id)}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                        }}
                      >
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={16}
                          color={colors.card}
                        />
                        <Text style={{ color: colors.card, fontWeight: "700" }}>
                          Mark Complete
                        </Text>
                      </View>
                    </Button>
                    <Button
                      variant="outline"
                      onPress={() => contactAgent(t.id)}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                        }}
                      >
                        <Ionicons
                          name="call-outline"
                          size={16}
                          color={colors.cardForeground}
                        />
                        <Text
                          style={{
                            color: colors.cardForeground,
                            fontWeight: "700",
                          }}
                        >
                          Contact Agent
                        </Text>
                      </View>
                    </Button>
                  </View>
                )}
                {t.status === "Completed" && (
                  <View
                    style={{
                      backgroundColor: "#d1fae5",
                      borderRadius: 12,
                      padding: spacing.md,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#065f46", fontSize: 13 }}>
                      ✅ Task completed successfully
                    </Text>
                  </View>
                )}
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
