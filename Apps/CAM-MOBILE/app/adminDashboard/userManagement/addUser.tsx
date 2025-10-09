// app/adminDashboard/userManagement/addUser.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";

// Backend URL from Expo env
const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/users`;

export default function AddUserScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<"admin" | "agent" | "volunteer">("volunteer");
  const [agentOrg, setAgentOrg] = useState("");
  const [agentExp, setAgentExp] = useState("");
  const [volunteerAge, setVolunteerAge] = useState("");
  const [volunteerSkills, setVolunteerSkills] = useState("");
  const [volunteerAvailability, setVolunteerAvailability] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!fullName || !email || !role) {
      Alert.alert("Error", "Full name, email, and role are required.");
      return;
    }

    const newUser: any = {
      uid: uuidv4(),
      fullName,
      email,
      phoneNumber,
      role,
      status: "active",
    };

    if (role === "agent") {
      newUser.agentProfile = {
        organization: agentOrg,
        experienceAndMotivation: agentExp,
      };
    }

    if (role === "volunteer") {
      newUser.volunteerProfile = {
        age: volunteerAge ? Number(volunteerAge) : undefined,
        skillsAndInterest: volunteerSkills,
        availability: volunteerAvailability,
      };
    }

    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "User created successfully!");
        router.back(); // go back to User Management
      } else {
        Alert.alert("Error", data.message || "Failed to create user");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add New User</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#888"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {/* Role Selector */}
      <View style={styles.roleContainer}>
        {["admin", "agent", "volunteer"].map((r) => (
          <TouchableOpacity
            key={r}
            style={[
              styles.roleButton,
              role === r ? styles.roleSelected : null,
            ]}
            onPress={() => setRole(r as any)}
          >
            <Text style={styles.roleText}>{r.charAt(0).toUpperCase() + r.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Agent Fields */}
      {role === "agent" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Organization"
            placeholderTextColor="#888"
            value={agentOrg}
            onChangeText={setAgentOrg}
          />
          <TextInput
            style={styles.input}
            placeholder="Experience & Motivation"
            placeholderTextColor="#888"
            value={agentExp}
            onChangeText={setAgentExp}
          />
        </>
      )}

      {/* Volunteer Fields */}
      {role === "volunteer" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Age"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={volunteerAge}
            onChangeText={setVolunteerAge}
          />
          <TextInput
            style={styles.input}
            placeholder="Skills & Interest"
            placeholderTextColor="#888"
            value={volunteerSkills}
            onChangeText={setVolunteerSkills}
          />
          <TextInput
            style={styles.input}
            placeholder="Availability"
            placeholderTextColor="#888"
            value={volunteerAvailability}
            onChangeText={setVolunteerAvailability}
          />
        </>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Create User</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  header: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    backgroundColor: "#f4f6c6ff",
    color: "#060606ff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  roleContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  roleButton: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#333" },
  roleSelected: { backgroundColor: "#d2c215ff" },
  roleText: { color: "#fcfcfdff", fontWeight: "600" },
  submitButton: { backgroundColor: "#d2c215ff", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 20 },
  submitText: { color: "#000", fontWeight: "700", fontSize: 16 },
});
