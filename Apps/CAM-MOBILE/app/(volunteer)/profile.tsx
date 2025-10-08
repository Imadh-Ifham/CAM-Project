import React, { useState, useEffect } from "react";
import { View, Text, Alert, ActivityIndicator } from "react-native";
import { colors } from "../../src/styles/colors";
import { spacing } from "../../src/styles/spacing";
import { typography } from "../../src/styles/typography";
import { Card, CardContent, CardHeader } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { logout } from "../../src/api/auth";
import { getVolunteerProfile } from "../../src/api/volunteer";

export default function VolunteerProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [volunteerProfile, setVolunteerProfile] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      const data = await getVolunteerProfile();
      setVolunteerProfile(data.volunteer || data);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  };

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

  if (profileLoading) {
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
                {volunteerProfile?.fullName || "Volunteer"}
              </Text>
              <Text style={{ color: colors.muted, marginTop: 2 }}>
                {volunteerProfile?.phoneNumber ||
                  volunteerProfile?.email ||
                  "No contact info"}
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
                {volunteerProfile?.assignedCampaigns?.length || 0}
              </Text>
            </View>

            {/* Age */}
            {volunteerProfile?.age && (
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
                <Text style={{ color: colors.cardForeground }}>Age</Text>
                <Text style={{ fontWeight: "700", color: colors.cardForeground }}>
                  {volunteerProfile.age}
                </Text>
              </View>
            )}

            {/* Skills & Interest */}
            {volunteerProfile?.skillsAndInterest && (
              <View
                style={{
                  paddingVertical: spacing.sm,
                  borderBottomWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={{
                    color: colors.muted,
                    fontSize: 12,
                    marginBottom: 4,
                  }}
                >
                  Skills & Interests
                </Text>
                <Text style={{ color: colors.cardForeground }}>
                  {volunteerProfile.skillsAndInterest}
                </Text>
              </View>
            )}

            {/* Availability */}
            {volunteerProfile?.availability && (
              <View style={{ paddingVertical: spacing.sm }}>
                <Text
                  style={{
                    color: colors.muted,
                    fontSize: 12,
                    marginBottom: 4,
                  }}
                >
                  Availability
                </Text>
                <Text style={{ color: colors.cardForeground }}>
                  {volunteerProfile.availability}
                </Text>
              </View>
            )}
          </View>
        </CardContent>
      </Card>

      {/* Volunteer Impact - can be enhanced later with real metrics */}
      {/* ...existing code... */}

      {/* Buttons */}
      <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
        <Button
          variant="outline"
          style={{ width: "100%" }}
          onPress={() => router.push("/(volunteer)/edit-profile" as any)}
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
