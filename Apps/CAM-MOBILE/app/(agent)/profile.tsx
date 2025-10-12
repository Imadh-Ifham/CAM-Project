import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent, CardHeader } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/Button";
import { colors } from "../../src/styles/colors";
import { spacing } from "../../src/styles/spacing";
import { typography } from "../../src/styles/typography";
import { auth } from "../../src/services/firebase";

export default function AgentProfile() {
  const router = useRouter();

  // Mock agent profile data (replace with API later)
  const agent = {
    name: "John Doe",
    phone: "+1234567890",
    id: "AG-2024-001",
    joinDate: "January 10, 2024",
    activeCampaigns: 1,
    type: "Collection & Distribution",
    location: "Downtown District",
    totalCollected: 450,
    deliveriesMade: 12,
  };

  const Row = ({
    label,
    value,
    showBorder = true,
  }: {
    label: string;
    value: React.ReactNode;
    showBorder?: boolean;
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: spacing.md,
        borderBottomWidth: showBorder ? 1 : 0,
        borderColor: "#333",
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: "#fff",
        }}
      >
        {label}
      </Text>
      {typeof value === "string" || typeof value === "number" ? (
        <Text style={{ fontSize: 14, color: "#888" }}>{value}</Text>
      ) : (
        <View>{value}</View>
      )}
    </View>
  );

  const VerifiedBadge = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#eafaf0",
        borderWidth: 1,
        borderColor: "#86efac",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
      }}
    >
      <Ionicons name="checkmark-circle" size={14} color="#16a34a" />
      <Text style={{ color: "#16a34a", fontSize: 12, fontWeight: "600" }}>
        Verified
      </Text>
    </View>
  );

  const Progress = ({ percent, color }: { percent: number; color: string }) => (
    <View
      style={{
        height: 8,
        backgroundColor: "#333",
        borderRadius: 999,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${percent}%`,
          height: 8,
          backgroundColor: color,
          borderRadius: 999,
        }}
      />
    </View>
  );

  async function onLogout() {
    try {
      await (auth as any).signOut();
    } finally {
      // Go back to the app index (which redirects to splash)
      router.replace("/" as any);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xl,
        }}
      >
        {/* Top title + verified status */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: spacing.md,
          }}
        >
          <Text style={[typography.h2, { color: "#fff" }]}>Agent Profile</Text>
          <VerifiedBadge />
        </View>

        {/* Profile header card */}
        <Card
          style={{
            borderRadius: 20,
            backgroundColor: "#1a1a1a",
            borderWidth: 1,
            borderColor: "#333",
          }}
        >
          <CardContent style={{ padding: spacing.lg }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.lg,
                marginBottom: spacing.md,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#10b981",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="person-outline" size={40} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#fff",
                  }}
                >
                  {agent.name}
                </Text>
                <Text style={{ color: "#888", marginTop: 2 }}>
                  {agent.phone}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 6,
                  }}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                  <Text
                    style={{
                      color: "#16a34a",
                      fontSize: 13,
                      fontWeight: "600",
                    }}
                  >
                    Verified Agent
                  </Text>
                </View>
              </View>
            </View>

            {/* two stats */}
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#2a2a2a",
                  borderRadius: 12,
                  padding: spacing.md,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "800",
                    color: "#10b981",
                  }}
                >
                  {agent.totalCollected}
                </Text>
                <Text style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                  Resources Collected
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#2a2a2a",
                  borderRadius: 12,
                  padding: spacing.md,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "800",
                    color: "#3b82f6",
                  }}
                >
                  {agent.deliveriesMade}
                </Text>
                <Text style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                  Deliveries Made
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Agent Information */}
        <Card
          style={{
            borderRadius: 20,
            marginTop: spacing.lg,
            backgroundColor: "#1a1a1a",
            borderWidth: 1,
            borderColor: "#333",
          }}
        >
          <CardHeader>
            <Text style={[typography.h3, { color: "#fff" }]}>
              Agent Information
            </Text>
          </CardHeader>
          <CardContent style={{ paddingTop: 0 }}>
            <Row label="Agent ID" value={agent.id} />
            <Row label="Join Date" value={agent.joinDate} />
            <Row
              label="Active Campaigns"
              value={String(agent.activeCampaigns)}
            />
            <Row label="Agent Type" value={agent.type} />
            <Row label="Location Coverage" value={agent.location} />
            <Row
              label="Verification Status"
              value={<VerifiedBadge />}
              showBorder={false}
            />
          </CardContent>
        </Card>

        {/* Performance Statistics */}
        <Card
          style={{
            borderRadius: 20,
            marginTop: spacing.lg,
            backgroundColor: "#1a1a1a",
            borderWidth: 1,
            borderColor: "#333",
          }}
        >
          <CardHeader>
            <Text style={[typography.h3, { color: "#fff" }]}>
              Performance Statistics
            </Text>
          </CardHeader>
          <CardContent>
            <View style={{ marginBottom: spacing.md }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: spacing.xs,
                }}
              >
                <Text style={{ color: "#fff" }}>Task Completion Rate</Text>
                <Text style={{ fontWeight: "700", color: "#fff" }}>92%</Text>
              </View>
              <Progress percent={92} color="#10b981" />
            </View>
            <View style={{ marginBottom: spacing.md }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: spacing.xs,
                }}
              >
                <Text style={{ color: "#fff" }}>On-Time Delivery Rate</Text>
                <Text style={{ fontWeight: "700", color: "#fff" }}>88%</Text>
              </View>
              <Progress percent={88} color="#3b82f6" />
            </View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: spacing.xs,
                }}
              >
                <Text style={{ color: "#fff" }}>Community Impact Score</Text>
                <Text style={{ fontWeight: "700", color: "#fff" }}>95%</Text>
              </View>
              <Progress percent={95} color="#a855f7" />
            </View>

            {/* Recent Achievements */}
            <View
              style={{
                backgroundColor: "#2a2a2a",
                borderRadius: 12,
                padding: spacing.md,
                marginTop: spacing.lg,
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  marginBottom: spacing.sm,
                  fontSize: 14,
                  color: "#fff",
                }}
              >
                Recent Achievements
              </Text>
              <View style={{ gap: 8 }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={{ color: "#fff", fontSize: 12 }}>
                    Collected 500+ resources this month
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
                  <Text style={{ color: "#fff", fontSize: 12 }}>
                    100% on-time deliveries this week
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#a855f7" />
                  <Text style={{ color: "#fff", fontSize: 12 }}>
                    Top performing agent in Winter Relief
                  </Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Campaign History */}
        <Card
          style={{
            borderRadius: 20,
            marginTop: spacing.lg,
            backgroundColor: "#1a1a1a",
            borderWidth: 1,
            borderColor: "#333",
          }}
        >
          <CardHeader>
            <Text style={[typography.h3, { color: "#fff" }]}>
              Campaign History
            </Text>
          </CardHeader>
          <CardContent style={{ gap: spacing.md }}>
            <View
              style={{
                borderLeftWidth: 3,
                borderLeftColor: "#10b981",
                paddingLeft: spacing.md,
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  color: "#fff",
                  fontSize: 14,
                }}
              >
                Winter Relief 2024
              </Text>
              <Text style={{ color: "#888", fontSize: 12 }}>
                Active Campaign
              </Text>
              <Text style={{ color: "#10b981", fontSize: 12 }}>
                450 resources collected
              </Text>
            </View>
            <View
              style={{
                borderLeftWidth: 3,
                borderLeftColor: "#555",
                paddingLeft: spacing.md,
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  color: "#fff",
                  fontSize: 14,
                }}
              >
                Emergency Food Drive
              </Text>
              <Text style={{ color: "#888", fontSize: 12 }}>
                Completed Dec 2023
              </Text>
              <Text style={{ color: "#888", fontSize: 12 }}>
                320 resources distributed
              </Text>
            </View>
            <View
              style={{
                borderLeftWidth: 3,
                borderLeftColor: "#555",
                paddingLeft: spacing.md,
              }}
            >
              <Text
                style={{
                  fontWeight: "700",
                  color: "#fff",
                  fontSize: 14,
                }}
              >
                Back to School Support
              </Text>
              <Text style={{ color: "#888", fontSize: 12 }}>
                Completed Aug 2023
              </Text>
              <Text style={{ color: "#888", fontSize: 12 }}>
                280 items delivered
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card
          style={{
            borderRadius: 20,
            marginTop: spacing.lg,
            backgroundColor: "#1a1a1a",
            borderWidth: 1,
            borderColor: "#333",
          }}
        >
          <CardHeader>
            <Text style={[typography.h3, { color: "#fff" }]}>
              Account Settings
            </Text>
          </CardHeader>
          <CardContent style={{ gap: spacing.md }}>
            <Button
              variant="outline"
              style={{
                justifyContent: "flex-start",
                height: 50,
                borderColor: "#444",
                backgroundColor: "#2a2a2a",
              }}
            >
              <Ionicons name="person-outline" size={18} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Edit Profile Information
              </Text>
            </Button>
            <Button
              variant="outline"
              style={{
                justifyContent: "flex-start",
                height: 50,
                borderColor: "#444",
                backgroundColor: "#2a2a2a",
              }}
            >
              <Ionicons name="notifications-outline" size={18} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Notification Preferences
              </Text>
            </Button>
            <Button
              variant="outline"
              style={{
                justifyContent: "flex-start",
                height: 50,
                borderColor: "#444",
                backgroundColor: "#2a2a2a",
              }}
            >
              <Ionicons name="call-outline" size={18} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Contact Support
              </Text>
            </Button>
            {/* LOGOUT button (renamed from Report an Issue) */}
            <Button
              variant="outline"
              onPress={onLogout}
              style={{
                justifyContent: "flex-start",
                height: 50,
                borderColor: "#dc2626",
                backgroundColor: "#2a1a1a",
              }}
            >
              <Ionicons name="log-out-outline" size={18} color="#ef4444" />
              <Text style={{ color: "#ef4444", fontWeight: "700" }}>
                LOGOUT
              </Text>
            </Button>
          </CardContent>
        </Card>

        {/* App Version */}
        <View style={{ alignItems: "center", paddingVertical: spacing.lg }}>
          <Text style={{ fontSize: 12, color: "#666" }}>
            CAM Agent App v1.0.0
          </Text>
          <Text style={{ fontSize: 12, color: "#666" }}>
            © 2024 Community Aid Map
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
