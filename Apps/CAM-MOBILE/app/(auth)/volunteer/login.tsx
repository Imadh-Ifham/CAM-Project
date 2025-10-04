import React, { useMemo, useState } from "react";
import { Text, View, Pressable } from "react-native";
import VolunteerAuthLayout from "./components/VolunteerAuthLayout";
import VolunteerAuthForm from "./components/VolunteerAuthForm";
import { useRouter } from "expo-router";
import { login } from "../../../src/api/auth";

function validateEmail(email: string) {
  // Simple email validation
  return /.+@.+\..+/.test(email);
}

export default function VolunteerLoginScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const pretty = useMemo(() => {
    try {
      return detail
        ? JSON.stringify(
            {
              name: detail?.name,
              code: detail?.code,
              message: detail?.message,
              status: detail?.status,
              body: detail?.body,
              stack: detail?.stack,
            },
            null,
            2
          )
        : null;
    } catch {
      return String(detail);
    }
  }, [detail]);

  return (
    <VolunteerAuthLayout title="Volunteer Login">
      {error && (
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
          {detail ? (
            <View style={{ marginTop: 6 }}>
              <Pressable
                onPress={() => setShow((v) => !v)}
                style={{ alignSelf: "center", padding: 4 }}
              >
                <Text style={{ color: "#2563eb" }}>
                  {show ? "Hide technical details" : "Show technical details"}
                </Text>
              </Pressable>
              {show && pretty ? (
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
                    style={{ color: "#e5e7eb", fontFamily: "monospace" as any }}
                  >
                    {pretty}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      )}
      {success && (
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Text style={{ color: "green", textAlign: "center" }}>{success}</Text>
        </View>
      )}
      <VolunteerAuthForm
        onSubmit={async (data) => {
          setError(null);
          setDetail(null);
          setSuccess(null);
          // Field validation
          if (!data.email || !data.password) {
            setError("Please fill in all fields to login.");
            return;
          }
          if (!validateEmail(data.email)) {
            setError(
              "Please enter a valid email address (missing @ or domain)."
            );
            return;
          }
          try {
            await login({ email: data.email, password: data.password });
            setSuccess("Login successful! Redirecting...");
            setTimeout(() => {
              router.replace("/tempHome" as any);
            }, 1000);
          } catch (e: any) {
            setDetail(e);
            // Try to extract a user-friendly error message
            const code = e?.code || e?.cause?.code;
            const msg = e?.message || e?.cause?.message;
            if (code === "auth/user-not-found") {
              setError("No account found with that email address.");
            } else if (code === "auth/wrong-password") {
              setError("Incorrect password. Please try again.");
            } else if (code === "auth/invalid-email") {
              setError("Invalid email address format.");
            } else if (code === "auth/too-many-requests") {
              setError("Too many failed attempts. Please try again later.");
            } else if (
              msg &&
              /password/i.test(msg) &&
              /incorrect|invalid/i.test(msg)
            ) {
              setError("Incorrect password. Please try again.");
            } else if (
              msg &&
              /email/i.test(msg) &&
              /not found|does not exist/i.test(msg)
            ) {
              setError("No account found with that email address.");
            } else {
              setError(
                "Login failed. Please check your credentials and try again."
              );
            }
            console.error("Login failed", e);
          }
        }}
        onRegister={() => router.push("/(auth)/volunteer/signup" as any)}
      />
    </VolunteerAuthLayout>
  );
}
