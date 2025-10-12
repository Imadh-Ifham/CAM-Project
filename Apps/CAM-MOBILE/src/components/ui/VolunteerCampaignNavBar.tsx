import React from "react";
import TopNavBar, { TopTab } from "./TopNavBar";
import { usePathname } from "expo-router";

type Props = {
  campaignId: string;
  activeKey?: string;
};

const keys = [
  { key: "overview", label: "Overview" },
  { key: "collect", label: "Collect" },
  { key: "distribution", label: "Distribution" },
];

export const VolunteerCampaignNavBar: React.FC<Props> = ({
  campaignId,
  activeKey,
}) => {
  const pathname = usePathname();
  const derived = (() => {
    if (activeKey) return activeKey;
    const seg = pathname?.split("/").filter(Boolean) || [];
    const last = seg[seg.length - 1] || "overview";
    return keys.some((k) => k.key === last) ? last : "overview";
  })();

  const tabs: TopTab[] = keys.map((k) => ({
    key: k.key,
    label: k.label,
    href: `/(volunteer)/campaigns/${campaignId}/${k.key}`,
  }));

  return (
    <TopNavBar
      tabs={tabs}
      activeKey={derived}
      outerPaddingHorizontal={12}
      outerPaddingTop={8}
    />
  );
};

export default VolunteerCampaignNavBar;
