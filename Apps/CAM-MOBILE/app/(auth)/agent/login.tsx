import React, { useMemo, useState } from "react";
import { Text, View, Pressable } from "react-native";
import AgentAuthLayout from "./components/AgentAuthLayout";
import AgentAuthForm from "./components/AgentAuthForm";
import { useRouter } from "expo-router";
import { login } from "../../../src/api/auth";

export default function AgentLoginScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [show, setShow] = useState(false);
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
    <AgentAuthLayout title="Agent Login">
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
      <AgentAuthForm
        onSubmit={async (data) => {
          try {
            await login({ email: data.email, password: data.password });
            router.replace("/tempHome" as any);
          } catch (e: any) {
            setDetail(e);
            const code = e?.code || e?.cause?.code;
            if (code) setError(`Login failed (${code}).`);
            else setError("Login failed. Please try again.");
            console.error("Login failed", e);
          }
        }}
        onRegister={() => router.push("/(auth)/agent/signup" as any)}
      />
    </AgentAuthLayout>
  );
}
