import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function UserManagement() {
    const router = useRouter();

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#00ff94" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>User Management</Text>
            </View>

            {/* Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Manage Users</Text>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="person-add" size={20} color="#00ff94" />
                    <Text style={styles.actionText}>Add New User</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="create" size={20} color="#4ade80" />
                    <Text style={styles.actionText}>Edit User Details</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="trash" size={20} color="#f87171" />
                    <Text style={styles.actionText}>Remove User</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push("/adminDashboard/userManagement/allUsers")}
                >
                    <Ionicons name="people" size={20} color="#60a5fa" />
                    <Text style={styles.actionText}>View All Users</Text>
                </TouchableOpacity>
                
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20, paddingVertical: 30 },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
    headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginLeft: 10 },
    section: { backgroundColor: "#1a1a1a", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#333" },
    sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "600", marginBottom: 15 },
    actionButton: {
        flexDirection: "row", alignItems: "center", gap: 10,
        backgroundColor: "#111", padding: 12, borderRadius: 8,
        borderWidth: 1, borderColor: "#333", marginBottom: 10,
    },
    actionText: { color: "#fff", fontSize: 15, fontWeight: "500" },
});
