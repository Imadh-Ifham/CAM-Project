import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
  Alert,
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
import { useLocalSearchParams } from "expo-router";
import { useGetCampaignByIdQuery } from "@/src/store/services/campaignsApi";
import {
  useCreateCollectionJobMutation,
  useGetCollectionsByCampaignQuery,
  useStartCollectionJobMutation,
  useCompleteCollectionJobMutation,
  useUpdateCollectionJobMutation,
  useCancelCollectionJobMutation,
} from "@/src/store/services/collectionsApi";
import DateTimePicker from "@react-native-community/datetimepicker";

type CollectionStatus =
  | "draft"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export default function CampaignCollect() {
  // Form state
  const params = useLocalSearchParams<{ campaignId: string }>();
  const campaignId = params.campaignId as string;
  const { data: campaign } = useGetCampaignByIdQuery(campaignId, {
    skip: !campaignId,
  });
  const [createJob, { isLoading: creating }] = useCreateCollectionJobMutation();
  const { data: jobs } = useGetCollectionsByCampaignQuery(
    { campaignId },
    { skip: !campaignId }
  );
  const [startJob] = useStartCollectionJobMutation();
  const [completeJob] = useCompleteCollectionJobMutation();
  const [updateJob] = useUpdateCollectionJobMutation();
  const [cancelJob] = useCancelCollectionJobMutation();

  const [resourceId, setResourceId] = useState<string | undefined>();
  const [targetQty, setTargetQty] = useState("");
  const [notes, setNotes] = useState("");
  const [plannedStartAt, setPlannedStartAt] = useState<string | undefined>();
  const [plannedEndAt, setPlannedEndAt] = useState<string | undefined>();
  const [pickupLocationName, setPickupLocationName] = useState<string>("");
  const [pickupAddress, setPickupAddress] = useState<string>("");
  const [pickupContactName, setPickupContactName] = useState<string>("");
  const [pickupContactPhone, setPickupContactPhone] = useState<string>("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [noVolunteer, setNoVolunteer] = useState<boolean>(true);
  const [volunteerPickerOpen, setVolunteerPickerOpen] = useState(false);
  const [volunteerId, setVolunteerId] = useState<string | undefined>(undefined);
  const volunteerOptions: Array<{ key: string; label: string }> = [];
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; job?: any }>({
    open: false,
  });
  const [editTargetQty, setEditTargetQty] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");

  const resourceOptions = useMemo(
    () =>
      (campaign?.resources || []).map((r) => ({
        key: r.id,
        label: `${r.name} (${r.unit})`,
        unit: r.unit,
        target: r.quantity,
      })),
    [campaign]
  );

  const collections = jobs || [];

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
      draft: { bg: colors.mutedBackground, fg: colors.muted },
      scheduled: { bg: "#e0e7ff", fg: "#4338ca" },
      in_progress: { bg: "#e9d5ff", fg: "#6b21a8" },
      completed: { bg: "#dcfce7", fg: "#166534" },
      cancelled: { bg: "#fee2e2", fg: "#991b1b" },
    } as any;
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
          <Badge variant="outline">{collections.length} Jobs</Badge>
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
            {/* Resource (campaign resource) */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Resource
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
                    color: resourceId ? colors.cardForeground : colors.muted,
                  }}
                >
                  {resourceOptions.find((r) => r.key === resourceId)?.label ||
                    "Select resource"}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={16}
                  color={colors.muted}
                />
              </Pressable>
            </View>

            {/* Target Quantity */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Target Quantity
              </Text>
              <TextInput
                value={targetQty}
                onChangeText={setTargetQty}
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

            {/* Volunteer assignment */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Assigned Volunteer (optional)
              </Text>
              <Pressable
                onPress={() => setNoVolunteer(!noVolunteer)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <Ionicons
                  name={noVolunteer ? "checkbox-outline" : "square-outline"}
                  size={18}
                  color={noVolunteer ? colors.primary : colors.muted}
                />
                <Text style={{ color: colors.cardForeground }}>
                  No volunteer (agent will collect)
                </Text>
              </Pressable>
              <Pressable
                disabled={noVolunteer}
                onPress={() => setVolunteerPickerOpen(true)}
                style={{
                  height: 44,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: noVolunteer
                    ? colors.background
                    : colors.mutedBackground,
                  paddingHorizontal: spacing.md,
                  opacity: noVolunteer ? 0.6 : 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: volunteerId ? colors.cardForeground : colors.muted,
                  }}
                >
                  {volunteerOptions.find((v) => v.key === volunteerId)?.label ||
                    "Select volunteer"}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={16}
                  color={colors.muted}
                />
              </Pressable>
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

            {/* Optional: Schedule */}
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                  Planned Start
                </Text>
                <Pressable
                  onPress={() => setShowStartPicker(true)}
                  style={{
                    height: 44,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.mutedBackground,
                    paddingHorizontal: spacing.md,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: plannedStartAt
                        ? colors.cardForeground
                        : colors.muted,
                    }}
                  >
                    {plannedStartAt
                      ? new Date(plannedStartAt).toLocaleDateString()
                      : "YYYY-MM-DD"}
                  </Text>
                </Pressable>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                  Planned End
                </Text>
                <Pressable
                  onPress={() => setShowEndPicker(true)}
                  style={{
                    height: 44,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.mutedBackground,
                    paddingHorizontal: spacing.md,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: plannedEndAt
                        ? colors.cardForeground
                        : colors.muted,
                    }}
                  >
                    {plannedEndAt
                      ? new Date(plannedEndAt).toLocaleDateString()
                      : "YYYY-MM-DD"}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Optional: Pickup details */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Pickup Details (Optional)
              </Text>
              <TextInput
                value={pickupLocationName}
                onChangeText={setPickupLocationName}
                placeholder="Location name"
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
              <View style={{ height: spacing.sm }} />
              <TextInput
                value={pickupAddress}
                onChangeText={setPickupAddress}
                placeholder="Address"
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
              <View style={{ height: spacing.sm }} />
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <TextInput
                  value={pickupContactName}
                  onChangeText={setPickupContactName}
                  placeholder="Contact name"
                  placeholderTextColor={colors.muted}
                  style={{
                    flex: 1,
                    height: 44,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.mutedBackground,
                    paddingHorizontal: spacing.md,
                    color: colors.cardForeground,
                  }}
                />
                <TextInput
                  value={pickupContactPhone}
                  onChangeText={setPickupContactPhone}
                  placeholder="Contact phone"
                  placeholderTextColor={colors.muted}
                  style={{
                    flex: 1,
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

            {/* Submit */}
            <Button
              disabled={!resourceId || !targetQty || creating}
              onPress={async () => {
                if (!resourceId || !targetQty) return;
                try {
                  await createJob({
                    campaignId,
                    resourceId,
                    targetQty: Number(targetQty),
                    assignedVolunteerId: noVolunteer
                      ? undefined
                      : volunteerId || undefined,
                    notes: notes || undefined,
                    schedule:
                      plannedStartAt || plannedEndAt
                        ? { plannedStartAt, plannedEndAt }
                        : undefined,
                    pickup:
                      pickupLocationName ||
                      pickupAddress ||
                      pickupContactName ||
                      pickupContactPhone
                        ? {
                            locationName: pickupLocationName || undefined,
                            address: pickupAddress || undefined,
                            contactName: pickupContactName || undefined,
                            contactPhone: pickupContactPhone || undefined,
                          }
                        : undefined,
                  }).unwrap();
                  Alert.alert("Success", "Collection job created.");
                  // Reset fields on success
                  setResourceId(undefined);
                  setTargetQty("");
                  setNotes("");
                  setNoVolunteer(true);
                  setVolunteerId(undefined);
                  setPlannedStartAt(undefined);
                  setPlannedEndAt(undefined);
                  setPickupLocationName("");
                  setPickupAddress("");
                  setPickupContactName("");
                  setPickupContactPhone("");
                } catch (e: any) {
                  console.error("create collection error", e);
                  Alert.alert(
                    "Error",
                    e?.data?.message || "Failed to create job"
                  );
                }
              }}
              style={{ width: "100%" }}
            >
              <Ionicons name="add" size={16} color={colors.primaryForeground} />
              <Text
                style={{
                  color: colors.primaryForeground,
                  fontWeight: "700",
                  marginLeft: 6,
                }}
              >
                Create Collection Job
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
            {collections.map((c: any) => (
              <View
                key={c._id}
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
                    <Text style={{ fontWeight: "700" }}>
                      {c.resourceSnapshot?.name || c.resourceId}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>
                      Target: {c.targetQty} {c.resourceSnapshot?.unit || ""}
                    </Text>
                  </View>
                  <StatusBadge status={c.status} />
                </View>

                {/* Details */}
                <View style={{ gap: 6 }}>
                  {!!c.pickup?.locationName && (
                    <Row icon="location-outline" text={c.pickup.locationName} />
                  )}
                  <Row
                    icon="person-outline"
                    text={`Volunteer: ${
                      c.assignedVolunteerId ? c.assignedVolunteerId : "Agent"
                    }`}
                  />
                  {!!c.schedule?.plannedStartAt && (
                    <Row
                      icon="calendar-outline"
                      text={`Planned: ${new Date(
                        c.schedule.plannedStartAt
                      ).toLocaleDateString()}`}
                    />
                  )}
                  {!!c.schedule?.startedAt && (
                    <Row
                      icon="time-outline"
                      text={`Started: ${new Date(
                        c.schedule.startedAt
                      ).toLocaleString()}`}
                    />
                  )}
                  {!!c.schedule?.completedAt && (
                    <Row
                      icon="checkmark-circle-outline"
                      text={`Completed: ${new Date(
                        c.schedule.completedAt
                      ).toLocaleString()}`}
                    />
                  )}
                  {!!c.notes && (
                    <Row icon="clipboard-outline" text={c.notes} multiline />
                  )}
                </View>

                {/* Actions */}
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: spacing.sm,
                    marginTop: spacing.xs,
                  }}
                >
                  {(c.status === "scheduled" || c.status === "draft") && (
                    <Button
                      size="sm"
                      variant="outline"
                      style={{ width: "48%" }}
                      onPress={async () => {
                        try {
                          await startJob({ campaignId, jobId: c._id }).unwrap();
                          Alert.alert("Started", "Collection started");
                        } catch (e: any) {
                          Alert.alert(
                            "Error",
                            e?.data?.message || "Failed to start job"
                          );
                        }
                      }}
                    >
                      <Ionicons
                        name="play-circle-outline"
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
                        Start
                      </Text>
                    </Button>
                  )}
                  {c.status === "draft" && (
                    <Button
                      size="sm"
                      variant="outline"
                      style={{ width: "48%" }}
                      onPress={() => {
                        setEditTargetQty(String(c.targetQty || ""));
                        setEditNotes(c.notes || "");
                        setEditModal({ open: true, job: c });
                      }}
                    >
                      <Ionicons
                        name="create-outline"
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
                        Edit
                      </Text>
                    </Button>
                  )}
                  {c.status === "in_progress" && (
                    <Button
                      size="sm"
                      style={{ width: "48%" }}
                      onPress={async () => {
                        try {
                          await completeJob({
                            campaignId,
                            jobId: c._id,
                          }).unwrap();
                          Alert.alert("Completed", "Collection completed");
                        } catch (e: any) {
                          Alert.alert(
                            "Error",
                            e?.data?.message || "Failed to complete job"
                          );
                        }
                      }}
                    >
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
                        Complete
                      </Text>
                    </Button>
                  )}
                  {(c.status === "draft" || c.status === "scheduled") && (
                    <Button
                      size="sm"
                      variant="outline"
                      style={{ width: "48%" }}
                      onPress={async () => {
                        try {
                          await cancelJob({
                            campaignId,
                            jobId: c._id,
                          }).unwrap();
                          Alert.alert("Cancelled", "Collection cancelled");
                        } catch (e: any) {
                          Alert.alert(
                            "Error",
                            e?.data?.message || "Failed to cancel job"
                          );
                        }
                      }}
                    >
                      <Ionicons
                        name="close-circle-outline"
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
                        Cancel
                      </Text>
                    </Button>
                  )}
                  <Button size="sm" variant="outline" style={{ width: "48%" }}>
                    <Ionicons
                      name="information-circle-outline"
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
                  setResourceId(opt.key);
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
                {resourceId === opt.key && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Volunteer picker */}
      <Modal
        visible={volunteerPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setVolunteerPickerOpen(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(15,23,42,0.15)",
            padding: spacing.lg,
            justifyContent: "center",
          }}
          onPress={() => setVolunteerPickerOpen(false)}
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
            {volunteerOptions.length === 0 ? (
              <Text style={{ color: colors.muted }}>
                No volunteers available
              </Text>
            ) : (
              volunteerOptions.map((opt) => (
                <Pressable
                  key={opt.key}
                  onPress={() => {
                    setVolunteerId(opt.key);
                    setVolunteerPickerOpen(false);
                  }}
                  style={{
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.sm,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ flex: 1 }}>{opt.label}</Text>
                  {volunteerId === opt.key && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={colors.primary}
                    />
                  )}
                </Pressable>
              ))
            )}
          </View>
        </Pressable>
      </Modal>

      {/* Date pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={plannedStartAt ? new Date(plannedStartAt) : new Date()}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowStartPicker(false);
            if (date) setPlannedStartAt(date.toISOString());
          }}
        />
      )}
      {/* Edit draft modal */}
      <Modal
        visible={editModal.open}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModal({ open: false })}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(15,23,42,0.15)",
            padding: spacing.lg,
            justifyContent: "center",
          }}
          onPress={() => setEditModal({ open: false })}
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
            <Text
              style={[
                typography.h3,
                { fontSize: 18, marginBottom: spacing.sm },
              ]}
            >
              Edit Collection (Draft)
            </Text>
            <Text style={{ fontWeight: "600", marginBottom: 6 }}>
              Target Quantity
            </Text>
            <TextInput
              value={editTargetQty}
              onChangeText={setEditTargetQty}
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
            <View style={{ height: spacing.sm }} />
            <Text style={{ fontWeight: "600", marginBottom: 6 }}>Notes</Text>
            <TextInput
              value={editNotes}
              onChangeText={setEditNotes}
              placeholder="Any additional details..."
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
                paddingVertical: spacing.sm,
                textAlignVertical: "top",
                color: colors.cardForeground,
              }}
            />
            <View style={{ height: spacing.md }} />
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <Button
                variant="outline"
                style={{ flex: 1 }}
                onPress={() => setEditModal({ open: false })}
              >
                <Text
                  style={{ color: colors.cardForeground, fontWeight: "600" }}
                >
                  Cancel
                </Text>
              </Button>
              <Button
                style={{ flex: 1 }}
                onPress={async () => {
                  if (!editModal.job) return;
                  try {
                    const patch: any = {};
                    if (editTargetQty) patch.targetQty = Number(editTargetQty);
                    patch.notes = editNotes || undefined;
                    await updateJob({
                      campaignId,
                      jobId: editModal.job._id,
                      patch,
                    }).unwrap();
                    Alert.alert("Updated", "Draft collection updated");
                    setEditModal({ open: false });
                  } catch (e: any) {
                    Alert.alert(
                      "Error",
                      e?.data?.message || "Failed to update draft"
                    );
                  }
                }}
              >
                <Ionicons
                  name="save-outline"
                  size={14}
                  color={colors.primaryForeground}
                />
                <Text
                  style={{
                    color: colors.primaryForeground,
                    fontWeight: "700",
                    marginLeft: 6,
                  }}
                >
                  Save
                </Text>
              </Button>
            </View>
          </View>
        </Pressable>
      </Modal>
      {showEndPicker && (
        <DateTimePicker
          value={plannedEndAt ? new Date(plannedEndAt) : new Date()}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowEndPicker(false);
            if (date) setPlannedEndAt(date.toISOString());
          }}
        />
      )}
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
