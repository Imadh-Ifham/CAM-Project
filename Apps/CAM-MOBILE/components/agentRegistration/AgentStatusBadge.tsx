import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AgentStatusBadge = ({ status }: { status: string }) => (
  <View
    style={[
      styles.badge,
      status === "approved" ? styles.approved : styles.pending,
    ]}
  >
    <Text style={styles.text}>{status.toUpperCase()}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: { padding: 8, borderRadius: 4 },
  approved: { backgroundColor: "#4caf50" },
  pending: { backgroundColor: "#ff9800" },
  text: { color: "#fff", fontWeight: "bold" },
});

export default AgentStatusBadge;
