import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Mock campaign data
const mockCampaigns = [
  {
    id: "1",
    name: "Flood Relief - Colombo",
    type: "disaster-relief",
    status: "active",
    priority: "critical",
    location: "Colombo, Western Province",
    startDate: "2024-01-15",
    volunteers: 25,
    progress: 75,
    budget: 150000,
  },
  {
    id: "2",
    name: "Medical Aid - Kandy",
    type: "medical-aid",
    status: "planning",
    priority: "high",
    location: "Kandy, Central Province",
    startDate: "2024-01-20",
    volunteers: 12,
    progress: 30,
    budget: 80000,
  },
  {
    id: "3",
    name: "Education Support - Jaffna",
    type: "education",
    status: "completed",
    priority: "medium",
    location: "Jaffna, Northern Province",
    startDate: "2024-01-10",
    volunteers: 8,
    progress: 100,
    budget: 45000,
  },
];

const campaignTypes = [
  { key: "all", label: "All Campaigns", icon: "grid" },
  { key: "disaster-relief", label: "Disaster Relief", icon: "warning" },
  { key: "medical-aid", label: "Medical Aid", icon: "medical" },
  { key: "education", label: "Education", icon: "school" },
  { key: "food-distribution", label: "Food Distribution", icon: "restaurant" },
];

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

export default function CampaignsIndex() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesType =
      selectedType === "all" || campaign.type === selectedType;
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleCreateCampaign = () => {
    router.push("/adminDashboard/components/campaigns/createCampaign" as any);
  };

  const getCampaignIcon = (type: string) => {
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

  const formatCurrency = (amount: number) => {
    return `LKR ${amount.toLocaleString()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#00ff94" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Campaigns</Text>
        <TouchableOpacity
          onPress={handleCreateCampaign}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search campaigns..."
            placeholderTextColor="#666"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {campaignTypes.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={[
              styles.filterTab,
              selectedType === type.key && styles.filterTabActive,
            ]}
            onPress={() => setSelectedType(type.key)}
          >
            <Ionicons
              name={type.icon as any}
              size={16}
              color={selectedType === type.key ? "#000" : "#666"}
            />
            <Text
              style={[
                styles.filterTabText,
                selectedType === type.key && styles.filterTabTextActive,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Campaign Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{mockCampaigns.length}</Text>
          <Text style={styles.statLabel}>Total Campaigns</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {mockCampaigns.filter((c) => c.status === "active").length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {mockCampaigns.reduce((sum, c) => sum + c.volunteers, 0)}
          </Text>
          <Text style={styles.statLabel}>Volunteers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {formatCurrency(
              mockCampaigns.reduce((sum, c) => sum + c.budget, 0)
            )}
          </Text>
          <Text style={styles.statLabel}>Total Budget</Text>
        </View>
      </View>

      {/* Campaigns List */}
      <ScrollView
        style={styles.campaignsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredCampaigns.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="megaphone-outline" size={64} color="#666" />
            <Text style={styles.emptyStateTitle}>No campaigns found</Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Create your first campaign to get started"}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateCampaign}
              >
                <Ionicons name="add" size={20} color="#000" />
                <Text style={styles.createButtonText}>Create Campaign</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredCampaigns.map((campaign) => (
            <TouchableOpacity key={campaign.id} style={styles.campaignCard}>
              {/* Campaign Header */}
              <View style={styles.campaignHeader}>
                <View style={styles.campaignIcon}>
                  <Ionicons
                    name={getCampaignIcon(campaign.type) as any}
                    size={20}
                    color="#00ff94"
                  />
                </View>
                <View style={styles.campaignHeaderInfo}>
                  <Text style={styles.campaignName}>{campaign.name}</Text>
                  <Text style={styles.campaignLocation}>
                    {campaign.location}
                  </Text>
                </View>
                <View style={styles.campaignBadges}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          statusColors[
                            campaign.status as keyof typeof statusColors
                          ] + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            statusColors[
                              campaign.status as keyof typeof statusColors
                            ],
                        },
                      ]}
                    >
                      {campaign.status.toUpperCase()}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.priorityBadge,
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
                        styles.priorityText,
                        {
                          color:
                            priorityColors[
                              campaign.priority as keyof typeof priorityColors
                            ],
                        },
                      ]}
                    >
                      {campaign.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Campaign Details */}
              <View style={styles.campaignDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar" size={14} color="#888" />
                    <Text style={styles.detailText}>
                      Start: {campaign.startDate}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="people" size={14} color="#888" />
                    <Text style={styles.detailText}>
                      {campaign.volunteers} volunteers
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="card" size={14} color="#888" />
                    <Text style={styles.detailText}>
                      {formatCurrency(campaign.budget)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="bar-chart" size={14} color="#888" />
                    <Text style={styles.detailText}>
                      {campaign.progress}% complete
                    </Text>
                  </View>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${campaign.progress}%` },
                    ]}
                  />
                </View>
              </View>

              {/* Campaign Actions */}
              <View style={styles.campaignActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="eye" size={16} color="#00ff94" />
                  <Text style={styles.actionButtonText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="create" size={16} color="#fbbf24" />
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="share" size={16} color="#60a5fa" />
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleCreateCampaign}>
        <Ionicons name="add" size={28} color="#000" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#00ff94",
    borderRadius: 8,
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  filterContainer: {
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 45, // fixed height
  },
  filterTabActive: {
    backgroundColor: "#00ff94",
  },
  filterTabText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  filterTabTextActive: {
    color: "#000",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    gap: 12,
    marginTop: -480,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  statNumber: {
    color: "#00ff94",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
  },
  campaignsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00ff94",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  createButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  campaignCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  campaignHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  campaignIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#00ff9420",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  campaignHeaderInfo: {
    flex: 1,
  },
  campaignName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  campaignLocation: {
    color: "#888",
    fontSize: 14,
  },
  campaignBadges: {
    gap: 4,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  priorityBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "600",
  },
  campaignDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  detailText: {
    color: "#bbb",
    fontSize: 13,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#00ff94",
  },
  campaignActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    color: "#bbb",
    fontSize: 13,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: "#00ff94",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
