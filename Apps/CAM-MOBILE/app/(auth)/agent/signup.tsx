import React from "react";
import { useRouter } from "expo-router";
import AgentSignupForm from "./components/AgentSignupForm";
import AgentAuthLayout from "./components/AgentAuthLayout";
import { ScrollView } from "react-native";
import { registerAgent } from "../../../src/api/auth";

export default function AgentSignupScreen() {
  const router = useRouter();

  return (
    <AgentAuthLayout title="Create Agent Account">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <AgentSignupForm
          onSubmit={async (data) => {
            try {
              await registerAgent({
                fullName: data.fullName,
                email: data.email,
                phoneNumber: data.phone,
                organization: data.organization,
                password: data.password,
                experienceAndMotivation: data.experience,
              });
              router.replace("/tempHome" as any);
            } catch (e) {
              console.error("Agent registration failed", e);
            }
          }}
          onLogin={() => router.replace("/(auth)/agent/login" as any)}
        />
      </ScrollView>
    </AgentAuthLayout>
  );
}
