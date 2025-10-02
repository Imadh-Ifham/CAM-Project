import React from "react";
import {
  Pressable,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
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
  };
  // ...rest of the component implementation
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[base, style]}
    >
      {loading ? (
        <ActivityIndicator color={colors.primaryForeground} />
      ) : (
        <Text style={textStyle}>{children}</Text>
      )}
    </Pressable>
  );
};
