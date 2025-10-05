import React from "react";
import { Stack, Slot } from "expo-router";
import { View, Text } from "react-native";
import MainTabs from "../../src/navigation/MainTabs";
import { colors } from "../../src/styles/colors";
import { spacing } from "../../src/styles/spacing";
import { typography } from "../../src/styles/typography";

export default function AgentLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Custom header */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text style={[typography.h2]}>CAM Agent</Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>Welcome</Text>
      </View>
      {/* MainTabs (TopNavBar) */}
      <MainTabs role="agent" />
      {/* Render child pages here */}
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </View>
  );
}
