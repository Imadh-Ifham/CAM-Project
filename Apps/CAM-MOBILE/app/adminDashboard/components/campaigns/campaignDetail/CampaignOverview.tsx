import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Campaign } from "@/src/types/campaign.type";

interface CampaignOverviewProps {
  campaign: Campaign;
}

const statusColors = {
  active: "#00ff94",
  planning: "#fbbf24",
  completed: "#4ade80",
  paused: "#f472b6",
};

const priorityColors = {
  critical: "#ff4444",
  high: "#ff8800",
  medium: "#fbbf24",
  low: "#4ade80",
};

export default function CampaignOverview({ campaign }: CampaignOverviewProps) {
  const formatCurrency = (amount?: number | null) => {
    const safe = typeof amount === "number" && isFinite(amount) ? amount : 0;
    try {
      return `LKR ${safe.toLocaleString()}`;
    } catch {
      return `LKR ${safe}`;
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Not set";

    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "Invalid date";

      // Format as: Jan 15, 2024
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "disaster-relief":
        return "warning";
      case "medical-aid":
        return "medical";
      case "education":
        return "school";
      case "food-distribution":
        return "restaurant";
      default:
        return "megaphone";
    }
  };

  return (
    <View style={styles.container}>
      {/* Campaign Header */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={getTypeIcon(campaign.type) as any}
              size={24}
              color="#00ff94"
            />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.campaignName}>{campaign.name}</Text>
            <Text style={styles.campaignLocation}>{campaign.location}</Text>
          </View>
        </View>

        <Text style={styles.description}>{campaign.description}</Text>

        {/* Status and Priority Badges */}
        <View style={styles.badgeContainer}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  statusColors[campaign.status as keyof typeof statusColors] +
                  "20",
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color:
                    statusColors[campaign.status as keyof typeof statusColors],
                },
              ]}
            >
              {campaign.status}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  priorityColors[
                    campaign.priority as keyof typeof priorityColors
                  ] + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color:
                    priorityColors[
                      campaign.priority as keyof typeof priorityColors
                    ],
                },
              ]}
            >
              {campaign.priority}
            </Text>
          </View>
        </View>
      </View>

      {/* Campaign Stats */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Campaign Statistics</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Ionicons name="people" size={16} color="#00ff94" />
              <Text style={styles.statLabel}>Volunteers</Text>
            </View>
            <Text style={styles.statValue}>
              {(campaign as any)?.volunteers ?? 0}/
              {(campaign as any)?.requiredVolunteers ??
                (campaign as any)?.targetVolunteers ??
                0}
            </Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Ionicons name="trending-up" size={16} color="#00ff94" />
              <Text style={styles.statLabel}>Progress</Text>
            </View>
            <Text style={styles.statValue}>{campaign.progress}%</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Ionicons name="card" size={16} color="#00ff94" />
              <Text style={styles.statLabel}>Estimated Budget</Text>
            </View>
            <Text style={styles.statValue}>
              {formatCurrency(
                (campaign as any)?.estimatedBudget ?? (campaign as any)?.budget
              )}
            </Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Ionicons name="cash" size={16} color="#00ff94" />
              <Text style={styles.statLabel}>Spent</Text>
            </View>
            <Text style={styles.statValue}>
              {formatCurrency((campaign as any)?.spent)}
            </Text>
          </View>
        </View>
      </View>

      {/* Timeline */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Duration</Text>

        <View style={styles.durationRow}>
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Ionicons name="play" size={16} color="#00ff94" />
              <Text style={styles.statLabel}>Start Date</Text>
            </View>
            <Text style={styles.dateValue}>
              {formatDate((campaign as any)?.startDate)}
            </Text>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Ionicons name="stop" size={16} color="#00ff94" />
              <Text style={styles.statLabel}>End Date</Text>
            </View>
            <Text style={styles.dateValue}>
              {formatDate((campaign as any)?.endDate)}
            </Text>
          </View>
        </View>
      </View>

      {/* Coordinator Info */}
      <View style={[styles.card, { marginBottom: 0 }]}>
        <Text style={styles.sectionTitle}>Campaign Coordinator</Text>

        <View style={styles.coordinatorHeader}>
          <View style={styles.coordinatorIcon}>
            <Ionicons name="person" size={20} color="#00ff94" />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.coordinatorName}>
              {(campaign as any)?.coordinator?.name || "Unassigned"}
            </Text>
          </View>
        </View>

        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Ionicons name="call" size={16} color="#888" />
            <Text style={styles.contactText}>
              {(campaign as any)?.coordinator?.phone || "N/A"}
            </Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={16} color="#888" />
            <Text style={styles.contactText}>
              {(campaign as any)?.coordinator?.email || "N/A"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#00ff9420",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  campaignName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  campaignLocation: {
    color: "#9ca3af",
    fontSize: 14,
  },
  description: {
    color: "#d1d5db",
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 16,
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statLabel: {
    color: "#9ca3af",
    fontSize: 14,
    marginLeft: 8,
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  durationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  coordinatorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  coordinatorIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#00ff9420",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  coordinatorName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  contactInfo: {
    gap: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    color: "#d1d5db",
    fontSize: 14,
    marginLeft: 12,
  },
});
