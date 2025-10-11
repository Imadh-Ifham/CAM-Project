import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import { colors } from "../../src/styles/colors";
import { spacing } from "../../src/styles/spacing";
import { typography } from "../../src/styles/typography";
import { Card, CardContent, CardHeader } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/Button";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getVolunteerProfile, getAssignedCampaigns } from "../../src/api/volunteer";

export default function VolunteerHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [assignedCampaigns, setAssignedCampaigns] = useState<any[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const [profileData, campaignsData] = await Promise.all([
        getVolunteerProfile(),
        getAssignedCampaigns(),
      ]);
      setProfile(profileData.volunteer || profileData);
      setAssignedCampaigns(campaignsData.campaigns || []);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Mocked data; wire to API later
  const tasksCompleted = profile?.tasksCompleted || 0;
  const tasksActive = profile?.activeTasks || 0;
  const hoursVolunteered = profile?.hoursVolunteered || 0;

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.cardForeground} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xl,
        }}
      >
        {/* Welcome message */}
        <Text style={[typography.h2, { marginBottom: spacing.sm }]}>
          Welcome back,{" "}
          {profile?.fullName?.split(" ")[0] || "Volunteer"}!
        </Text>

        {/* Quick Stats */}
        <View
          style={{
            flexDirection: "row",
            gap: spacing.lg,
            marginTop: spacing.lg,
            justifyContent: "center",
          }}
        >
          {/* Completed */}
          <Card
            style={{
              width: 115,
              borderRadius: 20,
              backgroundColor: "#ecfdf5",
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 2,
            }}
          >
            <CardContent style={{ padding: spacing.lg }}>
              <View style={{ alignItems: "center" }}>
                <LinearGradient
                  colors={["#34d399", "#059669"]}
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
                    name="checkmark-circle-outline"
                    size={24}
                    color="#fff"
                  />
                </LinearGradient>
                <Text
                  style={{ fontSize: 26, fontWeight: "800", color: "#059669" }}
                >
                  {tasksCompleted}
                </Text>
                <Text
                  style={{
                    color: "#059669",
                    marginTop: spacing.xs,
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
              width: 110,
              borderRadius: 20,
              backgroundColor: "#eff6ff",
              shadowColor: "#000",
              shadowOpacity: 0.08,
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
                  <Ionicons name="time-outline" size={24} color="#fff" />
                </LinearGradient>
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: "800",
                    color: colors.blue,
                  }}
                >
                  {tasksActive}
                </Text>
                <Text
                  style={{
                    color: colors.blue,
                    marginTop: spacing.xs,
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
              width: 110,
              borderRadius: 20,
              backgroundColor: "#fff7ed",
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 2,
            }}
          >
            <CardContent style={{ padding: spacing.lg }}>
              <View style={{ alignItems: "center" }}>
                <LinearGradient
                  colors={["#fb923c", "#ea580c"]}
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
                  <Ionicons name="people-outline" size={24} color="#fff" />
                </LinearGradient>
                <Text
                  style={{ fontSize: 26, fontWeight: "800", color: "#ea580c" }}
                >
                  {hoursVolunteered}
                </Text>
                <Text
                  style={{
                    color: "#ea580c",
                    marginTop: spacing.xs,
                    fontWeight: "600",
                  }}
                >
                  Hours
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Current Campaign - show first assigned campaign */}
        {assignedCampaigns && assignedCampaigns.length > 0 ? (
          <Card style={{ borderRadius: 20, marginTop: spacing.xl }}>
            <CardHeader>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="briefcase-outline"
                  size={18}
                  color={colors.muted}
                />
                <Text style={[typography.h3, { marginLeft: spacing.sm }]}>
                  Current Campaign
                </Text>
              </View>
            </CardHeader>
            <CardContent>
              <View
                style={{ flexDirection: "row", justifyContent: "space-between" }}
              >
                <Text style={{ color: colors.cardForeground }}>
                  {assignedCampaigns[0].name || "Active Campaign"}
                </Text>
                <Text
                  style={{
                    backgroundColor: colors.blue,
                    color: "#fff",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    fontSize: 12,
                    overflow: "hidden",
                  }}
                >
                  {assignedCampaigns[0].status || "Active"}
                </Text>
              </View>
              <Text
                style={{
                  color: colors.muted,
                  marginTop: 4,
                  fontSize: 12,
                }}
              >
                Working with Agent: {assignedCampaigns[0].assignedAgents?.[0]?.fullName || "Agent"}
              </Text>
              {assignedCampaigns[0].description && (
                <Text
                  style={{
                    color: colors.cardForeground,
                    marginTop: 8,
                    fontSize: 13,
                  }}
                >
                  {assignedCampaigns[0].description}
                </Text>
              )}
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
                    width: `75%`,
                    backgroundColor: colors.cardForeground,
                  }}
                />
              </View>
            </CardContent>
          </Card>
        ) : (
          <Card style={{ borderRadius: 20, marginTop: spacing.xl }}>
            <CardContent style={{ padding: spacing.lg, alignItems: "center" }}>
              <Text style={{ color: colors.muted }}>No active campaigns yet</Text>
              <Button
                style={{ marginTop: spacing.md }}
                onPress={() => router.push("/(volunteer)/campaigns" as any)}
              >
                Browse Campaigns
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Recent Updates (simplified) */}
        <Card style={{ borderRadius: 20, marginTop: spacing.xl }}>
          <CardHeader>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="notifications-outline"
                size={18}
                color={colors.muted}
              />
              <Text style={[typography.h3, { marginLeft: spacing.sm }]}>
                Recent Updates
              </Text>
            </View>
          </CardHeader>
          <CardContent>
            {[
              "New task assigned: Pack Food Packages",
              "Task reminder: Transport Supplies due tomorrow",
              "Campaign update: Winter Relief 2024 progress",
            ].map((msg, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: spacing.sm,
                  borderBottomWidth: idx < 2 ? 1 : 0,
                  borderBottomColor: colors.border,
                  gap: spacing.sm,
                }}
              >
                <Ionicons
                  name="notifications-outline"
                  size={16}
                  color={colors.muted}
                />
                <Text style={{ color: colors.cardForeground }}>{msg}</Text>
              </View>
            ))}
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
            onPress={() => router.replace("/(volunteer)/campaigns" as any)}
          >
            View Campaigns
          </Button>
          <Button
            variant="outline"
            style={{ flex: 1 }}
            onPress={() => router.replace("/(volunteer)/profile" as any)}
          >
            My Profile
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
