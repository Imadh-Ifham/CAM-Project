import React, { useRef, useEffect, useState } from "react";
import { View, Text, Pressable, LayoutChangeEvent } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
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
  // Optional: reduce outer horizontal padding to make the control wider on screen
  outerPaddingHorizontal?: number;
  outerPaddingTop?: number;
};

// A segmented control-like top navbar used across Agent screens

export const TopNavBar: React.FC<Props> = ({
  tabs,
  activeKey,
  onTabChange,
  outerPaddingHorizontal,
  outerPaddingTop,
}) => {
  const router = useRouter();
  const [tabLayouts, setTabLayouts] = useState<{ x: number; width: number }[]>(
    []
  );
  const containerWidth = useRef(0);
  const [containerW, setContainerW] = useState(0);
  const highlightX = useSharedValue(0);
  const highlightWidth = useSharedValue(0);

  // Update highlight position when activeKey or tabLayouts change
  useEffect(() => {
    const idx = tabs.findIndex((t) => t.key === activeKey);
    if (idx === -1) return;
    const pad = spacing.xs; // container horizontal padding inside the pill
    const gap = spacing.xs; // gap between tabs
    const measured = tabLayouts[idx];
    if (measured) {
      highlightX.value = withTiming(measured.x, { duration: 220 });
      highlightWidth.value = withTiming(measured.width, { duration: 220 });
    } else if (containerW > 0) {
      // Fallback until onLayout measurements are available
      const totalGap = gap * (tabs.length - 1);
      const innerW = containerW - pad * 2; // padding is already included in absolute coords
      const segmentW = (innerW - totalGap) / tabs.length;
      const approxX = pad + idx * (segmentW + gap);
      highlightX.value = withTiming(approxX, { duration: 220 });
      highlightWidth.value = withTiming(segmentW, { duration: 220 });
    }
  }, [activeKey, tabLayouts, tabs, containerW]);

  const highlightStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: highlightX.value,
    width: highlightWidth.value,
    top: 0,
    bottom: 0,
    backgroundColor: colors.card,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  }));

  const onTabLayout = (idx: number, e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setTabLayouts((prev) => {
      const next = [...prev];
      next[idx] = { x, width };
      return next;
    });
  };

  const padH = outerPaddingHorizontal ?? spacing.lg;
  const padT = outerPaddingTop ?? spacing.md;

  return (
    <View style={{ paddingHorizontal: padH, paddingTop: padT }}>
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
          position: "relative",
          overflow: "hidden",
        }}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          containerWidth.current = w;
          setContainerW(w);
        }}
      >
        {/* Animated highlight oval */}
        <Animated.View style={highlightStyle} pointerEvents="none" />
        {tabs.map((t, idx) => {
          const active = t.key === activeKey;
          return (
            <Pressable
              key={t.key}
              onPress={() => {
                onTabChange?.(t.key);
                router.replace(t.href as any);
              }}
              onLayout={(e) => onTabLayout(idx, e)}
              style={{
                flex: 1,
                paddingVertical: spacing.sm,
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: active ? "700" : "500",
                  color: active ? colors.cardForeground : colors.muted,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
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
