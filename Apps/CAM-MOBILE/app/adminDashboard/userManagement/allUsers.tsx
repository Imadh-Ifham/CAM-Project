import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

//BACKEND URL
const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/users`;


export default function AllUsersScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Helper: Get role-specific details
  const getProfileInfo = (user: any) => {
    if (user.role === "agent" && user.agentProfile) {
      return `Organization: ${user.agentProfile.organization}`;
    }
    if (user.role === "volunteer" && user.volunteerProfile) {
      return `Skills: ${user.volunteerProfile.skillsAndInterest}`;
    }
    return "";
  };

  // Helper: Get badge color based on role
  const getRoleColor = (role: string) => {
    switch (role) {
      case "volunteer":
        return "#00ff94"; // green
      case "agent":
        return "#c771f8ff"; // red
      case "admin":
        return "#f59e0b"; // orange
      default:
        return "#888"; // gray
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#00ff94" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Users</Text>
      </View>

      {/* Loading */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00ff94" />
          <Text style={styles.statusText}>Loading users...</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {users.length === 0 ? (
            <Text style={styles.emptyText}>No users found.</Text>
          ) : (
            users.map((user) => (
              <View key={user._id} style={styles.userCard}>
                <Text style={styles.userName}>{user.fullName}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.profileText}>{getProfileInfo(user)}</Text>
                 <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
                  <Text style={styles.roleText}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 12,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    color: "#aaa",
    marginTop: 12,
    fontSize: 16,
  },
  listContainer: {
    gap: 12,
  },
  userCard: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  userName: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  userEmail: {
    color: "#999",
    fontSize: 14,
    marginTop: 4,
  },
  profileText: {
    color: "#cbd5e1",
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 6,
  },
   roleBadge: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  roleText: {
    color: "#000000ff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    color: "#888",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});