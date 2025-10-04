import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/styles/colors";
import { spacing } from "../../src/styles/spacing";

export default function VolunteerScreen() {
  const router = useRouter();
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
        Volunteer Dashboard (Placeholder)
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
        onPress={() => router.replace("/tempHome" as any)}
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
