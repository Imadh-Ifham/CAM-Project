import React from "react";
import { View, Text, ScrollView } from "react-native";
import { colors } from "../../src/styles/colors";
import { spacing } from "../../src/styles/spacing";
import { typography } from "../../src/styles/typography";
import { Card, CardContent, CardHeader } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/Button";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function VolunteerHome() {
  const router = useRouter();
  // Mocked data; wire to API later
  const tasksCompleted = 8;
  const tasksActive = 2;
  const hoursVolunteered = 24;
  const userName = "Alice Johnson";
  const currentCampaign = "Winter Relief 2024";
  const agentName = "John Doe";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: colors.cardForeground,
              marginBottom: 4,
            }}
          >
            Welcome back! 👋
          </Text>
          <Text style={{ fontSize: 16, color: colors.muted }}>{userName}</Text>
        </View>

        {/* Quick Stats */}
        <View
          style={{
            flexDirection: "row",
            gap: spacing.sm,
            marginBottom: spacing.xl,
          }}
        >
          {/* Completed */}
          <Card
            style={{
              flex: 1,
              borderRadius: 16,
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 3,
            }}
          >
            <CardContent style={{ padding: spacing.md }}>
              <View style={{ alignItems: "center", gap: 8 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.green + "20",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={28}
                    color={colors.green}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "800",
                    color: colors.cardForeground,
                  }}
                >
                  {tasksCompleted}
                </Text>
                <Text
                  style={{
                    color: colors.muted,
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  Completed
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Active */}
          <Card
            style={{
              flex: 1,
              borderRadius: 16,
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 3,
            }}
          >
            <CardContent style={{ padding: spacing.md }}>
              <View style={{ alignItems: "center", gap: 8 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.blue + "20",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="time" size={28} color={colors.blue} />
                </View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "800",
                    color: colors.cardForeground,
                  }}
                >
                  {tasksActive}
                </Text>
                <Text
                  style={{
                    color: colors.muted,
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  Active
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Hours */}
          <Card
            style={{
              flex: 1,
              borderRadius: 16,
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 3,
            }}
          >
            <CardContent style={{ padding: spacing.md }}>
              <View style={{ alignItems: "center", gap: 8 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.orange + "20",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="flame" size={28} color={colors.orange} />
                </View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "800",
                    color: colors.cardForeground,
                  }}
                >
                  {hoursVolunteered}
                </Text>
                <Text
                  style={{
                    color: colors.muted,
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  Hours
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Current Campaign */}
        <Card
          style={{
            borderRadius: 16,
            marginBottom: spacing.lg,
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
        >
          <CardHeader style={{ paddingBottom: spacing.sm }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: colors.blue + "20",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="briefcase" size={16} color={colors.blue} />
                </View>
                <Text style={[typography.h3]}>Current Campaign</Text>
              </View>
              <View
                style={{
                  backgroundColor: colors.blue,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Ionicons name="radio-button-on" size={12} color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: "700",
                  }}
                >
                  Active
                </Text>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.cardForeground,
                marginBottom: 8,
              }}
            >
              {currentCampaign}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginBottom: spacing.md,
              }}
            >
              <Ionicons name="person" size={14} color={colors.muted} />
              <Text style={{ color: colors.muted, fontSize: 13 }}>
                Working with Agent: {agentName}
              </Text>
            </View>

            {/* Progress Section */}
            <View
              style={{
                backgroundColor: colors.mutedBackground,
                borderRadius: 12,
                padding: spacing.md,
                borderWidth: 1,
                borderColor: colors.border + "40",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    color: colors.muted,
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  Campaign Progress
                </Text>
                <Text
                  style={{
                    color: colors.cardForeground,
                    fontSize: 12,
                    fontWeight: "700",
                  }}
                >
                  75%
                </Text>
              </View>
              <View
                style={{
                  height: 8,
                  backgroundColor: colors.card,
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: 8,
                    borderRadius: 999,
                    width: "75%",
                    backgroundColor: colors.blue,
                  }}
                />
              </View>
            </View>

            {/* Quick Action Button */}
            <Button
              onPress={() =>
                router.replace("/(volunteer)/campaigns/1/overview" as any)
              }
              style={{
                marginTop: spacing.md,
                backgroundColor: colors.blue,
                height: 44,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Ionicons name="arrow-forward-circle" size={18} color="#fff" />
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}
                >
                  View Campaign Details
                </Text>
              </View>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Updates */}
        <Card
          style={{
            borderRadius: 16,
            marginBottom: spacing.lg,
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
        >
          <CardHeader style={{ paddingBottom: spacing.sm }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: colors.orange + "20",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="notifications"
                  size={16}
                  color={colors.orange}
                />
              </View>
              <Text style={[typography.h3]}>Recent Updates</Text>
            </View>
          </CardHeader>
          <CardContent>
            {[
              {
                icon: "cube" as const,
                text: "New task assigned: Pack Food Packages",
                color: colors.blue,
                time: "2 hours ago",
              },
              {
                icon: "car" as const,
                text: "Task reminder: Transport Supplies due tomorrow",
                color: colors.orange,
                time: "5 hours ago",
              },
              {
                icon: "trending-up" as const,
                text: "Campaign update: Winter Relief 2024 progress",
                color: colors.green,
                time: "1 day ago",
              },
            ].map((update, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: spacing.md,
                  borderBottomWidth: idx < 2 ? 1 : 0,
                  borderBottomColor: colors.border,
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: update.color + "20",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={update.icon} size={20} color={update.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.cardForeground,
                      fontSize: 14,
                      fontWeight: "600",
                      marginBottom: 2,
                    }}
                  >
                    {update.text}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>
                    {update.time}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.muted}
                />
              </View>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <View style={{ gap: spacing.sm }}>
          <Button
            onPress={() => router.replace("/(volunteer)/campaigns" as any)}
            style={{
              backgroundColor: colors.blue,
              height: 52,
              shadowColor: colors.blue,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Ionicons name="grid" size={20} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                View All Campaigns
              </Text>
            </View>
          </Button>

          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            <Button
              variant="outline"
              onPress={() =>
                router.replace("/(volunteer)/campaigns/1/tasks" as any)
              }
              style={{
                flex: 1,
                height: 48,
                borderColor: colors.border,
                backgroundColor: colors.card,
              }}
              textStyle={{ color: colors.cardForeground, fontWeight: "600" }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Ionicons name="list" size={18} color={colors.cardForeground} />
                <Text
                  style={{
                    color: colors.cardForeground,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  My Tasks
                </Text>
              </View>
            </Button>

            <Button
              variant="outline"
              onPress={() => router.replace("/(volunteer)/profile" as any)}
              style={{
                flex: 1,
                height: 48,
                borderColor: colors.border,
                backgroundColor: colors.card,
              }}
              textStyle={{ color: colors.cardForeground, fontWeight: "600" }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Ionicons
                  name="person"
                  size={18}
                  color={colors.cardForeground}
                />
                <Text
                  style={{
                    color: colors.cardForeground,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  Profile
                </Text>
              </View>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
