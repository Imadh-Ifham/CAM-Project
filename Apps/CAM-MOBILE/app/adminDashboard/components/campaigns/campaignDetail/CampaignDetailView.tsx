import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import CampaignOverview from "./CampaignOverview";
import CampaignTeam from "./CampaignTeam";
import CampaignResources from "./CampaignResources";
import CampaignProgress from "./CampaignProgress";
import { mockCampaignDetail } from "@/src/types/campaign.type";
import { useSelector } from "react-redux";
import { selectSelectedCampaign } from "@/src/store/slices/campaignSlice";

// Mock campaign data - in a real app, this would come from an API

const tabItems = [
  { key: "overview", label: "Overview", icon: "information-circle" },
  { key: "team", label: "Team", icon: "people" },
  { key: "resources", label: "Resources", icon: "cube" },
  { key: "progress", label: "Progress", icon: "bar-chart" },
];

export default function CampaignDetailView() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Import useSelector and the selector from your campaignSlice

  const selectedCampaign = useSelector(selectSelectedCampaign);

  const handleEditCampaign = () => {
    router.push(
      `/adminDashboard/components/campaigns/editCampaign/${params.id}` as any
    );
  };

  const handleDeleteCampaign = () => {
    Alert.alert(
      "Delete Campaign",
      "Are you sure you want to delete this campaign? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Handle delete logic here
            router.back();
          },
        },
      ]
    );
  };

  const handleShareCampaign = () => {
    // Handle share logic here
    Alert.alert(
      "Share Campaign",
      "Share functionality will be implemented here"
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <CampaignOverview campaign={selectedCampaign} />;
      case "team":
        return <CampaignTeam campaign={selectedCampaign} />;
      case "resources":
        return <CampaignResources campaign={selectedCampaign} />;
      case "progress":
        return <CampaignProgress campaign={selectedCampaign} />;
      default:
        return <CampaignOverview campaign={selectedCampaign} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color="#00ff94" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Campaign Details</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleShareCampaign}
            style={styles.headerButton}
          >
            <Ionicons name="share" size={20} color="#60a5fa" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleEditCampaign}
            style={styles.headerButton}
          >
            <Ionicons name="create" size={20} color="#fbbf24" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteCampaign}
            style={styles.headerButton}
          >
            <Ionicons name="trash" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        {tabItems.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key ? styles.tabActive : styles.tabInactive,
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons
              name={tab.icon as any}
              size={16}
              color={activeTab === tab.key ? "#000" : "#9ca3af"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key
                  ? styles.tabTextActive
                  : styles.tabTextInactive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  tabContainer: {
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    maxHeight: 60,
    borderBottomColor: "#374151",
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  tabActive: {
    backgroundColor: "#00ff94",
  },
  tabInactive: {
    backgroundColor: "#374151",
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#000",
  },
  tabTextInactive: {
    color: "#9ca3af",
  },
  content: {
    flex: 1,
  },
});
