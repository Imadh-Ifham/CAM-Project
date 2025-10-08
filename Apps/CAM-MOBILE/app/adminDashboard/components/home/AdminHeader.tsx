import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function AdminHeader() {
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const router = useRouter();

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleSettingsPress = () => {
    setShowLogoutMenu(!showLogoutMenu);
  };

  const handleLogout = () => {
    // Close the menu first
    setShowLogoutMenu(false);

    // Navigate back to auth index page
    router.push("/(auth)" as any);

    // Add any additional logout logic here (clear storage, reset state, etc.)
    console.log("Admin logged out");
  };

  return (
    <View style={styles.headerContainer}>
      {/* Top Row - User Info and Notifications */}
      <View style={styles.topRow}>
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color="#00ff94" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.adminName}>Admin User</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#00ff94" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.settingsContainer}>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={handleSettingsPress}
            >
              <Ionicons name="settings-outline" size={24} color="#00ff94" />
            </TouchableOpacity>

            {/* Floating Logout Menu */}
            {showLogoutMenu && (
              <View style={styles.logoutMenu}>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={18} color="#ff4444" />
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Bottom Row - Date and Time */}
      <View style={styles.bottomRow}>
        <View style={styles.dateTimeSection}>
          <Text style={styles.dateText}>{currentDate}</Text>
          <Text style={styles.timeText}>{currentTime}</Text>
        </View>

        <View style={styles.statusIndicator}>
          <View style={styles.onlineIndicator} />
          <Text style={styles.statusText}>System Online</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: "#333",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00ff94",
    marginRight: 12,
  },
  userInfo: {
    justifyContent: "center",
  },
  welcomeText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "400",
  },
  adminName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  notificationButton: {
    position: "relative",
    padding: 8,
    backgroundColor: "#333",
    borderRadius: 12,
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  settingsContainer: {
    position: "relative",
  },
  settingsButton: {
    padding: 8,
    backgroundColor: "#333",
    borderRadius: 12,
  },
  logoutMenu: {
    position: "absolute",
    top: 50, // Position below the settings button
    right: 0,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    minWidth: 120,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 8,
  },
  logoutText: {
    color: "#ff4444",
    fontSize: 14,
    fontWeight: "500",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateTimeSection: {
    flex: 1,
  },
  dateText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  timeText: {
    color: "#00ff94",
    fontSize: 14,
    fontWeight: "600",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    backgroundColor: "#00ff94",
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: "#00ff94",
    fontSize: 12,
    fontWeight: "500",
  },
});
