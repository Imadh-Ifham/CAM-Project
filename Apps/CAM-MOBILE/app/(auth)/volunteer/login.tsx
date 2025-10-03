import React from "react";
import VolunteerAuthLayout from "./components/VolunteerAuthLayout";
import VolunteerAuthForm from "./components/VolunteerAuthForm";
import { useRouter } from "expo-router";

export default function VolunteerLoginScreen() {
  const router = useRouter();

  return (
    <VolunteerAuthLayout title="Volunteer Login">
      <VolunteerAuthForm
        onSubmit={(data) => {
          // TODO: integrate with backend auth service
          console.log("Volunteer login attempt:", data);
        }}
        onRegister={() => router.push("/(auth)/volunteer/signup" as any)}
      />
    </VolunteerAuthLayout>
  );
}
