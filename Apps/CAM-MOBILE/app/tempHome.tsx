import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../src/services/firebase";
import { getCurrentUser } from "../src/api/auth";

export default function TempHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [router]);

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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Welcome</Text>
    </View>
  );
}
