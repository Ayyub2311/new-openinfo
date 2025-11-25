"use client";
import React from "react";
import Tabs from "@/app/shared/ui/components/Tabs";
import type { Tab } from "@/app/shared/ui/components/Tabs/types";
import EssentialFactsTable from "@/app/features/calendar/components/EssentialFactsTable";
import ReportsTable from "@/app/features/calendar/components/ReportsTable";
import { useTranslations } from "next-intl";
import AnnouncementsTable from "@/app/features/calendar/components/AnnouncementsTable";
import SecuritiesTable from "@/app/features/calendar/components/SecuritiesTable";

export const HomeInfoDisclosureTabs = () => {
  const t = useTranslations();

  const tabs: Tab[] = [
    {
      id: "facts",
      label: t("main.informationdisclosuretabs.facts"),
      content: <EssentialFactsTable />,
    },

    {
      id: "finance",
      label: t("main.informationdisclosuretabs.finance"),
      content: <ReportsTable />,
    },
    {
      id: "announcements",
      label: t("main.informationdisclosuretabs.announcements"),
      content: <AnnouncementsTable />,
    },
    {
      id: "securities",
      label: t("main.informationdisclosuretabs.securities"),
      content: <SecuritiesTable />,
    },
  ];

  const handleTabChange = (tabId: string) => {
    console.log("Active tab:", tabId);
  };

  return <Tabs tabs={tabs} defaultActiveTab="facts" onChange={handleTabChange} />;
};
