import React from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent, CardHeader } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/Button";
import { colors } from "../../src/styles/colors";
import { spacing } from "../../src/styles/spacing";
import { typography } from "../../src/styles/typography";
import { auth } from "../../src/services/firebase";
import {
  useGetCampaignsQuery,
  useGetMeQuery,
} from "@/src/store/services/campaignsApi";

export default function AgentProfile() {
  const router = useRouter();
  // Real user (auth/me)
  const { data: me } = useGetMeQuery();
  const agentId = (me as any)?.user?.agentId || (me as any)?.agentId || "";
  const email = (me as any)?.user?.email || (me as any)?.email || "";
  const displayName =
    (me as any)?.user?.fullName ||
    (me as any)?.fullName ||
    (email ? email.split("@")[0] : "Agent");
  // Campaigns assigned to this agent (backend supports filters; fallbacks included)
  const { data: assignedCampaigns = [] } = useGetCampaignsQuery(
    agentId ? { agentId, assigned: true } : { assigned: true }
  );
  const activeCampaignsCount = Array.isArray(assignedCampaigns)
    ? assignedCampaigns.filter(
        (c: any) => String(c.status).toLowerCase() === "active"
      ).length
    : 0;

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
        borderColor: colors.border,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: colors.cardForeground,
        }}
      >
        {label}
      </Text>
      {typeof value === "string" || typeof value === "number" ? (
        <Text style={{ fontSize: 14, color: colors.muted }}>{value}</Text>
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
        backgroundColor: colors.mutedBackground,
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
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
          <Text style={[typography.h2]}>Agent Profile</Text>
          <VerifiedBadge />
        </View>

        {/* Profile header card */}
        <Card style={{ borderRadius: 20 }}>
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
                    color: colors.cardForeground,
                  }}
                >
                  {displayName}
                </Text>
                <Text style={{ color: colors.muted, marginTop: 2 }}>
                  {email}
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
                  backgroundColor: colors.mutedBackground,
                  borderRadius: 12,
                  padding: spacing.md,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "800",
                    color: colors.green,
                  }}
                >
                  {/* Placeholder metric – backend aggregate not available here */}
                  0
                </Text>
                <Text
                  style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}
                >
                  Resources Collected
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.mutedBackground,
                  borderRadius: 12,
                  padding: spacing.md,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "800",
                    color: colors.blue,
                  }}
                >
                  0
                </Text>
                <Text
                  style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}
                >
                  Deliveries Made
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Agent Information */}
        <Card style={{ borderRadius: 20, marginTop: spacing.lg }}>
          <CardHeader>
            <Text style={[typography.h3]}>Agent Information</Text>
          </CardHeader>
          <CardContent style={{ paddingTop: 0 }}>
            <Row label="Agent ID" value={agentId || "—"} />
            {/* Join Date not available from /auth/me; keep placeholder */}
            <Row label="Join Date" value={"—"} />
            <Row
              label="Active Campaigns"
              value={String(activeCampaignsCount)}
            />
            {/* Removed Agent Type and Location Coverage as requested */}
            <Row
              label="Verification Status"
              value={<VerifiedBadge />}
              showBorder={false}
            />
          </CardContent>
        </Card>

        {/* Performance Statistics */}
        <Card style={{ borderRadius: 20, marginTop: spacing.lg }}>
          <CardHeader>
            <Text style={[typography.h3]}>Performance Statistics</Text>
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
                <Text style={{ color: colors.cardForeground }}>
                  Task Completion Rate
                </Text>
                <Text
                  style={{ fontWeight: "700", color: colors.cardForeground }}
                >
                  92%
                </Text>
              </View>
              <Progress percent={92} color={colors.green} />
            </View>
            <View style={{ marginBottom: spacing.md }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: spacing.xs,
                }}
              >
                <Text style={{ color: colors.cardForeground }}>
                  On-Time Delivery Rate
                </Text>
                <Text
                  style={{ fontWeight: "700", color: colors.cardForeground }}
                >
                  88%
                </Text>
              </View>
              <Progress percent={88} color={colors.blue} />
            </View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: spacing.xs,
                }}
              >
                <Text style={{ color: colors.cardForeground }}>
                  Community Impact Score
                </Text>
                <Text
                  style={{ fontWeight: "700", color: colors.cardForeground }}
                >
                  95%
                </Text>
              </View>
              <Progress percent={95} color="#a855f7" />
            </View>

            {/* Recent Achievements */}
            <View
              style={{
                backgroundColor: colors.mutedBackground,
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
                }}
              >
                Recent Achievements
              </Text>
              <View style={{ gap: 8 }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={colors.green}
                  />
                  <Text style={{ color: colors.cardForeground, fontSize: 12 }}>
                    Collected 500+ resources this month
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={colors.blue}
                  />
                  <Text style={{ color: colors.cardForeground, fontSize: 12 }}>
                    100% on-time deliveries this week
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#a855f7" />
                  <Text style={{ color: colors.cardForeground, fontSize: 12 }}>
                    Top performing agent in Winter Relief
                  </Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Campaign History */}
        <Card style={{ borderRadius: 20, marginTop: spacing.lg }}>
          <CardHeader>
            <Text style={[typography.h3]}>Campaign History</Text>
          </CardHeader>
          <CardContent style={{ gap: spacing.md }}>
            {Array.isArray(assignedCampaigns) &&
            assignedCampaigns.length > 0 ? (
              assignedCampaigns.map((c: any, idx: number) => {
                const active =
                  String(c.status || "").toLowerCase() === "active";
                const key = String(
                  c?.campaignID ||
                    c?._id ||
                    c?.id ||
                    `${c?.name || "campaign"}-${idx}`
                );
                return (
                  <View
                    key={key}
                    style={{
                      borderLeftWidth: 3,
                      borderLeftColor: active ? colors.green : colors.border,
                      paddingLeft: spacing.md,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "700",
                        color: colors.cardForeground,
                        fontSize: 14,
                      }}
                    >
                      {c.name}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>
                      {active ? "Active Campaign" : (c.status || "").toString()}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={{ color: colors.muted, fontSize: 12 }}>
                No assigned campaigns found.
              </Text>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card style={{ borderRadius: 20, marginTop: spacing.lg }}>
          <CardHeader>
            <Text style={[typography.h3]}>Account Settings</Text>
          </CardHeader>
          <CardContent style={{ gap: spacing.md }}>
            <Button
              variant="outline"
              style={{ justifyContent: "flex-start", height: 50 }}
              onPress={() =>
                Alert.alert("Coming soon", "Edit profile is under development.")
              }
            >
              <Ionicons
                name="person-outline"
                size={18}
                color={colors.cardForeground}
              />
              <Text style={{ color: colors.cardForeground, fontWeight: "600" }}>
                Edit Profile Information
              </Text>
            </Button>
            <Button
              variant="outline"
              style={{ justifyContent: "flex-start", height: 50 }}
              onPress={() =>
                Alert.alert(
                  "Coming soon",
                  "Notification preferences are under development."
                )
              }
            >
              <Ionicons
                name="notifications-outline"
                size={18}
                color={colors.cardForeground}
              />
              <Text style={{ color: colors.cardForeground, fontWeight: "600" }}>
                Notification Preferences
              </Text>
            </Button>
            <Button
              variant="outline"
              style={{ justifyContent: "flex-start", height: 50 }}
              onPress={() =>
                Alert.alert(
                  "Coming soon",
                  "Contact support is under development."
                )
              }
            >
              <Ionicons
                name="call-outline"
                size={18}
                color={colors.cardForeground}
              />
              <Text style={{ color: colors.cardForeground, fontWeight: "600" }}>
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
                borderColor: "#fecaca",
                backgroundColor: "#fff1f2",
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={18}
                color={colors.destructive}
              />
              <Text style={{ color: colors.destructive, fontWeight: "700" }}>
                LOGOUT
              </Text>
            </Button>
          </CardContent>
        </Card>

        {/* App Version */}
        <View style={{ alignItems: "center", paddingVertical: spacing.lg }}>
          <Text style={{ fontSize: 12, color: colors.muted }}>
            CAM Agent App v1.0.0
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted }}>
            © 2024 Community Aid Map
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
