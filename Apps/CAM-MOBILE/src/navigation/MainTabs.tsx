import React, { useMemo } from "react";
import { usePathname } from "expo-router";
import TopNavBar, { TopTab } from "../components/ui/TopNavBar";

type Props = {
  role?: "agent" | "volunteer";
};

// Renders the segmented top tabs based on current pathname
export const MainTabs: React.FC<Props> = ({ role = "agent" }) => {
  const pathname = usePathname();

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
    const m = pathname.match(/\/(agent|volunteer)\/(\w+)/);
    const key = m?.[2];
    return key === "campaigns" || key === "profile" ? key : "home";
  }, [pathname]);

  return <TopNavBar tabs={tabs} activeKey={activeKey} />;
};

export default MainTabs;
