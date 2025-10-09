import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

// Backend API URL
const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/users`;

interface UserCountData {
  admin: number;
  agent: number;
  volunteer: number;
}

export default function UserCount() {
  const [counts, setCounts] = useState<UserCountData>({ admin: 0, agent: 0, volunteer: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.success) {
          const users = data.data;
          const adminCount = users.filter((u: any) => u.role === "admin").length;
          const agentCount = users.filter((u: any) => u.role === "agent").length;
          const volunteerCount = users.filter((u: any) => u.role === "volunteer").length;
          setCounts({ admin: adminCount, agent: agentCount, volunteer: volunteerCount });
        }
      } catch (error) {
        console.error("Error fetching user counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCounts();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" color="#00ff94" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Counts</Text>
      <View style={styles.countRow}>
        <Text style={[styles.countText, { color: "orange" }]}>Admin: {counts.admin}</Text>
        <Text style={[styles.countText, { color: "red" }]}>Agent: {counts.agent}</Text>
        <Text style={[styles.countText, { color: "green" }]}>Volunteer: {counts.volunteer}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    marginTop: 20,
  },
  title: { color: "#fff", fontSize: 16, fontWeight: "600", marginBottom: 10 },
  countRow: { flexDirection: "row", justifyContent: "space-between" },
  countText: { fontSize: 14, fontWeight: "500" },
  centered: { justifyContent: "center", alignItems: "center", paddingVertical: 10 },
});
