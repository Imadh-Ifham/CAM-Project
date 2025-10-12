import React from "react";
import { Slot, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { colors } from "../../../../src/styles/colors";
import { spacing } from "../../../../src/styles/spacing";
import CampaignNavBar from "../../../../src/components/ui/CampaignNavBar";
import { Ionicons } from "@expo/vector-icons";
import { useGetCampaignByIdQuery } from "../../../../src/store/services/campaignsApi";

export default function CampaignLayout() {
  const params = useLocalSearchParams();
  const campaignId = String(params.campaignId || "");
  const { data: campaign } = useGetCampaignByIdQuery(campaignId, {
    skip: !campaignId,
  } as any);
  const name = (campaign as any)?.name || "Campaign";
  const status = ((campaign as any)?.status || "active") as string;
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          marginTop: 30,
          borderBottomWidth: 1,
          borderColor: "#333",
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
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </Pressable>
          <View>
            <Text style={{ fontWeight: "700", fontSize: 18, color: "#fff" }}>
              Campaign Management
            </Text>
            <Text style={{ color: "#888", marginTop: 2 }}>{name}</Text>
          </View>
        </View>

        {/* Right: Status pill */}
        {(() => {
          const st = String(status || "").toLowerCase();
          const pill =
            st === "active"
              ? { bg: "#10b981", fg: "#fff", label: "Active" }
              : st === "paused"
              ? { bg: "#2563eb", fg: "#fff", label: "Paused" }
              : { bg: "#6b7280", fg: "#fff", label: "Completed" };
          return (
            <View
              style={{
                backgroundColor: pill.bg,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
              }}
            >
              <Text style={{ color: pill.fg, fontWeight: "700", fontSize: 12 }}>
                {pill.label}
              </Text>
            </View>
          );
        })()}
      </View>

      {/* Tabs */}
      <CampaignNavBar campaignId={campaignId} />

      {/* Screen content */}
      <Slot />
    </View>
  );
}
