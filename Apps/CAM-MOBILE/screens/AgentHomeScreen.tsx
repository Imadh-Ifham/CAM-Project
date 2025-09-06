import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import programs from "../data/programs";

const AgentHomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleProgramPress = (program: (typeof programs)[0]) => {
    navigation.navigate("AgentRegistrationScreen", { program });
  };

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>🌍 Community Aid Map</Text>
        <Text style={styles.heroSubtitle}>
          Empowering Sri Lanka’s communities by connecting aid, volunteers, and
          programs. Together, we solve local challenges with lasting impact.
        </Text>
      </View>

      {/* Impact Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>25+</Text>
          <Text style={styles.statLabel}>Districts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>50+</Text>
          <Text style={styles.statLabel}>Programs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>100+</Text>
          <Text style={styles.statLabel}>Volunteers</Text>
        </View>
      </View>

      {/* Navigation Hub */}
      <View style={styles.navHub}>
        <TouchableOpacity
          style={styles.navCard}
          onPress={() => navigation.navigate("Details")}
        >
          <Text style={styles.navEmoji}>📋</Text>
          <Text style={styles.navLabel}>Programs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navCard}
          onPress={() => navigation.navigate("AgentRegistrationScreen")}
        >
          <Text style={styles.navEmoji}>📝</Text>
          <Text style={styles.navLabel}>Pitch Program</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navCard}
          onPress={() => navigation.navigate("VolunteerScreen")}
        >
          <Text style={styles.navEmoji}>🙌</Text>
          <Text style={styles.navLabel}>Volunteer Hub</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navCard}
          onPress={() => navigation.navigate("AgentHomeScreen")}
        >
          <Text style={styles.navEmoji}>📊</Text>
          <Text style={styles.navLabel}>My Impact</Text>
        </TouchableOpacity>
      </View>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>✨ Featured Programs</Text>

      {/* Program List */}
      <View style={styles.programList}>
        {programs.map((program, idx) => {
          const scale = new Animated.Value(1);

          const onPressIn = () => {
            Animated.spring(scale, {
              toValue: 0.97,
              useNativeDriver: true,
            }).start();
          };

          const onPressOut = () => {
            Animated.spring(scale, {
              toValue: 1,
              friction: 3,
              useNativeDriver: true,
            }).start();
          };

          return (
            <Animated.View key={idx} style={{ transform: [{ scale }] }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleProgramPress(program)}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={styles.programCard}
              >
                {/* Header */}
                <View style={styles.cardHeader}>
                  <Text style={styles.programEmoji}>
                    {program.emoji || "✨"}
                  </Text>
                  <Text style={styles.programName}>{program.name}</Text>
                </View>

                {/* Description */}
                <Text style={styles.programDesc}>{program.description}</Text>

                {/* Extra Info */}
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>📍 Location:</Text>
                  <Text style={styles.infoText}>{program.location}</Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>🎯 Goals:</Text>
                  <Text style={styles.infoText}>{program.goals}</Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>📅 Events:</Text>
                  {program.events.map((event, i) => (
                    <Text key={i} style={styles.infoText}>
                      • {event}
                    </Text>
                  ))}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
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
  );
};

export default AgentHomeScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0f0a",
    padding: 20,
  },

  // Hero
  hero: {
    marginBottom: 20,
    backgroundColor: "#14532d",
    padding: 18,
    borderRadius: 16,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fdd835",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#e0e0e0",
    lineHeight: 22,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#1c261c",
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fdd835",
  },
  statLabel: {
    fontSize: 13,
    color: "#b5e3c7",
    marginTop: 4,
  },

  // Nav Hub
  navHub: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  navCard: {
    backgroundColor: "#1c261c",
    width: "48%",
    borderRadius: 14,
    paddingVertical: 20,
    marginBottom: 12,
    alignItems: "center",
  },
  navEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  navLabel: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
  },

  // Section Title
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fdd835",
    marginBottom: 12,
  },

  // Program List
  programList: {
    flex: 1,
  },
  programCard: {
    backgroundColor: "#1c261c",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#14532d",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  programEmoji: {
    fontSize: 26,
    marginRight: 10,
  },
  programName: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  programDesc: {
    fontSize: 14,
    color: "#b5e3c7",
    marginBottom: 12,
    lineHeight: 20,
  },
  infoSection: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#fdd835",
    marginBottom: 2,
  },
  infoText: {
    fontSize: 14,
    color: "#e0e0e0",
    lineHeight: 20,
  },

  // Footer
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
