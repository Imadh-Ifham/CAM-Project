import React, { useMemo } from "react";
import { useSegments } from "expo-router";
import TopNavBar, { TopTab } from "../components/ui/TopNavBar";

type Props = {
  role?: "agent" | "volunteer";
};

// Renders the segmented top tabs based on current pathname
export const MainTabs: React.FC<Props> = ({ role = "agent" }) => {
  const segments = useSegments();

  const tabs: TopTab[] = useMemo(() => {
    if (role === "agent") {
      return [
        { key: "home", label: "Home", href: "/(agent)/home" },
        { key: "campaigns", label: "Campaigns", href: "/(agent)/campaigns" },
        { key: "profile", label: "Profile", href: "/(agent)/profile" },
      ];
    }
    // Volunteer (future expansion)
    return [
      { key: "home", label: "Home", href: "/(volunteer)/home" },
      { key: "campaigns", label: "Campaigns", href: "/(volunteer)/campaigns" },
      { key: "profile", label: "Profile", href: "/(volunteer)/profile" },
    ];
  }, [role]);

  const activeKey = useMemo(() => {
    const flat = segments.map((s) => (Array.isArray(s) ? s[0] : s));
    const clean = flat
      .map((s) => (s ? s.replace(/[()]/g, "") : s))
      .filter(Boolean) as string[];
    const roleIdx = clean.findIndex((s) => s === "agent" || s === "volunteer");
    const next = roleIdx >= 0 ? clean[roleIdx + 1] : clean[0];
    if (next === "campaigns") return "campaigns";
    if (next === "profile") return "profile";
    return "home";
  }, [segments]);

  return <TopNavBar tabs={tabs} activeKey={activeKey} />;
};

export default MainTabs;
