import React from "react";
import { View, Text, StyleSheet } from "react-native";

const VolunteerScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Volunteer Portal</Text>
    <Text style={styles.desc}>
      Welcome! Here you can join campaigns and help make a difference.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181824",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    color: "#90caf9",
    fontWeight: "bold",
    marginBottom: 16,
  },
  desc: {
    fontSize: 18,
    color: "#e0e0e0",
    textAlign: "center",
  },
});

export default VolunteerScreen;
