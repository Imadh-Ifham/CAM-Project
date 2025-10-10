import React from "react";
import { View, Text } from "react-native";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../src/components/ui/Card";
import { spacing } from "../../../../src/styles/spacing";
import { Ionicons } from "@expo/vector-icons";

export type Volunteer = {
  id: number;
  name: string;
  role: string;
  status: "active" | "inactive";
};

export default function VolunteersTab({ items }: { items: Volunteer[] }) {
  return (
    <Card
      style={{
        borderRadius: 16,
        backgroundColor: "#0f172a",
        borderColor: "#1f2937",
        borderWidth: 1,
      }}
    >
      <CardHeader>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "#7c3aed33",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="people" size={14} color="#c084fc" />
          </View>
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Team Volunteers ({items.length})
          </Text>
        </View>
      </CardHeader>
      <CardContent>
        <View style={{ gap: spacing.md }}>
          {items.map((v) => (
            <View
              key={v.id}
              style={{
                backgroundColor: "#111827",
                borderColor: "#374151",
                borderWidth: 1,
                borderRadius: 12,
                padding: spacing.md,
              }}
            >
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
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "#1f2937",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="person" size={18} color="#9ca3af" />
                  </View>
                  <View>
                    <Text style={{ color: "#fff", fontWeight: "700" }}>
                      {v.name}
                    </Text>
                    <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                      {v.role}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 999,
                    borderColor:
                      v.status === "active" ? "#22c55e55" : "#6b728055",
                    borderWidth: 1,
                  }}
                >
                  <Text
                    style={{
                      color: v.status === "active" ? "#22c55e" : "#9ca3af",
                      fontSize: 12,
                    }}
                  >
                    {v.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </CardContent>
    </Card>
  );
}
