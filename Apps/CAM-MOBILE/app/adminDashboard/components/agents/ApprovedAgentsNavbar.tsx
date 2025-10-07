import React from "react";
import { View, Text, Pressable } from "react-native";
import { spacing } from "../../../../src/styles/spacing";

export type ApprovedAgentTab =
  | "collections"
  | "distributions"
  | "volunteers"
  | "stats";

export default function ApprovedAgentsNavbar({
  selected,
  onChange,
}: {
  selected: ApprovedAgentTab;
  onChange: (tab: ApprovedAgentTab) => void;
}) {
  const tabs: { key: ApprovedAgentTab; label: string }[] = [
    { key: "collections", label: "Collections" },
    { key: "distributions", label: "Distributions" },
    { key: "volunteers", label: "Volunteers" },
    { key: "stats", label: "Stats" },
  ];

  return (
    <View
      style={{
        backgroundColor: "#111827",
        borderColor: "#1f2937",
        borderWidth: 1,
        borderRadius: 999,
        padding: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 4,
      }}
    >
      {tabs.map((t) => {
        const active = selected === t.key;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              borderRadius: 999,
              alignItems: "center",
              backgroundColor: active ? "#0b0f15" : "transparent",
            }}
          >
            <Text
              style={{
                color: active ? "#fff" : "#d1d5db",
                fontWeight: active ? "700" : "500",
                fontSize: 12,
              }}
            >
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
