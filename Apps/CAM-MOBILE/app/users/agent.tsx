import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { getCurrentUser } from "../../src/api/auth";

export default function AgentScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // animations (same vibe as splash)
  const pulse1 = useRef(new Animated.Value(0.6)).current;
  const pulse2 = useRef(new Animated.Value(0.6)).current;
  const pulse3 = useRef(new Animated.Value(0.6)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: 1,
            duration: 700,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0.6,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    loop(pulse1, 0);
    loop(pulse2, 150);
    loop(pulse3, 300);

    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [pulse1, pulse2, pulse3, spin]);

  useEffect(() => {
    (async () => {
      try {
        const me = await getCurrentUser();
        setFullName(me?.user?.fullName || null);
        setUpdatedAt(me?.user?.updatedAt || "2025-10-04T08:08:48.599+00:00");
      } catch (e: any) {
        setError(e?.message || "Failed to load profile");
      }
    })();
  }, []);

  const initials = useMemo(() => {
    if (!fullName) return "A";
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + last).toUpperCase() || "A";
  }, [fullName]);

  const spinInterpolate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const lastLoginText = useMemo(() => {
    if (!updatedAt) return "";
    const d = new Date(updatedAt);
    const str = d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    return `Last login: ${str}`;
  }, [updatedAt]);

  const goHome = () => router.replace("/(agent)/home" as any);

  return (
    <LinearGradient
      colors={["#000000", "#111827", "#064e3b"]}
      style={styles.container}
    >
      {/* Animated background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View
          style={[
            styles.bgBlob,
            {
              top: 80,
              left: 40,
              backgroundColor: "rgba(74,222,128,0.10)",
              transform: [{ scale: pulse1 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.bgBlob,
            {
              bottom: 120,
              right: 32,
              width: 96,
              height: 96,
              backgroundColor: "rgba(110,231,183,0.15)",
              transform: [{ scale: pulse2 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.bgBlob,
            {
              top: "50%",
              left: "50%",
              marginLeft: -80,
              marginTop: -80,
              width: 160,
              height: 160,
              backgroundColor: "rgba(34,197,94,0.20)",
              transform: [{ scale: pulse3 }],
            },
          ]}
        />
      </View>

      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          {/* Logo + ring */}
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <View style={styles.logoCircleOuter}>
              <LinearGradient
                colors={["#4ade80", "#059669"]}
                style={styles.logoCircleInner}
              >
                <View style={{ position: "relative" }}>
                  <Feather name="heart" size={56} color="#ffffff" />
                  <Feather
                    name="star"
                    size={20}
                    color="#86efac"
                    style={{ position: "absolute", top: -6, right: -8 }}
                  />
                  <Feather
                    name="star"
                    size={14}
                    color="#a7f3d0"
                    style={{ position: "absolute", bottom: -4, left: -10 }}
                  />
                </View>
              </LinearGradient>
              <Animated.View
                style={[
                  styles.orbit,
                  { transform: [{ rotate: spinInterpolate }] },
                ]}
              >
                <View
                  style={[styles.dot, { top: -4, backgroundColor: "#4ade80" }]}
                />
                <View
                  style={[
                    styles.dot,
                    { bottom: -4, backgroundColor: "#34d399" },
                  ]}
                />
                <View
                  style={[styles.dot, { left: -4, backgroundColor: "#86efac" }]}
                />
                <View
                  style={[
                    styles.dot,
                    { right: -4, backgroundColor: "#a7f3d0" },
                  ]}
                />
              </Animated.View>
            </View>
          </View>

          {/* Welcome copy */}
          <View style={{ alignItems: "center", marginBottom: 8 }}>
            <Text style={styles.title}>
              Welcome{fullName ? `, ${fullName}!` : " Agent!"}
            </Text>
            <Text style={styles.success}>Login Successful ✨</Text>
          </View>

          {/* Card-like message */}
          <View style={styles.panel}>
            <View style={{ alignItems: "center", marginBottom: 8 }}>
              <Feather name="user-check" size={20} color="#ccebd6" />
            </View>
            <Text style={styles.panelTitle}>Ready to Make Impact</Text>
            <Text style={styles.panelText}>
              Your agent dashboard is ready. Start coordinating aid distribution
              and help communities in need.
            </Text>
          </View>

          {/* Feature icons */}
          <View style={styles.iconsRow}>
            <View style={styles.lineGroup}>
              <Feather
                name="map-pin"
                size={20}
                color="rgba(134,239,172,0.80)"
              />
              <Text style={styles.bottomText}>Campaigns</Text>
            </View>
            <View style={styles.dividerVert} />
            <View style={styles.lineGroup}>
              <Feather name="users" size={20} color="rgba(134,239,172,0.80)" />
              <Text style={styles.bottomText}>Volunteers</Text>
            </View>
            <View style={styles.dividerVert} />
            <View style={styles.lineGroup}>
              <Feather name="heart" size={20} color="rgba(134,239,172,0.80)" />
              <Text style={styles.bottomText}>Impact</Text>
            </View>
          </View>

          {/* Continue Button */}
          <Pressable
            style={styles.button}
            onPress={goHome}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Welcome Back</Text>
          </Pressable>

          {/* Last login + loading hint */}
          {!!lastLoginText && (
            <Text style={{ color: "#ccebd6", marginTop: 4, marginBottom: 4 }}>
              {lastLoginText}
            </Text>
          )}
          <Text style={{ color: "#ccebd6", opacity: 0.9 }}>
            Loading dashboard...
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  safe: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "100%",
    maxWidth: 420,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  bgBlob: {
    position: "absolute",
    width: 128,
    height: 128,
    borderRadius: 9999,
    filter: "blur(24px)" as any,
  },
  logoCircleOuter: {
    width: 136,
    height: 136,
    borderRadius: 68,
    justifyContent: "center",
    alignItems: "center",
  },
  logoCircleInner: {
    width: 128,
    height: 128,
    borderRadius: 64,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(74,222,128,0.30)",
  },
  orbit: { position: "absolute", top: -8, bottom: -8, left: -8, right: -8 },
  dot: { position: "absolute", width: 8, height: 8, borderRadius: 4 },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
  },
  success: { color: "#ccebd6", marginTop: 4 },
  panel: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(74,222,128,0.30)",
    backgroundColor: "rgba(2,6,23,0.35)",
    padding: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  panelTitle: {
    color: "#eafff0",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  panelText: { color: "rgba(255,255,255,0.85)", textAlign: "center" },
  iconsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  lineGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  bottomText: { color: "rgba(134,239,172,0.80)", fontSize: 12, marginLeft: 6 },
  dividerVert: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(74,222,128,0.40)",
    marginHorizontal: 8,
  },
  button: {
    backgroundColor: "#059669",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 6,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
