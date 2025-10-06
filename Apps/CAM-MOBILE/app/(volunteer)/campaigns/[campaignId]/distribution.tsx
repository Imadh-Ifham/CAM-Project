import React from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { colors } from "../../../../src/styles/colors";
import { spacing } from "../../../../src/styles/spacing";
import { typography } from "../../../../src/styles/typography";
import { Card, CardContent } from "../../../../src/components/ui/Card";
import { Button } from "../../../../src/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";

type DistributionItem = {
  id: number;
  resource: string;
  quantity: number;
  location: string;
  recipient: string;
  status: "Assigned" | "In Progress" | "Completed";
  deliveryDate: string;
  assignedBy: string;
  instructions: string;
  priority: "High" | "Medium" | "Low";
};

export default function VolunteerCampaignDistribution() {
  // Mock distributions assigned by agent to this volunteer
  const assignedDistributions: DistributionItem[] = [
    {
      id: 1,
      resource: "Food Packages",
      quantity: 20,
      location: "East Side School",
      recipient: "School Administration",
      status: "Assigned",
      deliveryDate: "2024-01-21",
      assignedBy: "John Doe",
      instructions:
        "Deliver between 9 AM - 3 PM. Contact Mrs. Johnson at the front office.",
      priority: "High",
    },
    {
      id: 2,
      resource: "Blankets",
      quantity: 12,
      location: "West Park Shelter",
      recipient: "Shelter Manager",
      status: "In Progress",
      deliveryDate: "2024-01-20",
      assignedBy: "John Doe",
      instructions: "Ring bell at main entrance. Ask for Tom Wilson.",
      priority: "Medium",
    },
    {
      id: 3,
      resource: "Medical Supplies",
      quantity: 8,
      location: "North District Hospital",
      recipient: "Emergency Dept.",
      status: "Completed",
      deliveryDate: "2024-01-18",
      assignedBy: "John Doe",
      instructions: "Delivered to emergency department reception desk.",
      priority: "High",
    },
  ];

  const activeCount = assignedDistributions.filter(
    (d) => d.status !== "Completed"
  ).length;

  const StatusBadge = ({ status }: { status: DistributionItem["status"] }) => {
    const map: Record<DistributionItem["status"], string> = {
      Assigned: "#f59e0b",
      "In Progress": colors.blue,
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

  const PriorityBadge = ({
    priority,
  }: {
    priority: DistributionItem["priority"];
  }) => {
    const map: Record<
      DistributionItem["priority"],
      { bg: string; text: string }
    > = {
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

  const startDelivery = (id: number) => {
    Alert.alert(
      "Start Delivery",
      "Delivery started! Please follow the instructions."
    );
  };
  const markDelivered = (id: number) => {
    Alert.alert("Mark Delivered", "Delivery marked as completed. Thank you!");
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
          <Text style={[typography.h2]}>My Distribution Tasks</Text>
          <View
            style={{
              borderColor: colors.green,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 999,
            }}
          >
            <Text
              style={{ color: colors.green, fontWeight: "700", fontSize: 12 }}
            >
              {activeCount} Active
            </Text>
          </View>
        </View>

        {/* List */}
        <View style={{ gap: spacing.lg }}>
          {assignedDistributions.map((d) => (
            <Card key={d.id} style={{ borderRadius: 16 }}>
              <CardContent style={{ padding: spacing.lg }}>
                {/* Title row */}
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
                      {d.resource}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>
                      Qty: {d.quantity}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end", gap: 6 }}>
                    <StatusBadge status={d.status} />
                    <PriorityBadge priority={d.priority} />
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
                      name="location-outline"
                      size={14}
                      color={colors.muted}
                    />
                    <Text
                      style={{ color: colors.cardForeground, fontSize: 13 }}
                    >
                      {d.location}
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
                      Recipient: {d.recipient}
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
                      Delivery: {d.deliveryDate}
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
                      Assigned by: {d.assignedBy}
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
                    Delivery Instructions:
                  </Text>
                  <Text style={{ color: colors.cardForeground, fontSize: 13 }}>
                    {d.instructions}
                  </Text>
                </View>

                {/* Actions */}
                {d.status === "Assigned" && (
                  <Button
                    onPress={() => startDelivery(d.id)}
                    style={{ backgroundColor: colors.green }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      <Ionicons name="bus-outline" size={16} color="#fff" />
                      <Text style={{ color: "#fff", fontWeight: "700" }}>
                        Start Delivery
                      </Text>
                    </View>
                  </Button>
                )}
                {d.status === "In Progress" && (
                  <View style={{ gap: spacing.sm }}>
                    <Button onPress={() => markDelivered(d.id)}>
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
                          Mark Delivered
                        </Text>
                      </View>
                    </Button>
                    <Button variant="outline">
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
                          Contact Recipient
                        </Text>
                      </View>
                    </Button>
                  </View>
                )}
                {d.status === "Completed" && (
                  <View
                    style={{
                      backgroundColor: "#d1fae5",
                      borderRadius: 12,
                      padding: spacing.md,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#065f46", fontSize: 13 }}>
                      ✅ Distribution completed successfully
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
