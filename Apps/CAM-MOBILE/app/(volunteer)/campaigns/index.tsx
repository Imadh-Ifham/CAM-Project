import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { colors } from "../../../src/styles/colors";
import { spacing } from "../../../src/styles/spacing";
import { typography } from "../../../src/styles/typography";
import { Card, CardContent, CardHeader } from "../../../src/components/ui/Card";
import { Button } from "../../../src/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type CampaignStatus = "Active" | "Available" | "Completed";

type Campaign = {
  id: number;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  agent: string;
  agentPhone: string;
  volunteers: number;
  volunteersNeeded: number;
  status: CampaignStatus;
  locations: number;
  taskTypes: string;
  resourceNeeds: { food: number; clothes: number; funds: number };
};

export default function VolunteerCampaignsIndex() {
  const router = useRouter();

  // Mock data (replace with API later)
  const campaigns: Campaign[] = [
    {
      id: 1,
      name: "Winter Relief 2024",
      description: "Emergency winter supplies for affected families",
      location: "Downtown Community Center",
      startDate: "2024-01-15",
      endDate: "2024-02-28",
      agent: "John Doe",
      agentPhone: "+1234567890",
      volunteers: 12,
      volunteersNeeded: 20,
      status: "Active",
      locations: 8,
      taskTypes: "Collection, packaging, delivery",
      resourceNeeds: { food: 500, clothes: 200, funds: 10000 },
    },
    {
      id: 2,
      name: "Flood Response",
      description: "Flood relief operations in affected areas",
      location: "Regional Emergency Center",
      startDate: "2024-02-01",
      endDate: "2024-03-15",
      agent: "Jane Smith",
      agentPhone: "+1234567891",
      volunteers: 8,
      volunteersNeeded: 15,
      status: "Available",
      locations: 5,
      taskTypes: "Emergency distribution, logistics",
      resourceNeeds: { food: 300, clothes: 150, funds: 8000 },
    },
    {
      id: 3,
      name: "Community Outreach",
      description: "Regular community support activities",
      location: "City Hall",
      startDate: "2024-03-01",
      endDate: "2024-04-30",
      agent: "Mike Johnson",
      agentPhone: "+1234567892",
      volunteers: 15,
      volunteersNeeded: 25,
      status: "Available",
      locations: 12,
      taskTypes: "Door-to-door collection, community events",
      resourceNeeds: { food: 800, clothes: 300, funds: 15000 },
    },
    {
      id: 4,
      name: "Emergency Shelter Setup",
      description: "Temporary shelter establishment for displaced families",
      location: "West Side Community",
      startDate: "2023-12-15",
      endDate: "2024-01-15",
      agent: "Sarah Wilson",
      agentPhone: "+1234567893",
      volunteers: 30,
      volunteersNeeded: 30,
      status: "Completed",
      locations: 6,
      taskTypes: "Setup, maintenance, distribution",
      resourceNeeds: { food: 800, clothes: 400, funds: 20000 },
    },
    {
      id: 5,
      name: "Spring Cleanup Initiative",
      description: "Community cleanup and resource recovery program",
      location: "Multiple Districts",
      startDate: "2024-03-15",
      endDate: "2024-04-30",
      agent: "Tom Davis",
      agentPhone: "+1234567894",
      volunteers: 18,
      volunteersNeeded: 25,
      status: "Available",
      locations: 10,
      taskTypes: "Collection, sorting, environmental cleanup",
      resourceNeeds: { food: 200, clothes: 600, funds: 8000 },
    },
  ];

  type FilterKey = "all" | "available" | "active" | "completed";
  const [filter, setFilter] = useState<FilterKey>("all");

  // Join modal state
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [volunteerApplication, setVolunteerApplication] = useState({
    fullName: "Alice Johnson",
    age: "",
    email: "",
    phone: "+1234567893",
    skills: "",
    experience: "",
    preferredTasks: "",
    availability: "",
    motivation: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const filtered = useMemo(() => {
    if (filter === "all") return campaigns;
    if (filter === "available")
      return campaigns.filter((c) => c.status === "Available");
    if (filter === "active")
      return campaigns.filter((c) => c.status === "Active");
    return campaigns.filter((c) => c.status === "Completed");
  }, [filter]);

  const counts = useMemo(
    () => ({
      all: campaigns.length,
      available: campaigns.filter((c) => c.status === "Available").length,
      active: campaigns.filter((c) => c.status === "Active").length,
      completed: campaigns.filter((c) => c.status === "Completed").length,
    }),
    []
  );

  const badgeText =
    filter === "all" ? `${counts.all} Total` : `${filtered.length} Found`;

  const StatusPill = ({ s }: { s: CampaignStatus }) => {
    const config = {
      Active: {
        bg: colors.blue,
        icon: "radio-button-on" as const,
      },
      Completed: {
        bg: colors.green,
        icon: "checkmark-circle" as const,
      },
      Available: {
        bg: colors.orange,
        icon: "time" as const,
      },
    };
    const { bg, icon } = config[s];
    return (
      <View
        style={{
          backgroundColor: bg,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Ionicons name={icon} size={12} color="#fff" />
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>
          {s}
        </Text>
      </View>
    );
  };

  const FilterButton = ({
    label,
    value,
  }: {
    label: string;
    value: FilterKey;
  }) => {
    const selected = filter === value;
    const config = {
      all: {
        selectedBg: colors.cardForeground,
        selectedBorder: colors.cardForeground,
        selectedText: colors.card,
        unselectedBg: colors.mutedBackground,
        unselectedBorder: colors.border,
        unselectedText: colors.cardForeground,
      },
      available: {
        selectedBg: colors.orange,
        selectedBorder: colors.orange,
        selectedText: "#fff",
        unselectedBg: colors.orange + "15",
        unselectedBorder: colors.orange + "30",
        unselectedText: colors.orange,
      },
      active: {
        selectedBg: colors.blue,
        selectedBorder: colors.blue,
        selectedText: "#fff",
        unselectedBg: colors.blue + "15",
        unselectedBorder: colors.blue + "30",
        unselectedText: colors.blue,
      },
      completed: {
        selectedBg: colors.green,
        selectedBorder: colors.green,
        selectedText: "#fff",
        unselectedBg: colors.green + "15",
        unselectedBorder: colors.green + "30",
        unselectedText: colors.green,
      },
    };

    const style = config[value];
    const backgroundColor = selected ? style.selectedBg : style.unselectedBg;
    const borderColor = selected
      ? style.selectedBorder
      : style.unselectedBorder;
    const textColor = selected ? style.selectedText : style.unselectedText;

    return (
      <Button
        variant="outline"
        size="sm"
        onPress={() => setFilter(value)}
        style={{
          flex: 1,
          height: 44,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          borderWidth: 1.5,
        }}
        textStyle={{
          color: textColor,
          fontWeight: "700",
          fontSize: 13,
        }}
      >
        {label}
      </Button>
    );
  };

  const onManage = (c: Campaign) => {
    router.replace(`/(volunteer)/campaigns/${c.id}/overview` as any);
  };

  const onRequestJoin = (c: Campaign) => {
    setSelectedCampaign(c);
    setShowJoinModal(true);
  };

  const handleVolunteerApplication = () => {
    // Placeholder submit; wire to API later
    const name = selectedCampaign?.name || "Campaign";

    setShowJoinModal(false);
    setSelectedCampaign(null);

    // Show success alert after modal closes
    setTimeout(() => {
      Alert.alert(
        "✅ Application Submitted!",
        `Your request to join "${name}" has been successfully sent to ${
          selectedCampaign?.agent || "the campaign agent"
        }. You'll be notified once it's reviewed.`,
        [{ text: "OK", style: "default" }]
      );
    }, 300);

    setVolunteerApplication({
      fullName: "Alice Johnson",
      age: "",
      email: "",
      phone: "+1234567893",
      skills: "",
      experience: "",
      preferredTasks: "",
      availability: "",
      motivation: "",
      emergencyContact: "",
      emergencyPhone: "",
    });
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section with gradient-like effect */}
          <View style={{ marginBottom: spacing.lg }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: spacing.sm,
              }}
            >
              <View>
                <Text style={[typography.h2, { marginBottom: 4 }]}>
                  Campaigns
                </Text>
                <Text style={{ color: colors.muted, fontSize: 14 }}>
                  Find and join relief campaigns
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: colors.blue + "20",
                  borderWidth: 1,
                  borderColor: colors.blue + "40",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: colors.blue,
                    fontWeight: "700",
                    fontSize: 13,
                  }}
                >
                  {badgeText}
                </Text>
              </View>
            </View>
          </View>

          {/* Filter Card with enhanced design */}
          <Card
            style={{
              borderRadius: 16,
              marginBottom: spacing.lg,
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <CardHeader style={{ paddingBottom: spacing.sm }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Ionicons name="filter-outline" size={18} color={colors.blue} />
                <Text style={[typography.h3]}>Filter Campaigns</Text>
              </View>
            </CardHeader>
            <CardContent>
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <FilterButton label={`All (${counts.all})`} value="all" />
                <FilterButton
                  label={`Available (${counts.available})`}
                  value="available"
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.sm,
                  marginTop: spacing.sm,
                }}
              >
                <FilterButton
                  label={`Active (${counts.active})`}
                  value="active"
                />
                <FilterButton
                  label={`Completed (${counts.completed})`}
                  value="completed"
                />
              </View>
            </CardContent>
          </Card>

          {/* Campaign list with enhanced cards */}
          <View style={{ gap: spacing.md }}>
            {filtered.map((c) => (
              <Card
                key={c.id}
                style={{
                  borderRadius: 16,
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <CardContent style={{ padding: spacing.lg }}>
                  {/* Title + status with better spacing */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: spacing.sm,
                    }}
                  >
                    <View style={{ flex: 1, marginRight: spacing.md }}>
                      <Text
                        style={{
                          fontWeight: "700",
                          fontSize: 18,
                          color: colors.cardForeground,
                          marginBottom: 4,
                        }}
                      >
                        {c.name}
                      </Text>
                      <Text
                        style={{
                          color: colors.muted,
                          fontSize: 13,
                          lineHeight: 18,
                        }}
                      >
                        {c.description}
                      </Text>
                    </View>
                    <StatusPill s={c.status} />
                  </View>

                  {/* Meta rows with icons and better spacing */}
                  <View
                    style={{
                      gap: 10,
                      marginTop: spacing.md,
                      marginBottom: spacing.md,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          backgroundColor: colors.blue + "20",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons
                          name="location"
                          size={16}
                          color={colors.blue}
                        />
                      </View>
                      <Text
                        style={{
                          color: colors.cardForeground,
                          fontSize: 14,
                          flex: 1,
                        }}
                      >
                        {c.location}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          backgroundColor: colors.orange + "20",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons
                          name="calendar"
                          size={16}
                          color={colors.orange}
                        />
                      </View>
                      <Text
                        style={{
                          color: colors.cardForeground,
                          fontSize: 14,
                          flex: 1,
                        }}
                      >
                        {c.startDate} - {c.endDate}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          backgroundColor: colors.green + "20",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons
                          name="person"
                          size={16}
                          color={colors.green}
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{ color: colors.cardForeground, fontSize: 14 }}
                        >
                          Agent: {c.agent}
                        </Text>
                        <View
                          style={{
                            backgroundColor: colors.mutedBackground,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 12,
                          }}
                        >
                          <Text
                            style={{
                              color: colors.cardForeground,
                              fontSize: 12,
                              fontWeight: "600",
                            }}
                          >
                            {c.volunteers}/{c.volunteersNeeded} volunteers
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Tasks + resources panel with better design */}
                  <View
                    style={{
                      backgroundColor: colors.mutedBackground,
                      borderRadius: 12,
                      padding: spacing.md,
                      marginBottom: spacing.md,
                      borderWidth: 1,
                      borderColor: colors.border + "40",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 8,
                      }}
                    >
                      <Ionicons
                        name="clipboard-outline"
                        size={14}
                        color={colors.muted}
                      />
                      <Text
                        style={{
                          color: colors.muted,
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        Tasks
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: colors.cardForeground,
                        fontSize: 13,
                        marginBottom: 10,
                      }}
                    >
                      {c.taskTypes}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: spacing.md,
                        flexWrap: "wrap",
                      }}
                    >
                      {!!c.resourceNeeds.food && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            backgroundColor: colors.card,
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 8,
                          }}
                        >
                          <Ionicons
                            name="restaurant"
                            size={14}
                            color={colors.orange}
                          />
                          <Text
                            style={{
                              color: colors.cardForeground,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            {c.resourceNeeds.food} food
                          </Text>
                        </View>
                      )}
                      {!!c.resourceNeeds.clothes && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            backgroundColor: colors.card,
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 8,
                          }}
                        >
                          <Ionicons
                            name="shirt"
                            size={14}
                            color={colors.blue}
                          />
                          <Text
                            style={{
                              color: colors.cardForeground,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            {c.resourceNeeds.clothes} clothes
                          </Text>
                        </View>
                      )}
                      {!!c.resourceNeeds.funds && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            backgroundColor: colors.card,
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 8,
                          }}
                        >
                          <Ionicons
                            name="cash"
                            size={14}
                            color={colors.green}
                          />
                          <Text
                            style={{
                              color: colors.cardForeground,
                              fontSize: 13,
                              fontWeight: "600",
                            }}
                          >
                            ${c.resourceNeeds.funds}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* CTA with enhanced buttons */}
                  {c.status === "Active" && (
                    <Button
                      onPress={() => onManage(c)}
                      style={{
                        width: "100%",
                        backgroundColor: colors.blue,
                        height: 48,
                        shadowColor: colors.blue,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Ionicons name="apps" size={18} color="#fff" />
                        <Text
                          style={{
                            color: "#fff",
                            fontWeight: "700",
                            fontSize: 15,
                          }}
                        >
                          Manage Campaign
                        </Text>
                      </View>
                    </Button>
                  )}
                  {c.status === "Available" && (
                    <Button
                      onPress={() => onRequestJoin(c)}
                      style={{
                        width: "100%",
                        backgroundColor: colors.orange,
                        height: 48,
                        shadowColor: colors.orange,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Ionicons name="person-add" size={18} color="#fff" />
                        <Text
                          style={{
                            color: "#fff",
                            fontWeight: "700",
                            fontSize: 15,
                          }}
                        >
                          Request to Join
                        </Text>
                      </View>
                    </Button>
                  )}
                  {c.status === "Completed" && (
                    <View
                      style={{
                        width: "100%",
                        height: 48,
                        backgroundColor: colors.green + "20",
                        borderRadius: 12,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: colors.green + "40",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color={colors.green}
                        />
                        <Text
                          style={{
                            color: colors.green,
                            fontWeight: "700",
                            fontSize: 15,
                          }}
                        >
                          Campaign Completed
                        </Text>
                      </View>
                    </View>
                  )}
                </CardContent>
              </Card>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Volunteer Application Modal */}
      <Modal
        visible={showJoinModal}
        onRequestClose={() => setShowJoinModal(false)}
        transparent
        animationType="slide"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1, justifyContent: "flex-end" }}
          >
            <View
              style={{
                backgroundColor: colors.card,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight: "90%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              {/* Enhanced Header */}
              <View
                style={{
                  padding: spacing.lg,
                  borderBottomWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.mutedBackground,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: colors.cardForeground,
                        marginBottom: 4,
                      }}
                    >
                      Join Campaign
                    </Text>
                    <Text
                      style={{
                        color: colors.muted,
                        fontSize: 14,
                      }}
                    >
                      {selectedCampaign?.name}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setShowJoinModal(false)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: colors.card,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <Ionicons name="close" size={20} color={colors.muted} />
                  </Pressable>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 4,
                  }}
                >
                  <Ionicons
                    name="person-outline"
                    size={14}
                    color={colors.muted}
                  />
                  <Text style={{ color: colors.muted, fontSize: 13 }}>
                    Agent: {selectedCampaign?.agent}
                  </Text>
                </View>
              </View>

              {/* Content */}
              <ScrollView
                contentContainerStyle={{
                  padding: spacing.lg,
                  gap: spacing.lg,
                }}
                showsVerticalScrollIndicator={false}
              >
                {/* Campaign Summary Card */}
                <View
                  style={{
                    backgroundColor: colors.blue + "15",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.blue + "30",
                    padding: spacing.md,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <Ionicons
                      name="information-circle"
                      size={18}
                      color={colors.blue}
                    />
                    <Text
                      style={{
                        fontWeight: "700",
                        color: colors.cardForeground,
                        fontSize: 14,
                      }}
                    >
                      Campaign Overview
                    </Text>
                  </View>
                  <View style={{ gap: 6 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Ionicons name="location" size={14} color={colors.blue} />
                      <Text
                        style={{ fontSize: 13, color: colors.cardForeground }}
                      >
                        {selectedCampaign?.location}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Ionicons name="calendar" size={14} color={colors.blue} />
                      <Text
                        style={{ fontSize: 13, color: colors.cardForeground }}
                      >
                        {selectedCampaign?.startDate} -{" "}
                        {selectedCampaign?.endDate}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Ionicons
                        name="clipboard"
                        size={14}
                        color={colors.blue}
                      />
                      <Text
                        style={{ fontSize: 13, color: colors.cardForeground }}
                      >
                        {selectedCampaign?.taskTypes}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Ionicons name="people" size={14} color={colors.blue} />
                      <Text
                        style={{ fontSize: 13, color: colors.cardForeground }}
                      >
                        {selectedCampaign?.volunteers}/
                        {selectedCampaign?.volunteersNeeded} volunteers
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Personal Information */}
                <View style={{ gap: spacing.sm }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons
                      name="person-circle-outline"
                      size={18}
                      color={colors.cardForeground}
                    />
                    <Text
                      style={{
                        fontWeight: "700",
                        color: colors.cardForeground,
                        fontSize: 15,
                      }}
                    >
                      Personal Information
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", gap: spacing.sm }}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: colors.muted,
                          fontSize: 12,
                          marginBottom: 6,
                          fontWeight: "600",
                        }}
                      >
                        Full Name *
                      </Text>
                      <TextInput
                        value={volunteerApplication.fullName}
                        onChangeText={(t) =>
                          setVolunteerApplication({
                            ...volunteerApplication,
                            fullName: t,
                          })
                        }
                        placeholder="Your full name"
                        placeholderTextColor={colors.muted}
                        style={{
                          height: 48,
                          borderWidth: 1.5,
                          borderColor: colors.border,
                          borderRadius: 12,
                          paddingHorizontal: spacing.md,
                          backgroundColor: colors.mutedBackground,
                          color: colors.cardForeground,
                          fontSize: 14,
                        }}
                      />
                    </View>
                    <View style={{ width: 100 }}>
                      <Text
                        style={{
                          color: colors.muted,
                          fontSize: 12,
                          marginBottom: 6,
                          fontWeight: "600",
                        }}
                      >
                        Age *
                      </Text>
                      <TextInput
                        value={volunteerApplication.age}
                        onChangeText={(t) =>
                          setVolunteerApplication({
                            ...volunteerApplication,
                            age: t,
                          })
                        }
                        placeholder="Age"
                        placeholderTextColor={colors.muted}
                        keyboardType="number-pad"
                        style={{
                          height: 48,
                          borderWidth: 1.5,
                          borderColor: colors.border,
                          borderRadius: 12,
                          paddingHorizontal: spacing.md,
                          backgroundColor: colors.mutedBackground,
                          color: colors.cardForeground,
                          fontSize: 14,
                        }}
                      />
                    </View>
                  </View>

                  <View>
                    <Text
                      style={{
                        color: colors.muted,
                        fontSize: 12,
                        marginBottom: 6,
                        fontWeight: "600",
                      }}
                    >
                      Email *
                    </Text>
                    <TextInput
                      value={volunteerApplication.email}
                      onChangeText={(t) =>
                        setVolunteerApplication({
                          ...volunteerApplication,
                          email: t,
                        })
                      }
                      placeholder="your.email@example.com"
                      placeholderTextColor={colors.muted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={{
                        height: 48,
                        borderWidth: 1.5,
                        borderColor: colors.border,
                        borderRadius: 12,
                        paddingHorizontal: spacing.md,
                        backgroundColor: colors.mutedBackground,
                        color: colors.cardForeground,
                        fontSize: 14,
                      }}
                    />
                  </View>

                  <View>
                    <Text
                      style={{
                        color: colors.muted,
                        fontSize: 12,
                        marginBottom: 6,
                        fontWeight: "600",
                      }}
                    >
                      Phone Number *
                    </Text>
                    <TextInput
                      value={volunteerApplication.phone}
                      onChangeText={(t) =>
                        setVolunteerApplication({
                          ...volunteerApplication,
                          phone: t,
                        })
                      }
                      placeholder="+1234567890"
                      placeholderTextColor={colors.muted}
                      keyboardType="phone-pad"
                      style={{
                        height: 48,
                        borderWidth: 1.5,
                        borderColor: colors.border,
                        borderRadius: 12,
                        paddingHorizontal: spacing.md,
                        backgroundColor: colors.mutedBackground,
                        color: colors.cardForeground,
                        fontSize: 14,
                      }}
                    />
                  </View>
                </View>

                {/* Skills & Experience */}
                <View style={{ gap: spacing.sm }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons
                      name="briefcase-outline"
                      size={18}
                      color={colors.cardForeground}
                    />
                    <Text
                      style={{
                        fontWeight: "700",
                        color: colors.cardForeground,
                        fontSize: 15,
                      }}
                    >
                      Skills & Experience
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: colors.muted,
                        fontSize: 12,
                        marginBottom: 6,
                        fontWeight: "600",
                      }}
                    >
                      Relevant Skills
                    </Text>
                    <TextInput
                      value={volunteerApplication.skills}
                      onChangeText={(t) =>
                        setVolunteerApplication({
                          ...volunteerApplication,
                          skills: t,
                        })
                      }
                      placeholder="e.g., First Aid, Driving, Languages, Organization..."
                      placeholderTextColor={colors.muted}
                      multiline
                      numberOfLines={3}
                      style={{
                        minHeight: 80,
                        borderWidth: 1.5,
                        borderColor: colors.border,
                        borderRadius: 12,
                        padding: spacing.md,
                        backgroundColor: colors.mutedBackground,
                        textAlignVertical: "top",
                        color: colors.cardForeground,
                        fontSize: 14,
                      }}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: colors.muted,
                        fontSize: 12,
                        marginBottom: 6,
                        fontWeight: "600",
                      }}
                    >
                      Previous Volunteer Experience
                    </Text>
                    <TextInput
                      value={volunteerApplication.experience}
                      onChangeText={(t) =>
                        setVolunteerApplication({
                          ...volunteerApplication,
                          experience: t,
                        })
                      }
                      placeholder="Describe any previous volunteer work..."
                      placeholderTextColor={colors.muted}
                      multiline
                      numberOfLines={3}
                      style={{
                        minHeight: 80,
                        borderWidth: 1.5,
                        borderColor: colors.border,
                        borderRadius: 12,
                        padding: spacing.md,
                        backgroundColor: colors.mutedBackground,
                        textAlignVertical: "top",
                        color: colors.cardForeground,
                        fontSize: 14,
                      }}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: colors.muted,
                        fontSize: 12,
                        marginBottom: 6,
                        fontWeight: "600",
                      }}
                    >
                      Preferred Tasks
                    </Text>
                    <TextInput
                      value={volunteerApplication.preferredTasks}
                      onChangeText={(t) =>
                        setVolunteerApplication({
                          ...volunteerApplication,
                          preferredTasks: t,
                        })
                      }
                      placeholder="Select preferred tasks"
                      placeholderTextColor={colors.muted}
                      style={{
                        height: 48,
                        borderWidth: 1.5,
                        borderColor: colors.border,
                        borderRadius: 12,
                        paddingHorizontal: spacing.md,
                        backgroundColor: colors.mutedBackground,
                        color: colors.cardForeground,
                        fontSize: 14,
                      }}
                    />
                  </View>
                </View>

                {/* Availability & Motivation */}
                <View style={{ gap: spacing.sm }}>
                  <View>
                    <Text
                      style={{
                        color: colors.muted,
                        fontSize: 12,
                        marginBottom: 6,
                        fontWeight: "600",
                      }}
                    >
                      Availability
                    </Text>
                    <TextInput
                      value={volunteerApplication.availability}
                      onChangeText={(t) =>
                        setVolunteerApplication({
                          ...volunteerApplication,
                          availability: t,
                        })
                      }
                      placeholder="e.g., Weekends, evenings, 10-15 hours/week"
                      placeholderTextColor={colors.muted}
                      style={{
                        height: 48,
                        borderWidth: 1.5,
                        borderColor: colors.border,
                        borderRadius: 12,
                        paddingHorizontal: spacing.md,
                        backgroundColor: colors.mutedBackground,
                        color: colors.cardForeground,
                        fontSize: 14,
                      }}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: colors.muted,
                        fontSize: 12,
                        marginBottom: 6,
                        fontWeight: "600",
                      }}
                    >
                      Why do you want to volunteer?
                    </Text>
                    <TextInput
                      value={volunteerApplication.motivation}
                      onChangeText={(t) =>
                        setVolunteerApplication({
                          ...volunteerApplication,
                          motivation: t,
                        })
                      }
                      placeholder="Tell us what motivates you to help..."
                      placeholderTextColor={colors.muted}
                      multiline
                      numberOfLines={3}
                      style={{
                        minHeight: 80,
                        borderWidth: 1.5,
                        borderColor: colors.border,
                        borderRadius: 12,
                        padding: spacing.md,
                        backgroundColor: colors.mutedBackground,
                        textAlignVertical: "top",
                        color: colors.cardForeground,
                        fontSize: 14,
                      }}
                    />
                  </View>
                </View>

                {/* Emergency Contact */}
                <View style={{ gap: spacing.sm }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons
                      name="medical-outline"
                      size={18}
                      color={colors.cardForeground}
                    />
                    <Text
                      style={{
                        fontWeight: "700",
                        color: colors.cardForeground,
                        fontSize: 15,
                      }}
                    >
                      Emergency Contact
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: colors.muted,
                        fontSize: 12,
                        marginBottom: 6,
                        fontWeight: "600",
                      }}
                    >
                      Emergency Contact Name
                    </Text>
                    <TextInput
                      value={volunteerApplication.emergencyContact}
                      onChangeText={(t) =>
                        setVolunteerApplication({
                          ...volunteerApplication,
                          emergencyContact: t,
                        })
                      }
                      placeholder="Contact person name"
                      placeholderTextColor={colors.muted}
                      style={{
                        height: 48,
                        borderWidth: 1.5,
                        borderColor: colors.border,
                        borderRadius: 12,
                        paddingHorizontal: spacing.md,
                        backgroundColor: colors.mutedBackground,
                        color: colors.cardForeground,
                        fontSize: 14,
                      }}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: colors.muted,
                        fontSize: 12,
                        marginBottom: 6,
                        fontWeight: "600",
                      }}
                    >
                      Emergency Contact Phone
                    </Text>
                    <TextInput
                      value={volunteerApplication.emergencyPhone}
                      onChangeText={(t) =>
                        setVolunteerApplication({
                          ...volunteerApplication,
                          emergencyPhone: t,
                        })
                      }
                      placeholder="Emergency contact number"
                      placeholderTextColor={colors.muted}
                      keyboardType="phone-pad"
                      style={{
                        height: 48,
                        borderWidth: 1.5,
                        borderColor: colors.border,
                        borderRadius: 12,
                        paddingHorizontal: spacing.md,
                        backgroundColor: colors.mutedBackground,
                        color: colors.cardForeground,
                        fontSize: 14,
                      }}
                    />
                  </View>
                </View>
              </ScrollView>

              {/* Enhanced Footer */}
              <View
                style={{
                  padding: spacing.lg,
                  borderTopWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.mutedBackground,
                  gap: spacing.sm,
                }}
              >
                <Button
                  onPress={handleVolunteerApplication}
                  style={{
                    height: 52,
                    backgroundColor: colors.blue,
                    shadowColor: colors.blue,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Ionicons name="paper-plane" size={18} color="#fff" />
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "700",
                        fontSize: 16,
                      }}
                    >
                      Submit Application
                    </Text>
                  </View>
                </Button>
                <Button
                  variant="outline"
                  onPress={() => setShowJoinModal(false)}
                  style={{
                    height: 48,
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                  }}
                  textStyle={{
                    color: colors.cardForeground,
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}
