// Typography styles for CAM Mobile
import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const typography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 36,
    color: colors.cardForeground,
  },
  h2: {
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 30,
    color: colors.cardForeground,
  },
  h3: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
    color: colors.cardForeground,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 22,
    color: colors.cardForeground,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    color: colors.cardForeground,
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    color: colors.primaryForeground,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    color: colors.muted,
  },
});
