import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/styles/colors";
import { spacing } from "../../src/styles/spacing";
import { typography } from "../../src/styles/typography";
import { getCurrentUser } from "../../src/api/auth";
import { Button } from "../../src/components/ui/Button";
import { Card, CardContent, CardHeader } from "../../src/components/ui/Card";

export default function VolunteerScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initials = useMemo(() => {
    if (!fullName) return "V";
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + last).toUpperCase() || "V";
  }, [fullName]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const me = await getCurrentUser();
        setFullName(me?.user?.fullName || null);
      } catch (e: any) {
        setError(e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            paddingTop: spacing.xl,
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.lg,
            backgroundColor: colors.mutedBackground,
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
          }}
        >
          <Text style={[typography.h2]}>Volunteer Dashboard</Text>
          <Text style={[{ color: colors.muted, marginTop: spacing.xs }]}>
            Loading your profile...
          </Text>
        </View>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator color={colors.primary} />
          <Text style={{ marginTop: spacing.sm, color: colors.muted }}>
            Please wait
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            paddingTop: spacing.xl,
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.lg,
            backgroundColor: colors.mutedBackground,
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
          }}
        >
          <Text style={[typography.h2]}>Volunteer Dashboard</Text>
          <Text style={[{ color: colors.muted, marginTop: spacing.xs }]}>
            Something went wrong
          </Text>
        </View>
        <View style={{ padding: spacing.lg }}>
          <Card>
            <CardHeader>
              <Text style={[typography.h3, { color: colors.destructive }]}>
                Error
              </Text>
            </CardHeader>
            <CardContent>
              <Text style={{ color: colors.cardForeground }}>{error}</Text>
              <View style={{ height: spacing.lg }} />
              <Button
                variant="outline"
                onPress={() => router.replace("/tempHome?stay=1" as any)}
              >
                Back to Temp Home
              </Button>
            </CardContent>
          </Card>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Hero Section */}
      <View
        style={{
          paddingTop: spacing.xl,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.lg,
          backgroundColor: colors.mutedBackground,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.accent,
              alignItems: "center",
              justifyContent: "center",
              marginRight: spacing.md,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ fontWeight: "700", color: colors.accentForeground }}>
              {initials}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[typography.h2]}>
              {fullName ? `Welcome, ${fullName}` : "Welcome"}
            </Text>
            <View
              style={{
                alignSelf: "flex-start",
                marginTop: spacing.xs,
                paddingHorizontal: spacing.sm,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor: colors.accent,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 12, color: colors.accentForeground }}>
                Volunteer
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={{ padding: spacing.lg }}>
        <Card>
          <CardHeader>
            <Text style={typography.h3}>Overview</Text>
          </CardHeader>
          <CardContent>
            <Text style={{ color: colors.muted }}>
              You are logged in as a volunteer. Explore your dashboard and
              discover upcoming campaigns.
            </Text>
            <View style={{ height: spacing.lg }} />
            <Button onPress={() => router.replace("/tempHome?stay=1" as any)}>
              Back to Temp Home
            </Button>
            <View style={{ height: spacing.sm }} />
            <Button variant="outline" onPress={() => {}}>
              View Profile (coming soon)
            </Button>
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
