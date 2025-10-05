import React from "react";
import { Slot, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { colors } from "../../../../src/styles/colors";
import { spacing } from "../../../../src/styles/spacing";
import CampaignNavBar from "../../../../src/components/ui/CampaignNavBar";
import { Ionicons } from "@expo/vector-icons";

export default function CampaignLayout() {
  const params = useLocalSearchParams();
  const campaignId = String(params.campaignId || "");
  const name = "Winter Relief 2024"; // replace with API later
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: Back + Titles */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Pressable
            onPress={() => router.replace("/(agent)/campaigns")}
            hitSlop={10}
            style={{ padding: 4, marginRight: 4 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={colors.cardForeground}
            />
          </Pressable>
          <View>
            <Text style={{ fontWeight: "700", fontSize: 18 }}>
              Campaign Management
            </Text>
            <Text style={{ color: colors.muted, marginTop: 2 }}>{name}</Text>
          </View>
        </View>

        {/* Right: Status pill */}
        <View
          style={{
            backgroundColor: colors.green,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>
            Active
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <CampaignNavBar campaignId={campaignId} />

      {/* Screen content */}
      <Slot />
    </View>
  );
}
