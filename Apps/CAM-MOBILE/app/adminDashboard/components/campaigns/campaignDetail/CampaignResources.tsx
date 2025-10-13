import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Campaign } from "@/src/types/campaign.type";

interface CampaignResourcesProps {
  campaign: Campaign;
}

export default function CampaignResources({
  campaign,
}: CampaignResourcesProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = campaign.resources.filter((resource) =>
    resource.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getResourceIcon = (resourceName: string) => {
    const name = resourceName.toLowerCase();
    if (name.includes("food") || name.includes("packet")) return "restaurant";
    if (name.includes("water") || name.includes("bottle")) return "water";
    if (name.includes("medical") || name.includes("kit")) return "medical";
    if (name.includes("tent") || name.includes("shelter")) return "home";
    if (name.includes("clothes") || name.includes("clothing")) return "shirt";
    return "cube";
  };

  const getProgressColor = (available: number, required: number) => {
    const percentage = (available / required) * 100;
    if (percentage >= 80) return "#00ff94";
    if (percentage >= 50) return "#fbbf24";
    return "#ff4444";
  };

  const getStatusText = (available: number, required: number) => {
    const percentage = (available / required) * 100;
    if (percentage >= 100) return "Complete";
    if (percentage >= 80) return "Nearly Complete";
    if (percentage >= 50) return "In Progress";
    return "Critical";
  };

  const getStatusColor = (available: number, required: number) => {
    const percentage = (available / required) * 100;
    if (percentage >= 100) return "#10b981";
    if (percentage >= 80) return "#60a5fa";
    if (percentage >= 50) return "#fbbf24";
    return "#ef4444";
  };

  const getStatusBgColor = (available: number, required: number) => {
    const percentage = (available / required) * 100;
    if (percentage >= 100) return "#10b98120";
    if (percentage >= 80) return "#60a5fa20";
    if (percentage >= 50) return "#fbbf2420";
    return "#ef444420";
  };

  const totalResources = campaign.resources.length;
  const completeResources = campaign.resources.filter(
    (r) => r.availableQuantity >= r.requiredQuantity
  ).length;
  const criticalResources = campaign.resources.filter(
    (r) => (r.availableQuantity / r.requiredQuantity) * 100 < 50
  ).length;

  return (
    <View style={styles.container}>
      {/* Resource Stats */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Resource Overview</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumberGreen}>{completeResources}</Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumberBlue}>{totalResources}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumberRed}>{criticalResources}</Text>
            <Text style={styles.statLabel}>Critical</Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="#666" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search resources..."
            placeholderTextColor="#666"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close" size={16} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Resources List */}
      <View style={styles.resourcesList}>
        {filteredResources.map((resource, index) => {
          const percentage =
            (resource.availableQuantity / resource.requiredQuantity) * 100;
          const progressColor = getProgressColor(
            resource.availableQuantity,
            resource.requiredQuantity
          );

          return (
            <View key={index} style={styles.resourceCard}>
              <View style={styles.resourceHeader}>
                <View style={styles.resourceIcon}>
                  <Ionicons
                    name={getResourceIcon(resource.name) as any}
                    size={20}
                    color="#00ff94"
                  />
                </View>

                <View style={styles.resourceInfo}>
                  <View style={styles.resourceTitleRow}>
                    <Text style={styles.resourceName}>{resource.name}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusBgColor(
                            resource.availableQuantity,
                            resource.requiredQuantity
                          ),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: getStatusColor(
                              resource.availableQuantity,
                              resource.requiredQuantity
                            ),
                          },
                        ]}
                      >
                        {getStatusText(
                          resource.availableQuantity,
                          resource.requiredQuantity
                        )}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.resourceStats}>
                    <Text style={styles.resourceCount}>
                      {resource.availableQuantity} / {resource.requiredQuantity}{" "}
                      {resource.unit}
                    </Text>
                    <Text style={styles.resourcePercentage}>
                      {percentage.toFixed(0)}%
                    </Text>
                  </View>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: progressColor,
                    },
                  ]}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.addButton]}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="add" size={16} color="#00ff94" />
                    <Text style={styles.addButtonText}>Add Stock</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.updateButton]}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="create" size={16} color="#60a5fa" />
                    <Text style={styles.updateButtonText}>Update</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.historyButton]}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="list" size={16} color="#fbbf24" />
                    <Text style={styles.historyButtonText}>History</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {filteredResources.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={48} color="#666" />
            <Text style={styles.emptyStateTitle}>No resources found</Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery
                ? "Try adjusting your search criteria"
                : "No resources have been added to this campaign yet"}
            </Text>
          </View>
        )}
      </View>

      {/* Add Resource Button */}
      <TouchableOpacity style={styles.addResourceButton}>
        <Ionicons name="add" size={20} color="#000" />
        <Text style={styles.addResourceButtonText}>Add New Resource</Text>
      </TouchableOpacity>
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
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumberGreen: {
    color: "#10b981",
    fontSize: 24,
    fontWeight: "bold",
  },
  statNumberBlue: {
    color: "#60a5fa",
    fontSize: 24,
    fontWeight: "bold",
  },
  statNumberRed: {
    color: "#ef4444",
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#9ca3af",
    fontSize: 14,
  },
  searchContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },
  resourcesList: {
    gap: 12,
  },
  resourceCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  resourceHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#00ff9420",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  resourceName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  resourceStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  resourceCount: {
    color: "#9ca3af",
    fontSize: 14,
  },
  resourcePercentage: {
    color: "#d1d5db",
    fontSize: 14,
    fontWeight: "500",
  },
  progressContainer: {
    backgroundColor: "#374151",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#00ff9420",
  },
  updateButton: {
    backgroundColor: "#60a5fa20",
  },
  historyButton: {
    backgroundColor: "#fbbf2420",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    color: "#4ade80",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  updateButtonText: {
    color: "#60a5fa",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  historyButtonText: {
    color: "#fbbf24",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  emptyState: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  emptyStateTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center",
  },
  addResourceButton: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addResourceButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
