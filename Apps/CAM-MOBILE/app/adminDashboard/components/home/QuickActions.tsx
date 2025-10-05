import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface QuickActionProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

function QuickActionCard({
  title,
  subtitle,
  icon,
  color,
  onPress,
}: QuickActionProps) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>

      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>

      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
    </TouchableOpacity>
  );
}

export default function QuickActions() {
  const quickActions: QuickActionProps[] = [
    {
      title: "Add New User",
      subtitle: "Register volunteer or agent",
      icon: "person-add",
      color: "#00ff94",
      onPress: () => console.log("Add User pressed"),
    },
    {
      title: "Create Campaign",
      subtitle: "Start new relief campaign",
      icon: "add-circle",
      color: "#4ade80",
      onPress: () => console.log("Create Campaign pressed"),
    },
    {
      title: "Manage Inventory",
      subtitle: "Update stock and supplies",
      icon: "cube",
      color: "#60a5fa",
      onPress: () => console.log("Manage Inventory pressed"),
    },
    {
      title: "View Reports",
      subtitle: "Analytics and insights",
      icon: "bar-chart",
      color: "#f472b6",
      onPress: () => console.log("View Reports pressed"),
    },
    {
      title: "Send Notifications",
      subtitle: "Broadcast to users",
      icon: "notifications",
      color: "#fbbf24",
      onPress: () => console.log("Send Notifications pressed"),
    },
    {
      title: "System Settings",
      subtitle: "Configure app settings",
      icon: "settings",
      color: "#a78bfa",
      onPress: () => console.log("System Settings pressed"),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.customizeButton}>
          <Ionicons name="options" size={16} color="#00ff94" />
          <Text style={styles.customizeText}>Customize</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsGrid}>
        {quickActions.map((action, index) => (
          <QuickActionCard key={index} {...action} />
        ))}
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
  customizeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  customizeText: {
    color: "#00ff94",
    fontSize: 12,
    fontWeight: "500",
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  actionSubtitle: {
    color: "#888",
    fontSize: 13,
    fontWeight: "400",
  },
  arrowContainer: {
    padding: 4,
  },
});
