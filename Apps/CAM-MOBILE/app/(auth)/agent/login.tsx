import React from "react";
import AgentAuthLayout from "./components/AgentAuthLayout";
import AgentAuthForm from "./components/AgentAuthForm";
import { useRouter } from "expo-router";
import { login } from "../../../src/api/auth";

export default function AgentLoginScreen() {
  const router = useRouter();

  return (
    <AgentAuthLayout title="Agent Login">
      <AgentAuthForm
        onSubmit={async (data) => {
          try {
            await login({ email: data.email, password: data.password });
            router.replace("/tempHome" as any);
          } catch (e) {
            console.error("Login failed", e);
          }
        }}
        onRegister={() => router.push("/(auth)/agent/signup" as any)}
      />
    </AgentAuthLayout>
  );
}
