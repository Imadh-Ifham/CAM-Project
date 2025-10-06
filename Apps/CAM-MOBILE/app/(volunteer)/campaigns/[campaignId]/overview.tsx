import React from "react";
import { View, Text } from "react-native";
import { colors } from "../../../../src/styles/colors";
import { spacing } from "../../../../src/styles/spacing";
import { typography } from "../../../../src/styles/typography";

export default function VolunteerCampaignOverview() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.lg,
      }}
    >
      <Text style={typography.h2}>Overview</Text>
      <Text style={{ color: colors.muted, marginTop: spacing.sm }}>
        Volunteer campaign overview.
      </Text>
    </View>
  );
}
