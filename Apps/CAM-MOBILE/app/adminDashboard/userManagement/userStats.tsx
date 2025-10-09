import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface UserStatsData {
  admins: number;
  agents: number;
  volunteers: number;
  total: number;
  active: number;
  inactive: number;
}

export default function UserStats() {
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/users/stats/all`
        );
        const data = await response.json();
        if (data.success) setStats(data.data);
        else setError(true);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff94" />
        <Text style={styles.loadingText}>Loading user statistics...</Text>
      </View>
    );

  if (error || !stats)
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>⚠️ Unable to load user statistics.</Text>
      </View>
    );

  const data = [
    { label: "Total Users", value: stats.total, color: "#3b82f6", icon: "people" },
    { label: "Admins", value: stats.admins, color: "#facc15", icon: "shield-checkmark" },
    { label: "Agents", value: stats.agents, color: "#f97316", icon: "briefcase" },
    { label: "Volunteers", value: stats.volunteers, color: "#22c55e", icon: "hand-left" },
    { label: "Active", value: stats.active, color: "#00ff94", icon: "checkmark-circle" },
    { label: "Inactive", value: stats.inactive, color: "#9ca3af", icon: "close-circle" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Statistics</Text>
      <View style={styles.grid}>
        {data.map((item, index) => (
          <View key={index} style={[styles.card, { borderColor: item.color }]}>
            <Ionicons name={item.icon as any} size={28} color={item.color} />
            <Text style={[styles.value, { color: item.color }]}>{item.value}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#111",
    paddingVertical: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: "center",
  },
  label: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 6,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    color: "#ccc",
    marginTop: 8,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "#f87171",
  },
});
