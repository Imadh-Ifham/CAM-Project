import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../../src/styles/colors";

type StatusType = "Assigned" | "In Progress" | "Completed";

type StatusBadgeProps = {
  status: StatusType;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (
    status: StatusType
  ): { bg: string; text: string; icon: string } => {
    const configs = {
      Assigned: {
        bg: "#2a1f0d",
        text: colors.orange,
        icon: "time-outline",
      },
      "In Progress": {
        bg: "#1a2332",
        text: colors.primary,
        icon: "sync-outline",
      },
      Completed: {
        bg: "#1a2b1f",
        text: colors.green,
        icon: "checkmark-circle-outline",
      },
    };
    return configs[status];
  };

  const { bg, text, icon } = getStatusConfig(status);

  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderWidth: 1,
        borderColor: text,
      }}
    >
      <Ionicons name={icon as any} size={14} color={text} />
      <Text style={{ color: text, fontWeight: "700", fontSize: 12 }}>
        {status}
      </Text>
    </View>
  );
};
