import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import AgentRegistrationForm from "../components/agentRegistration/AgentRegistrationForm";

const AgentRegistrationScreen: React.FC = () => {
  const route = useRoute<any>();
  const program = route.params?.program;

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {program && (
          <View style={styles.programSection}>
            {/* Hero */}
            <View style={styles.hero}>
              <Text style={styles.emoji}>{program.emoji}</Text>
              <Text style={styles.programTitle}>{program.name}</Text>
            </View>

            {/* Description */}
            <Text style={styles.programDesc}>{program.description}</Text>

            {/* Key Highlights */}
            <View style={styles.badges}>
              <Text style={styles.badge}>📍 {program.location}</Text>
              <Text style={styles.badge}>🎯 Goal: {program.goals}</Text>
            </View>

            {/* Events */}
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Upcoming Events</Text>
              {program.events?.map((event: string, i: number) => (
                <Text key={i} style={styles.eventChip}>
                  📌 {event}
                </Text>
              ))}
            </View>

            {/* Overview */}
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Program Overview</Text>
              <Text style={styles.infoValue}>
                This initiative is part of CAM (Community Aid Map, Sri Lanka),
                focusing on community-driven change. Coordinated by registered
                agents and supported by volunteers.
              </Text>
            </View>
          </View>
        )}

        {/* Pitch Form */}
        <View style={styles.formWrapper}>
          <Text style={styles.formTitle}>🤝 Become a Program Agent</Text>
          <Text style={styles.formSubtitle}>
            Share your resources, team, and execution plan to lead this program
            locally.
          </Text>
          <AgentRegistrationForm />
        </View>

        {/* Creative Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerEmoji}>🌱</Text>
          <Text style={styles.footerText}>
            Powered by{" "}
            <Text style={styles.footerHighlight}>Community Aid Map</Text>
          </Text>
          <Text style={styles.footerTagline}>
            “Connecting hearts, building brighter communities across Sri Lanka.”
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AgentRegistrationScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0f0a",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  programSection: {
    backgroundColor: "#162616",
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
    shadowColor: "#14532d",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  emoji: {
    fontSize: 36,
    marginRight: 10,
  },
  programTitle: {
    fontSize: 24,
    color: "#43a047",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  programDesc: {
    fontSize: 16,
    color: "#b5e3c7",
    marginBottom: 14,
    lineHeight: 22,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "#2e7d32",
    color: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 14,
  },
  infoBlock: {
    marginBottom: 14,
  },
  infoLabel: {
    fontSize: 15,
    color: "#fdd835",
    fontWeight: "bold",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#e0e0e0",
    lineHeight: 20,
  },
  eventChip: {
    backgroundColor: "#1b2d1b",
    color: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 14,
    marginBottom: 6,
  },
  formWrapper: {
    backgroundColor: "#121512",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fdd835",
    textAlign: "center",
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#a5d6a7",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },

  // Footer Styles
  footer: {
    marginTop: 32,
    alignItems: "center",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#2e7d32",
  },
  footerEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  footerText: {
    fontSize: 16,
    color: "#b5e3c7",
  },
  footerHighlight: {
    color: "#fdd835",
    fontWeight: "bold",
  },
  footerTagline: {
    fontSize: 13,
    color: "#a5d6a7",
    marginTop: 4,
    fontStyle: "italic",
    textAlign: "center",
    paddingHorizontal: 16,
  },
});
