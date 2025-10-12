import React from "react";
import {
  Pressable,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from "react-native";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const sizeStyles: Record<Size, ViewStyle> = {
  sm: { height: 36, paddingHorizontal: spacing.md },
  md: { height: 44, paddingHorizontal: spacing.lg },
  lg: { height: 48, paddingHorizontal: spacing.xl },
};

export const Button: React.FC<Props> = ({
  children,
  onPress,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  style,
  textStyle,
}) => {
  const base: ViewStyle = {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
  };

  const variantStyle: ViewStyle = (() => {
    switch (variant) {
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: "#444",
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
        };
      case "primary":
      default:
        return {
          backgroundColor: "#3b82f6",
        };
    }
  })();

  const contentColor = variant === "primary" ? "#fff" : "#fff";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[base, sizeStyles[size], variantStyle, style]}
    >
      {loading ? (
        <ActivityIndicator color={contentColor} />
      ) : typeof children === "string" ? (
        <Text style={[{ color: contentColor, fontWeight: "600" }, textStyle]}>
          {children}
        </Text>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* render children as-is to allow icons */}
          {children}
        </View>
      )}
    </Pressable>
  );
};
