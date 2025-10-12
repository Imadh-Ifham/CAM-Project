import React, { useEffect, useMemo, useRef, useState } from "react";
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
  useCreateDistributionJobRecordMutation,
} from "@/src/store/services/distributionsApi";
import {
  useGetCampaignSnapshotsQuery,
  useGetResourceSnapshotQuery,
} from "@/src/store/services/progressApi";
import ProgressHeader from "@/src/components/ui/ProgressHeader";
import { useGetTotalsQuery as useGetStockTotalsQuery } from "@/src/store/services/stockApi";

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
  const { data: resSnapshot, refetch: refetchResourceSnapshot } =
    useGetResourceSnapshotQuery(
      resourceId && campaignId ? { campaignId, resourceId } : ({} as any),
      { skip: !campaignId || !resourceId } as any
    );
  const selectedResSnapshot: any | undefined =
    resourceId && Array.isArray(snapshots)
      ? (resSnapshot as any) ||
        (snapshots as any).find((s: any) => s.resourceId === resourceId)
      : undefined;

  // Backend hooks
  const { data: distributions = [] } = useGetDistributionsByCampaignQuery(
    { campaignId },
    { skip: !campaignId }
  );
  // Strictly scope distributions to current campaign to avoid bleed across routes
  const campaignResourceIds = useMemo(() => {
    const set = new Set<string>();
    (campaign?.resources || []).forEach((r: any) => r?.id && set.add(r.id));
    return set;
  }, [campaign]);
  const filteredDistributions = useMemo(() => {
    const cid = String(campaignId || "");
    return (distributions as any[]).filter(
      (d: any) =>
        String(d?.campaignId || "") === cid ||
        (d?.resourceId && campaignResourceIds.has(String(d.resourceId)))
    );
  }, [distributions, campaignId, campaignResourceIds]);
  // Refresh snapshots when distributions list changes
  useEffect(() => {
    if (refetchSnapshots) refetchSnapshots();
  }, [filteredDistributions]);
  const [createJob, { isLoading: creating }] =
    useCreateDistributionJobMutation();
  const [startJob] = useStartDistributionJobMutation();
  const [completeJob] = useCompleteDistributionJobMutation();
  const [cancelJob] = useCancelDistributionJobMutation();
  const [createRecord, { isLoading: recording }] =
    useCreateDistributionJobRecordMutation();

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
  // Track last alerted resource (ref to avoid StrictMode duplicate alerts)
  const lastAlertedDistResourceIdRef = useRef<string | null>(null);
  // Reset UI state on campaign change to prevent carryover
  useEffect(() => {
    setDetailsModal({ open: false });
    lastAlertedDistResourceIdRef.current = null;
    setResourceId(undefined);
    setTargetQty("");
  }, [campaignId]);

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

  // Stock totals for insufficient banner and header extras
  const { data: stockTotals = [], refetch: refetchStockTotals } =
    useGetStockTotalsQuery(campaignId!, {
      skip: !campaignId,
      pollingInterval: 15000,
      refetchOnFocus: true,
    } as any);
  const selectedStockTotals: any | undefined = React.useMemo(
    () =>
      (stockTotals as any[])?.find?.((r: any) => r.resourceId === resourceId),
    [stockTotals, resourceId]
  );
  const availableFromStock = selectedStockTotals?.totalAvailable;
  const availableFromSnapshot = selectedResSnapshot?.availableQty;
  const availableForSelected =
    typeof availableFromStock === "number"
      ? availableFromStock
      : typeof availableFromSnapshot === "number"
      ? availableFromSnapshot
      : 0;
  const unitLabel = resourceId
    ? resourceOptions.find((r) => r.key === resourceId)?.unit
    : "";
  const insufficient =
    !!resourceId && !!targetQty && Number(targetQty) > availableForSelected;
  const maxDistributable = availableForSelected;
  const inputDisabled = !!resourceId && Number(maxDistributable) <= 0;

  // Determine if campaign requirement is fully distributed for selected resource
  const distributedForSelected = resourceId
    ? typeof (selectedResSnapshot as any)?.distributedQty === "number"
      ? Number((selectedResSnapshot as any)?.distributedQty)
      : 0
    : 0;
  const remainingToDistribute = resourceId
    ? Math.max(
        (Number((selectedResSnapshot as any)?.targetQty) || 0) -
          distributedForSelected,
        0
      )
    : undefined;

  useEffect(() => {
    const name = resourceId
      ? (resourceOptions.find((r) => r.key === resourceId)?.label || "").split(
          " ("
        )[0]
      : "";
    const targetQtySel = Number((selectedResSnapshot as any)?.targetQty) || 0;
    if (
      resourceId &&
      targetQtySel > 0 &&
      remainingToDistribute === 0 &&
      lastAlertedDistResourceIdRef.current !== resourceId
    ) {
      Alert.alert(
        "Distribution Complete",
        `Distributions for ${
          name || "this resource"
        } have fulfilled the campaign requirement.`
      );
      lastAlertedDistResourceIdRef.current = resourceId;
    }
  }, [resourceId, remainingToDistribute, selectedResSnapshot]);

  // Details records hook at top-level
  const detailsJob: any | undefined = detailsModal.job;
  const detailsId: string | undefined = detailsJob?._id;
  const { data: detailsRecords = [], refetch: refetchDetailsRecords } =
    useGetDistributionJobRecordsQuery(
      detailsId ? { campaignId, id: detailsId } : ({} as any),
      { skip: !detailsModal.open || !detailsId }
    );

  // Local state for adding delivery records
  const [recordQty, setRecordQty] = useState("");
  const [recordNote, setRecordNote] = useState("");
  const [recordError, setRecordError] = useState<string | null>(null);
  useEffect(() => {
    if (detailsModal.open) {
      setRecordQty("");
      setRecordNote("");
      setRecordError(null);
    }
  }, [detailsModal.open, detailsId]);

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
        {(() => {
          // Aggregate campaign snapshot sums
          const toNum = (n: any) => (typeof n === "number" ? n : 0);
          const sum = (key: string) =>
            (Array.isArray(snapshots) ? snapshots : []).reduce(
              (acc: number, s: any) => acc + toNum((s as any)?.[key]),
              0
            );
          const campaignSum = {
            target: sum("targetQty"),
            collected: sum("collectedQty"),
            distributed: sum("distributedQty"),
            available: sum("availableQty"),
          };
          const isSingleResourceCampaign =
            (campaign?.resources || []).length === 1;
          const configTargetForSelected = resourceId
            ? Number(
                resourceOptions.find((r) => r.key === resourceId)?.target || 0
              )
            : 0;
          const snapshotTargetForSelected = Number(
            (selectedResSnapshot as any)?.targetQty || 0
          );
          const effectiveTargetForSelected = resourceId
            ? snapshotTargetForSelected > 0
              ? snapshotTargetForSelected
              : configTargetForSelected
            : 0;
          const headerTarget = resourceId
            ? effectiveTargetForSelected
            : campaignSum.target > 0
            ? campaignSum.target
            : (campaign?.resources || []).reduce(
                (acc: number, r: any) => acc + (Number(r.quantity || 0) || 0),
                0
              );
          const headerCollected = resourceId
            ? typeof (selectedResSnapshot as any)?.collectedQty === "number"
              ? Number((selectedResSnapshot as any)?.collectedQty)
              : isSingleResourceCampaign
              ? campaignSum.collected
              : 0
            : campaignSum.collected;
          const headerDistributed = resourceId
            ? typeof (selectedResSnapshot as any)?.distributedQty === "number"
              ? Number((selectedResSnapshot as any)?.distributedQty)
              : isSingleResourceCampaign
              ? campaignSum.distributed
              : 0
            : campaignSum.distributed;
          const headerAvailable = resourceId
            ? typeof selectedStockTotals?.totalAvailable === "number"
              ? Number(selectedStockTotals.totalAvailable)
              : typeof (selectedResSnapshot as any)?.availableQty === "number"
              ? Number((selectedResSnapshot as any)?.availableQty)
              : isSingleResourceCampaign
              ? campaignSum.available
              : 0
            : (Array.isArray(stockTotals) ? (stockTotals as any[]) : []).length
            ? (stockTotals as any[]).reduce(
                (acc: number, r: any) => acc + (r.totalAvailable || 0),
                0
              )
            : campaignSum.available;
          return (
            <ProgressHeader
              title={
                resourceId
                  ? `Progress · ${
                      resourceOptions.find((r) => r.key === resourceId)
                        ?.label || "Selected"
                    }`
                  : "Campaign Progress"
              }
              target={headerTarget}
              collected={headerCollected}
              distributed={headerDistributed}
              available={headerAvailable}
              unitLabel={unitLabel}
              stockTotals={
                resourceId && selectedStockTotals
                  ? {
                      totalQuantity: selectedStockTotals.totalQuantity || 0,
                      totalConsumed: selectedStockTotals.totalConsumed || 0,
                      totalAvailable: selectedStockTotals.totalAvailable || 0,
                    }
                  : undefined
              }
              campaignId={campaignId}
              requiredResources={campaign?.resources as any}
            />
          );
        })()}
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
            {filteredDistributions.length} Jobs
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

            {/* Completed banner when fully distributed against campaign target */}
            {resourceId &&
              (Number((selectedResSnapshot as any)?.targetQty) || 0) > 0 &&
              remainingToDistribute === 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginTop: spacing.sm,
                    padding: spacing.sm,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#86efac",
                    backgroundColor: "#dcfce7",
                  }}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={16}
                    color="#166534"
                  />
                  <Text style={{ color: "#166534", flex: 1 }}>
                    Distribution complete for{" "}
                    {
                      (
                        resourceOptions.find((r) => r.key === resourceId)
                          ?.label || "this resource"
                      ).split(" (")[0]
                    }
                    . Campaign requirement fulfilled.
                  </Text>
                </View>
              )}

            {/* Quantity & Date */}
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                  Target Quantity
                </Text>
                {resourceId && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                      padding: spacing.sm,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: colors.border,
                      backgroundColor: colors.mutedBackground,
                    }}
                  >
                    <Ionicons
                      name="information-circle-outline"
                      size={16}
                      color={colors.muted}
                    />
                    <Text style={{ color: colors.muted, flex: 1 }}>
                      Available to distribute: {maxDistributable}
                      {unitLabel ? ` ${unitLabel}` : ""}
                    </Text>
                  </View>
                )}
                <TextInput
                  value={targetQty}
                  onChangeText={(val) => {
                    if (val === "") {
                      setTargetQty("");
                      return;
                    }
                    const cleaned = val.replace(/[^0-9.]/g, "");
                    let num = Number(cleaned);
                    if (isNaN(num)) {
                      setTargetQty("");
                      return;
                    }
                    if (typeof maxDistributable === "number") {
                      num = Math.min(num, maxDistributable);
                    }
                    setTargetQty(String(num));
                  }}
                  keyboardType="numeric"
                  placeholder="Amount"
                  placeholderTextColor={colors.muted}
                  editable={!!resourceId && Number(maxDistributable) > 0}
                  style={{
                    height: 44,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.mutedBackground,
                    paddingHorizontal: spacing.md,
                    color: colors.cardForeground,
                    opacity:
                      !!resourceId && Number(maxDistributable) > 0 ? 1 : 0.6,
                  }}
                />
                {resourceId && (
                  <Text
                    style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}
                  >
                    Max {maxDistributable}
                    {unitLabel ? ` ${unitLabel}` : ""} can be distributed for
                    this resource.
                  </Text>
                )}
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
            {insufficient && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  padding: spacing.sm,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#fecaca",
                  backgroundColor: "#fee2e2",
                }}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color="#991b1b"
                />
                <Text style={{ color: "#991b1b", flex: 1 }}>
                  Insufficient stock. Available {availableForSelected}
                  {unitLabel ? ` ${unitLabel}` : ""}. You can still schedule;
                  delivery will be blocked until stock is added.
                </Text>
              </View>
            )}
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
            {filteredDistributions.map((d: any) => (
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
                          // Immediate refresh of progress and stock
                          if (refetchSnapshots) await refetchSnapshots();
                          if (refetchResourceSnapshot && resourceId)
                            await refetchResourceSnapshot();
                          if (refetchStockTotals) await refetchStockTotals();
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
                          // After completion, progress snapshots and stock should change -> refetch immediately
                          if (refetchSnapshots) await refetchSnapshots();
                          if (refetchResourceSnapshot && resourceId)
                            await refetchResourceSnapshot();
                          if (refetchStockTotals) await refetchStockTotals();
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
                          // Cancellation may release reservations; refresh to be safe
                          if (refetchSnapshots) await refetchSnapshots();
                          if (refetchResourceSnapshot && resourceId)
                            await refetchResourceSnapshot();
                          if (refetchStockTotals) await refetchStockTotals();
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
                  {/* Add delivery record */}
                  {job.status !== "completed" && job.status !== "cancelled" && (
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 12,
                        padding: spacing.md,
                        gap: spacing.sm,
                      }}
                    >
                      <Text style={{ fontWeight: "700" }}>
                        Add delivery record
                      </Text>
                      {recordError && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                            padding: spacing.sm,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: "#fecaca",
                            backgroundColor: "#fee2e2",
                          }}
                        >
                          <Ionicons
                            name="alert-circle-outline"
                            size={16}
                            color="#991b1b"
                          />
                          <Text style={{ color: "#991b1b", flex: 1 }}>
                            {recordError}
                          </Text>
                        </View>
                      )}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                          padding: spacing.sm,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: colors.border,
                          backgroundColor: colors.mutedBackground,
                        }}
                      >
                        <Ionicons
                          name="information-circle-outline"
                          size={16}
                          color={colors.muted}
                        />
                        <Text style={{ color: colors.muted, flex: 1 }}>
                          Remaining toward target:{" "}
                          {Math.max(0, totalTarget - totalDelivered)}
                          {job.resourceSnapshot?.unit
                            ? ` ${job.resourceSnapshot?.unit}`
                            : ""}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", gap: spacing.sm }}>
                        <TextInput
                          value={recordQty}
                          onChangeText={(val) => {
                            if (val === "") {
                              setRecordQty("");
                              return;
                            }
                            const cleaned = val.replace(/[^0-9.]/g, "");
                            let num = Number(cleaned);
                            if (isNaN(num)) {
                              setRecordQty("");
                              return;
                            }
                            const remaining = Math.max(
                              0,
                              totalTarget - totalDelivered
                            );
                            if (remaining > 0) num = Math.min(num, remaining);
                            setRecordQty(String(num));
                          }}
                          keyboardType="numeric"
                          placeholder="Amount delivered"
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
                          value={recordNote}
                          onChangeText={setRecordNote}
                          placeholder="Note (optional)"
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
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: spacing.sm,
                        }}
                      >
                        <Text style={{ color: colors.muted, flex: 1 }}>
                          Delivered {totalDelivered}/{totalTarget} — Remaining{" "}
                          {Math.max(0, totalTarget - totalDelivered)}
                          {job.resourceSnapshot?.unit
                            ? ` ${job.resourceSnapshot?.unit}`
                            : ""}
                        </Text>
                        <Button
                          disabled={
                            !recordQty || Number(recordQty) <= 0 || recording
                          }
                          onPress={async () => {
                            const amt = Number(recordQty);
                            if (!detailsId || !amt || isNaN(amt) || amt <= 0)
                              return;
                            try {
                              await createRecord({
                                campaignId,
                                id: detailsId,
                                amountSubmitted: amt,
                                note: recordNote || undefined,
                              }).unwrap();
                              if (refetchDetailsRecords)
                                await refetchDetailsRecords();
                              if (refetchSnapshots) await refetchSnapshots();
                              if (refetchResourceSnapshot && resourceId)
                                await refetchResourceSnapshot();
                              if (refetchStockTotals)
                                await refetchStockTotals();
                              setRecordQty("");
                              setRecordNote("");
                              setRecordError(null);
                            } catch (e: any) {
                              const msg =
                                e?.data?.error ||
                                e?.data?.message ||
                                e?.error ||
                                "Failed to submit record";
                              setRecordError(String(msg));
                              setTimeout(() => setRecordError(null), 3000);
                            }
                          }}
                        >
                          <Ionicons
                            name="download-outline"
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
                            Mark Delivered
                          </Text>
                        </Button>
                      </View>
                    </View>
                  )}
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
          setTargetQty("");
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
