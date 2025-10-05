import React from "react";
import { View } from "react-native";
import { colors } from "../../../../src/styles/colors";
import { AuthHeader } from "../../../../src/components/ui/AuthHeader";

type Props = {
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
  icon?: keyof typeof import("@expo/vector-icons").Feather.glyphMap;
  iconColor?: string;
};

export default function AdminAuthLayout({
  title,
  children,
  onBack,
  icon,
  iconColor,
}: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AuthHeader
        title={title}
        icon={icon || "user-check"}
        iconColor={iconColor || "#2563eb"}
        onBack={onBack}
      />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
