import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import { useGetCampaignByIdQuery } from "@/src/store/services/campaignsApi";
import {
  useCreateCollectionJobMutation,
  useGetCollectionsByCampaignQuery,
  useStartCollectionJobMutation,
  useCompleteCollectionJobMutation,
  useUpdateCollectionJobMutation,
  useCancelCollectionJobMutation,
  useGetCollectionJobRecordsQuery,
} from "@/src/store/services/collectionsApi";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  useGetCampaignSnapshotsQuery,
  useGetResourceSnapshotQuery,
} from "@/src/store/services/progressApi";
import ProgressHeader from "@/src/components/ui/ProgressHeader";

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
  // Resource selection must be declared before hooks that depend on it
  const [resourceId, setResourceId] = useState<string | undefined>();
  // Track if the user manually selected a resource in this session.
  // This prevents any implicit/default selection from showing up in the UI.
  const [didManuallySelectResource, setDidManuallySelectResource] =
    useState(false);
  const { data: snapshots = [], refetch: refetchSnapshots } =
    useGetCampaignSnapshotsQuery(campaignId!, {
      skip: !campaignId,
      // Enable background refresh when screen refocuses
      pollingInterval: 15000,
      refetchOnFocus: true,
    } as any);
  const { data: resSnapshot, refetch: refetchResSnapshot } =
    useGetResourceSnapshotQuery(
      resourceId && campaignId ? { campaignId, resourceId } : ({} as any),
      { skip: !campaignId || !resourceId } as any
    );
  // Fallback for selected resource: if single-resource query is null, find it in campaign snapshots
  const selectedResSnapshot: any | undefined =
    resourceId && Array.isArray(snapshots)
      ? (resSnapshot as any) ||
        (snapshots as any).find(
          (s: any) => String(s.resourceId) === String(resourceId)
        )
      : undefined;
  const [createJob, { isLoading: creating }] = useCreateCollectionJobMutation();
  const { data: jobs } = useGetCollectionsByCampaignQuery(
    { campaignId },
    { skip: !campaignId }
  );
  const [startJob] = useStartCollectionJobMutation();
  const [completeJob] = useCompleteCollectionJobMutation();
  const [updateJob] = useUpdateCollectionJobMutation();
  const [cancelJob] = useCancelCollectionJobMutation();

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
  const [detailsModal, setDetailsModal] = useState<{
    open: boolean;
    job?: any;
  }>({ open: false });
  // Track if we already alerted for a completed resource (ref guard avoids StrictMode double fire)
  const lastAlertedResourceIdRef = useRef<string | null>(null);

  // On campaign change or initial mount, clear selection to prevent auto-select carryover
  useEffect(() => {
    setResourceId(undefined);
    setTargetQty("");
    setDidManuallySelectResource(false);
  }, [campaignId]);

  // Also reset selection whenever this screen gets focus (prevents carryover across tabs/routes)
  useFocusEffect(
    React.useCallback(() => {
      // Only clear if user hasn't manually selected yet. This avoids
      // wiping selection when closing in-screen modals (which trigger focus).
      if (!didManuallySelectResource) {
        setResourceId(undefined);
        setTargetQty("");
        lastAlertedResourceIdRef.current = null;
        setDidManuallySelectResource(false);
      }
      return undefined;
    }, [campaignId, didManuallySelectResource])
  );

  // If selection is cleared (resourceId undefined), allow alert to fire on next selection
  useEffect(() => {
    if (!resourceId) {
      lastAlertedResourceIdRef.current = null;
      setDidManuallySelectResource(false);
    }
  }, [resourceId]);

  // Details modal data fetch (must be at top level to respect Rules of Hooks)
  const detailsJob: any | undefined = detailsModal.job;
  const detailsJobId: string | undefined = detailsJob?._id;
  const { data: detailsRecords = [] } = useGetCollectionJobRecordsQuery(
    detailsJobId ? { campaignId, jobId: detailsJobId } : ({} as any),
    { skip: !detailsModal.open || !detailsJobId }
  );

  // Helpers to read resource config safely across backend variants
  const getResourceTarget = React.useCallback((r: any) => {
    const v =
      r?.quantity ??
      r?.targetQty ??
      r?.targetQuantity ??
      r?.requiredQty ??
      r?.requiredQuantity ??
      0;
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  }, []);
  const getResourceUnit = React.useCallback((r: any) => {
    return r?.unit ?? r?.measureUnit ?? r?.units ?? "";
  }, []);

  const resourceOptions = useMemo(
    () =>
      (campaign?.resources || []).map((r) => ({
        key: String(r.id),
        label: `${r.name} (${r.unit})`,
        unit: getResourceUnit(r),
        target: getResourceTarget(r),
      })),
    [campaign, getResourceTarget, getResourceUnit]
  );

  const collections = jobs || [];

  // Remaining collection needed for selected resource (target - collected)
  const unitLabel = resourceId
    ? resourceOptions.find((r) => r.key === resourceId)?.unit
    : "";
  // Aggregate campaign snapshot sums (raw sums from progress snapshots)
  const campaignSum = React.useMemo(() => {
    const toNum = (n: any) => (typeof n === "number" ? n : 0);
    const sum = (key: string) =>
      (Array.isArray(snapshots) ? snapshots : []).reduce(
        (acc: number, s: any) => acc + toNum(s?.[key]),
        0
      );
    return {
      target: sum("targetQty"),
      collected: sum("collectedQty"),
      distributed: sum("distributedQty"),
      available: sum("availableQty"),
    };
  }, [snapshots]);

  // Compute effective campaign target with a reliable fallback to campaign config when snapshots are empty
  const campaignTargetFromConfig = React.useMemo(() => {
    return (campaign?.resources || []).reduce(
      (acc: number, r: any) => acc + getResourceTarget(r),
      0
    );
  }, [campaign, getResourceTarget]);
  const campaignTargetEffective =
    campaignSum.target > 0 ? campaignSum.target : campaignTargetFromConfig;
  const isSingleResourceCampaign = (campaign?.resources || []).length === 1;
  // Use snapshot target when available; otherwise fall back to campaign-configured quantity
  const configTargetForSelected = resourceId
    ? Number(resourceOptions.find((r) => r.key === resourceId)?.target || 0)
    : 0;
  const snapshotTargetForSelected = Number(
    (selectedResSnapshot as any)?.targetQty || 0
  );
  const effectiveTargetForSelected = resourceId
    ? snapshotTargetForSelected > 0
      ? snapshotTargetForSelected
      : configTargetForSelected > 0
      ? configTargetForSelected
      : isSingleResourceCampaign
      ? campaignTargetEffective
      : 0
    : 0;
  // Remaining needed is based on collected vs target (not stock): remaining = target - collected
  const effectiveCollectedForSelected = resourceId
    ? typeof (selectedResSnapshot as any)?.collectedQty === "number"
      ? Number((selectedResSnapshot as any)?.collectedQty)
      : isSingleResourceCampaign
      ? campaignSum.collected
      : 0
    : 0;
  const remainingNeeded: number | undefined = resourceId
    ? Math.max(effectiveTargetForSelected - effectiveCollectedForSelected, 0)
    : undefined;
  // Clamp targetQty if remaining shrinks due to live updates
  useEffect(() => {
    if (typeof remainingNeeded === "number" && targetQty) {
      const num = Number(targetQty);
      if (!isNaN(num) && num > remainingNeeded) {
        setTargetQty(String(remainingNeeded));
      }
    }
  }, [remainingNeeded]);

  // Alert once when selecting a resource that is fully collected (only after a manual selection)
  useEffect(() => {
    const name = resourceId
      ? (resourceOptions.find((r) => r.key === resourceId)?.label || "").split(
          " ("
        )[0]
      : "";
    if (
      resourceId &&
      didManuallySelectResource &&
      effectiveTargetForSelected > 0 &&
      remainingNeeded === 0 &&
      lastAlertedResourceIdRef.current !== resourceId
    ) {
      Alert.alert(
        "Collection Complete",
        `Collections for ${
          name || "this resource"
        } are complete. Arrange distributions to locations.`
      );
      lastAlertedResourceIdRef.current = resourceId;
    }
  }, [
    resourceId,
    didManuallySelectResource,
    effectiveTargetForSelected,
    remainingNeeded,
  ]);

  // Refresh snapshots when collections list changes
  useEffect(() => {
    if (refetchSnapshots) refetchSnapshots();
  }, [collections]);

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
        {/* Progress summary header */}
        <ProgressHeader
          title={
            didManuallySelectResource && resourceId
              ? `Progress · ${
                  resourceOptions.find((r) => r.key === resourceId)?.label ||
                  "Selected"
                }`
              : "Campaign Progress"
          }
          target={
            didManuallySelectResource && resourceId
              ? effectiveTargetForSelected
              : campaignTargetEffective
          }
          collected={
            didManuallySelectResource && resourceId
              ? typeof (selectedResSnapshot as any)?.collectedQty === "number"
                ? Number((selectedResSnapshot as any)?.collectedQty)
                : isSingleResourceCampaign
                ? campaignSum.collected
                : 0
              : campaignSum.collected
          }
          distributed={
            didManuallySelectResource && resourceId
              ? typeof (selectedResSnapshot as any)?.distributedQty === "number"
                ? Number((selectedResSnapshot as any)?.distributedQty)
                : isSingleResourceCampaign
                ? campaignSum.distributed
                : 0
              : campaignSum.distributed
          }
          available={
            didManuallySelectResource && resourceId
              ? typeof (selectedResSnapshot as any)?.availableQty === "number"
                ? Number((selectedResSnapshot as any)?.availableQty)
                : isSingleResourceCampaign
                ? campaignSum.available
                : 0
              : campaignSum.available
          }
          unitLabel={
            didManuallySelectResource && resourceId
              ? resourceOptions.find((r) => r.key === resourceId)?.unit
              : ""
          }
          campaignId={campaignId}
          requiredResources={campaign?.resources as any}
        />
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
                    color:
                      didManuallySelectResource && resourceId
                        ? colors.cardForeground
                        : colors.muted,
                  }}
                >
                  {didManuallySelectResource && resourceId
                    ? resourceOptions.find((r) => r.key === resourceId)?.label
                    : "Select resources"}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={16}
                  color={colors.muted}
                />
              </Pressable>
            </View>

            {/* Completed banner when fully collected */}
            {didManuallySelectResource &&
              resourceId &&
              effectiveTargetForSelected > 0 &&
              remainingNeeded === 0 && (
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
                    Collection complete for{" "}
                    {
                      (
                        resourceOptions.find((r) => r.key === resourceId)
                          ?.label || "this resource"
                      ).split(" (")[0]
                    }
                    . Arrange distributions to locations.
                  </Text>
                </View>
              )}

            {/* Target Quantity */}
            <View>
              {didManuallySelectResource && resourceId && (
                <Text
                  style={{ color: colors.muted, marginTop: 6, fontSize: 12 }}
                >
                  Target: {effectiveTargetForSelected}
                  {unitLabel ? ` ${unitLabel}` : ""} · Remaining:{" "}
                  {remainingNeeded}
                  {unitLabel ? ` ${unitLabel}` : ""}
                </Text>
              )}
              <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                Target Quantity
              </Text>
              {didManuallySelectResource &&
                typeof remainingNeeded === "number" && (
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
                      Remaining needed: {remainingNeeded}
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
                  // keep numeric only
                  const cleaned = val.replace(/[^0-9.]/g, "");
                  let num = Number(cleaned);
                  if (isNaN(num)) {
                    setTargetQty("");
                    return;
                  }
                  if (typeof remainingNeeded === "number") {
                    num = Math.min(num, remainingNeeded);
                  }
                  setTargetQty(String(num));
                }}
                keyboardType="numeric"
                placeholder="Enter quantity"
                placeholderTextColor={colors.muted}
                // Allow editing only after a resource is selected and if more is needed
                editable={
                  didManuallySelectResource &&
                  !!resourceId &&
                  !(typeof remainingNeeded === "number" && remainingNeeded <= 0)
                }
                style={{
                  height: 44,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.mutedBackground,
                  paddingHorizontal: spacing.md,
                  color: colors.cardForeground,
                  opacity:
                    !didManuallySelectResource ||
                    !resourceId ||
                    (typeof remainingNeeded === "number" &&
                      remainingNeeded <= 0)
                      ? 0.6
                      : 1,
                }}
              />
              {didManuallySelectResource &&
                typeof remainingNeeded === "number" && (
                  <Text
                    style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}
                  >
                    Max {remainingNeeded}
                    {unitLabel ? ` ${unitLabel}` : ""} can be collected for this
                    resource.
                  </Text>
                )}
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
              disabled={
                !didManuallySelectResource ||
                !resourceId ||
                !targetQty ||
                creating ||
                (typeof remainingNeeded === "number" && remainingNeeded <= 0)
              }
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
                  // Refresh snapshots so remaining/headers update immediately
                  if (refetchSnapshots) await refetchSnapshots();
                  if (refetchResSnapshot) await refetchResSnapshot();
                  // Reset fields on success
                  setResourceId(undefined);
                  setTargetQty("");
                  setDidManuallySelectResource(false);
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
                          if (refetchSnapshots) await refetchSnapshots();
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
                          if (refetchSnapshots) await refetchSnapshots();
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
                          if (refetchSnapshots) await refetchSnapshots();
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
                  <Button
                    size="sm"
                    variant="outline"
                    style={{ width: "48%" }}
                    onPress={() => setDetailsModal({ open: true, job: c })}
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

      {/* View Details modal (mocked volunteer progress) */}
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
              // Use records fetched via top-level hook
              type R = {
                volunteerId?: string;
                volunteerName?: string;
                amountSubmitted: number;
                completedQtyAfter: number;
                targetQtySnapshot: number;
                recordedAt: string;
                note?: string;
              };
              // Group by volunteer for display (simple group)
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
              const totalCollected = (detailsRecords as R[]).reduce(
                (sum, r) => sum + (r.amountSubmitted || 0),
                0
              );
              const percent =
                totalTarget > 0
                  ? Math.min(
                      100,
                      Math.round((totalCollected / totalTarget) * 100)
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
                  {/* Progress bar */}
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
                        {totalCollected}/{totalTarget}
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
                  {/* Volunteers list */}
                  <View style={{ gap: spacing.sm }}>
                    {groups.length === 0 && (
                      <Text style={{ color: colors.muted }}>
                        No volunteer made any collections yet.
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
                key={opt.key || `${opt.label}-${idx}`}
                onPress={() => {
                  // Clear previous quantity and set new resource
                  setTargetQty("");
                  setResourceId(opt.key);
                  setDidManuallySelectResource(true);
                  setPickerOpen(false);
                  // Ensure fresh snapshot for selected resource
                  setTimeout(() => {
                    try {
                      if (refetchResSnapshot) refetchResSnapshot();
                      if (refetchSnapshots) refetchSnapshots();
                    } catch {}
                  }, 0);
                }}
                style={{
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.sm,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ flex: 1 }}>{opt.label}</Text>
                {didManuallySelectResource && resourceId === opt.key && (
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
