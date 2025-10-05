import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";

export type TopTab = {
  key: string;
  label: string;
  href: string;
};

type Props = {
  tabs: TopTab[];
  activeKey: string;
  onTabChange?: (key: string) => void;
};

// A segmented control-like top navbar used across Agent screens
export const TopNavBar: React.FC<Props> = ({
  tabs,
  activeKey,
  onTabChange,
}) => {
  const router = useRouter();

  return (
    <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
      <View
        style={{
          backgroundColor: colors.mutedBackground,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.xs,
          flexDirection: "row",
          justifyContent: "space-between",
          gap: spacing.xs,
        }}
      >
        {tabs.map((t) => {
          const active = t.key === activeKey;
          return (
            <Pressable
              key={t.key}
              onPress={() => {
                onTabChange?.(t.key);
                router.replace(t.href as any);
              }}
              style={{
                flex: 1,
                paddingVertical: spacing.sm,
                borderRadius: 999,
                backgroundColor: active ? colors.card : "transparent",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: active ? 1 : 0,
                borderColor: active ? colors.border : "transparent",
              }}
            >
              <Text
                style={{
                  fontWeight: active ? "700" : "500",
                  color: active ? colors.cardForeground : colors.muted,
                }}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default TopNavBar;
