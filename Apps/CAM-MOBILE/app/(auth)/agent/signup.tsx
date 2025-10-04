import React, { useMemo, useState } from "react";
import { Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import AgentSignupForm from "./components/AgentSignupForm";
import AgentAuthLayout from "./components/AgentAuthLayout";
import { ScrollView } from "react-native";
import { registerAgent } from "../../../src/api/auth";

export default function AgentSignupScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

  const prettyError = useMemo(() => {
    try {
      return errorDetail
        ? JSON.stringify(
            {
              name: errorDetail?.name,
              code: errorDetail?.code,
              message: errorDetail?.message,
              status: errorDetail?.status,
              body: errorDetail?.body,
              stack: errorDetail?.stack,
            },
            null,
            2
          )
        : null;
    } catch {
      return String(errorDetail);
    }
  }, [errorDetail]);

  return (
    <AgentAuthLayout title="Create Agent Account">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {error && (
          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
            {errorDetail ? (
              <View style={{ marginTop: 6 }}>
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
                {showDebug && prettyError ? (
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
                      {prettyError}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        )}
        <AgentSignupForm
          onSubmit={async (data) => {
            setError(null);
            setErrorDetail(null);
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
            } catch (e: any) {
              // Prefer code when available (FirebaseError)
              const code = e?.code || e?.cause?.code;
              setErrorDetail(e);
              if (
                code === "auth/email-already-in-use" ||
                e?.message?.includes("auth/email-already-in-use")
              ) {
                setError(
                  "This email is already registered. Please log in or use a different email."
                );
              } else if (code) {
                setError(`Agent registration failed (${code}).`);
              } else {
                setError("Agent registration failed. Please try again.");
              }
              console.error("Agent registration failed", e);
            }
          }}
          onLogin={() => router.replace("/(auth)/agent/login" as any)}
        />
      </ScrollView>
    </AgentAuthLayout>
  );
}
