import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import VolunteerSignupForm from "./components/VolunteerSignupForm";
import { colors } from "../../../src/styles/colors";
import { spacing } from "../../../src/styles/spacing";
import { typography } from "../../../src/styles/typography";
import { Feather } from "@expo/vector-icons";

export default function VolunteerSignupScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ padding: spacing.sm, marginRight: spacing.sm }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="arrow-left" size={18} color={colors.cardForeground} />
        </Pressable>
        <Text style={[{ marginLeft: spacing.xs }, typography.h3]}>
          Join as Volunteer
        </Text>
      </View>

      {/* Content (scrollable) */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <VolunteerSignupForm
          onSubmit={(data) => {
            // TODO: integrate with backend registration service
            console.log("Volunteer registration attempt:", data);
          }}
          onLogin={() => router.replace("/(auth)/volunteer/login" as any)}
        />
      </ScrollView>
    </View>
  );
}
