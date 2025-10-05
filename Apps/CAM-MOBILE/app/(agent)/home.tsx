import React from "react";
import { View, Text } from "react-native";
import { colors } from "../../src/styles/colors";
import { spacing } from "../../src/styles/spacing";
import { typography } from "../../src/styles/typography";
import { Card, CardContent, CardHeader } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/Button";
import { useRouter } from "expo-router";

export default function AgentHome() {
  const router = useRouter();
  // Mocked data; wire to API later
  const totalCollected = 450;
  const pendingTasks = 3;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: spacing.lg }}>
        {/* Quick Stats */}
        <View style={{ flexDirection: "row", gap: spacing.lg }}>
          <Card style={{ flex: 1 }}>
            <CardContent>
              <View
                style={{ alignItems: "center", paddingVertical: spacing.lg }}
              >
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: colors.blue,
                  }}
                >
                  {totalCollected}
                </Text>
                <Text style={{ color: colors.muted, marginTop: spacing.xs }}>
                  Resources Collected
                </Text>
              </View>
            </CardContent>
          </Card>
          <Card style={{ flex: 1 }}>
            <CardContent>
              <View
                style={{ alignItems: "center", paddingVertical: spacing.lg }}
              >
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: colors.orange,
                  }}
                >
                  {pendingTasks}
                </Text>
                <Text style={{ color: colors.muted, marginTop: spacing.xs }}>
                  Pending Tasks
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Active Campaigns Overview */}
        <View style={{ marginTop: spacing.xl }}>
          <Text style={[typography.h2, { marginBottom: spacing.md }]}>
            Active Campaigns Overview
          </Text>
          <View style={{ gap: spacing.md }}>
            <Card>
              <CardContent>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: spacing.md,
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: "700", color: "#065f46" }}>
                      3 Active Campaigns
                    </Text>
                    <Text
                      style={{ color: "#047857", marginTop: 2, fontSize: 12 }}
                    >
                      Managing resources & volunteers
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: spacing.md,
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: "700", color: "#1e3a8a" }}>
                      Next Delivery
                    </Text>
                    <Text
                      style={{ color: "#1d4ed8", marginTop: 2, fontSize: 12 }}
                    >
                      Community Center A – Tomorrow
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        backgroundColor: colors.blue,
                        color: "#fff",
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 999,
                        fontSize: 12,
                      }}
                    >
                      Due Soon
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: spacing.md,
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: "700", color: "#9a3412" }}>
                      Pending Volunteer Approvals
                    </Text>
                    <Text
                      style={{ color: "#ea580c", marginTop: 2, fontSize: 12 }}
                    >
                      2 applications awaiting review
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        backgroundColor: colors.orange,
                        color: "#fff",
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 999,
                        fontSize: 12,
                      }}
                    >
                      Action Needed
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </View>
        </View>

        {/* Quick Actions */}
        <View
          style={{
            flexDirection: "row",
            gap: spacing.lg,
            marginTop: spacing.xl,
          }}
        >
          <Button
            style={{ flex: 1 }}
            onPress={() => router.replace("/(agent)/campaigns" as any)}
          >
            View Campaigns
          </Button>
          <Button
            variant="outline"
            style={{ flex: 1 }}
            onPress={() => router.replace("/(agent)/profile" as any)}
          >
            My Profile
          </Button>
        </View>
      </View>
    </View>
  );
}
