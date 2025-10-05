export type CampaignTabKey =
  | "overview"
  | "collect"
  | "distribution"
  | "volunteers"
  | "tasks";

export const CAMPAIGN_TABS: { key: CampaignTabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "collect", label: "Collect" },
  { key: "distribution", label: "Distribution" },
  { key: "volunteers", label: "Volunteers" },
  { key: "tasks", label: "Tasks" },
];
