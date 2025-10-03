import React from "react";
import VolunteerAuthLayout from "./components/VolunteerAuthLayout";
import VolunteerAuthForm from "./components/VolunteerAuthForm";
import { useRouter } from "expo-router";
import { login } from "../../../src/api/auth";

export default function VolunteerLoginScreen() {
  const router = useRouter();

  return (
    <VolunteerAuthLayout title="Volunteer Login">
      <VolunteerAuthForm
        onSubmit={async (data) => {
          try {
            await login({ email: data.email, password: data.password });
            router.replace("/tempHome" as any);
          } catch (e) {
            console.error("Login failed", e);
          }
        }}
        onRegister={() => router.push("/(auth)/volunteer/signup" as any)}
      />
    </VolunteerAuthLayout>
  );
}
