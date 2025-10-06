import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { auth } from "../src/services/firebase";
import { getCurrentUser } from "../src/api/auth";

export default function TempHome() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If ?stay=1 is present, do not auto-redirect
    if (params?.stay === "1") {
      setLoading(false);
      return;
    }
    // Only call getCurrentUser if user is signed in
    if (typeof (auth as any).onAuthStateChanged === "function") {
      const unsub = (auth as any).onAuthStateChanged(async (user: any) => {
        if (!user) {
          setLoading(false);
          router.replace("/(auth)" as any);
          return;
        }
        // Only call backend if user is signed in
        try {
          const me = await getCurrentUser();
          const role = me?.user?.role;
          if (role === "agent") {
            router.replace("/users/agent" as any);
          } else if (role === "volunteer") {
            router.replace("/users/volunteer" as any);
          } else {
            setError("Role not set. Complete registration.");
          }
        } catch (e: any) {
          setError(e?.message || "Failed to load profile");
        } finally {
          setLoading(false);
        }
      });
      return () => unsub && unsub();
    } else {
      // Fallback: check if user is present before calling backend
      const user = (auth as any).currentUser;
      if (!user) {
        setLoading(false);
        router.replace("/(auth)" as any);
        return () => {};
      }
      (async () => {
        try {
          const me = await getCurrentUser();
          const role = me?.user?.role;
          if (role === "agent") router.replace("/users/agent" as any);
          else if (role === "volunteer")
            router.replace("/users/volunteer" as any);
          else router.replace("/(auth)" as any);
        } catch {
          router.replace("/(auth)" as any);
        } finally {
          setLoading(false);
        }
      })();
      return () => {};
    }
  }, [router, params]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <Text>{error}</Text>
        <Pressable
          onPress={async () => {
            try {
              await (auth as any).signOut();
            } finally {
              router.replace("/(auth)" as any);
            }
          }}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: "#ef4444",
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>Logout</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <Text>Welcome</Text>
      <Text>
        {(auth as any)?.currentUser?.email
          ? `Signed in as ${(auth as any).currentUser.email}`
          : "No Firebase user"}
      </Text>
      <Pressable
        onPress={async () => {
          try {
            await (auth as any).signOut();
          } finally {
            router.replace("/(auth)" as any);
          }
        }}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: "#ef4444",
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Logout</Text>
      </Pressable>
    </View>
  );
}
