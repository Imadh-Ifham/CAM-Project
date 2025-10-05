import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ActivityItem {
  id: string;
  type: "user" | "campaign" | "inventory" | "system";
  title: string;
  description: string;
  timestamp: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  isRead: boolean;
}

function ActivityCard({ item }: { item: ActivityItem }) {
  return (
    <TouchableOpacity
      style={[styles.activityCard, !item.isRead && styles.unreadCard]}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}
      >
        <Ionicons name={item.icon} size={20} color={item.color} />
      </View>

      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.activityTimestamp}>{item.timestamp}</Text>
      </View>

      {!item.isRead && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
}

export default function RecentActivity() {
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "user",
      title: "New Volunteer Registration",
      description: "Sarah Johnson registered as a volunteer",
      timestamp: "2 minutes ago",
      icon: "person-add",
      color: "#00ff94",
      isRead: false,
    },
    {
      id: "2",
      type: "campaign",
      title: "Campaign Status Update",
      description: "Flood Relief Campaign marked as completed",
      timestamp: "5 minutes ago",
      icon: "checkmark-circle",
      color: "#4ade80",
      isRead: false,
    },
    {
      id: "3",
      type: "inventory",
      title: "Low Stock Alert",
      description: "Medical supplies running low (15 items remaining)",
      timestamp: "12 minutes ago",
      icon: "warning",
      color: "#fbbf24",
      isRead: true,
    },
    {
      id: "4",
      type: "system",
      title: "System Backup Completed",
      description: "Daily backup completed successfully",
      timestamp: "1 hour ago",
      icon: "cloud-done",
      color: "#60a5fa",
      isRead: true,
    },
    {
      id: "5",
      type: "user",
      title: "Agent Assignment",
      description: "John Doe assigned to Colombo district",
      timestamp: "2 hours ago",
      icon: "people",
      color: "#f472b6",
      isRead: true,
    },
    {
      id: "6",
      type: "inventory",
      title: "New Donation Received",
      description: "500kg rice bags added to inventory",
      timestamp: "3 hours ago",
      icon: "gift",
      color: "#a78bfa",
      isRead: true,
    },
  ];

  const unreadCount = activities.filter((activity) => !activity.isRead).length;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#00ff94" />
        </TouchableOpacity>
      </View>

      <View style={styles.activitiesContainer}>
        {activities.slice(0, 5).map((activity) => (
          <ActivityCard key={activity.id} item={activity} />
        ))}

        <TouchableOpacity style={styles.loadMoreButton}>
          <Text style={styles.loadMoreText}>Load More Activities</Text>
          <Ionicons name="refresh" size={16} color="#00ff94" />
        </TouchableOpacity>
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  unreadBadge: {
    backgroundColor: "#ff4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    color: "#00ff94",
    fontSize: 14,
    fontWeight: "500",
  },
  activitiesContainer: {
    gap: 8,
  },
  activityCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#333",
    position: "relative",
  },
  unreadCard: {
    borderColor: "#00ff94",
    backgroundColor: "#0a1a0f",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  activityDescription: {
    color: "#bbb",
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 4,
    lineHeight: 18,
  },
  activityTimestamp: {
    color: "#666",
    fontSize: 11,
    fontWeight: "500",
  },
  unreadIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    backgroundColor: "#00ff94",
    borderRadius: 4,
  },
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    marginTop: 8,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  loadMoreText: {
    color: "#00ff94",
    fontSize: 14,
    fontWeight: "500",
  },
});
