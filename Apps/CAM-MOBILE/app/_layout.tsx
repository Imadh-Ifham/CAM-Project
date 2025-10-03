import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  // Let Expo Router auto-register routes from the file system
  return <Stack screenOptions={{ headerShown: false }} />;
}
