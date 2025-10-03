import React from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import VolunteerSignupForm from "./components/VolunteerSignupForm";
import { colors } from "../../../src/styles/colors";
import { spacing } from "../../../src/styles/spacing";
import { typography } from "../../../src/styles/typography";
import VolunteerAuthLayout from "./components/VolunteerAuthLayout";
import { registerVolunteer } from "../../../src/api/auth";

export default function VolunteerSignupScreen() {
  const router = useRouter();

  return (
    <VolunteerAuthLayout title="Join as Volunteer">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <VolunteerSignupForm
          onSubmit={async (data) => {
            try {
              await registerVolunteer({
                fullName: data.fullName,
                age: parseInt(data.age || "0", 10) || undefined,
                email: data.email,
                phoneNumber: data.phone,
                password: data.password,
                skillsAndInterest: data.skills,
                availability: data.availability,
              });
              router.replace("/tempHome" as any);
            } catch (e) {
              console.error("Volunteer registration failed", e);
            }
          }}
          onLogin={() => router.replace("/(auth)/volunteer/login" as any)}
        />
      </ScrollView>
    </VolunteerAuthLayout>
  );
}
