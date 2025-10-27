import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Campaign } from "@/src/types/campaign.type";
import { mockTeamMembers } from "@/src/types/volunteer.type";

interface CampaignTeamProps {
  campaign: Campaign;
}

// Mock pending approvals data
const mockPendingApprovals = [
  {
    id: "pa1",
    name: "Sarah Johnson",
    role: "Field Supervisor",
    phone: "+1 555-0123",
    email: "sarah.j@example.com",
    appliedDate: "2025-10-25",
    experience: "5 years in disaster relief",
    availability: "Full-time",
  },
  {
    id: "pa2",
    name: "Michael Chen",
    role: "Logistics Coordinator",
    phone: "+1 555-0124",
    email: "m.chen@example.com",
    appliedDate: "2025-10-24",
    experience: "3 years in supply chain",
    availability: "Part-time",
  },
  {
    id: "pa3",
    name: "Emily Rodriguez",
    role: "Medical Officer",
    phone: "+1 555-0125",
    email: "emily.r@example.com",
    appliedDate: "2025-10-23",
    experience: "Licensed nurse, 7 years",
    availability: "Full-time",
  },
];

export default function CampaignTeam({ campaign }: CampaignTeamProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [pendingApprovals, setPendingApprovals] =
    useState(mockPendingApprovals);

  const volunteers = mockTeamMembers.volunteers;

  const filteredMembers = volunteers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = () => {
    setShowAddMember(true);
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    Alert.alert(
      "Remove Team Member",
      `Are you sure you want to remove ${memberName} from this campaign?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            // Handle remove member logic here
            console.log("Removing member:", memberId);
          },
        },
      ]
    );
  };

  const handleApproveApplication = (
    applicationId: string,
    memberName: string
  ) => {
    Alert.alert(
      "Approve Application",
      `Approve ${memberName} to join the campaign team?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: () => {
            setPendingApprovals(
              pendingApprovals.filter((app) => app.id !== applicationId)
            );
            Alert.alert(
              "Success! ✅",
              `${memberName} has been added to the team`
            );
          },
        },
      ]
    );
  };

  const handleRejectApplication = (
    applicationId: string,
    memberName: string
  ) => {
    Alert.alert(
      "Reject Application",
      `Are you sure you want to reject ${memberName}'s application?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            setPendingApprovals(
              pendingApprovals.filter((app) => app.id !== applicationId)
            );
            Alert.alert(
              "Application Rejected",
              `${memberName}'s application has been rejected`
            );
          },
        },
      ]
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "campaign coordinator":
        return "person-circle";
      case "field supervisor":
        return "clipboard";
      case "medical officer":
        return "medical";
      case "logistics coordinator":
        return "cube";
      default:
        return "person";
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Pending Approvals Section */}
      {pendingApprovals.length > 0 && (
        <View style={styles.pendingSection}>
          <View style={styles.pendingSectionHeader}>
            <View style={styles.pendingTitleRow}>
              <Ionicons name="time" size={20} color="#fbbf24" />
              <Text style={styles.pendingSectionTitle}>Pending Approvals</Text>
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>
                  {pendingApprovals.length}
                </Text>
              </View>
            </View>
            <Text style={styles.pendingSectionSubtitle}>
              Review and approve new team member applications
            </Text>
          </View>

          <View style={styles.pendingList}>
            {pendingApprovals.map((application) => (
              <View key={application.id} style={styles.pendingCard}>
                <View style={styles.pendingHeader}>
                  <View style={styles.pendingAvatar}>
                    <Ionicons name="person" size={20} color="#fbbf24" />
                  </View>

                  <View style={styles.pendingInfo}>
                    <Text style={styles.pendingName}>{application.name}</Text>
                    <Text style={styles.pendingRole}>{application.role}</Text>
                  </View>

                  <View style={styles.pendingStatusBadge}>
                    <Text style={styles.pendingStatusText}>PENDING</Text>
                  </View>
                </View>

                <View style={styles.pendingDetails}>
                  <View style={styles.pendingDetailRow}>
                    <Ionicons name="call" size={14} color="#888" />
                    <Text style={styles.pendingDetailText}>
                      {application.phone}
                    </Text>
                  </View>
                  <View style={styles.pendingDetailRow}>
                    <Ionicons name="mail" size={14} color="#888" />
                    <Text style={styles.pendingDetailText}>
                      {application.email}
                    </Text>
                  </View>
                  <View style={styles.pendingDetailRow}>
                    <Ionicons name="calendar" size={14} color="#888" />
                    <Text style={styles.pendingDetailText}>
                      Applied: {application.appliedDate}
                    </Text>
                  </View>
                  <View style={styles.pendingDetailRow}>
                    <Ionicons name="briefcase" size={14} color="#888" />
                    <Text style={styles.pendingDetailText}>
                      {application.experience}
                    </Text>
                  </View>
                  <View style={styles.pendingDetailRow}>
                    <Ionicons name="time" size={14} color="#888" />
                    <Text style={styles.pendingDetailText}>
                      Availability: {application.availability}
                    </Text>
                  </View>
                </View>

                <View style={styles.pendingActions}>
                  <TouchableOpacity
                    onPress={() =>
                      handleRejectApplication(application.id, application.name)
                    }
                    style={styles.rejectButton}
                  >
                    <Ionicons name="close-circle" size={16} color="#ef4444" />
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      handleApproveApplication(application.id, application.name)
                    }
                    style={styles.approveButton}
                  >
                    <Ionicons name="checkmark-circle" size={16} color="#000" />
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Team Stats */}
      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>Team Overview</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#00ff94" }]}>
              {volunteers.filter((m) => m.status === "active").length}
            </Text>
            <Text style={styles.statLabel}>Active Members</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#60a5fa" }]}>
              {volunteers.length}
            </Text>
            <Text style={styles.statLabel}>Total Members</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#fbbf24" }]}>
              {campaign.targetVolunteers - campaign.volunteers.length}
            </Text>
            <Text style={styles.statLabel}>Needed</Text>
          </View>
        </View>
      </View>

      {/* Search and Add */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={16} color="#666" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search team members..."
              placeholderTextColor="#666"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close" size={16} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={handleAddMember} style={styles.addButton}>
          <Ionicons name="add" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Team Members List */}
      <View style={styles.membersList}>
        {filteredMembers.map((member) => (
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberContent}>
              <View style={styles.memberAvatar}>
                <Ionicons
                  name={getRoleIcon(member.role) as any}
                  size={20}
                  color="#00ff94"
                />
              </View>

              <View style={styles.memberInfo}>
                <View style={styles.memberHeader}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      member.status === "active"
                        ? styles.statusBadgeActive
                        : styles.statusBadgeInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        member.status === "active"
                          ? styles.statusTextActive
                          : styles.statusTextInactive,
                      ]}
                    >
                      {member.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.memberRole}>{member.role}</Text>

                <View style={styles.contactInfo}>
                  <View style={styles.contactItem}>
                    <Ionicons name="call" size={12} color="#888" />
                    <Text style={styles.contactText}>{member.phone}</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Ionicons name="mail" size={12} color="#888" />
                    <Text style={styles.contactText}>{member.email}</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Ionicons name="calendar" size={12} color="#888" />
                    <Text style={styles.contactText}>
                      Joined: {member.joinDate}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.callButton]}
                  >
                    <Ionicons name="call" size={14} color="#60a5fa" />
                    <Text
                      style={[styles.actionButtonText, styles.callButtonText]}
                    >
                      Call
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.emailButton]}
                  >
                    <Ionicons name="mail" size={14} color="#00ff94" />
                    <Text
                      style={[styles.actionButtonText, styles.emailButtonText]}
                    >
                      Email
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleRemoveMember(member.id, member.name)}
                    style={[styles.actionButton, styles.removeButton]}
                  >
                    <Ionicons name="remove-circle" size={14} color="#ff4444" />
                    <Text
                      style={[styles.actionButtonText, styles.removeButtonText]}
                    >
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        {filteredMembers.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#666" />
            <Text style={styles.emptyStateTitle}>No team members found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Add team members to get started"}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  pendingSection: {
    marginBottom: 20,
  },
  pendingSectionHeader: {
    marginBottom: 16,
  },
  pendingTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  pendingSectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
  },
  pendingBadge: {
    backgroundColor: "#fbbf2420",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  pendingBadgeText: {
    color: "#fbbf24",
    fontSize: 12,
    fontWeight: "600",
  },
  pendingSectionSubtitle: {
    color: "#9ca3af",
    fontSize: 14,
    marginLeft: 28,
  },
  pendingList: {
    gap: 12,
  },
  pendingCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#fbbf24",
  },
  pendingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  pendingAvatar: {
    width: 48,
    height: 48,
    backgroundColor: "#fbbf2420",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  pendingInfo: {
    flex: 1,
  },
  pendingName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  pendingRole: {
    color: "#fbbf24",
    fontSize: 14,
    fontWeight: "500",
  },
  pendingStatusBadge: {
    backgroundColor: "#fbbf2420",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pendingStatusText: {
    color: "#fbbf24",
    fontSize: 11,
    fontWeight: "600",
  },
  pendingDetails: {
    gap: 6,
    marginBottom: 16,
    paddingLeft: 60,
  },
  pendingDetailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pendingDetailText: {
    color: "#9ca3af",
    fontSize: 13,
    marginLeft: 8,
  },
  pendingActions: {
    flexDirection: "row",
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#ef4444",
    borderRadius: 12,
    paddingVertical: 12,
  },
  rejectButtonText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  approveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10b981",
    borderRadius: 12,
    paddingVertical: 12,
  },
  approveButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  overviewCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  overviewTitle: {
    color: "#ffffff",
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
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#9ca3af",
    fontSize: 14,
  },
  searchRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    marginLeft: 12,
  },
  addButton: {
    backgroundColor: "#00ff94",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  membersList: {
    gap: 12,
  },
  memberCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  memberContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  memberAvatar: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(0, 255, 148, 0.2)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  memberName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusBadgeActive: {
    backgroundColor: "rgba(0, 255, 148, 0.2)",
  },
  statusBadgeInactive: {
    backgroundColor: "rgba(107, 114, 128, 0.2)",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusTextActive: {
    color: "#00ff94",
  },
  statusTextInactive: {
    color: "#9ca3af",
  },
  memberRole: {
    color: "#00ff94",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  contactInfo: {
    gap: 4,
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    color: "#9ca3af",
    fontSize: 12,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  callButton: {
    backgroundColor: "rgba(96, 165, 250, 0.2)",
  },
  emailButton: {
    backgroundColor: "rgba(0, 255, 148, 0.2)",
  },
  removeButton: {
    backgroundColor: "rgba(255, 68, 68, 0.2)",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  callButtonText: {
    color: "#60a5fa",
  },
  emailButtonText: {
    color: "#00ff94",
  },
  removeButtonText: {
    color: "#ff4444",
  },
  emptyState: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  emptyStateTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateText: {
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center",
  },
});
