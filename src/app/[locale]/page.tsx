"use client";

import { ChevronRight } from "lucide-react";
import Container from "@/app/shared/ui/components/Container";
import CorporatePortal from "@/app/shared/ui/containers/CorparatePortal";
import Section from "@/app/shared/ui/components/Section";
import { CalendarTabs } from "@/app/features/calendar/components/CalendarTabs";
import { NewsGrid } from "@/app/features/news/components/NewsGrid";
import Divider from "@/app/shared/ui/components/Divider";
import Sidebar from "@/app/shared/ui/components/Sidebar";
import { sidebarItems } from "@/app/features/sidebar/components/Sidebar";
import { Link } from "@/i18n/routing";
import TradeAnalyticsTables from "../features/top-lists/components";
import { useTranslations } from "next-intl";
import { HomeInfoDisclosureTabs } from "../features/disclosure-information/components/HomeInfoDisclosureTabs";
import { useRef } from "react";

export default function Home() {
  const t = useTranslations();

  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <Container>
      <div className="mt-4">
        <CorporatePortal />
      </div>
      <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 mt-[30px] relative">
        { /* Main Content */}
        <div className="col-span-1 lg:col-span-2">
          <div>
            <Section
              title={
                <div className="flex gap-1 items-center">
                  <span>
                    <Link href="/about">{t("Home.disclosure_of_information")}</Link>
                  </span>
                  <ChevronRight />
                </div>
              }
            >
              <HomeInfoDisclosureTabs />
            </Section>
          </div>
          <div className="mt-[30px]">
            <Section
              title={
                <div className="flex gap-1 items-center">
                  <span>{t("Home.calendars")}</span>
                  <ChevronRight />
                </div>
              }
            >
              <CalendarTabs />
            </Section>
          </div>
          <div className="mt-[30px] mb-[30px]">
            <Section
              title={
                <div className="flex gap-1 items-center">
                  <span>{t("Home.analytics_and_opinions")}</span>
                  <ChevronRight />
                </div>
              }
            >
              <div className="my-4 md:mt-6 flex-grow">
                <Divider />
              </div>
              <NewsGrid />
            </Section>

            <TradeAnalyticsTables />
          </div>
          {/* <Section title={t("Home.statistics")}>
            <PieBarGrid />
          </Section> */}
        </div>
        <aside className="hidden md:block lg:block shrink-0 grow-0 basis-[clamp(280px,26vw,360px)]">
          <div className="sticky top-10 max-h-[calc(100vh-5rem] overflow-auto">
            <Sidebar items={sidebarItems} />
          </div>
        </aside>
      </div>
    </Container>
  );
}
