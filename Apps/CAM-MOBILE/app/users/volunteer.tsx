import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/styles/colors";
import { spacing } from "../../src/styles/spacing";
import { getCurrentUser } from "../../src/api/auth";

export default function VolunteerScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.lg,
        backgroundColor: colors.background,
      }}
    >
      <Text
        style={{ fontSize: 20, fontWeight: "700", marginBottom: spacing.md }}
      >
        {fullName
          ? `Welcome ${fullName} as a volunteer`
          : "Welcome as a volunteer"}
      </Text>
      <Text
        style={{
          color: colors.muted,
          textAlign: "center",
          marginBottom: spacing.lg,
        }}
      >
        You are logged in as a volunteer. Build your volunteer UI here.
      </Text>
      <Pressable
        onPress={() => router.replace("/tempHome?stay=1" as any)}
        style={{
          padding: 12,
          borderRadius: 10,
          backgroundColor: colors.primary,
        }}
      >
        <Text style={{ color: colors.primaryForeground, fontWeight: "700" }}>
          Back to Temp Home
        </Text>
      </Pressable>
    </View>
  );
}
