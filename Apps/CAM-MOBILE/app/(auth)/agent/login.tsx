import React from "react";
import AgentAuthLayout from "./components/AgentAuthLayout";
import AgentAuthForm from "./components/AgentAuthForm";
import { useRouter } from "expo-router";

export default function AgentLoginScreen() {
  const router = useRouter();

  return (
    <AgentAuthLayout title="Agent Login">
      <AgentAuthForm
        onSubmit={(data) => {
          // TODO: integrate with backend auth service
          console.log("Agent login attempt:", data);
        }}
        onRegister={() => router.push("/(auth)/agent/signup" as any)}
      />
    </AgentAuthLayout>
  );
}
