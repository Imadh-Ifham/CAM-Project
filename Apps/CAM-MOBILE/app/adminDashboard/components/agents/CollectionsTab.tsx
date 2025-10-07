import React from "react";
import { View, Text } from "react-native";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../src/components/ui/Card";
import { spacing } from "../../../../src/styles/spacing";
import { Ionicons } from "@expo/vector-icons";

export type Collection = {
  id: string;
  resourceName: string;
  quantity: number;
  date: string;
  volunteersAssigned: number;
  status: "completed" | "in-progress" | "pending";
};

function StatusBadge({ status }: { status: Collection["status"] }) {
  const map: Record<
    Collection["status"],
    {
      bg: string;
      color: string;
      icon: keyof typeof Ionicons.glyphMap;
      label: string;
    }
  > = {
    completed: {
      bg: "#065f4600",
      color: "#22c55e",
      icon: "checkmark-circle",
      label: "Completed",
    },
    "in-progress": {
      bg: "#1e3a8a00",
      color: "#60a5fa",
      icon: "time",
      label: "In-Progress",
    },
    pending: {
      bg: "#7c2d1200",
      color: "#fbbf24",
      icon: "calendar",
      label: "Pending",
    },
  };
  const s = map[status];
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        borderColor: s.color + "55",
        borderWidth: 1,
        backgroundColor: "transparent",
      }}
    >
      <Ionicons name={s.icon} size={12} color={s.color} />
      <Text style={{ color: s.color, fontSize: 12 }}>{s.label}</Text>
    </View>
  );
}

export default function CollectionsTab({ items }: { items: Collection[] }) {
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
              backgroundColor: "#1d4ed833",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="cube-outline" size={14} color="#93c5fd" />
          </View>
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Collections ({items.length})
          </Text>
        </View>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: spacing.lg }}>
            <Ionicons name="cube-outline" size={40} color="#6b7280" />
            <Text style={{ color: "#9ca3af", marginTop: spacing.sm }}>
              No collections found
            </Text>
          </View>
        ) : (
          <View style={{ gap: spacing.md }}>
            {items.map((c) => (
              <View
                key={c.id}
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
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    {c.resourceName}
                  </Text>
                  <StatusBadge status={c.status} />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                    Quantity:{" "}
                    <Text style={{ color: "#d1d5db" }}>
                      {c.quantity.toLocaleString()}
                    </Text>
                  </Text>
                  <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                    Volunteers:{" "}
                    <Text style={{ color: "#d1d5db" }}>
                      {c.volunteersAssigned}
                    </Text>
                  </Text>
                </View>
                <Text style={{ color: "#9ca3af", fontSize: 12, marginTop: 6 }}>
                  Date:{" "}
                  <Text style={{ color: "#d1d5db" }}>
                    {new Date(c.date).toLocaleDateString()}
                  </Text>
                </Text>
              </View>
            ))}
          </View>
        )}
      </CardContent>
    </Card>
  );
}
