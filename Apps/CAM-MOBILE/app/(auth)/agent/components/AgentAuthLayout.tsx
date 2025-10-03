import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../../../src/styles/colors";
import { spacing } from "../../../../src/styles/spacing";
import { typography } from "../../../../src/styles/typography";
import { Pressable } from "react-native";

type Props = {
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
};

export default function AgentAuthLayout({ title, children, onBack }: Props) {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
