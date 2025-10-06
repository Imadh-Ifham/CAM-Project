import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
  color,
}: StatCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "#00ff94";
      case "negative":
        return "#ff4444";
      default:
        return "#888";
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return "trending-up";
      case "negative":
        return "trending-down";
      default:
        return "remove";
    }
  };

  return (
    <TouchableOpacity style={styles.statCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View
          style={[
            styles.changeContainer,
            { backgroundColor: getChangeColor() + "20" },
          ]}
        >
          <Ionicons name={getChangeIcon()} size={14} color={getChangeColor()} />
          <Text style={[styles.changeText, { color: getChangeColor() }]}>
            {change}
          </Text>
        </View>
      </View>

      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function StatsOverview() {
  const stats: StatCardProps[] = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12.5%",
      changeType: "positive",
      icon: "people",
      color: "#00ff94",
    },
    {
      title: "Active Campaigns",
      value: "23",
      change: "+3",
      changeType: "positive",
      icon: "megaphone",
      color: "#4ade80",
    },
    {
      title: "Inventory Items",
      value: "1,456",
      change: "-2.1%",
      changeType: "negative",
      icon: "cube",
      color: "#60a5fa",
    },
    {
      title: "Volunteers",
      value: "189",
      change: "+8.3%",
      changeType: "positive",
      icon: "heart",
      color: "#f472b6",
    },
    {
      title: "Donations Today",
      value: "$12,450",
      change: "+15.2%",
      changeType: "positive",
      icon: "gift",
      color: "#fbbf24",
    },
    {
      title: "System Health",
      value: "98.5%",
      change: "0%",
      changeType: "neutral",
      icon: "pulse",
      color: "#34d399",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#00ff94" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsContainer}
        style={styles.scrollView}
      >
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </ScrollView>
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
  scrollView: {
    flexGrow: 0,
  },
  statsContainer: {
    gap: 15,
    paddingRight: 20,
  },
  statCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    width: 140,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  changeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statTitle: {
    color: "#888",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
});
