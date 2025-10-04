import React, { useState } from "react";
import { View, ScrollView, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import VolunteerSignupForm from "./components/VolunteerSignupForm";
import { colors } from "../../../src/styles/colors";
import { spacing } from "../../../src/styles/spacing";
import { typography } from "../../../src/styles/typography";
import VolunteerAuthLayout from "./components/VolunteerAuthLayout";
import { registerVolunteer } from "../../../src/api/auth";

export default function VolunteerSignupScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

  return (
    <VolunteerAuthLayout title="Join as Volunteer">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {error && (
          <>
            <Text
              style={{ color: "red", marginBottom: 8, textAlign: "center" }}
            >
              {error}
            </Text>
            {errorDetail ? (
              <>
                <Pressable
                  onPress={() => setShowDebug((v) => !v)}
                  style={{ alignSelf: "center", padding: 4 }}
                >
                  <Text style={{ color: "#2563eb", textAlign: "center" }}>
                    {showDebug
                      ? "Hide technical details"
                      : "Show technical details"}
                  </Text>
                </Pressable>
                {showDebug && (
                  <View
                    style={{
                      backgroundColor: "#0b1020",
                      borderWidth: 1,
                      borderColor: "#1f2937",
                      borderRadius: 8,
                      padding: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "#e5e7eb",
                        fontFamily: "monospace" as any,
                      }}
                    >
                      {JSON.stringify(errorDetail, null, 2)}
                    </Text>
                  </View>
                )}
              </>
            ) : null}
          </>
        )}
        <VolunteerSignupForm
          onSubmit={async (data) => {
            setError(null);
            setErrorDetail(null);
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
            } catch (e: any) {
              setErrorDetail(e);
              if (e.message?.includes("auth/email-already-in-use")) {
                setError(
                  "This email is already registered. Please log in or use a different email."
                );
              } else if (e.code) {
                setError(`Volunteer registration failed (${e.code}).`);
              } else {
                setError("Volunteer registration failed. Please try again.");
              }
              console.error("Volunteer registration failed", e);
            }
          }}
          onLogin={() => router.replace("/(auth)/volunteer/login" as any)}
        />
      </ScrollView>
    </VolunteerAuthLayout>
  );
}
