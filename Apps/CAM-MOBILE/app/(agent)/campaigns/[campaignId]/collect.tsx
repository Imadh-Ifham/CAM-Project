import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
} from "react-native";
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

type CollectionStatus = "Collected" | "Processing" | "Verified" | "Confirmed";

export default function CampaignCollect() {
  // Form state
  const [resourceType, setResourceType] = useState<string | undefined>();
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [donor, setDonor] = useState("");
  const [notes, setNotes] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const resourceOptions = [
    { key: "food", label: "Food Packages" },
    { key: "clothes", label: "Clothing Items" },
    { key: "medical", label: "Medical Supplies" },
    { key: "funds", label: "Monetary Donations" },
    { key: "other", label: "Other Essentials" },
  ];

  const collections = useMemo(
    () => [
      {
        id: 1,
        resource: "Food Packages",
        quantity: 75,
        location: "Local Grocery Store",
        donor: "Fresh Market Inc.",
        status: "Collected" as CollectionStatus,
        collectionDate: "2024-01-18",
        collectedBy: "Agent John Doe",
        notes: "Fresh produce and canned goods mix",
      },
      {
        id: 2,
        resource: "Clothing Items",
        quantity: 45,
        location: "Community Center",
        donor: "Local Families",
        status: "Processing" as CollectionStatus,
        collectionDate: "2024-01-19",
        collectedBy: "Agent John Doe",
        notes: "Winter coats and warm clothing",
      },
      {
        id: 3,
        resource: "Medical Supplies",
        quantity: 30,
        location: "City Hospital",
        donor: "Metropolitan Health",
        status: "Verified" as CollectionStatus,
        collectionDate: "2024-01-17",
        collectedBy: "Agent John Doe",
        notes: "First aid kits and basic medications",
      },
      {
        id: 4,
        resource: "Monetary Donations",
        quantity: 2500,
        location: "Bank Transfer",
        donor: "Anonymous Donor",
        status: "Confirmed" as CollectionStatus,
        collectionDate: "2024-01-16",
        collectedBy: "Agent John Doe",
        notes: "Direct bank transfer for emergency funds",
      },
    ],
    []
  );

  const Badge = ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant?: "green" | "blue" | "yellow" | "purple" | "gray" | "outline";
  }) => {
    const styleMap = {
      green: { backgroundColor: colors.green, color: "#fff" },
      blue: { backgroundColor: "#3b82f6", color: "#fff" },
      yellow: { backgroundColor: "#f59e0b", color: "#fff" },
      purple: { backgroundColor: "#a855f7", color: "#fff" },
      gray: { backgroundColor: colors.mutedBackground, color: colors.muted },
      outline: {
        backgroundColor: "transparent",
        color: "#16a34a",
        borderColor: "#16a34a",
        borderWidth: 1,
      },
    } as const;
    const c = styleMap[variant || "gray"];
    return (
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
          backgroundColor: c.backgroundColor,
          borderColor: (c as any).borderColor,
          borderWidth: (c as any).borderWidth || 0,
        }}
      >
        <Text style={{ color: c.color, fontWeight: "700", fontSize: 12 }}>
          {children}
        </Text>
      </View>
    );
  };

  const StatusBadge = ({ status }: { status: CollectionStatus }) => {
    const map: Record<CollectionStatus, { bg: string; fg: string }> = {
      Collected: { bg: colors.mutedBackground, fg: colors.muted },
      Processing: { bg: "#e0e7ff", fg: "#4338ca" },
      Verified: { bg: "#e9d5ff", fg: "#6b21a8" },
      Confirmed: { bg: "#e2e8f0", fg: "#0f172a" },
    };
    const s = map[status];
    return (
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
          backgroundColor: s.bg,
        }}
      >
        <Text style={{ color: s.fg, fontWeight: "700", fontSize: 12 }}>
          {status}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xl,
          gap: spacing.lg,
        }}
      >
        {/* Title row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={[typography.h3]}>Collect Resources</Text>
          <Badge variant="outline">4 Collected</Badge>
        </View>

        {/* Add New Collection */}
        <Card>
          <CardHeader>
            <Text style={[typography.h3, { fontSize: 18 }]}>
              Add New Collection
            </Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>
              Record resources collected from the community
            </Text>
          </CardHeader>
          <CardContent style={{ gap: spacing.md }}>
            {/* Resource Type (select) */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Resource Type
              </Text>
              <Pressable
                onPress={() => setPickerOpen(true)}
                style={{
                  height: 44,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.mutedBackground,
                  paddingHorizontal: spacing.md,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: resourceType ? colors.cardForeground : colors.muted,
                  }}
                >
                  {resourceType || "Select resource type"}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={16}
                  color={colors.muted}
                />
              </Pressable>
            </View>

            {/* Quantity */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Quantity/Amount
              </Text>
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="Enter quantity"
                placeholderTextColor={colors.muted}
                style={{
                  height: 44,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.mutedBackground,
                  paddingHorizontal: spacing.md,
                  color: colors.cardForeground,
                }}
              />
            </View>

            {/* Location */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Collection Location
              </Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Where was this collected?"
                placeholderTextColor={colors.muted}
                style={{
                  height: 44,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.mutedBackground,
                  paddingHorizontal: spacing.md,
                  color: colors.cardForeground,
                }}
              />
            </View>

            {/* Donor */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Donor Information (Optional)
              </Text>
              <TextInput
                value={donor}
                onChangeText={setDonor}
                placeholder="Name or organization"
                placeholderTextColor={colors.muted}
                style={{
                  height: 44,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.mutedBackground,
                  paddingHorizontal: spacing.md,
                  color: colors.cardForeground,
                }}
              />
            </View>

            {/* Notes */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Additional Notes (Optional)
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Any additional details..."
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={4}
                style={{
                  minHeight: 88,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.mutedBackground,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.md,
                  textAlignVertical: "top",
                  color: colors.cardForeground,
                }}
              />
            </View>

            {/* Photo evidence */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Photo Evidence (Optional)
              </Text>
              <Button
                variant="outline"
                style={{ width: "100%" }}
                onPress={() => {}}
              >
                <Ionicons
                  name="camera-outline"
                  size={16}
                  color={colors.muted}
                />
                <Text style={{ color: colors.muted, marginLeft: 6 }}>
                  Take Photo
                </Text>
              </Button>
            </View>

            {/* Submit */}
            <Button onPress={() => {}} style={{ width: "100%" }}>
              <Ionicons name="add" size={16} color={colors.primaryForeground} />
              <Text
                style={{
                  color: colors.primaryForeground,
                  fontWeight: "700",
                  marginLeft: 6,
                }}
              >
                Submit Collection
              </Text>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Collections */}
        <Card>
          <CardHeader>
            <Text style={[typography.h3, { fontSize: 18 }]}>
              Recent Collections
            </Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>
              Track and manage collected resources
            </Text>
          </CardHeader>
          <CardContent style={{ gap: spacing.md }}>
            {collections.map((c) => (
              <View
                key={c.id}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  padding: spacing.md,
                  gap: spacing.sm,
                }}
              >
                {/* Header row */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: "700" }}>{c.resource}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>
                      Qty: {c.quantity}
                    </Text>
                  </View>
                  <StatusBadge status={c.status} />
                </View>

                {/* Details */}
                <View style={{ gap: 6 }}>
                  <Row icon="location-outline" text={c.location} />
                  <Row icon="person-outline" text={`Donor: ${c.donor}`} />
                  <Row
                    icon="calendar-outline"
                    text={`Collected: ${c.collectionDate}`}
                  />
                  <Row icon="people-outline" text={`By: ${c.collectedBy}`} />
                  {!!c.notes && (
                    <Row icon="clipboard-outline" text={c.notes} multiline />
                  )}
                </View>

                {/* Actions */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: spacing.sm,
                    marginTop: spacing.xs,
                  }}
                >
                  {c.status === "Processing" && (
                    <Button size="sm" style={{ flex: 1 }}>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={14}
                        color={colors.primaryForeground}
                      />
                      <Text
                        style={{
                          color: colors.primaryForeground,
                          fontWeight: "600",
                          marginLeft: 6,
                        }}
                      >
                        Verify
                      </Text>
                    </Button>
                  )}
                  {c.status === "Collected" && (
                    <Button size="sm" variant="outline" style={{ flex: 1 }}>
                      <Ionicons
                        name="cube-outline"
                        size={14}
                        color={colors.cardForeground}
                      />
                      <Text
                        style={{
                          color: colors.cardForeground,
                          fontWeight: "600",
                          marginLeft: 6,
                        }}
                      >
                        Process
                      </Text>
                    </Button>
                  )}
                  <Button size="sm" variant="outline" style={{ flex: 1 }}>
                    <Ionicons
                      name="camera-outline"
                      size={14}
                      color={colors.cardForeground}
                    />
                    <Text
                      style={{
                        color: colors.cardForeground,
                        fontWeight: "600",
                        marginLeft: 6,
                      }}
                    >
                      View Details
                    </Text>
                  </Button>
                </View>
              </View>
            ))}
          </CardContent>
        </Card>
      </ScrollView>

      {/* Resource type picker */}
      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(15,23,42,0.15)",
            padding: spacing.lg,
            justifyContent: "center",
          }}
          onPress={() => setPickerOpen(false)}
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing.md,
            }}
          >
            {resourceOptions.map((opt, idx) => (
              <Pressable
                key={opt.key}
                onPress={() => {
                  setResourceType(opt.label);
                  setPickerOpen(false);
                }}
                style={{
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.sm,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ flex: 1 }}>{opt.label}</Text>
                {resourceType === opt.label && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function Row({
  icon,
  text,
  multiline,
}: {
  icon: any;
  text: string;
  multiline?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: multiline ? "flex-start" : "center",
        gap: 8,
      }}
    >
      <Ionicons name={icon} size={14} color={colors.muted} />
      <Text style={{ color: colors.cardForeground, flex: 1 }}>{text}</Text>
    </View>
  );
}
