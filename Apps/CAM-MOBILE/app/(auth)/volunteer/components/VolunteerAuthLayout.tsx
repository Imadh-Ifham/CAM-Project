import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../../../src/styles/colors";
import { spacing } from "../../../../src/styles/spacing";
import { typography } from "../../../../src/styles/typography";

type Props = {
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
};

export default function VolunteerAuthLayout({
  title,
  children,
  onBack,
}: Props) {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Content */}
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
