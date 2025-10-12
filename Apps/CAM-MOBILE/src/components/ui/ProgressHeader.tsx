import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { useGetCampaignByIdQuery } from "../../store/services/campaignsApi";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { typography } from "../../styles/typography";

type Props = {
  title?: string;
  target?: number;
  collected?: number;
  distributed?: number;
  available?: number;
  unitLabel?: string;
  // Optional stock extras
  stockTotals?: {
    totalQuantity: number;
    totalConsumed: number;
    totalAvailable: number;
  };
  lotCounts?: { available: number; partial: number; depleted: number };
  // Optional: campaign required resources to show in a modal
  requiredResources?: Array<{
    id?: string;
    name: string;
    unit?: string;
    quantity?: number;
  }>;
  // Optional: if provided, ProgressHeader will fetch required resources from API when requiredResources not passed
  campaignId?: string;
};

export function ProgressHeader({
  title = "Progress",
  target = 0,
  collected = 0,
  distributed = 0,
  available = 0,
  unitLabel = "",
  stockTotals,
  lotCounts,
  requiredResources,
  campaignId,
}: Props) {
  // If requiredResources not provided, fetch campaign to get resources
  const shouldFetchCampaign =
    !requiredResources || requiredResources.length === 0;
  const { data: campaignData } = useGetCampaignByIdQuery(
    campaignId as any,
    {
      skip: !campaignId || !shouldFetchCampaign,
    } as any
  );
  const providedResources = requiredResources || [];
  const resourcesFromApi = (campaignData as any)?.resources || [];
  const readQty = (r: any) => {
    const v =
      r?.quantity ??
      r?.targetQty ??
      r?.targetQuantity ??
      r?.requiredQty ??
      r?.requiredQuantity ??
      0;
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  };
  const readUnit = (r: any) => r?.unit ?? r?.measureUnit ?? r?.units ?? "";
  const effectiveResources: Array<{
    id?: string;
    name: string;
    unit?: string;
    quantity?: number;
  }> =
    providedResources.length > 0
      ? providedResources
      : resourcesFromApi.map((r: any) => ({
          id: r.id,
          name: r.name,
          unit: readUnit(r),
          quantity: readQty(r),
        }));
  const safeNum = (n: any) => (typeof n === "number" && isFinite(n) ? n : 0);
  const T = Math.max(safeNum(target), 0);
  const C = Math.max(Math.min(safeNum(collected), T), 0);
  const D = Math.max(Math.min(safeNum(distributed), T), 0);
  // Available can never exceed Collected - Distributed and never exceed Target
  const Araw = Math.max(safeNum(available), 0);
  const A = Math.max(Math.min(Araw, Math.max(C - D, 0), T), 0);
  const clampPct = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
  const pctCollected = T > 0 ? clampPct((C / T) * 100) : 0;
  const pctDistributed = T > 0 ? clampPct((D / T) * 100) : 0;
  const pctAvailable = T > 0 ? clampPct((A / T) * 100) : 0;
  const remainingToCollect = Math.max(T - C, 0);
  const remainingToDistribute = Math.max(T - D, 0);
  const fallbackTarget = effectiveResources.reduce((acc, r) => {
    const n = Number((r as any)?.quantity ?? 0);
    return acc + (isNaN(n) ? 0 : n);
  }, 0);
  const Tdisplay = T > 0 ? T : fallbackTarget;

  const Bar = ({ value, color }: { value: number; color: string }) => (
    <View
      style={{
        height: 8,
        backgroundColor: colors.mutedBackground,
        borderRadius: 999,
      }}
    >
      <View
        style={{
          height: 8,
          width: `${value}%`,
          backgroundColor: color,
          borderRadius: 999,
        }}
      />
    </View>
  );

  const Row = ({
    label,
    stat,
    pct,
    color,
  }: {
    label: string;
    stat: string;
    pct: number;
    color: string;
  }) => (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "600", color: colors.cardForeground }}>
          {label}
        </Text>
        <Text style={{ color: colors.muted }}>{pct}%</Text>
      </View>
      <Bar value={pct} color={color} />
      <Text style={{ color: colors.muted, fontSize: 12 }}>{stat}</Text>
    </View>
  );

  return (
    <View
      style={{
        padding: spacing.md,
        borderRadius: 16,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        gap: spacing.md,
      }}
    >
      {/* Title */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={[typography.h3, { fontSize: 16 }]}>{title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ color: colors.muted }}>
            Target: {Tdisplay}
            {unitLabel ? ` ${unitLabel}` : ""}
          </Text>
          <TargetButton resources={effectiveResources} />
        </View>
      </View>

      {/* Campaign progress (based on collections vs target) */}
      <Row
        label="Campaign progress"
        stat={`Collected ${C}/${T}${
          unitLabel ? ` ${unitLabel}` : ""
        } • Remaining to collect ${remainingToCollect}`}
        pct={pctCollected}
        color={colors.primary}
      />

      {/* Distribution progress */}
      <Row
        label="Distribution progress"
        stat={`Distributed ${D}/${T}${
          unitLabel ? ` ${unitLabel}` : ""
        } • Remaining to distribute ${remainingToDistribute}`}
        pct={pctDistributed}
        color="#8b5cf6" /* purple */
      />

      {/* Stock available vs target */}
      <Row
        label="Stock available"
        stat={`Available now ${A}/${T}${unitLabel ? ` ${unitLabel}` : ""}${
          stockTotals
            ? ` • Lots total ${stockTotals.totalQuantity}, consumed ${stockTotals.totalConsumed}`
            : ""
        }`}
        pct={pctAvailable}
        color="#f59e0b" /* amber */
      />

      {/* Optional lot health */}
      {lotCounts ? (
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          <Chip
            label={`Lots available: ${lotCounts.available}`}
            bg={colors.green}
          />
          <Chip label={`Lots partial: ${lotCounts.partial}`} bg="#f59e0b" />
          <Chip label={`Lots depleted: ${lotCounts.depleted}`} bg="#ef4444" />
        </View>
      ) : null}
    </View>
  );
}

export default ProgressHeader;

function TargetButton({
  resources,
}: {
  resources: Array<{
    id?: string;
    name: string;
    unit?: string;
    quantity?: number;
  }>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.mutedBackground,
        }}
      >
        <Text
          style={{
            color: colors.cardForeground,
            fontWeight: "600",
            fontSize: 12,
          }}
        >
          Target
        </Text>
      </Pressable>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(15,23,42,0.15)",
            padding: spacing.lg,
            justifyContent: "center",
          }}
          onPress={() => setOpen(false)}
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
            <Text style={[typography.h3, { fontSize: 16 }]}>
              Required Resources
            </Text>
            <View style={{ gap: 8 }}>
              {resources.map((r, idx) => (
                <View
                  key={r.id || `${r.name}-${idx}`}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontWeight: "600" }}>{r.name}</Text>
                  <Text style={{ color: colors.muted }}>
                    {Number(r.quantity || 0)}
                    {r.unit ? ` ${r.unit}` : ""}
                  </Text>
                </View>
              ))}
              {resources.length === 0 && (
                <Text style={{ color: colors.muted }}>
                  No resources configured.
                </Text>
              )}
            </View>
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <Pressable
                onPress={() => setOpen(false)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: colors.cardForeground, fontWeight: "600" }}
                >
                  Close
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

function Chip({ label, bg }: { label: string; bg: string }) {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: bg,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>
        {label}
      </Text>
    </View>
  );
}
