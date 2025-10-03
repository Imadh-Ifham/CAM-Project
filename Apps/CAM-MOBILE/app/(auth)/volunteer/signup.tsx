import React from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import VolunteerSignupForm from "./components/VolunteerSignupForm";
import { colors } from "../../../src/styles/colors";
import { spacing } from "../../../src/styles/spacing";
import { typography } from "../../../src/styles/typography";
import VolunteerAuthLayout from "./components/VolunteerAuthLayout";

export default function VolunteerSignupScreen() {
  const router = useRouter();

  return (
    <VolunteerAuthLayout title="Join as Volunteer">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <VolunteerSignupForm
          onSubmit={(data) => {
            // TODO: integrate with backend registration service
            console.log("Volunteer registration attempt:", data);
          }}
          onLogin={() => router.replace("/(auth)/volunteer/login" as any)}
        />
      </ScrollView>
    </VolunteerAuthLayout>
  );
}
