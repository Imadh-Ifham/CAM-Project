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

type DistStatus = "Delivered" | "In Transit" | "Scheduled";

export default function CampaignDistribution() {
  // Form state
  const [resource, setResource] = useState<string | undefined>();
  const [quantity, setQuantity] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState<
    string | undefined
  >();
  const [recipient, setRecipient] = useState("");
  const [assignee, setAssignee] = useState<string | undefined>();
  const [instructions, setInstructions] = useState("");

  // pickers
  const [resourcePicker, setResourcePicker] = useState(false);
  const [locationPicker, setLocationPicker] = useState(false);
  const [volPicker, setVolPicker] = useState(false);

  const resourceOptions = [
    { key: "food", label: "Food Packages" },
    { key: "clothes", label: "Clothing Items" },
    { key: "medical", label: "Medical Supplies" },
    { key: "blankets", label: "Blankets" },
    { key: "other", label: "Other Supplies" },
  ];

  const campaign = useMemo(
    () => ({
      locations: [
        "Downtown Community Center",
        "East Side School",
        "West Park Shelter",
        "North District Hospital",
      ],
    }),
    []
  );

  const volunteers = useMemo(
    () => [
      { id: 1, name: "Alice Johnson" },
      { id: 2, name: "Bob Wilson" },
      { id: 3, name: "Carol Davis" },
    ],
    []
  );

  const distributions = useMemo(
    () => [
      {
        id: 1,
        resource: "Food Packages",
        quantity: 45,
        location: "East Side School",
        recipient: "School Administration",
        status: "Delivered" as DistStatus,
        deliveryDate: "2024-01-18",
        volunteer: "Alice Johnson",
      },
      {
        id: 2,
        resource: "Blankets",
        quantity: 30,
        location: "West Park Shelter",
        recipient: "Shelter Manager",
        status: "In Transit" as DistStatus,
        deliveryDate: "2024-01-20",
        volunteer: "Bob Wilson",
      },
      {
        id: 3,
        resource: "Medical Supplies",
        quantity: 15,
        location: "North District Hospital",
        recipient: "Emergency Dept.",
        status: "Scheduled" as DistStatus,
        deliveryDate: "2024-01-22",
        volunteer: "Carol Davis",
      },
    ],
    []
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

  const StatusBadge = ({ status }: { status: DistStatus }) => {
    const map: Record<DistStatus, { bg: string; fg: string }> = {
      Delivered: { bg: colors.green, fg: "#fff" },
      "In Transit": { bg: colors.blue, fg: "#fff" },
      Scheduled: { bg: "#f59e0b", fg: "#fff" },
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
          <Text style={[typography.h3]}>Distribution Management</Text>
          <OutlineBadge color={colors.blue}>3 Active</OutlineBadge>
        </View>

        {/* Schedule New Distribution */}
        <Card>
          <CardHeader>
            <Text style={[typography.h3, { fontSize: 18 }]}>
              Schedule New Distribution
            </Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>
              Plan and schedule resource distribution
            </Text>
          </CardHeader>
          <CardContent style={{ gap: spacing.md }}>
            {/* Resource to Distribute */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Resource to Distribute
              </Text>
              <Pressable
                onPress={() => setResourcePicker(true)}
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
                    color: resource ? colors.cardForeground : colors.muted,
                  }}
                >
                  {resource || "Select resource"}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={16}
                  color={colors.muted}
                />
              </Pressable>
            </View>

            {/* Quantity & Date */}
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                  Quantity
                </Text>
                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  placeholder="Amount"
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
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                  Delivery Date
                </Text>
                <TextInput
                  value={deliveryDate}
                  onChangeText={setDeliveryDate}
                  placeholder="mm/dd/yyyy"
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
            </View>

            {/* Delivery Location */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Delivery Location
              </Text>
              <Pressable
                onPress={() => setLocationPicker(true)}
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
                    color: deliveryLocation
                      ? colors.cardForeground
                      : colors.muted,
                  }}
                >
                  {deliveryLocation || "Select location"}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={16}
                  color={colors.muted}
                />
              </Pressable>
            </View>

            {/* Recipient */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Recipient Contact
              </Text>
              <TextInput
                value={recipient}
                onChangeText={setRecipient}
                placeholder="Contact person or organization"
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

            {/* Assign Volunteer */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Assign Volunteer
              </Text>
              <Pressable
                onPress={() => setVolPicker(true)}
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
                    color: assignee ? colors.cardForeground : colors.muted,
                  }}
                >
                  {assignee || "Select volunteer"}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={16}
                  color={colors.muted}
                />
              </Pressable>
            </View>

            {/* Instructions */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Delivery Instructions
              </Text>
              <TextInput
                value={instructions}
                onChangeText={setInstructions}
                placeholder="Special instructions for delivery..."
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={3}
                style={{
                  minHeight: 72,
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

            <Button style={{ width: "100%" }}>
              <Ionicons
                name="bus-outline"
                size={16}
                color={colors.primaryForeground}
              />
              <Text
                style={{
                  color: colors.primaryForeground,
                  fontWeight: "700",
                  marginLeft: 6,
                }}
              >
                Schedule Distribution
              </Text>
            </Button>
          </CardContent>
        </Card>

        {/* Active Distributions */}
        <Card>
          <CardHeader>
            <Text style={[typography.h3, { fontSize: 18 }]}>
              Active Distributions
            </Text>
          </CardHeader>
          <CardContent style={{ gap: spacing.md }}>
            {distributions.map((d) => (
              <View
                key={d.id}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  padding: spacing.md,
                  gap: spacing.sm,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: "700" }}>{d.resource}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>
                      Qty: {d.quantity}
                    </Text>
                  </View>
                  <StatusBadge status={d.status} />
                </View>
                <View style={{ gap: 6 }}>
                  <Row icon="location-outline" text={d.location} />
                  <Row
                    icon="person-outline"
                    text={`Recipient: ${d.recipient}`}
                  />
                  <Row
                    icon="calendar-outline"
                    text={`Due: ${d.deliveryDate}`}
                  />
                  <Row
                    icon="people-outline"
                    text={`Assigned: ${d.volunteer}`}
                  />
                </View>
                {d.status === "Scheduled" && (
                  <Button
                    size="sm"
                    style={{ width: "100%", marginTop: spacing.xs }}
                  >
                    <Text
                      style={{
                        color: colors.primaryForeground,
                        fontWeight: "700",
                      }}
                    >
                      Start Delivery
                    </Text>
                  </Button>
                )}
                {d.status === "In Transit" && (
                  <Button
                    size="sm"
                    variant="outline"
                    style={{ width: "100%", marginTop: spacing.xs }}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={14}
                      color={colors.cardForeground}
                    />
                    <Text
                      style={{
                        color: colors.cardForeground,
                        fontWeight: "700",
                        marginLeft: 6,
                      }}
                    >
                      Mark Delivered
                    </Text>
                  </Button>
                )}
              </View>
            ))}
          </CardContent>
        </Card>
      </ScrollView>

      {/* Resource picker */}
      <PickerModal
        visible={resourcePicker}
        title="Select resource"
        options={resourceOptions.map((o) => o.label)}
        selected={resource}
        onSelect={(v) => {
          setResource(v);
          setResourcePicker(false);
        }}
        onClose={() => setResourcePicker(false)}
      />
      {/* Location picker */}
      <PickerModal
        visible={locationPicker}
        title="Select location"
        options={campaign.locations}
        selected={deliveryLocation}
        onSelect={(v) => {
          setDeliveryLocation(v);
          setLocationPicker(false);
        }}
        onClose={() => setLocationPicker(false)}
      />
      {/* Volunteer picker */}
      <PickerModal
        visible={volPicker}
        title="Select volunteer"
        options={volunteers.map((v) => v.name)}
        selected={assignee}
        onSelect={(v) => {
          setAssignee(v);
          setVolPicker(false);
        }}
        onClose={() => setVolPicker(false)}
      />
    </View>
  );
}

function Row({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Ionicons name={icon} size={14} color={colors.muted} />
      <Text style={{ color: colors.cardForeground, flex: 1 }}>{text}</Text>
    </View>
  );
}

function PickerModal({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(15,23,42,0.15)",
          padding: spacing.lg,
          justifyContent: "center",
        }}
        onPress={onClose}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              padding: spacing.lg,
              borderBottomWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={[typography.h3, { fontSize: 16 }]}>{title}</Text>
          </View>
          <View style={{ paddingHorizontal: spacing.lg }}>
            {options.map((opt) => (
              <Pressable
                key={opt}
                onPress={() => onSelect(opt)}
                style={{
                  paddingVertical: spacing.md,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ flex: 1 }}>{opt}</Text>
                {selected === opt && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
