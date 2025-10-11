import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CampaignFormData } from "@/src/types/campaign.type";

interface CampaignBasicInfoProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
}

const campaignTypes = [
  {
    id: "disaster-relief",
    label: "Disaster Relief",
    icon: "umbrella",
    color: "#ff4444",
  },
  {
    id: "medical-aid",
    label: "Medical Aid",
    icon: "medical",
    color: "#4ade80",
  },
  { id: "education", label: "Education", icon: "school", color: "#60a5fa" },
  {
    id: "food-distribution",
    label: "Food Distribution",
    icon: "restaurant",
    color: "#fbbf24",
  },
  {
    id: "emergency-response",
    label: "Emergency Response",
    icon: "flash",
    color: "#f472b6",
  },
];

const priorityLevels = [
  {
    id: "low",
    label: "Low",
    color: "#4ade80",
    description: "Standard timeline",
  },
  {
    id: "medium",
    label: "Medium",
    color: "#fbbf24",
    description: "Moderate urgency",
  },
  {
    id: "high",
    label: "High",
    color: "#f472b6",
    description: "Urgent attention",
  },
  {
    id: "critical",
    label: "Critical",
    color: "#ff4444",
    description: "Immediate action",
  },
];

export default function CampaignBasicInfo({
  formData,
  updateFormData,
}: CampaignBasicInfoProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Campaign Details</Text>

        {/* Campaign Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Campaign Name *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.name}
            onChangeText={(text) => updateFormData({ name: text })}
            placeholder="Enter campaign name"
            placeholderTextColor="#666"
          />
        </View>

        {/* Campaign Description */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => updateFormData({ description: text })}
            placeholder="Describe the campaign objectives and scope"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Campaign Type */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Campaign Type</Text>
        <View style={styles.typeGrid}>
          {campaignTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeCard,
                formData.type === type.id && styles.typeCardActive,
                {
                  borderColor: formData.type === type.id ? type.color : "#333",
                },
              ]}
              onPress={() => updateFormData({ type: type.id as any })}
            >
              <View
                style={[
                  styles.typeIcon,
                  { backgroundColor: type.color + "20" },
                ]}
              >
                <Ionicons
                  name={type.icon as any}
                  size={24}
                  color={type.color}
                />
              </View>
              <Text
                style={[
                  styles.typeLabel,
                  formData.type === type.id && styles.typeLabelActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Priority Level */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Priority Level</Text>
        <View style={styles.priorityContainer}>
          {priorityLevels.map((priority) => (
            <TouchableOpacity
              key={priority.id}
              style={[
                styles.priorityCard,
                formData.priority === priority.id && styles.priorityCardActive,
                {
                  borderColor:
                    formData.priority === priority.id ? priority.color : "#333",
                },
              ]}
              onPress={() => updateFormData({ priority: priority.id as any })}
            >
              <View style={styles.priorityHeader}>
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: priority.color },
                  ]}
                />
                <Text
                  style={[
                    styles.priorityLabel,
                    formData.priority === priority.id &&
                      styles.priorityLabelActive,
                  ]}
                >
                  {priority.label}
                </Text>
              </View>
              <Text style={styles.priorityDescription}>
                {priority.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Form Validation Tips */}
      <View style={styles.tipsContainer}>
        <View style={styles.tipHeader}>
          <Ionicons name="bulb" size={16} color="#fbbf24" />
          <Text style={styles.tipTitle}>Tips for Better Campaigns</Text>
        </View>
        <Text style={styles.tipText}>
          • Use clear, descriptive names that reflect the campaign&apos;s
          purpose
          {"\n"}• Include specific objectives and expected outcomes in the
          description{"\n"}• Choose the appropriate type to ensure proper
          resource allocation{"\n"}• Set priority based on urgency and impact
          assessment
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  typeCard: {
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "48%",
    minHeight: 100,
  },
  typeCardActive: {
    backgroundColor: "#0a1a0f",
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  typeLabel: {
    color: "#bbb",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  typeLabelActive: {
    color: "#fff",
  },
  priorityContainer: {
    gap: 12,
  },
  priorityCard: {
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
  },
  priorityCardActive: {
    backgroundColor: "#0a1a0f",
  },
  priorityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  priorityLabel: {
    color: "#bbb",
    fontSize: 16,
    fontWeight: "600",
  },
  priorityLabelActive: {
    color: "#fff",
  },
  priorityDescription: {
    color: "#888",
    fontSize: 14,
    marginLeft: 20,
  },
  tipsContainer: {
    margin: 20,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipTitle: {
    color: "#fbbf24",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  tipText: {
    color: "#bbb",
    fontSize: 13,
    lineHeight: 18,
  },
});
