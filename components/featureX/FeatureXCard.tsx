import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface FeatureXCardProps {
  label: string;
}

const FeatureXCard: React.FC<FeatureXCardProps> = ({ label }) => (
  <View style={styles.card}>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#e0e0e0",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
  },
});

export default FeatureXCard;
