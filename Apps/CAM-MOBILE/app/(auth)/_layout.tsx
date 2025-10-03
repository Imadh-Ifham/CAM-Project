import React from "react";
import { Stack } from "expo-router";
import OnStartLayout from "./layouts/OnStartLayout";

export default function AuthLayout() {
  return (
    <OnStartLayout>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="agent/login" options={{ title: "Agent Login" }} />
        <Stack.Screen name="agent/signup" options={{ title: "Agent Signup" }} />
        <Stack.Screen
          name="volunteer/login"
          options={{ title: "Volunteer Login" }}
        />
        <Stack.Screen
          name="volunteer/signup"
          options={{ title: "Volunteer Signup" }}
        />
      </Stack>
    </OnStartLayout>
  );
}
