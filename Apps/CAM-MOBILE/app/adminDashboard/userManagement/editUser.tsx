import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

// Backend URL
const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/users`;

export default function EditUserScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  // Fetch all users to select
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (data.success) setUsers(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Populate form when user selected
  useEffect(() => {
    if (selectedUser) {
      setFullName(selectedUser.fullName);
      setEmail(selectedUser.email);
      setRole(selectedUser.role);
    }
  }, [selectedUser]);

  const handleUpdate = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(`${API_URL}/${selectedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, role }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", "User updated successfully");
        router.back();
      } else {
        Alert.alert("Error", data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  if (loading) return <Text style={{ color: "#fff", marginTop: 20 }}>Loading users...</Text>;

  return (
    <ScrollView style={styles.container}contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.title}>Select a User to Edit</Text>
      {users.map((user) => (
        <TouchableOpacity
          key={user._id}
          style={[styles.userCard, selectedUser?._id === user._id && { borderColor: "#00ff94" }]}
          onPress={() => setSelectedUser(user)}
        >
          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.roleText}>{user.role}</Text>
        </TouchableOpacity>
      ))}

      {selectedUser && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Role (admin / agent / volunteer)"
            value={role}
            onChangeText={setRole}
          />
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update User</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#000" },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  userCard: {
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 8,
  },
  userName: { color: "#fff", fontSize: 16, fontWeight: "600" },
  userEmail: { color: "#999", fontSize: 14 },
  roleText: { color: "#00ff94", marginTop: 2 },
  form: { marginTop: 20 },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#00ff94",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#000", fontWeight: "700" },
});
