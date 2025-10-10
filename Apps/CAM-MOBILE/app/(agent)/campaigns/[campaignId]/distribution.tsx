import React, { useEffect, useMemo, useState } from "react";
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
import { Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useGetCampaignByIdQuery } from "@/src/store/services/campaignsApi";
import {
  useCreateDistributionJobMutation,
  useGetDistributionsByCampaignQuery,
  useStartDistributionJobMutation,
  useCompleteDistributionJobMutation,
  useCancelDistributionJobMutation,
  useGetDistributionJobRecordsQuery,
} from "@/src/store/services/distributionsApi";
import {
  useGetCampaignSnapshotsQuery,
  useGetResourceSnapshotQuery,
} from "@/src/store/services/progressApi";
import ProgressHeader from "@/src/components/ui/ProgressHeader";

type DistStatus =
  | "draft"
  | "scheduled"
  | "blocked_insufficient_stock"
  | "in_progress"
  | "completed"
  | "cancelled";

export default function CampaignDistribution() {
  // Params and campaign
  const params = useLocalSearchParams<{ campaignId: string }>();
  const campaignId = params.campaignId as string;
  const { data: campaign } = useGetCampaignByIdQuery(campaignId, {
    skip: !campaignId,
  });
  // Resource selection must be declared before hooks that depend on it
  const [resourceId, setResourceId] = useState<string | undefined>();
  const { data: snapshots = [], refetch: refetchSnapshots } =
    useGetCampaignSnapshotsQuery(campaignId!, {
      skip: !campaignId,
      pollingInterval: 15000,
      refetchOnFocus: true,
    } as any);
  const { data: resSnapshot } = useGetResourceSnapshotQuery(
    resourceId && campaignId ? { campaignId, resourceId } : ({} as any),
    { skip: !campaignId || !resourceId } as any
  );

  // Backend hooks
  const { data: distributions = [] } = useGetDistributionsByCampaignQuery(
    { campaignId },
    { skip: !campaignId }
  );
  // Refresh snapshots when distributions list changes
  useEffect(() => {
    if (refetchSnapshots) refetchSnapshots();
  }, [distributions]);
  const [createJob, { isLoading: creating }] =
    useCreateDistributionJobMutation();
  const [startJob] = useStartDistributionJobMutation();
  const [completeJob] = useCompleteDistributionJobMutation();
  const [cancelJob] = useCancelDistributionJobMutation();

  // Form state
  const [targetQty, setTargetQty] = useState("");
  const [notes, setNotes] = useState("");
  const [plannedStartAt, setPlannedStartAt] = useState<string | undefined>();
  const [plannedEndAt, setPlannedEndAt] = useState<string | undefined>();
  const [destinationName, setDestinationName] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [receiverName, setReceiverName] = useState<string>("");
  const [receiverPhone, setReceiverPhone] = useState<string>("");
  const [noVolunteer, setNoVolunteer] = useState<boolean>(true);
  const [volunteerId, setVolunteerId] = useState<string | undefined>();

  // UI state
  const [resourcePicker, setResourcePicker] = useState(false);
  const [volPicker, setVolPicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [detailsModal, setDetailsModal] = useState<{
    open: boolean;
    job?: any;
  }>({ open: false });

  // Options
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
  const volunteerOptions: Array<{ key: string; label: string }> = [];

  // Details records hook at top-level
  const detailsJob: any | undefined = detailsModal.job;
  const detailsId: string | undefined = detailsJob?._id;
  const { data: detailsRecords = [] } = useGetDistributionJobRecordsQuery(
    detailsId ? { campaignId, id: detailsId } : ({} as any),
    { skip: !detailsModal.open || !detailsId }
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
      draft: { bg: colors.mutedBackground, fg: colors.muted },
      scheduled: { bg: "#e0e7ff", fg: "#4338ca" },
      blocked_insufficient_stock: { bg: "#fee2e2", fg: "#991b1b" },
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
        {/* Progress summary header */}
        <ProgressHeader
          title={
            resourceId
              ? `Progress · ${
                  resourceOptions.find((r) => r.key === resourceId)?.label ||
                  "Selected"
                }`
              : "Campaign Progress"
          }
          target={
            resSnapshot?.targetQty ??
            (resourceId
              ? 0
              : snapshots.reduce(
                  (acc: number, s: any) => acc + (s.targetQty || 0),
                  0
                ))
          }
          collected={
            resSnapshot?.collectedQty ??
            (resourceId
              ? 0
              : snapshots.reduce(
                  (acc: number, s: any) => acc + (s.collectedQty || 0),
                  0
                ))
          }
          distributed={
            resSnapshot?.distributedQty ??
            (resourceId
              ? 0
              : snapshots.reduce(
                  (acc: number, s: any) => acc + (s.distributedQty || 0),
                  0
                ))
          }
          available={
            resSnapshot?.availableQty ??
            (resourceId
              ? 0
              : snapshots.reduce(
                  (acc: number, s: any) => acc + (s.availableQty || 0),
                  0
                ))
          }
          unitLabel={
            resourceId
              ? resourceOptions.find((r) => r.key === resourceId)?.unit
              : ""
          }
        />
        {/* Title row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={[typography.h3]}>Distribute Resources</Text>
          <OutlineBadge color={colors.blue}>
            {distributions.length} Jobs
          </OutlineBadge>
        </View>

        {/* Schedule New Distribution */}
        <Card>
          <CardHeader>
            <Text style={[typography.h3, { fontSize: 18 }]}>
              Add New Distribution
            </Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>
              Plan and schedule resource distribution
            </Text>
          </CardHeader>
          <CardContent style={{ gap: spacing.md }}>
            {/* Resource to Distribute */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Resource
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

            {/* Quantity & Date */}
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                  Target Quantity
                </Text>
                <TextInput
                  value={targetQty}
                  onChangeText={setTargetQty}
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
            </View>
            {/* Planned End */}
            <View style={{ flexDirection: "row", gap: spacing.md }}>
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

            {/* Destination */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Destination Details (Optional)
              </Text>
              <TextInput
                value={destinationName}
                onChangeText={setDestinationName}
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
                value={destinationAddress}
                onChangeText={setDestinationAddress}
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
            </View>

            {/* Recipient */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Recipient Contact
              </Text>
              <TextInput
                value={receiverName}
                onChangeText={setReceiverName}
                placeholder="Name"
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
                value={receiverPhone}
                onChangeText={setReceiverPhone}
                placeholder="Phone"
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
                  No volunteer (agent will deliver)
                </Text>
              </Pressable>
              <Pressable
                disabled={noVolunteer}
                onPress={() => setVolPicker(true)}
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

            {/* Instructions */}
            <View>
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Delivery Instructions
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
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

            <Button
              disabled={!resourceId || !targetQty || creating}
              style={{ width: "100%" }}
              onPress={async () => {
                if (!resourceId || !targetQty) return;
                try {
                  const selected = resourceOptions.find(
                    (r) => r.key === resourceId
                  );
                  await createJob({
                    campaignId,
                    resourceId,
                    targetQty: Number(targetQty),
                    resourceSnapshot: selected
                      ? {
                          id: selected.key,
                          name: selected.label.split(" (")[0],
                          unit: selected.unit,
                          targetQty: Number(targetQty),
                        }
                      : undefined,
                    assignedVolunteerId: noVolunteer
                      ? undefined
                      : volunteerId || undefined,
                    receiverName: receiverName || undefined,
                    receiverPhone: receiverPhone || undefined,
                    deliveryInstructions: notes || undefined,
                    destination:
                      destinationName || destinationAddress
                        ? {
                            locationName: destinationName || undefined,
                            address: destinationAddress || undefined,
                          }
                        : undefined,
                    schedule:
                      plannedStartAt || plannedEndAt
                        ? { plannedStartAt, plannedEndAt }
                        : undefined,
                    notes: notes || undefined,
                  }).unwrap();
                  // reset
                  setResourceId(undefined);
                  setTargetQty("");
                  setNotes("");
                  setPlannedStartAt(undefined);
                  setPlannedEndAt(undefined);
                  setDestinationName("");
                  setDestinationAddress("");
                  setReceiverName("");
                  setReceiverPhone("");
                  setNoVolunteer(true);
                  setVolunteerId(undefined);
                } catch (e: any) {
                  const msg =
                    e?.data?.error ||
                    e?.data?.message ||
                    e?.error ||
                    "Failed to create distribution";
                  Alert.alert("Error", String(msg));
                  return;
                }
                Alert.alert("Success", "Distribution job created.");
              }}
            >
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
                Create Distribution Job
              </Text>
            </Button>
          </CardContent>
        </Card>

        {/* Active Distributions */}
        <Card>
          <CardHeader>
            <Text style={[typography.h3, { fontSize: 18 }]}>
              Recent Distributions
            </Text>
          </CardHeader>
          <CardContent style={{ gap: spacing.md }}>
            {distributions.map((d: any) => (
              <View
                key={d._id}
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
                    <Text style={{ fontWeight: "700" }}>
                      {d.resourceSnapshot?.name || d.resourceId}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>
                      Target: {d.targetQty} {d.resourceSnapshot?.unit || ""}
                    </Text>
                  </View>
                  <StatusBadge status={d.status} />
                </View>
                <View style={{ gap: 6 }}>
                  {!!d.destination?.locationName && (
                    <Row
                      icon="location-outline"
                      text={d.destination.locationName}
                    />
                  )}
                  <Row
                    icon="person-outline"
                    text={`Recipient: ${d.receiverName || "N/A"}`}
                  />
                  {!!d.schedule?.plannedStartAt && (
                    <Row
                      icon="calendar-outline"
                      text={`Planned: ${new Date(
                        d.schedule.plannedStartAt
                      ).toLocaleDateString()}`}
                    />
                  )}
                  {!!d.schedule?.startedAt && (
                    <Row
                      icon="time-outline"
                      text={`Started: ${new Date(
                        d.schedule.startedAt
                      ).toLocaleString()}`}
                    />
                  )}
                  {!!d.schedule?.completedAt && (
                    <Row
                      icon="checkmark-circle-outline"
                      text={`Completed: ${new Date(
                        d.schedule.completedAt
                      ).toLocaleString()}`}
                    />
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: spacing.sm,
                    marginTop: spacing.xs,
                  }}
                >
                  {(d.status === "scheduled" || d.status === "draft") && (
                    <Button
                      size="sm"
                      variant="outline"
                      style={{ width: "48%" }}
                      onPress={async () => {
                        try {
                          await startJob({ campaignId, id: d._id }).unwrap();
                        } catch {}
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
                  {d.status === "in_progress" && (
                    <Button
                      size="sm"
                      style={{ width: "48%" }}
                      onPress={async () => {
                        try {
                          await completeJob({ campaignId, id: d._id }).unwrap();
                        } catch {}
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
                  {(d.status === "draft" || d.status === "scheduled") && (
                    <Button
                      size="sm"
                      variant="outline"
                      style={{ width: "48%" }}
                      onPress={async () => {
                        try {
                          await cancelJob({ campaignId, id: d._id }).unwrap();
                        } catch {}
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
                  <Button
                    size="sm"
                    variant="outline"
                    style={{ width: "48%" }}
                    onPress={() => setDetailsModal({ open: true, job: d })}
                  >
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

      {/* View Details modal */}
      <Modal
        visible={detailsModal.open}
        transparent
        animationType="fade"
        onRequestClose={() => setDetailsModal({ open: false })}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(15,23,42,0.15)",
            padding: spacing.lg,
            justifyContent: "center",
          }}
          onPress={() => setDetailsModal({ open: false })}
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing.lg,
              gap: spacing.md,
            }}
          >
            {(() => {
              const job = detailsModal.job;
              if (!job)
                return <Text style={{ color: colors.muted }}>No details</Text>;
              type R = {
                volunteerId?: string;
                volunteerName?: string;
                amountSubmitted: number;
                completedQtyAfter: number;
                targetQtySnapshot: number;
                recordedAt: string;
                note?: string;
              };
              const byVolunteer: Record<
                string,
                { name: string; entries: { time: string; qty: number }[] }
              > = {};
              (detailsRecords as R[]).forEach((r) => {
                const id = r.volunteerId || "unknown";
                const name = r.volunteerName || r.volunteerId || "Unknown";
                if (!byVolunteer[id]) byVolunteer[id] = { name, entries: [] };
                byVolunteer[id].entries.push({
                  time: new Date(r.recordedAt).toLocaleString(),
                  qty: r.amountSubmitted,
                });
              });
              const groups = Object.entries(byVolunteer);
              const totalTarget = job.targetQty || 0;
              const totalDelivered = (detailsRecords as R[]).reduce(
                (sum, r) => sum + (r.amountSubmitted || 0),
                0
              );
              const percent =
                totalTarget > 0
                  ? Math.min(
                      100,
                      Math.round((totalDelivered / totalTarget) * 100)
                    )
                  : 0;
              return (
                <View style={{ gap: spacing.md }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text style={[typography.h3, { fontSize: 18 }]}>
                        {job.resourceSnapshot?.name || job.resourceId}
                      </Text>
                      <Text style={{ color: colors.muted, marginTop: 2 }}>
                        Target: {totalTarget} {job.resourceSnapshot?.unit || ""}
                      </Text>
                    </View>
                    <StatusBadge status={job.status} />
                  </View>
                  <View style={{ gap: 6 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ color: colors.muted, fontSize: 12 }}>
                        Progress
                      </Text>
                      <Text style={{ color: colors.muted, fontSize: 12 }}>
                        {totalDelivered}/{totalTarget}
                      </Text>
                    </View>
                    <View
                      style={{
                        height: 10,
                        backgroundColor: colors.mutedBackground,
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          height: 10,
                          width: `${percent}%`,
                          backgroundColor: colors.primary,
                        }}
                      />
                    </View>
                  </View>
                  <View style={{ gap: spacing.sm }}>
                    {groups.length === 0 && (
                      <Text style={{ color: colors.muted }}>
                        No volunteer made any deliveries yet.
                      </Text>
                    )}
                    {groups.map(([id, v]) => (
                      <View
                        key={id}
                        style={{
                          borderWidth: 1,
                          borderColor: colors.border,
                          borderRadius: 12,
                          padding: spacing.md,
                          gap: 6,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Ionicons
                            name="person-circle-outline"
                            size={16}
                            color={colors.muted}
                          />
                          <Text style={{ fontWeight: "700" }}>{v.name}</Text>
                        </View>
                        {v.entries.map((e, idx) => (
                          <View
                            key={idx}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <Ionicons
                              name="time-outline"
                              size={14}
                              color={colors.muted}
                            />
                            <Text
                              style={{ color: colors.cardForeground, flex: 1 }}
                            >
                              {e.time} — {e.qty}{" "}
                              {job.resourceSnapshot?.unit || ""}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                  <View style={{ flexDirection: "row", gap: spacing.sm }}>
                    <Button
                      variant="outline"
                      style={{ flex: 1 }}
                      onPress={() => setDetailsModal({ open: false })}
                    >
                      <Text
                        style={{
                          color: colors.cardForeground,
                          fontWeight: "600",
                        }}
                      >
                        Close
                      </Text>
                    </Button>
                  </View>
                </View>
              );
            })()}
          </View>
        </Pressable>
      </Modal>

      {/* Resource picker */}
      <PickerModal
        visible={resourcePicker}
        title="Select resource"
        options={resourceOptions.map((o) => o.label)}
        selected={resourceOptions.find((r) => r.key === resourceId)?.label}
        onSelect={(v) => {
          const match = resourceOptions.find((r) => r.label === v);
          setResourceId(match?.key);
          setResourcePicker(false);
        }}
        onClose={() => setResourcePicker(false)}
      />
      {/* Volunteer picker */}
      <PickerModal
        visible={volPicker}
        title="Select volunteer"
        options={volunteerOptions.map((v) => v.label)}
        selected={volunteerOptions.find((v) => v.key === volunteerId)?.label}
        onSelect={(v) => {
          const match = volunteerOptions.find((o) => o.label === v);
          setVolunteerId(match?.key);
          setVolPicker(false);
        }}
        onClose={() => setVolPicker(false)}
      />
      {/* Date pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={
            plannedStartAt ? new Date(plannedStartAt as string) : new Date()
          }
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowStartPicker(false);
            if (date) setPlannedStartAt(date.toISOString());
          }}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={plannedEndAt ? new Date(plannedEndAt as string) : new Date()}
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
