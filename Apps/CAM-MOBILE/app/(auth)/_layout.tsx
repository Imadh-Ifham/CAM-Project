import React from "react";
import { Stack } from "expo-router";
import OnStartLayout from "./layouts/OnStartLayout";

export default function AuthLayout() {
  return (
    <OnStartLayout>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="agent/login"
          options={{ title: "Agent Login", headerShown: false }}
        />
        <Stack.Screen
          name="agent/signup"
          options={{ title: "Agent Signup", headerShown: false }}
        />
        <Stack.Screen
          name="volunteer/login"
          options={{ title: "Volunteer Login", headerShown: false }}
        />
        <Stack.Screen
          name="volunteer/signup"
          options={{ title: "Volunteer Signup", headerShown: false }}
        />
        <Stack.Screen
          name="admin/login"
          options={{ title: "Admin Login", headerShown: false }}
        />
      </Stack>
    </OnStartLayout>
  );
}
