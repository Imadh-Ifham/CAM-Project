import React from "react";
import { Slot, usePathname } from "expo-router";
import { View, Text } from "react-native";
import MainTabs from "../../src/navigation/MainTabs";
import { colors } from "../../src/styles/colors";
import { spacing } from "../../src/styles/spacing";
import { typography } from "../../src/styles/typography";

export default function AgentLayout() {
  const pathname = usePathname();
  const segments = (pathname || "").split("/").filter(Boolean);
  // Hide the global header + MainTabs on campaign detail pages like /(agent)/campaigns/:id/*
  const campaignsIndex = segments.indexOf("campaigns");
  const isCampaignDetail =
    campaignsIndex !== -1 && segments.length > campaignsIndex + 1;
  return (
    <View style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
      {!isCampaignDetail && (
        <>
          {/* Custom header */}
          <View
            style={{
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.lg,
              paddingBottom: spacing.md,
              borderBottomWidth: 1,
              borderBottomColor: "#333",
            }}
          >
            <Text style={[typography.h2, { color: "#fff" }]}>CAM Agent</Text>
            <Text style={{ color: "#888", marginTop: 4 }}>Welcome</Text>
          </View>
          {/* MainTabs (TopNavBar) */}
          <MainTabs role="agent" />
        </>
      )}
      {/* Render child pages here */}
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </View>
  );
}
