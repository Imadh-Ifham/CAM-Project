import React from "react";
import { View, ViewStyle, Text, TextStyle } from "react-native";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";

type Props = {
  children?: React.ReactNode;
  style?: ViewStyle;
};

export const Card: React.FC<Props> = ({ children, style }) => {
  return (
    <View
      style={[
        {
          backgroundColor: "#1a1a1a",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#333",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const CardHeader: React.FC<Props> = ({ children, style }) => (
  <View style={[{ padding: spacing.lg, paddingBottom: spacing.md }, style]}>
    {children}
  </View>
);

export const CardContent: React.FC<Props> = ({ children, style }) => (
  <View style={[{ padding: spacing.lg, paddingTop: spacing.md }, style]}>
    {children}
  </View>
);
