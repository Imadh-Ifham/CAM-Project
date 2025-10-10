// app/adminDashboard/userManagement/removeUser.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/users`;

export default function RemoveUserScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setDeletingId(id);
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            const data = await response.json();
            if (data.success) {
              Alert.alert("Deleted", "User removed successfully");
              fetchUsers(); // Refresh list
            } else {
              Alert.alert("Error", data.message || "Failed to delete user");
            }
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong.");
          } finally {
            setDeletingId(null);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}contentContainerStyle={{ paddingBottom: 50 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#00ff94" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Remove Users</Text>
      </View>

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
                <View>
                  <Text style={styles.userName}>{user.fullName}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <Text style={styles.roleText}>{user.role}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(user._id)}
                  disabled={deletingId === user._id}
                >
                  <Text style={styles.deleteText}>
                    {deletingId === user._id ? "Deleting..." : "Delete"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold", marginLeft: 10 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  statusText: { color: "#aaa", marginTop: 10 },
  listContainer: { gap: 12 },
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  userName: { color: "#fff", fontSize: 16, fontWeight: "600" },
  userEmail: { color: "#ccc", fontSize: 14 },
  roleText: { color: "#00ff94", fontSize: 13, marginTop: 4 },
  deleteButton: { backgroundColor: "#f87171", padding: 10, borderRadius: 8 },
  deleteText: { color: "#fff", fontWeight: "600" },
  emptyText: { color: "#888", textAlign: "center", marginTop: 50 },


});