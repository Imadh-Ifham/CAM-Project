import React from "react";
import { View, Text } from "react-native";
import { Card, CardContent } from "../../../../src/components/ui/Card";

export default function StatsTab({
  totalCollections,
  totalDistributions,
  activeVolunteers,
  rating,
}: {
  totalCollections: number;
  totalDistributions: number;
  activeVolunteers: number;
  rating: number;
}) {
  const Item = ({
    iconBg,
    icon,
    value,
    label,
  }: {
    iconBg: string;
    icon: React.ReactNode;
    value: string | number;
    label: string;
  }) => (
    <Card
      style={{
        borderRadius: 16,
        backgroundColor: "#0f172a",
        borderColor: "#1f2937",
        borderWidth: 1,
      }}
    >
      <CardContent>
        <View style={{ alignItems: "center", paddingVertical: 12 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: iconBg,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            {icon}
          </View>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
            {value}
          </Text>
          <Text style={{ color: "#9ca3af", fontSize: 12 }}>{label}</Text>
        </View>
      </CardContent>
    </Card>
  );

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <Item
        iconBg="#10b98133"
        icon={<Text style={{ color: "#22c55e", fontWeight: "700" }}>🏅</Text>}
        value={totalCollections}
        label="Total Collections"
      />
      <Item
        iconBg="#60a5fa33"
        icon={<Text style={{ color: "#60a5fa", fontWeight: "700" }}>🚚</Text>}
        value={totalDistributions}
        label="Total Distributions"
      />
      <Item
        iconBg="#c084fc33"
        icon={<Text style={{ color: "#c084fc", fontWeight: "700" }}>👥</Text>}
        value={activeVolunteers}
        label="Active Volunteers"
      />
      <Item
        iconBg="#f59e0b33"
        icon={<Text style={{ color: "#f59e0b", fontWeight: "700" }}>⭐</Text>}
        value={rating}
        label="Performance Rating"
      />
    </View>
  );
}
