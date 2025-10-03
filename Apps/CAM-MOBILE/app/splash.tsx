import React, { useEffect, useRef } from "react";
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
import { setLaunched } from "../src/utils/firstLaunch";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function SplashScreen() {
  const router = useRouter();
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

  // Handler for button press
  const handleContinue = async () => {
    await setLaunched();
    router.replace("/(auth)");
  };

  const spinInterpolate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient
      colors={["#000000", "#111827", "#064e3b"]}
      style={styles.container}
    >
      {/* Animated Background Elements */}
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
          {/* Logo */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ alignItems: "center" }}>
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
                {/* Orbital dots */}
                <Animated.View
                  style={[
                    styles.orbit,
                    { transform: [{ rotate: spinInterpolate }] },
                  ]}
                >
                  <View
                    style={[
                      styles.dot,
                      { top: -4, backgroundColor: "#4ade80" },
                    ]}
                  />
                  <View
                    style={[
                      styles.dot,
                      { bottom: -4, backgroundColor: "#34d399" },
                    ]}
                  />
                  <View
                    style={[
                      styles.dot,
                      { left: -4, backgroundColor: "#86efac" },
                    ]}
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
          </View>

          {/* Name + subtitle */}
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <Text style={styles.camText}>CAM</Text>
            <View style={styles.divider} />
            <Text style={styles.subtitle}>Community Aid Map</Text>
          </View>

          {/* Tagline */}
          <View style={{ alignItems: "center", marginBottom: 40 }}>
            <Text style={styles.tagline}>
              Connecting hearts,{"\n"}
              <Text style={{ color: "#86efac" }}>delivering hope</Text> 💚
            </Text>
          </View>

          {/* Loading */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <Animated.View
                  style={[styles.loadDot, { opacity: pulse1, marginRight: 4 }]}
                />
                <Animated.View
                  style={[styles.loadDot, { opacity: pulse2, marginRight: 4 }]}
                />
                <Animated.View style={[styles.loadDot, { opacity: pulse3 }]} />
              </View>
              <Text style={{ color: "#ccebd6", marginLeft: 8 }}>
                Initializing...
              </Text>
            </View>
          </View>

          {/* Continue Button */}
          <Pressable
            style={styles.button}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue to app"
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>

        {/* Bottom icons */}
        <View style={styles.bottomIcons}>
          <View style={styles.lineGroup}>
            <Feather
              name="user-check"
              size={20}
              color="rgba(134,239,172,0.60)"
            />
            <Text style={styles.bottomText}>Agents</Text>
          </View>
          <View style={styles.dividerVert} />
          <View style={styles.lineGroup}>
            <Feather name="users" size={20} color="rgba(134,239,172,0.60)" />
            <Text style={styles.bottomText}>Volunteers</Text>
          </View>
          <View style={styles.dividerVert} />
          <View style={styles.lineGroup}>
            <Feather name="heart" size={20} color="rgba(134,239,172,0.60)" />
            <Text style={styles.bottomText}>Community</Text>
          </View>
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
  camText: {
    fontSize: 48,
    fontWeight: "800",
    backgroundColor: "#ffffff",
    color: "#ffffff",
    paddingHorizontal: 8,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  divider: {
    height: 1,
    width: 96,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: "#4ade80",
  },
  subtitle: { color: "#eafff0", fontSize: 18, fontWeight: "600" },
  tagline: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  loadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#4ade80" },
  bottomIcons: {
    position: "absolute",
    bottom: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  lineGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 6,
  },
  button: {
    backgroundColor: "#059669",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  bottomText: { color: "rgba(134,239,172,0.60)", fontSize: 12 },
  dividerVert: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(74,222,128,0.40)",
    marginHorizontal: 8,
  },
});
