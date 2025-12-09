"use client";
import React from "react";
import Tabs from "@/app/shared/ui/components/Tabs";
import type { Tab } from "@/app/shared/ui/components/Tabs/types";

import { useTranslations } from "next-intl";
import DividendCalendarTable from "../DevidersTable";
import AnnouncementCalendarTable from "../../AnnouncementCalendar";
import DedlineCalendar from "../../DedlineCalendar";



export const CalendarTabs = () => {


  const t = useTranslations();

  const tabs: Tab[] = [
    {
      id: "stocks",
      label: t("main.informationdisclosuretabs.devidends"),
      content: <DividendCalendarTable />,
    },
    {
      id: "announcementsCalendar",
      label: t("main.informationdisclosuretabs.announcements"),
      content: <AnnouncementCalendarTable />,
    },
    {
      id: "dedlineCalendar",
      label: t("main.informationdisclosuretabs.dedline_calendar"),
      content: <DedlineCalendar />,
    },
  ];

  const handleTabChange = (tabId: string) => {
    console.log("Active tab:", tabId);
  };

  return <Tabs tabs={tabs} defaultActiveTab="stocks" onChange={handleTabChange} />;
};
