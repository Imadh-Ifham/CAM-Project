import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  // Animations
  const agentAnim = React.useRef(new Animated.Value(1)).current;
  const volunteerAnim = React.useRef(new Animated.Value(1)).current;
  const logoAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  // Floating / scale
  const handlePressIn = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 1.08,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };
  const handlePressOut = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  // Breathing logo animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoAnim, {
          toValue: 1.08,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, []);

  // Background glow
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const glowInterpolation = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#0a0f0a", "#102b17"],
  });

  return (
    <View style={styles.root}>
      {/* Dynamic Background */}
      <Animated.View
        style={[styles.bgPattern, { backgroundColor: glowInterpolation }]}
      />

      <View style={styles.contentWrapper}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <Animated.Image
            source={require("../assets/adaptive-icon.png")}
            style={[styles.logo, { transform: [{ scale: logoAnim }] }]}
          />
          <Text style={styles.mission}>
            Together, <Text style={styles.highlight}>we can end poverty</Text>.
            Community Aid Map (CAM) Sri Lanka unites{" "}
            <Text style={styles.highlight}>communities</Text>,
            <Text style={styles.highlight}>agents</Text> &{" "}
            <Text style={styles.highlight}>volunteers</Text> to create lasting
            change.
          </Text>
        </View>

        {/* Select Role */}
        <View style={styles.selectContainer}>
          {/* Agent Card */}
          <Animated.View
            style={[
              styles.animatedButton,
              {
                transform: [
                  { scale: agentAnim },
                  {
                    translateY: agentAnim.interpolate({
                      inputRange: [1, 1.08],
                      outputRange: [0, -8],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.selectButton, styles.agentBtn]}
              onPress={() => navigation.navigate("AgentHomeScreen")}
              activeOpacity={0.85}
              onPressIn={() => handlePressIn(agentAnim)}
              onPressOut={() => handlePressOut(agentAnim)}
            >
              <Ionicons name="briefcase-outline" size={26} color="#fff" />
              <Text style={styles.buttonText}>Agent</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Volunteer Card */}
          <Animated.View
            style={[
              styles.animatedButton,
              {
                transform: [
                  { scale: volunteerAnim },
                  {
                    translateY: volunteerAnim.interpolate({
                      inputRange: [1, 1.08],
                      outputRange: [0, -8],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.selectButton, styles.volunteerBtn]}
              onPress={() => navigation.navigate("VolunteerRegistrationScreen")}
              activeOpacity={0.85}
              onPressIn={() => handlePressIn(volunteerAnim)}
              onPressOut={() => handlePressOut(volunteerAnim)}
            >
              <Ionicons name="heart-outline" size={26} color="#fff" />
              <Text style={styles.buttonText}>Volunteer</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>⚡ Powered by CAM Sri Lanka</Text>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0f0a",
    padding: 24,
  },
  bgPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 1,
    zIndex: -1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  headerCard: {
    backgroundColor: "#162616",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    marginBottom: 40,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 14,
    borderRadius: 20,
  },
  mission: {
    fontSize: 18,
    color: "#e0e0e0",
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  highlight: {
    color: "#fdd835",
    fontWeight: "bold",
  },
  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    width: "100%",
    paddingHorizontal: 8,
  },
  animatedButton: {
    width: 150,
    marginHorizontal: 6,
    shadowColor: "#1b5e20",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 14,
    borderRadius: 18,
  },
  selectButton: {
    paddingVertical: 22,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  agentBtn: {
    backgroundColor: "#14532d",
    borderWidth: 2,
    borderColor: "#2e7d32",
  },
  volunteerBtn: {
    backgroundColor: "#6a1b9a",
    borderWidth: 2,
    borderColor: "#9c27b0",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  footer: {
    marginTop: 40,
    color: "#b5e3c7",
    fontSize: 14,
    fontStyle: "italic",
  },
});
