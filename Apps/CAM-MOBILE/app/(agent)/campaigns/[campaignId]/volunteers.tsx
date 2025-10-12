import React, { useMemo } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { colors } from "../../../../src/styles/colors";
import { spacing } from "../../../../src/styles/spacing";
import { typography } from "../../../../src/styles/typography";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../src/components/ui/Card";
import { Button } from "../../../../src/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";

export default function CampaignVolunteers() {
  const volunteerRequests = useMemo(
    () => [
      {
        id: 4,
        name: "David Rodriguez",
        email: "david.rodriguez@email.com",
        phone: "+1234567896",
        age: 28,
        skills:
          "First Aid, Driving, Spanish/English bilingual, Event coordination",
        experience:
          "Volunteered with Red Cross for 2 years, helped in local food banks, organized community events",
        availability: "Weekends and weekday evenings, 15-20 hours per week",
        preferredTasks: "Delivery & Distribution",
        motivation:
          "I want to give back to my community and help families in need during difficult times.",
        emergencyContact: "Maria Rodriguez",
        emergencyPhone: "+1234567897",
        applicationDate: "2024-01-19",
        status: "Pending",
      },
      {
        id: 5,
        name: "Sarah Kim",
        email: "sarah.kim@email.com",
        phone: "+1234567898",
        age: 24,
        skills: "Organization, Social media, Photography, Customer service",
        experience:
          "New to volunteering but eager to help. Worked in retail for 3 years, good with people.",
        availability: "Flexible schedule, can work 10-15 hours per week",
        preferredTasks: "Packaging & Sorting",
        motivation:
          "I want to make a positive impact and learn more about community service.",
        emergencyContact: "John Kim",
        emergencyPhone: "+1234567899",
        applicationDate: "2024-01-20",
        status: "Pending",
      },
      {
        id: 6,
        name: "Michael Thompson",
        email: "mike.thompson@email.com",
        phone: "+1234567800",
        age: 35,
        skills: "Project management, Logistics, Heavy lifting, Truck driving",
        experience:
          "Former military logistics officer, managed supply chains, experienced with large-scale operations",
        availability: "Available full-time for the next 2 months",
        preferredTasks: "Logistics & Planning",
        motivation:
          "Using my military experience to help coordinate relief efforts efficiently.",
        emergencyContact: "Jennifer Thompson",
        emergencyPhone: "+1234567801",
        applicationDate: "2024-01-18",
        status: "Pending",
      },
    ],
    []
  );

  const approvedVolunteers = useMemo(
    () => [
      {
        id: 1,
        name: "Alice Johnson",
        phone: "+1234567893",
        status: "Active",
        joinDate: "2024-01-10",
        tasksCompleted: 8,
        skills: "First Aid, Organization, Community outreach",
        performance: 95,
      },
      {
        id: 2,
        name: "Bob Wilson",
        phone: "+1234567894",
        status: "Active",
        joinDate: "2024-01-15",
        tasksCompleted: 5,
        skills: "Driving, Heavy lifting, Logistics",
        performance: 88,
      },
      {
        id: 3,
        name: "Carol Davis",
        phone: "+1234567895",
        status: "Active",
        joinDate: "2024-01-12",
        tasksCompleted: 12,
        skills: "Medical background, Leadership, Training",
        performance: 98,
      },
    ],
    []
  );

  const PendingBadge = () => (
    <View
      style={{
        backgroundColor: "#f59e0b",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>
        Pending
      </Text>
    </View>
  );

  const OutlineBadge = ({
    children,
    color,
  }: {
    children: React.ReactNode;
    color: string;
  }) => (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: color,
      }}
    >
      <Text style={{ color, fontWeight: "700", fontSize: 12 }}>{children}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xl,
          gap: spacing.lg,
        }}
      >
        {/* Title */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={[typography.h3]}>Volunteer Management</Text>
          <OutlineBadge color="#eab308">
            {volunteerRequests.length} Pending
          </OutlineBadge>
        </View>

        {/* Volunteer Requests */}
        {volunteerRequests.length > 0 && (
          <Card style={{ borderRadius: 16 }}>
            <CardHeader>
              <Text style={[typography.h3, { fontSize: 18 }]}>
                Volunteer Requests
              </Text>
              <Text style={{ color: colors.muted, marginTop: 4 }}>
                Review and approve volunteer applications
              </Text>
            </CardHeader>
            <CardContent style={{ gap: spacing.md }}>
              {volunteerRequests.map((r) => (
                <View
                  key={r.id}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 16,
                    padding: spacing.lg,
                    gap: spacing.md,
                  }}
                >
                  {/* Header */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.md,
                      }}
                    >
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor: "#f59e0b",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons
                          name="person-outline"
                          size={20}
                          color="#fff"
                        />
                      </View>
                      <View>
                        <Text
                          style={{
                            fontWeight: "700",
                            color: colors.cardForeground,
                          }}
                        >
                          {r.name}
                        </Text>
                        <Text style={{ color: colors.muted, fontSize: 12 }}>
                          Age: {r.age}
                        </Text>
                        <Text style={{ color: colors.muted, fontSize: 12 }}>
                          Applied: {r.applicationDate}
                        </Text>
                      </View>
                    </View>
                    <PendingBadge />
                  </View>

                  {/* Contact (stacked to avoid overflow) */}
                  <View
                    style={{
                      flexDirection: "column",
                      gap: spacing.xs,
                      alignItems: "flex-start",
                    }}
                  >
                    <Info icon="mail-outline" text={r.email} />
                    <Info icon="call-outline" text={r.phone} />
                  </View>

                  {/* Details grid */}
                  <View style={{ gap: spacing.md }}>
                    <Field label="Skills" value={r.skills} />
                    <Field label="Experience" value={r.experience} />
                    <View style={{ flexDirection: "row", gap: spacing.lg }}>
                      <Field
                        label="Availability"
                        value={r.availability}
                        style={{ flex: 1 }}
                      />
                      <Field
                        label="Preferred Tasks"
                        value={r.preferredTasks}
                        style={{ flex: 1 }}
                      />
                    </View>
                    <Field label="Motivation" value={r.motivation} />
                    <View
                      style={{
                        backgroundColor: colors.mutedBackground,
                        borderRadius: 12,
                        padding: spacing.md,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.muted,
                          fontWeight: "600",
                          marginBottom: 4,
                        }}
                      >
                        Emergency Contact:
                      </Text>
                      <Text style={{ color: colors.cardForeground }}>
                        {r.emergencyContact} - {r.emergencyPhone}
                      </Text>
                    </View>
                  </View>

                  {/* Actions */}
                  <View style={{ flexDirection: "row", gap: spacing.sm }}>
                    <Button
                      size="sm"
                      style={{ flex: 1, backgroundColor: colors.green }}
                    >
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={14}
                        color="#fff"
                      />
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "700",
                          marginLeft: 6,
                        }}
                      >
                        Approve
                      </Text>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      style={{ flex: 1, borderColor: "#fecaca" }}
                    >
                      <Ionicons
                        name="alert-circle-outline"
                        size={14}
                        color="#ef4444"
                      />
                      <Text
                        style={{
                          color: "#ef4444",
                          fontWeight: "700",
                          marginLeft: 6,
                        }}
                      >
                        Reject
                      </Text>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={14}
                        color={colors.cardForeground}
                      />
                    </Button>
                  </View>
                </View>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Active Volunteers */}
        <Card>
          <CardHeader>
            <Text style={[typography.h3, { fontSize: 18 }]}>
              Active Volunteers
            </Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>
              Manage your volunteer team
            </Text>
          </CardHeader>
          <CardContent style={{ gap: spacing.md }}>
            {approvedVolunteers.map((v) => (
              <View
                key={v.id}
                style={{
                  padding: spacing.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: spacing.md,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.md,
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: colors.green,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="person-outline" size={18} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "700",
                          color: colors.cardForeground,
                        }}
                        numberOfLines={1}
                      >
                        {v.name}
                      </Text>
                    </View>
                    <Text
                      style={{ color: colors.muted, fontSize: 12 }}
                      numberOfLines={1}
                    >
                      {v.skills}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: spacing.lg,
                        marginTop: 4,
                      }}
                    >
                      <Text style={{ color: colors.muted, fontSize: 12 }}>
                        {v.tasksCompleted} tasks
                      </Text>
                      <Text style={{ color: colors.muted, fontSize: 12 }}>
                        {v.performance}% rating
                      </Text>
                      <Text style={{ color: colors.muted, fontSize: 12 }}>
                        Since {v.joinDate}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.sm,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: colors.green,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 999,
                    }}
                  >
                    <Text
                      style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}
                    >
                      Active
                    </Text>
                  </View>
                  <Button size="sm" variant="outline">
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={14}
                      color={colors.cardForeground}
                    />
                  </Button>
                </View>
              </View>
            ))}
          </CardContent>
        </Card>

        {/* Team Statistics */}
        <Card>
          <CardHeader>
            <Text style={[typography.h3, { fontSize: 18 }]}>
              Team Statistics
            </Text>
          </CardHeader>
          <CardContent>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: spacing.sm,
              }}
            >
              <Stat
                color={colors.green}
                value={approvedVolunteers.length.toString()}
                label="Active Volunteers"
              />
              <Stat
                color={colors.blue}
                value={approvedVolunteers
                  .reduce((s, v) => s + v.tasksCompleted, 0)
                  .toString()}
                label="Total Tasks"
              />
              <Stat
                color="#a855f7"
                value={(
                  Math.round(
                    approvedVolunteers.reduce((s, v) => s + v.performance, 0) /
                      approvedVolunteers.length
                  ) + "%"
                ).toString()}
                label="Avg. Performance"
              />
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}

function Info({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Ionicons name={icon} size={14} color={colors.muted} />
      <Text style={{ color: colors.cardForeground }}>{text}</Text>
    </View>
  );
}

function Field({
  label,
  value,
  style,
}: {
  label: string;
  value: string;
  style?: any;
}) {
  return (
    <View style={style}>
      <Text style={{ color: colors.muted, fontWeight: "700", marginBottom: 4 }}>
        {label}:
      </Text>
      <Text style={{ color: colors.cardForeground }}>{value}</Text>
    </View>
  );
}

function Stat({
  color,
  value,
  label,
}: {
  color: string;
  value: string;
  label: string;
}) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Text style={{ color, fontWeight: "800", fontSize: 22 }}>{value}</Text>
      <Text style={{ color: colors.muted, fontSize: 12 }}>{label}</Text>
    </View>
  );
}
