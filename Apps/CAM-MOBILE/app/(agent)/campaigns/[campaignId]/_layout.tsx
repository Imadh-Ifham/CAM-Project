import React from "react";
import { Stack } from "expo-router";
import { View, Text } from "react-native";
export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <View style={{ padding: 16, backgroundColor: "#f3f4f6" }}>
        <Text style={{ fontWeight: "700", fontSize: 18 }}>
          Campaign Management (placeholder)
        </Text>
      </View>
      {children}
    </>
  );
}
