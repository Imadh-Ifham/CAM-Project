import React from "react";
import { View, Text } from "react-native";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../src/components/ui/Card";
import { spacing } from "../../../../src/styles/spacing";
import { Ionicons } from "@expo/vector-icons";

export type Distribution = {
  id: string;
  resourceName: string;
  deliveryStatus: "delivered" | "in-transit" | "scheduled" | "delayed";
  destination: string;
  date: string;
  quantity: number;
};

function StatusBadge({ status }: { status: Distribution["deliveryStatus"] }) {
  const map: Record<
    Distribution["deliveryStatus"],
    { color: string; icon: keyof typeof Ionicons.glyphMap; label: string }
  > = {
    delivered: {
      color: "#22c55e",
      icon: "checkmark-circle",
      label: "Delivered",
    },
    "in-transit": { color: "#60a5fa", icon: "car", label: "In-Transit" },
    scheduled: { color: "#fbbf24", icon: "calendar", label: "Scheduled" },
    delayed: { color: "#ef4444", icon: "alert-circle", label: "Delayed" },
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
      }}
    >
      <Ionicons name={s.icon} size={12} color={s.color} />
      <Text style={{ color: s.color, fontSize: 12 }}>{s.label}</Text>
    </View>
  );
}

export default function DistributionsTab({ items }: { items: Distribution[] }) {
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
              backgroundColor: "#6d28d933",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="bus-outline" size={14} color="#c4b5fd" />
          </View>
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Distributions ({items.length})
          </Text>
        </View>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: spacing.lg }}>
            <Ionicons name="bus-outline" size={40} color="#6b7280" />
            <Text style={{ color: "#9ca3af", marginTop: spacing.sm }}>
              No distributions found
            </Text>
          </View>
        ) : (
          <View style={{ gap: spacing.md }}>
            {items.map((d) => (
              <View
                key={d.id}
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
                    {d.resourceName}
                  </Text>
                  <StatusBadge status={d.deliveryStatus} />
                </View>
                <View style={{ gap: 6 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Ionicons name="location" size={12} color="#9ca3af" />
                    <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                      {d.destination}
                    </Text>
                  </View>
                  <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                    Quantity:{" "}
                    <Text style={{ color: "#d1d5db" }}>
                      {d.quantity.toLocaleString()}
                    </Text>
                  </Text>
                  <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                    Date:{" "}
                    <Text style={{ color: "#d1d5db" }}>
                      {new Date(d.date).toLocaleDateString()}
                    </Text>
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </CardContent>
    </Card>
  );
}
