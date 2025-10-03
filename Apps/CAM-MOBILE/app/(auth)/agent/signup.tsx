import React from "react";
import { useRouter } from "expo-router";
import AgentSignupForm from "./components/AgentSignupForm";
import AgentAuthLayout from "./components/AgentAuthLayout";
import { ScrollView } from "react-native";

export default function AgentSignupScreen() {
  const router = useRouter();

  return (
    <AgentAuthLayout title="Create Agent Account">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <AgentSignupForm
          onSubmit={(data) => {
            // TODO: integrate with backend registration service
            console.log("Agent registration attempt:", data);
            // After submission, send them back to login
          }}
          onLogin={() => router.replace("/(auth)/agent/login" as any)}
        />
      </ScrollView>
    </AgentAuthLayout>
  );
}
