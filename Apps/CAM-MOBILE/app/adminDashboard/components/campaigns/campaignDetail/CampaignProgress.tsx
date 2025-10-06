import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Campaign {
  id: string;
  progress: number;
  budget: number;
  spent: number;
  volunteers: number;
  targetVolunteers: number;
}

interface CampaignProgressProps {
  campaign: Campaign;
}

// Mock progress data
const mockProgressData = {
  phases: [
    { name: "Planning", progress: 100, status: "completed" },
    { name: "Resource Collection", progress: 85, status: "active" },
    { name: "Team Deployment", progress: 70, status: "active" },
    { name: "Distribution", progress: 60, status: "active" },
    { name: "Follow-up", progress: 0, status: "pending" },
  ],
  milestones: [
    { name: "Campaign Launch", date: "2024-01-15", completed: true },
    { name: "50% Resource Target", date: "2024-01-22", completed: true },
    { name: "Team Full Deployment", date: "2024-01-25", completed: false },
    { name: "75% Distribution Complete", date: "2024-01-30", completed: false },
    { name: "Campaign Completion", date: "2024-02-15", completed: false },
  ],
  metrics: [
    { name: "Families Helped", current: 150, target: 200, unit: "families" },
    { name: "Relief Packages", current: 750, target: 1000, unit: "packages" },
    { name: "Medical Checkups", current: 300, target: 500, unit: "checkups" },
    { name: "Temporary Shelters", current: 80, target: 100, unit: "shelters" },
  ],
};

