import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { typography } from "../../styles/typography";

interface AuthHeaderProps {
  title: string;
  icon?: keyof typeof Feather.glyphMap;
  iconColor?: string;
  onBack?: () => void;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  icon,
  iconColor,
  onBack,
}) => {
  const router = useRouter();
  return (
    <View
      style={{
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <Pressable
        onPress={onBack ?? (() => router.back())}
        style={{ padding: spacing.sm, marginRight: spacing.sm }}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Feather name="arrow-left" size={18} color={colors.cardForeground} />
      </Pressable>
      {icon ? (
        <Feather
          name={icon}
          size={28}
          color={iconColor || colors.primary}
          style={{ marginRight: spacing.sm }}
        />
      ) : null}
      <Text style={[{ marginLeft: spacing.xs }, typography.h3]}>{title}</Text>
    </View>
  );
};
