import React from "react";
import { View } from "react-native";
import { colors } from "../../../../../src/styles/colors";

type ProgressBarProps = {
  percent: number;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ percent }) => {
  const getProgressColor = () => {
    if (percent >= 100) return colors.green;
    if (percent >= 50) return colors.primary;
    return colors.orange;
  };

  return (
    <View
      style={{
        height: 10,
        backgroundColor: colors.mutedBackground,
        borderRadius: 999,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: 10,
          borderRadius: 999,
          width: `${percent}%`,
          backgroundColor: getProgressColor(),
          shadowColor: getProgressColor(),
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
        }}
      />
    </View>
  );
};
