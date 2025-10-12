import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { colors } from "../../src/styles/colors";
import { spacing } from "../../src/styles/spacing";
import { typography } from "../../src/styles/typography";
import { Card, CardContent, CardHeader } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { logout } from "../../src/api/auth";
import {
  useGetMeQuery,
  useGetCampaignsQuery,
} from "@/src/store/services/campaignsApi";

export default function VolunteerProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Real user profile from backend
  const { data: me } = useGetMeQuery();
  const fullName =
    (me as any)?.user?.fullName || (me as any)?.fullName || "Volunteer";
  const email = (me as any)?.user?.email || (me as any)?.email || "";
  const role = (me as any)?.user?.role || (me as any)?.role || "volunteer";
  // If backend later supports volunteer assignments, wire here. For now, 0.
  const { data: assignedCampaigns = [] } = useGetCampaignsQuery({
    assigned: true,
  });
  const activeCampaignsCount = Array.isArray(assignedCampaigns)
    ? assignedCampaigns.filter(
        (c: any) => String(c.status).toLowerCase() === "active"
      ).length
    : 0;

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      router.replace("/splash" as any);
    } catch (e: any) {
      Alert.alert("Logout failed", e?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ProgressBar = ({
    percent,
    color = colors.cardForeground,
  }: {
    percent: number;
    color?: string;
  }) => (
    <View
      style={{
        height: 8,
        backgroundColor: colors.mutedBackground,
        borderRadius: 999,
        marginTop: spacing.sm,
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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.lg,
      }}
    >
      {/* Page title */}
      <Text style={typography.h2}>Profile</Text>

      {/* Profile card */}
      <Card style={{ borderRadius: 16, marginTop: spacing.lg }}>
        <CardContent style={{ padding: spacing.lg }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
              marginBottom: spacing.md,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: colors.cardForeground,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="person-outline" size={32} color={colors.card} />
            </View>
            <View>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 18,
                  color: colors.cardForeground,
                }}
              >
                {fullName}
              </Text>
              <Text style={{ color: colors.muted, marginTop: 2 }}>
                {email || "—"}
              </Text>
            </View>
          </View>

          {/* Stats rows */}
          <View style={{ gap: spacing.md }}>
            {/* Active Campaigns */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: spacing.sm,
                borderBottomWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ color: colors.cardForeground }}>
                Active Campaigns
              </Text>
              <Text style={{ fontWeight: "700", color: colors.cardForeground }}>
                {activeCampaignsCount}
              </Text>
            </View>

            {/* Tasks Completed */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: spacing.sm,
                borderBottomWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ color: colors.cardForeground }}>
                Tasks Completed
              </Text>
              <Text style={{ fontWeight: "700", color: colors.cardForeground }}>
                0
              </Text>
            </View>

            {/* Hours Volunteered */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: spacing.sm,
                borderBottomWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ color: colors.cardForeground }}>
                Hours Volunteered
              </Text>
              <Text style={{ fontWeight: "700", color: colors.cardForeground }}>
                0h
              </Text>
            </View>

            {/* Current Agent */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: spacing.sm,
              }}
            >
              <Text style={{ color: colors.cardForeground }}>
                Current Agent
              </Text>
              <Text style={{ fontWeight: "700", color: colors.cardForeground }}>
                —
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Volunteer Impact */}
      <Card style={{ borderRadius: 16, marginTop: spacing.lg }}>
        <CardHeader>
          <Text style={[typography.h3]}>Volunteer Impact</Text>
        </CardHeader>
        <CardContent>
          {/* Task Completion Rate */}
          <View style={{ marginBottom: spacing.lg }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ color: colors.cardForeground }}>
                Task Completion Rate
              </Text>
              <Text style={{ color: colors.muted }}>85%</Text>
            </View>
            <ProgressBar percent={85} color={colors.cardForeground} />
          </View>

          {/* Community Impact Score */}
          <View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ color: colors.cardForeground }}>
                Community Impact Score
              </Text>
              <Text style={{ color: colors.muted }}>92%</Text>
            </View>
            <ProgressBar percent={92} color={colors.cardForeground} />
          </View>
        </CardContent>
      </Card>

      {/* Buttons */}
      <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
        <Button
          variant="outline"
          style={{ width: "100%" }}
          onPress={() =>
            Alert.alert("Coming soon", "Edit profile is under development.")
          }
        >
          Edit Profile
        </Button>
        <Button
          variant="outline"
          onPress={handleLogout}
          loading={loading}
          style={{ width: "100%", borderColor: "#ef4444" }}
          textStyle={{ color: "#ef4444", fontWeight: "700" }}
        >
          Logout
        </Button>
      </View>
    </View>
  );
}