export default function CampaignProgress({ campaign }: CampaignProgressProps) {
  const formatCurrency = (amount: number) => {
    return `LKR ${amount.toLocaleString()}`;
  };

  const getPhaseColor = (status: string, progress: number) => {
    if (status === "completed") return "#00ff94";
    if (status === "active") {
      if (progress >= 80) return "#00ff94";
      if (progress >= 50) return "#fbbf24";
      return "#60a5fa";
    }
    return "#666";
  };

  const getPhaseIcon = (status: string) => {
    if (status === "completed") return "checkmark-circle";
    if (status === "active") return "play-circle";
    return "time";
  };

  return (
    <View style={styles.container}>
      {/* Overall Progress */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Overall Progress</Text>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Campaign Completion</Text>
            <Text style={styles.progressValue}>{campaign.progress}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${campaign.progress}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statColumn}>
            <Text style={styles.statLabel}>Budget Used</Text>
            <Text style={styles.statValue}>
              {formatCurrency(campaign.spent)}
            </Text>
            <Text style={styles.statSubtext}>
              of {formatCurrency(campaign.budget)}
            </Text>
          </View>

          <View style={[styles.statColumn, styles.centerAlign]}>
            <Text style={styles.statLabel}>Team Progress</Text>
            <Text style={styles.statValue}>
              {campaign.volunteers}/{campaign.targetVolunteers}
            </Text>
            <Text style={styles.statSubtext}>volunteers</Text>
          </View>

          <View style={[styles.statColumn, styles.rightAlign]}>
            <Text style={styles.statLabel}>Budget %</Text>
            <Text style={styles.statValue}>
              {((campaign.spent / campaign.budget) * 100).toFixed(0)}%
            </Text>
            <Text style={styles.statSubtext}>utilized</Text>
          </View>
        </View>
      </View>

      {/* Phases */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Campaign Phases</Text>

        <View style={styles.phasesList}>
          {mockProgressData.phases.map((phase, index) => (
            <View key={index} style={styles.phaseItem}>
              <View
                style={[
                  styles.phaseIcon,
                  {
                    backgroundColor:
                      getPhaseColor(phase.status, phase.progress) + "20",
                  },
                ]}
              >
                <Ionicons
                  name={getPhaseIcon(phase.status) as any}
                  size={16}
                  color={getPhaseColor(phase.status, phase.progress)}
                />
              </View>

              <View style={styles.phaseContent}>
                <View style={styles.phaseHeader}>
                  <Text style={styles.phaseName}>{phase.name}</Text>
                  <Text style={styles.phasePercentage}>{phase.progress}%</Text>
                </View>
                <View style={styles.phaseProgressContainer}>
                  <View
                    style={[
                      styles.phaseProgressFill,
                      {
                        width: `${phase.progress}%`,
                        backgroundColor: getPhaseColor(
                          phase.status,
                          phase.progress
                        ),
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Key Metrics */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>

        <View style={styles.metricsList}>
          {mockProgressData.metrics.map((metric, index) => {
            const percentage = (metric.current / metric.target) * 100;
            const color =
              percentage >= 80
                ? "#00ff94"
                : percentage >= 50
                ? "#fbbf24"
                : "#ff4444";

            return (
              <View key={index} style={styles.metricItem}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricName}>{metric.name}</Text>
                  <Text style={styles.metricValue}>
                    {metric.current}/{metric.target} {metric.unit}
                  </Text>
                </View>

                <View style={styles.metricProgressContainer}>
                  <View
                    style={[
                      styles.metricProgressFill,
                      {
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: color,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.metricPercentage}>
                  {percentage.toFixed(0)}% complete
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Milestones */}
      <View style={[styles.card, { marginBottom: 0 }]}>
        <Text style={styles.sectionTitle}>Milestones</Text>

        <View style={styles.milestonesList}>
          {mockProgressData.milestones.map((milestone, index) => (
            <View key={index} style={styles.milestoneItem}>
              <View
                style={[
                  styles.milestoneIcon,
                  milestone.completed
                    ? styles.milestoneCompleted
                    : styles.milestonePending,
                ]}
              >
                {milestone.completed ? (
                  <Ionicons name="checkmark" size={12} color="#000" />
                ) : (
                  <View style={styles.milestoneDot} />
                )}
              </View>

              <View style={styles.milestoneContent}>
                <Text
                  style={[
                    styles.milestoneName,
                    milestone.completed
                      ? styles.milestoneNameCompleted
                      : styles.milestoneNamePending,
                  ]}
                >
                  {milestone.name}
                </Text>
                <Text style={styles.milestoneDate}>{milestone.date}</Text>
              </View>

              {milestone.completed && (
                <Ionicons name="checkmark-circle" size={16} color="#00ff94" />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.updateButton]}>
          <View style={styles.buttonContent}>
            <Ionicons name="trending-up" size={16} color="#00ff94" />
            <Text style={styles.updateButtonText}>Update Progress</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.reportButton]}>
          <View style={styles.buttonContent}>
            <Ionicons name="document-text" size={16} color="#60a5fa" />
            <Text style={styles.reportButtonText}>Generate Report</Text>
          </View>
        </TouchableOpacity>
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
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    color: "#9ca3af",
    fontSize: 14,
  },
  progressValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  progressBarContainer: {
    backgroundColor: "#374151",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 6,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statColumn: {
    flex: 1,
  },
  centerAlign: {
    alignItems: "center",
  },
  rightAlign: {
    alignItems: "flex-end",
  },
  statLabel: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  statSubtext: {
    color: "#6b7280",
    fontSize: 12,
  },
  phasesList: {
    gap: 12,
  },
  phaseItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  phaseIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  phaseContent: {
    flex: 1,
  },
  phaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  phaseName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  phasePercentage: {
    color: "#9ca3af",
    fontSize: 12,
  },
  phaseProgressContainer: {
    backgroundColor: "#374151",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  phaseProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  metricsList: {
    gap: 12,
  },
  metricItem: {
    backgroundColor: "#111827",
    borderRadius: 8,
    padding: 12,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  metricName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  metricValue: {
    color: "#9ca3af",
    fontSize: 12,
  },
  metricProgressContainer: {
    backgroundColor: "#4b5563",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  metricProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  metricPercentage: {
    color: "#9ca3af",
    fontSize: 12,
  },
  milestonesList: {
    gap: 12,
  },
  milestoneItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  milestoneIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  milestoneCompleted: {
    backgroundColor: "#10b981",
  },
  milestonePending: {
    backgroundColor: "#4b5563",
  },
  milestoneDot: {
    width: 8,
    height: 8,
    backgroundColor: "#9ca3af",
    borderRadius: 4,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneName: {
    fontSize: 14,
    fontWeight: "500",
  },
  milestoneNameCompleted: {
    color: "#10b981",
  },
  milestoneNamePending: {
    color: "#fff",
  },
  milestoneDate: {
    color: "#9ca3af",
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  updateButton: {
    backgroundColor: "#00ff9420",
  },
  reportButton: {
    backgroundColor: "#60a5fa20",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  updateButtonText: {
    color: "#4ade80",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  reportButtonText: {
    color: "#60a5fa",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
});
