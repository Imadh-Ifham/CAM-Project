import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../../src/styles/colors";
import { spacing } from "../../../../../src/styles/spacing";
import { typography } from "../../../../../src/styles/typography";

type CollectionHeaderProps = {
  activeCount: number;
  completedCount: number;
  totalCount: number;
};

export const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  activeCount,
  completedCount,
  totalCount,
}) => {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      {/* Title */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBottom: spacing.md,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: colors.mutedBackground,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="basket" size={24} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[typography.h2, { marginBottom: 4 }]}>
            Collection Tasks
          </Text>
          <Text style={{ color: colors.muted, fontSize: 13 }}>
            Manage your assigned collections
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View
        style={{
          flexDirection: "row",
          gap: spacing.md,
        }}
      >
        <StatCard
          icon="flash"
          label="Active"
          value={activeCount}
          color={colors.orange}
          bgColor="#2a1f0d"
        />
        <StatCard
          icon="checkmark-done"
          label="Completed"
          value={completedCount}
          color={colors.green}
          bgColor="#1a2b1f"
        />
        <StatCard
          icon="list"
          label="Total"
          value={totalCount}
          color={colors.primary}
          bgColor="#1a2332"
        />
      </View>
    </View>
  );
};

const StatCard: React.FC<{
  icon: string;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}> = ({ icon, label, value, color, bgColor }) => (
  <View
    style={{
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    }}
  >
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: bgColor,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.sm,
      }}
    >
      <Ionicons name={icon as any} size={20} color={color} />
    </View>
    <Text
      style={{
        fontSize: 24,
        fontWeight: "700",
        color: colors.cardForeground,
        marginBottom: 2,
      }}
    >
      {value}
    </Text>
    <Text style={{ fontSize: 12, color: colors.muted }}>{label}</Text>
  </View>
);
