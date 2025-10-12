import React from "react";
import { View, Text, ScrollView } from "react-native";
import { colors } from "../../src/styles/colors";
import { spacing } from "../../src/styles/spacing";
import { typography } from "../../src/styles/typography";
import { Card, CardContent, CardHeader } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/Button";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function AgentHome() {
  const router = useRouter();
  // Mocked data; wire to API later
  const totalCollected = 450;
  const deliveriesMade = 12; // for second stats card as per design
  const collectionTarget = 85; // out of 100
  const volunteerEngagement = 92; // percent

  return (
    <View style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xl,
        }}
      >
        {/* Quick Stats (like image 2) */}
        <View
          style={{
            flexDirection: "row",
            gap: spacing.lg,
            marginTop: spacing.lg,
          }}
        >
          {/* Resources Collected */}
          <Card
            style={{
              flex: 1,
              borderRadius: 20,
              backgroundColor: "#1a1a1a",
              borderWidth: 1,
              borderColor: "#333",
              shadowColor: "#000",
              shadowOpacity: 0.3,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 2,
            }}
          >
            <CardContent style={{ padding: spacing.lg }}>
              <View style={{ alignItems: "center" }}>
                <LinearGradient
                  colors={["#60a5fa", "#2563eb"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: spacing.sm,
                  }}
                >
                  <Ionicons name="cube-outline" size={24} color="#fff" />
                </LinearGradient>
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: "800",
                    color: "#60a5fa",
                  }}
                >
                  {totalCollected}
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    marginTop: spacing.xs,
                    fontWeight: "600",
                  }}
                >
                  Resources Collected
                </Text>
                <Text style={{ color: "#888", marginTop: 4, fontSize: 12 }}>
                  +25 this week
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Deliveries Made */}
          <Card
            style={{
              flex: 1,
              borderRadius: 20,
              backgroundColor: "#1a1a1a",
              borderWidth: 1,
              borderColor: "#333",
              shadowColor: "#000",
              shadowOpacity: 0.3,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 2,
            }}
          >
            <CardContent style={{ padding: spacing.lg }}>
              <View style={{ alignItems: "center" }}>
                <LinearGradient
                  colors={["#a78bfa", "#7c3aed"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: spacing.sm,
                  }}
                >
                  <Ionicons
                    name="checkmark-done-outline"
                    size={24}
                    color="#fff"
                  />
                </LinearGradient>
                <Text
                  style={{ fontSize: 26, fontWeight: "800", color: "#a78bfa" }}
                >
                  {deliveriesMade}
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    marginTop: spacing.xs,
                    fontWeight: "600",
                  }}
                >
                  Deliveries Made
                </Text>
                <Text style={{ color: "#888", marginTop: 4, fontSize: 12 }}>
                  100% on-time
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Active Campaigns Overview */}
        <View style={{ marginTop: spacing.xl }}>
          <Text
            style={[typography.h2, { marginBottom: spacing.md, color: "#fff" }]}
          >
            Active Campaigns Overview
          </Text>
          <View style={{ gap: spacing.md }}>
            {/* Active Campaigns card */}
            <Card
              style={{
                borderRadius: 20,
                backgroundColor: "#1a1a1a",
                borderWidth: 1,
                borderColor: "#333",
              }}
            >
              <CardContent>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: "rgba(16,185,129,0.3)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: spacing.md,
                      }}
                    >
                      <Ionicons
                        name="people-outline"
                        size={22}
                        color="#10b981"
                      />
                    </View>
                    <View>
                      <Text style={{ fontWeight: "700", color: "#10b981" }}>
                        3 Active Campaigns
                      </Text>
                      <Text
                        style={{ color: "#888", marginTop: 2, fontSize: 12 }}
                      >
                        Managing resources & volunteers
                      </Text>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* Next Delivery card */}
            <Card
              style={{
                borderRadius: 20,
                backgroundColor: "#1a1a1a",
                borderWidth: 1,
                borderColor: "#333",
              }}
            >
              <CardContent>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: "rgba(37,99,235,0.3)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: spacing.md,
                      }}
                    >
                      <Ionicons name="cube-outline" size={22} color="#3b82f6" />
                    </View>
                    <View>
                      <Text style={{ fontWeight: "700", color: "#3b82f6" }}>
                        Next Delivery
                      </Text>
                      <Text
                        style={{ color: "#888", marginTop: 2, fontSize: 12 }}
                      >
                        Community Center A – Tomorrow
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text
                      style={{
                        backgroundColor: "#3b82f6",
                        color: "#fff",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 999,
                        fontSize: 12,
                        overflow: "hidden",
                      }}
                    >
                      Due Soon
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* Pending Volunteer Approvals */}
            <Card
              style={{
                borderRadius: 20,
                backgroundColor: "#1a1a1a",
                borderWidth: 1,
                borderColor: "#333",
              }}
            >
              <CardContent>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: "rgba(249,115,22,0.3)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: spacing.md,
                      }}
                    >
                      <Ionicons
                        name="checkmark-done-outline"
                        size={22}
                        color="#f97316"
                      />
                    </View>
                    <View>
                      <Text style={{ fontWeight: "700", color: "#f97316" }}>
                        Pending Volunteer Approvals
                      </Text>
                      <Text
                        style={{ color: "#888", marginTop: 2, fontSize: 12 }}
                      >
                        2 applications awaiting review
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text
                      style={{
                        backgroundColor: "#f97316",
                        color: "#fff",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 999,
                        fontSize: 12,
                        overflow: "hidden",
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

        {/* Weekly Performance (image 3) */}
        <Card
          style={{
            borderRadius: 20,
            marginTop: spacing.xl,
            backgroundColor: "#1a1a1a",
            borderWidth: 1,
            borderColor: "#333",
          }}
        >
          <CardHeader>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="bar-chart-outline" size={18} color="#888" />
              <Text
                style={[
                  typography.h3,
                  { marginLeft: spacing.sm, color: "#fff" },
                ]}
              >
                Weekly Performance
              </Text>
            </View>
          </CardHeader>
          <CardContent>
            {/* Collection Target */}
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ color: "#fff" }}>Collection Target</Text>
              <Text style={{ color: "#888" }}>{collectionTarget} / 100</Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: "#333",
                borderRadius: 999,
                marginTop: spacing.sm,
              }}
            >
              <View
                style={{
                  height: 8,
                  borderRadius: 999,
                  width: `${collectionTarget}%`,
                  backgroundColor: "#10b981",
                }}
              />
            </View>

            {/* Volunteer Engagement */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: spacing.lg,
              }}
            >
              <Text style={{ color: "#fff" }}>Volunteer Engagement</Text>
              <Text style={{ color: "#888" }}>{volunteerEngagement}%</Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: "#333",
                borderRadius: 999,
                marginTop: spacing.sm,
              }}
            >
              <View
                style={{
                  height: 8,
                  borderRadius: 999,
                  width: `${volunteerEngagement}%`,
                  backgroundColor: "#3b82f6",
                }}
              />
            </View>
          </CardContent>
        </Card>

        {/* Resource Inventory (image 4) */}
        <Card
          style={{
            borderRadius: 20,
            marginTop: spacing.xl,
            backgroundColor: "#1a1a1a",
            borderWidth: 1,
            borderColor: "#333",
          }}
        >
          <CardHeader>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="cube-outline" size={18} color="#888" />
              <Text
                style={[
                  typography.h3,
                  { marginLeft: spacing.sm, color: "#fff" },
                ]}
              >
                Resource Inventory
              </Text>
            </View>
          </CardHeader>
          <CardContent>
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              {/* Food */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#2a1a1a",
                  borderRadius: 16,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: "#444",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <Ionicons
                    name="restaurant-outline"
                    size={18}
                    color="#f97316"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={{ color: "#f97316", fontWeight: "700" }}>
                    Food Items
                  </Text>
                </View>
                <Text
                  style={{ color: "#f97316", fontSize: 28, fontWeight: "800" }}
                >
                  128
                </Text>
                <Text style={{ color: "#f97316", marginTop: 2, fontSize: 12 }}>
                  in stock
                </Text>
              </View>
              {/* Clothing */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#1a1f2a",
                  borderRadius: 16,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: "#444",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <Ionicons
                    name="shirt-outline"
                    size={18}
                    color="#3b82f6"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={{ color: "#3b82f6", fontWeight: "700" }}>
                    Clothing
                  </Text>
                </View>
                <Text
                  style={{
                    color: "#3b82f6",
                    fontSize: 28,
                    fontWeight: "800",
                  }}
                >
                  67
                </Text>
                <Text style={{ color: "#3b82f6", marginTop: 2, fontSize: 12 }}>
                  items
                </Text>
              </View>
              {/* Funds */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#1a2a1f",
                  borderRadius: 16,
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: "#444",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <Ionicons
                    name="cash-outline"
                    size={18}
                    color="#10b981"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={{ color: "#10b981", fontWeight: "700" }}>
                    Funds
                  </Text>
                </View>
                <Text
                  style={{ color: "#10b981", fontSize: 28, fontWeight: "800" }}
                >
                  $2.4K
                </Text>
                <Text style={{ color: "#10b981", marginTop: 2, fontSize: 12 }}>
                  available
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

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
      </ScrollView>
    </View>
  );
}
