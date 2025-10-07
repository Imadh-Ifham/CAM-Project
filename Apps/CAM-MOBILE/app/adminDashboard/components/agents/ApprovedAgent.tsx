import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../src/components/ui/Card";
import { Button } from "../../../../src/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { spacing } from "../../../../src/styles/spacing";

export default function ApprovedAgent() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0f15" }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          gap: spacing.lg,
          paddingBottom: spacing.xl,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
            Agent Details
          </Text>
          <Button variant="outline" onPress={() => router.back()}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Ionicons name="arrow-back" size={16} color="#d1d5db" />
              <Text style={{ color: "#d1d5db", fontWeight: "700" }}>Back</Text>
            </View>
          </Button>
        </View>

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
              Agent #{id ?? "-"}
            </Text>
          </CardHeader>
          <CardContent>
            <Text style={{ color: "#9ca3af" }}>
              This is a placeholder detail screen. Wire it to your backend to
              show the agent profile, assignments, and performance.
            </Text>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}
