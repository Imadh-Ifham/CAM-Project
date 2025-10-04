import React from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors } from "../../src/styles/colors";
import { spacing } from "../../src/styles/spacing";
import { typography } from "../../src/styles/typography";
import { Button } from "../../src/components/ui/Button";
import { Card, CardContent } from "../../src/components/ui/Card";

export default function OnStartScreen() {
  const router = useRouter();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={[{ marginLeft: spacing.md }, typography.h3]}>
          Welcome to CAM
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.section,
        }}
      >
        {/* Hero card */}
        <View
          style={{
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: spacing.xl,
          }}
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1701854300033-420c540869bc?auto=format&fit=crop&w=1200&q=60",
            }}
            style={{ width: "100%", height: 180 }}
            resizeMode="cover"
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,0.35)",
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: spacing.lg,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 24, fontWeight: "800" }}>
              CAM
            </Text>
            <Text style={{ color: "#fff", opacity: 0.9 }}>
              Community Aid Map
            </Text>
          </View>
        </View>

        {/* Intro */}
        <View style={{ alignItems: "center", marginBottom: spacing.lg }}>
          <Text
            style={[
              typography.h2,
              { textAlign: "center", marginBottom: spacing.sm },
            ]}
          >
            Making Aid Distribution Simple
          </Text>
          <Text style={{ textAlign: "center", color: colors.muted }}>
            Connect with your community through coordinated aid distribution.
            Join as an Agent to manage resources or as a Volunteer to help
            deliver aid to those in need.
          </Text>
        </View>

        {/* Features row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: spacing.xl,
          }}
        >
          {[
            { label: "Real-time Tracking" },
            { label: "Agent Network" },
            { label: "Volunteer Force" },
          ].map((f, i) => (
            <View key={i} style={{ alignItems: "center", flex: 1 }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: colors.accent,
                  marginBottom: spacing.sm,
                }}
              />
              <Text style={{ fontSize: 12 }}>{f.label}</Text>
            </View>
          ))}
        </View>

        {/* Choose role */}
        <Text
          style={[
            typography.h3,
            { textAlign: "center", marginBottom: spacing.md },
          ]}
        >
          Choose Your Role
        </Text>

        <Pressable onPress={() => router.push("agent/login" as any)}>
          <Card style={{ marginBottom: spacing.lg }}>
            <CardContent>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 56, color: "#16a34a" }}>✓</Text>
                <Text style={[typography.h2, { marginTop: spacing.sm }]}>
                  Agent Login
                </Text>
                <Text
                  style={{
                    color: colors.muted,
                    textAlign: "center",
                    marginTop: spacing.sm,
                  }}
                >
                  Manage resource collection and distribution campaigns
                </Text>
                <View
                  style={{
                    backgroundColor: "#ecfdf5",
                    padding: spacing.md,
                    borderRadius: 12,
                    marginTop: spacing.md,
                    alignSelf: "stretch",
                  }}
                >
                  <Text style={{ color: "#047857", fontSize: 12 }}>
                    • Create and manage campaigns{"\n"}• Collect community
                    resources{"\n"}• Coordinate with volunteers
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </Pressable>

        <Pressable onPress={() => router.push("volunteer/login" as any)}>
          <Card>
            <CardContent>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 56, color: "#f97316" }}>◎</Text>
                <Text style={[typography.h2, { marginTop: spacing.sm }]}>
                  Volunteer Login
                </Text>
                <Text
                  style={{
                    color: colors.muted,
                    textAlign: "center",
                    marginTop: spacing.sm,
                  }}
                >
                  Join campaigns and help deliver aid to communities
                </Text>
                <View
                  style={{
                    backgroundColor: "#fff7ed",
                    padding: spacing.md,
                    borderRadius: 12,
                    marginTop: spacing.md,
                    alignSelf: "stretch",
                  }}
                >
                  <Text style={{ color: "#c2410c", fontSize: 12 }}>
                    • Join active campaigns{"\n"}• Complete volunteer tasks
                    {"\n"}• Make a community impact
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </Pressable>

        <Pressable onPress={() => router.push("volunteer/login" as any)}>
          <Card>
            <CardContent>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 56, color: "#f97316" }}>◎</Text>
                <Text style={[typography.h2, { marginTop: spacing.sm }]}>
                  Volunteer Login
                </Text>
                <Text
                  style={{
                    color: colors.muted,
                    textAlign: "center",
                    marginTop: spacing.sm,
                  }}
                >
                  Join campaigns and help deliver aid to communities
                </Text>
                <View
                  style={{
                    backgroundColor: "#fff7ed",
                    padding: spacing.md,
                    borderRadius: 12,
                    marginTop: spacing.md,
                    alignSelf: "stretch",
                  }}
                >
                  <Text style={{ color: "#c2410c", fontSize: 12 }}>
                    • Join active campaigns{"\n"}• Complete volunteer tasks
                    {"\n"}• Make a community impact
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </Pressable>

        {/* Footer */}
        <View style={{ alignItems: "center", marginTop: spacing.xl }}>
          <Text style={{ color: colors.muted, fontSize: 12 }}>
            Together, we make communities stronger 💙
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
