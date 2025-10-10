import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

// BACKEND URL
const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/users`;

export default function AllUsersScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
          setFilteredUsers(data.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users by role
  useEffect(() => {
    if (selectedRole === "all") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((u) => u.role === selectedRole));
    }
  }, [selectedRole, users]);

  // 🔍 Combine all role details neatly
  const getProfileInfo = (user: any) => {
    let info = [`📧 Email: ${user.email}`];
    if (user.phoneNumber) info.push(`📞 Phone: ${user.phoneNumber}`);

    if (user.role === "admin") {
      info.push("🛡 Role: Admin (Full access to system)");
    }

    if (user.role === "agent" && user.agentProfile) {
      const { organization, experienceAndMotivation } = user.agentProfile;
      if (organization) info.push(`🏢 Organization: ${organization}`);
      if (experienceAndMotivation)
        info.push(`💡 Experience: ${experienceAndMotivation}`);
    }

    if (user.role === "volunteer" && user.volunteerProfile) {
      const { age, skillsAndInterest, availability } = user.volunteerProfile;
      if (age) info.push(`🎂 Age: ${age}`);
      if (skillsAndInterest) info.push(`🛠 Skills: ${skillsAndInterest}`);
      if (availability) info.push(`📅 Availability: ${availability}`);
    }

    return info.join("\n");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "volunteer":
        return "#00ff94";
      case "agent":
        return "#c771f8ff";
      case "admin":
        return "#f59e0b";
      default:
        return "#888";
    }
  };

  // Filter buttons
  const roles = [
    { label: "All", value: "all", icon: "people" },
    { label: "Admins", value: "admin", icon: "shield-checkmark" },
    { label: "Agents", value: "agent", icon: "briefcase" },
    { label: "Volunteers", value: "volunteer", icon: "hand-left" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#00ff94" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Users</Text>
      </View>

      {/* Filter Buttons */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.value}
            style={[
              styles.filterButton,
              selectedRole === role.value && { backgroundColor: "#00ff94" },
            ]}
            onPress={() => setSelectedRole(role.value)}
          >
            <Ionicons
              name={role.icon as any}
              size={18}
              color={selectedRole === role.value ? "#000" : "#00ff94"}
              style={{ marginRight: 5 }}
            />
            <Text
              style={[
                styles.filterText,
                selectedRole === role.value && { color: "#000" },
              ]}
            >
              {role.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* User List */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00ff94" />
          <Text style={styles.statusText}>Loading users...</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {filteredUsers.length === 0 ? (
            <Text style={styles.emptyText}>No users found.</Text>
          ) : (
            filteredUsers.map((user) => (
              <View key={user._id} style={styles.userCard}>
                <View style={styles.userHeader}>
                  <Ionicons
                    name={
                      user.role === "admin"
                        ? "shield-checkmark"
                        : user.role === "agent"
                        ? "briefcase"
                        : "hand-left"
                    }
                    size={20}
                    color={getRoleColor(user.role)}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.userName}>{user.fullName}</Text>
                </View>
                <Text style={styles.profileText}>{getProfileInfo(user)}</Text>
                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: getRoleColor(user.role) },
                  ]}
                >
                  <Text style={styles.roleText}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Text>
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
    marginBottom: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 12,
  },
  filterBar: {
    flexDirection: "row",
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00ff94",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
  },
  filterText: {
    color: "#00ff94",
    fontWeight: "600",
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
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  profileText: {
    color: "#cbd5e1",
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 8,
    lineHeight: 20,
  },
  roleBadge: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  roleText: {
    color: "#000",
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
