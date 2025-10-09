import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../src/components/ui/Card";
import { Button } from "../../../../src/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { spacing } from "../../../../src/styles/spacing";
import ApprovedAgentsNavbar, { ApprovedAgentTab } from "./ApprovedAgentsNavbar";
import CollectionsTab, { Collection } from "./CollectionsTab";
import DistributionsTab, { Distribution } from "./DistributionsTab";
import VolunteersTab, { Volunteer } from "./VolunteersTab";
import StatsTab from "./StatsTab";
import { useGetCoordinatorAssignmentQuery } from "@/src/store/services/campaignsApi";

export default function ApprovedAgent() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;
  const campaignId =
    (params.campaignId as string) || (params.id as string) || "";
  const agentId = (params.agentId as string) || "";
  const [tab, setTab] = useState<ApprovedAgentTab>("collections");
  const {
    data: assignment,
    isFetching,
    error,
  } = useGetCoordinatorAssignmentQuery(campaignId, {
    skip: !campaignId,
  });

  // Map assignment to the UI model
  const agent = useMemo(() => {
    const a: any = assignment || {};
    const collectionsCompleted = a?.stats?.collections?.completed || 0;
    const collectionsTarget = a?.stats?.collections?.target || 0;
    const distributionsCompleted = a?.stats?.distributions?.completed || 0;
    const distributionsTarget = a?.stats?.distributions?.target || 0;
    const volunteersArr: any[] = Array.isArray(a?.volunteers)
      ? a.volunteers
      : [];
    const volunteersMapped: Volunteer[] = volunteersArr.map(
      (v: any, idx: number) => ({
        id: idx + 1,
        name: v?.volunteerId || `Volunteer ${idx + 1}`,
        role: "Volunteer",
        status: v?.leftAt ? ("inactive" as const) : ("active" as const),
      })
    );

    return {
      id: Number(id) || 0,
      name: a?.coordinatorProfile?.fullName || agentId || "",
      email: a?.coordinatorProfile?.email || "",
      phone: a?.coordinatorProfile?.phoneNumber || "",
      campaignName: `${a?.campaign?.name || a?.campaignId || ""}${
        a?.campaign?.city ? ` - ${a.campaign.city}` : ""
      }${a?.campaign?.district ? `, ${a.campaign.district}` : ""}`,
      campaignType: a?.campaign?.type || "",
      role: "Both",
      joinDate: a?.startedAt || new Date().toISOString(),
      status: a?.status === "active" ? "active" : "inactive",
      performance: {
        collectionsCompleted,
        collectionsTarget,
        distributionsCompleted,
        distributionsTarget,
      },
      collections: [] as Collection[],
      distributions: [] as Distribution[],
      volunteers: volunteersMapped,
    };
  }, [assignment, id, agentId]);

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0f15" }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          gap: spacing.lg,
          paddingBottom: spacing.xl,
        }}
      >
        {/* Header with back and name */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
            marginTop: 30,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{ padding: 8, marginRight: 8 }}
          >
            <Ionicons name="chevron-back" size={20} color="#22c55e" />
          </Pressable>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
            {agent.name || "Coordinator"}
          </Text>
        </View>

        {/* Loading / Error states */}
        {isFetching ? (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <ActivityIndicator color="#22c55e" />
            <Text style={{ color: "#9ca3af", marginTop: 8 }}>
              Loading assignment...
            </Text>
          </View>
        ) : null}
        {error && !isFetching ? (
          <View
            style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: "#fee2e2",
              borderColor: "#ef4444",
              borderWidth: 1,
            }}
          >
            <Text style={{ color: "#991b1b", fontWeight: "700" }}>
              Failed to load coordinator details
            </Text>
          </View>
        ) : null}

        {/* Profile card */}
        <Card
          style={{
            borderRadius: 16,
            backgroundColor: "#0f172a",
            borderColor: "#1f2937",
            borderWidth: 1,
          }}
        >
          <CardHeader>
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              Agent Profile
            </Text>
          </CardHeader>
          <CardContent>
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "#1f2937",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="person" size={24} color="#9ca3af" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ color: "#fff", fontWeight: "700", marginBottom: 2 }}
                >
                  {agent.name}
                </Text>
                <View style={{ flexDirection: "row", gap: 8, marginBottom: 6 }}>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 999,
                      borderColor: "#6b728055",
                      borderWidth: 1,
                    }}
                  >
                    <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                      {agent.status}
                    </Text>
                  </View>
                </View>
                {agent.campaignName ? (
                  <Text style={{ color: "#9ca3af" }}>{agent.campaignName}</Text>
                ) : null}
                {agent.campaignType ? (
                  <Text style={{ color: "#6b7280", fontSize: 12 }}>
                    {agent.campaignType}
                  </Text>
                ) : null}
              </View>
            </View>

            <View style={{ marginTop: spacing.md, gap: 6 }}>
              {agent.email ? (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons name="mail-outline" size={14} color="#22c55e" />
                  <Text style={{ color: "#d1d5db" }}>{agent.email}</Text>
                </View>
              ) : null}
              {agent.phone ? (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons name="call-outline" size={14} color="#22c55e" />
                  <Text style={{ color: "#d1d5db" }}>{agent.phone}</Text>
                </View>
              ) : null}
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Ionicons name="calendar-outline" size={14} color="#22c55e" />
                <Text style={{ color: "#d1d5db" }}>
                  Joined: {new Date(agent.joinDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card
          style={{
            borderRadius: 16,
            backgroundColor: "#0f172a",
            borderColor: "#1f2937",
            borderWidth: 1,
          }}
        >
          <CardHeader>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons name="trending-up" size={16} color="#22c55e" />
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Performance Overview
              </Text>
            </View>
          </CardHeader>
          <CardContent>
            <View style={{ marginBottom: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "#d1d5db", fontSize: 12 }}>
                  Collections Progress
                </Text>
                <Text style={{ color: "#22c55e", fontSize: 12 }}>
                  {Math.round(
                    (agent.performance.collectionsCompleted /
                      Math.max(1, agent.performance.collectionsTarget)) *
                      100
                  )}
                  %
                </Text>
              </View>
              <View
                style={{
                  height: 8,
                  backgroundColor: "#1f2937",
                  borderRadius: 999,
                  marginTop: 6,
                }}
              >
                <View
                  style={{
                    height: 8,
                    width: `${
                      (agent.performance.collectionsCompleted /
                        Math.max(1, agent.performance.collectionsTarget)) *
                      100
                    }%`,
                    backgroundColor: "#10b981",
                    borderRadius: 999,
                  }}
                />
              </View>
              <Text style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}>
                {agent.performance.collectionsCompleted} of{" "}
                {agent.performance.collectionsTarget} completed
              </Text>
            </View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "#d1d5db", fontSize: 12 }}>
                  Distributions Progress
                </Text>
                <Text style={{ color: "#22c55e", fontSize: 12 }}>
                  {Math.round(
                    (agent.performance.distributionsCompleted /
                      Math.max(1, agent.performance.distributionsTarget)) *
                      100
                  )}
                  %
                </Text>
              </View>
              <View
                style={{
                  height: 8,
                  backgroundColor: "#1f2937",
                  borderRadius: 999,
                  marginTop: 6,
                }}
              >
                <View
                  style={{
                    height: 8,
                    width: `${
                      (agent.performance.distributionsCompleted /
                        Math.max(1, agent.performance.distributionsTarget)) *
                      100
                    }%`,
                    backgroundColor: "#10b981",
                    borderRadius: 999,
                  }}
                />
              </View>
              <Text style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}>
                {agent.performance.distributionsCompleted} of{" "}
                {agent.performance.distributionsTarget} completed
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Tabs navbar */}
        <ApprovedAgentsNavbar selected={tab} onChange={setTab} />

        {/* Tab content */}
        {tab === "collections" && <CollectionsTab items={agent.collections} />}
        {tab === "distributions" && (
          <DistributionsTab items={agent.distributions} />
        )}
        {tab === "volunteers" && <VolunteersTab items={agent.volunteers} />}
        {tab === "stats" && (
          <StatsTab
            totalCollections={agent.collections.length}
            totalDistributions={agent.distributions.length}
            activeVolunteers={
              agent.volunteers.filter((v) => v.status === "active").length
            }
            rating={4.8}
          />
        )}

        {/* Actions */}
        <View
          style={{ gap: 12, marginTop: spacing.md, marginBottom: spacing.lg }}
        >
          <Button
            onPress={() => {}}
            style={{ backgroundColor: "#2563eb", borderRadius: 12, height: 52 }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={18}
                color="#fff"
              />
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Contact Agent
              </Text>
            </View>
          </Button>
          <Button
            variant="outline"
            onPress={() => {}}
            style={{
              backgroundColor: "#ef4444",
              borderColor: "#ef4444",
              borderRadius: 12,
              height: 52,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Ionicons name="person-remove" size={18} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Remove Agent
              </Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
