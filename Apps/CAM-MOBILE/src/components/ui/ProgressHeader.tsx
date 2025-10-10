import React from "react";
import { View, Text } from "react-native";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { typography } from "../../styles/typography";

type Props = {
  title?: string;
  target?: number;
  collected?: number;
  distributed?: number;
  available?: number;
  unitLabel?: string;
};

export function ProgressHeader({
  title = "Progress",
  target = 0,
  collected = 0,
  distributed = 0,
  available = 0,
  unitLabel = "",
}: Props) {
  const pct =
    target > 0
      ? Math.max(0, Math.min(100, Math.round((collected / target) * 100)))
      : 0;
  return (
    <View
      style={{
        padding: spacing.md,
        borderRadius: 16,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.sm,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={[typography.h3, { fontSize: 16 }]}>{title}</Text>
        <Text style={{ color: colors.muted }}>{pct}%</Text>
      </View>
      <View
        style={{
          height: 10,
          backgroundColor: colors.mutedBackground,
          borderRadius: 999,
        }}
      >
        <View
          style={{
            height: 10,
            width: `${pct}%`,
            backgroundColor: colors.primary,
            borderRadius: 999,
          }}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: colors.muted }}>
          Target:{" "}
          <Text style={{ color: colors.cardForeground, fontWeight: "700" }}>
            {target}
          </Text>
          {unitLabel ? ` ${unitLabel}` : ""}
        </Text>
        <Text style={{ color: colors.muted }}>
          Collected:{" "}
          <Text style={{ color: colors.cardForeground, fontWeight: "700" }}>
            {collected}
          </Text>
        </Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: colors.muted }}>
          Distributed:{" "}
          <Text style={{ color: colors.cardForeground, fontWeight: "700" }}>
            {distributed}
          </Text>
        </Text>
        <Text style={{ color: colors.muted }}>
          Available:{" "}
          <Text style={{ color: colors.cardForeground, fontWeight: "700" }}>
            {available}
          </Text>
        </Text>
      </View>
    </View>
  );
}

export default ProgressHeader;
