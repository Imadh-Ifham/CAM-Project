import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MenuItemProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  badge?: string;
  onPress: () => void;
}

function MenuItem({
  title,
  subtitle,
  icon,
  color,
  badge,
  onPress,
}: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>

      <View style={styles.menuContent}>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
        </View>

        <View style={styles.menuRight}>
          {badge && (
            <View style={[styles.badge, { backgroundColor: color }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function AdminMenu() {
  const menuItems: MenuItemProps[] = [
    {
      title: "User Management",
      subtitle: "Manage volunteers, agents, and admins",
      icon: "people",
      color: "#00ff94",
      badge: "2,847",
      onPress: () => console.log("User Management pressed"),
    },
    {
      title: "Campaign Management",
      subtitle: "Create and monitor relief campaigns",
      icon: "megaphone",
      color: "#4ade80",
      badge: "23",
      onPress: () => console.log("Campaign Management pressed"),
    },
    {
      title: "Inventory Management",
      subtitle: "Track supplies and donations",
      icon: "cube",
      color: "#60a5fa",
      badge: "1,456",
      onPress: () => console.log("Inventory Management pressed"),
    },
    {
      title: "Analytics & Reports",
      subtitle: "View detailed insights and analytics",
      icon: "bar-chart",
      color: "#f472b6",
      onPress: () => console.log("Analytics pressed"),
    },
    {
      title: "Communication Hub",
      subtitle: "Send notifications and messages",
      icon: "chatbubbles",
      color: "#fbbf24",
      onPress: () => console.log("Communication pressed"),
    },
    {
      title: "System Settings",
      subtitle: "Configure app and security settings",
      icon: "settings",
      color: "#a78bfa",
      onPress: () => console.log("Settings pressed"),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Administration</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={18} color="#00ff94" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <MenuItem key={index} {...item} />
        ))}
      </View>

      {/* Emergency Actions */}
      <View style={styles.emergencySection}>
        <Text style={styles.emergencyTitle}>Emergency Actions</Text>
        <View style={styles.emergencyActions}>
          <TouchableOpacity style={styles.emergencyButton}>
            <Ionicons name="warning" size={20} color="#ff4444" />
            <Text style={styles.emergencyButtonText}>Emergency Alert</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.emergencyButton}>
            <Ionicons name="shield-checkmark" size={20} color="#fbbf24" />
            <Text style={styles.emergencyButtonText}>System Lock</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  searchButton: {
    padding: 8,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  menuContainer: {
    gap: 12,
    marginBottom: 20,
  },
  menuItem: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  menuSubtitle: {
    color: "#888",
    fontSize: 13,
    fontWeight: "400",
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: "center",
  },
  badgeText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "600",
  },
  emergencySection: {
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  emergencyTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  emergencyActions: {
    flexDirection: "row",
    gap: 12,
  },
  emergencyButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    backgroundColor: "#333",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  emergencyButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
});
