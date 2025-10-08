import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
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

export default function ApprovedAgent() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;
  const [tab, setTab] = useState<ApprovedAgentTab>("collections");

  // Mock agent data (could be fetched by id in the future)
  const agent = useMemo(
    () => ({
      id: Number(id) || 101,
      name: "John Williams",
      email: "john.williams@email.com",
      phone: "+94 77 456 7890",
      campaignName: "Flood Relief - Colombo",
      campaignType: "Disaster Relief",
      role: "Both",
      joinDate: "2024-01-01",
      status: "active",
      performance: {
        collectionsCompleted: 8,
        collectionsTarget: 10,
        distributionsCompleted: 12,
        distributionsTarget: 15,
      },
      collections: [
        {
          id: "c1",
          resourceName: "Rice Packets",
          quantity: 500,
          date: "2024-01-15",
          volunteersAssigned: 12,
          status: "completed" as const,
        },
        {
          id: "c2",
          resourceName: "Water Bottles",
          quantity: 1000,
          date: "2024-01-18",
          volunteersAssigned: 8,
          status: "in-progress" as const,
        },
      ] as Collection[],
      distributions: [
        {
          id: "d1",
          resourceName: "Food Packages",
          deliveryStatus: "delivered" as const,
          destination: "Colombo District",
          date: "2024-01-16",
          quantity: 300,
        },
        {
          id: "d2",
          resourceName: "Medical Supplies",
          deliveryStatus: "in-transit" as const,
          destination: "Western Province",
          date: "2024-01-19",
          quantity: 150,
        },
      ] as Distribution[],
      volunteers: [
        {
          id: 1,
          name: "Alice Johnson",
          role: "Field Worker",
          status: "active" as const,
        },
        {
          id: 2,
          name: "Bob Smith",
          role: "Logistics",
          status: "active" as const,
        },
        {
          id: 3,
          name: "Carol Brown",
          role: "Coordinator",
          status: "inactive" as const,
        },
        {
          id: 4,
          name: "David Wilson",
          role: "Driver",
          status: "active" as const,
        },
      ] as Volunteer[],
    }),
    [id]
  );

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
            {agent.name}
          </Text>
        </View>

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
                <Text style={{ color: "#9ca3af" }}>{agent.campaignName}</Text>
                <Text style={{ color: "#6b7280", fontSize: 12 }}>
                  {agent.campaignType}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: spacing.md, gap: 6 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Ionicons name="mail-outline" size={14} color="#22c55e" />
                <Text style={{ color: "#d1d5db" }}>{agent.email}</Text>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Ionicons name="call-outline" size={14} color="#22c55e" />
                <Text style={{ color: "#d1d5db" }}>{agent.phone}</Text>
              </View>
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
