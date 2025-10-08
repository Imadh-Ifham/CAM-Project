import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CampaignFormData } from "@/src/types/campaign.type";

interface CampaignTeamProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
}

const commonSkills = [
  "First Aid",
  "Communication",
  "Leadership",
  "Logistics",
  "Translation",
  "Medical Training",
  "Construction",
  "Cooking",
  "Teaching",
  "Driving",
  "Social Work",
  "Counseling",
  "Photography",
  "Data Entry",
  "Organization",
];

export default function CampaignTeam({
  formData,
  updateFormData,
}: CampaignTeamProps) {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = (skill: string) => {
    if (skill && !formData.skillsRequired.includes(skill)) {
      updateFormData({
        skillsRequired: [...formData.skillsRequired, skill],
      });
    }
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    updateFormData({
      skillsRequired: formData.skillsRequired.filter((s) => s !== skill),
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Volunteer Requirements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Volunteer Requirements</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Number of Volunteers Needed</Text>
          <View style={styles.volunteerCounter}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() =>
                updateFormData({
                  requiredVolunteers: Math.max(
                    0,
                    formData.requiredVolunteers - 1
                  ),
                })
              }
            >
              <Ionicons name="remove" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.counterDisplay}>
              <Text style={styles.counterText}>
                {formData.requiredVolunteers}
              </Text>
              <Text style={styles.counterLabel}>volunteers</Text>
            </View>

            <TouchableOpacity
              style={styles.counterButton}
              onPress={() =>
                updateFormData({
                  requiredVolunteers: formData.requiredVolunteers + 1,
                })
              }
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Required Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Required Skills</Text>

        {/* Add Custom Skill */}
        <View style={styles.addSkillContainer}>
          <TextInput
            style={styles.skillInput}
            value={newSkill}
            onChangeText={setNewSkill}
            placeholder="Add custom skill..."
            placeholderTextColor="#666"
            onSubmitEditing={() => addSkill(newSkill)}
          />
          <TouchableOpacity
            style={styles.addSkillButton}
            onPress={() => addSkill(newSkill)}
          >
            <Ionicons name="add" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Common Skills */}
        <Text style={styles.subsectionTitle}>Common Skills</Text>
        <View style={styles.skillsGrid}>
          {commonSkills.map((skill) => (
            <TouchableOpacity
              key={skill}
              style={[
                styles.skillChip,
                formData.skillsRequired.includes(skill) &&
                  styles.skillChipSelected,
              ]}
              onPress={() =>
                formData.skillsRequired.includes(skill)
                  ? removeSkill(skill)
                  : addSkill(skill)
              }
            >
              <Text
                style={[
                  styles.skillChipText,
                  formData.skillsRequired.includes(skill) &&
                    styles.skillChipTextSelected,
                ]}
              >
                {skill}
              </Text>
              {formData.skillsRequired.includes(skill) && (
                <Ionicons name="checkmark" size={14} color="#000" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Skills */}
        {formData.skillsRequired.length > 0 && (
          <View style={styles.selectedSkillsContainer}>
            <Text style={styles.subsectionTitle}>
              Selected Skills ({formData.skillsRequired.length})
            </Text>
            <View style={styles.selectedSkillsList}>
              {formData.skillsRequired.map((skill) => (
                <View key={skill} style={styles.selectedSkillItem}>
                  <Text style={styles.selectedSkillText}>{skill}</Text>
                  <TouchableOpacity onPress={() => removeSkill(skill)}>
                    <Ionicons name="close" size={16} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Team Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Team Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Ionicons name="person-add" size={18} color="#4ade80" />
            <Text style={styles.summaryLabel}>Required Volunteers:</Text>
            <Text style={styles.summaryValue}>
              {formData.requiredVolunteers}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="star" size={18} color="#fbbf24" />
            <Text style={styles.summaryLabel}>Required Skills:</Text>
            <Text style={styles.summaryValue}>
              {formData.skillsRequired.length}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="calculator" size={18} color="#f472b6" />
            <Text style={styles.summaryLabel}>Total Team Size:</Text>
            <Text style={styles.summaryValue}>
              {formData.requiredVolunteers} people
            </Text>
          </View>
        </View>
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  subsectionTitle: {
    color: "#bbb",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
    marginTop: 16,
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
  volunteerCounter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 4,
  },
  counterButton: {
    backgroundColor: "#00ff94",
    borderRadius: 8,
    padding: 12,
  },
  counterDisplay: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  counterText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  counterLabel: {
    color: "#888",
    fontSize: 12,
  },
  addSkillContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  skillInput: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    fontSize: 14,
  },
  addSkillButton: {
    backgroundColor: "#00ff94",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillChip: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  skillChipSelected: {
    backgroundColor: "#00ff94",
    borderColor: "#00ff94",
  },
  skillChipText: {
    color: "#bbb",
    fontSize: 12,
    fontWeight: "500",
  },
  skillChipTextSelected: {
    color: "#000",
  },
  selectedSkillsContainer: {
    marginTop: 16,
  },
  selectedSkillsList: {
    gap: 8,
  },
  selectedSkillItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectedSkillText: {
    color: "#fff",
    fontSize: 14,
  },
  assignButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  assignButtonText: {
    color: "#00ff94",
    fontSize: 14,
    fontWeight: "500",
  },
  agentSelection: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    fontSize: 14,
    marginBottom: 12,
  },
  agentsList: {
    maxHeight: 200,
  },
  agentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  agentCardAssigned: {
    backgroundColor: "#0a1a0f",
    borderWidth: 1,
    borderColor: "#00ff94",
  },
  agentAvatar: {
    width: 36,
    height: 36,
    backgroundColor: "#00ff9420",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  agentDetails: {
    color: "#888",
    fontSize: 12,
  },
  assignedAgentsList: {
    gap: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
  },
  emptyStateSubtext: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  assignedAgentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 12,
  },
  removeAgentButton: {
    padding: 8,
  },
  summaryCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryLabel: {
    color: "#bbb",
    fontSize: 14,
    flex: 1,
  },
  summaryValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
