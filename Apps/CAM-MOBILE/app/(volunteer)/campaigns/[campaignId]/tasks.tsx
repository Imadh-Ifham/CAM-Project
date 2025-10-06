import React from "react";
import { View, Text } from "react-native";
import { colors } from "../../../../src/styles/colors";
import { spacing } from "../../../../src/styles/spacing";
import { typography } from "../../../../src/styles/typography";

export default function VolunteerCampaignTasks() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.lg,
      }}
    >
      <Text style={typography.h2}>Tasks</Text>
      <Text style={{ color: colors.muted, marginTop: spacing.sm }}>
        Your assigned tasks.
      </Text>
    </View>
  );
}
