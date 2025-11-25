"use client";
import React from "react";
import Tabs from "@/app/shared/ui/components/Tabs";
import type { Tab } from "@/app/shared/ui/components/Tabs/types";
import { DividendTable } from "../DividendTable";
import Box from "@/app/shared/ui/components/Box";
import { FinancialReportTable } from "@/app/features/disclosure-information/components/FinancialReportTable";
import GeneralTable from "@/app/features/disclosure-information/components/GeneralTable";
import { IncomeTable } from "@/app/features/disclosure-information/components/IncomeTable";
import { PerformanceIndicatorTable } from "@/app/features/disclosure-information/components/PerformanceIndicatorTable";
import { TradeTable } from "@/app/features/disclosure-information/components/TradeTable";
import { useParams, useSearchParams } from "next/navigation";
import { EssentialFactsTable } from "../EssentialFactsTable";
import { useTranslations } from "next-intl";
import { BalanceSheetTable } from "../BalanceSheet/IncomeTable";

interface DisclosureOfInformationTabsProps {
  organization: any; // Ideally use a typed OrganizationData interface
  tickerName: any;
}

export const DisclosureOfInformationTabs: React.FC<DisclosureOfInformationTabsProps> = ({
  organization,
  tickerName,
}) => {
  const searchParams = useSearchParams();

  const stockType = searchParams.get("stock_type") as "common" | "privileged" | "bond";
  const { id } = useParams();

  const t = useTranslations();

  const tabs: Tab[] = [];

  tabs.push({
    id: "general",
    label: t("profile_emitents.general_tab"),
    content: <GeneralTable id={id} isListing={organization?.is_listing} />,
  });

  tabs.push({
    id: "Доходы",
    label: t("profile_emitents.earnings"),
    content: <IncomeTable organizationId={organization.id} />,
  });
  tabs.push({
    id: "balance_sheet",
    label: t("profile_emitents.balance_sheet"),
    content: <BalanceSheetTable organizationId={organization.id} />,
  });

  tabs.push({
    id: "Показатели Эффективности",
    label: t("profile_emitents.performance_indicators"),
    content: <PerformanceIndicatorTable organizationId={organization.id} />,
  });

  if (organization?.is_listing) {
    tabs.push({
      id: "Trading_statistics",
      label: t("profile_emitents.trading_statistics"),
      content: (
        <Box>
          <TradeTable tickerName={tickerName} />
        </Box>
      ),
    });
  }

  tabs.push(
    {
      id: "facts",
      label: t("profile_emitents.essential_facts"),
      content: (
        <Box>
          <EssentialFactsTable />
        </Box>
      ),
    },
    {
      id: "finance",
      label: t("profile_emitents.financial_reports"),
      content: (
        <Box>
          <FinancialReportTable />
        </Box>
      ),
    },
    {
      id: "dividend",
      label: t("profile_emitents.dividends"),
      content: (
        <Box>
          <DividendTable id={id} stockType={stockType} />
        </Box>
      ),
    }
  );
  // const tabs: Tab[] = [
  //   {
  //     id: "general",
  //     label: t("profile_emitents.general_tab"),
  //     content: <GeneralTable id={id} isListing={organization?.is_listing} />, // fetches with its own logic
  //   },
  //   {
  //     id: "Доходы",
  //     label: t("profile_emitents.earnings"),
  //     content: <IncomeTable organizationId={organization.id} />,
  //   },
  //   {
  //     id: "Показатели Эффективности",
  //     label: t("profile_emitents.performance_indicators"),
  //     content: <PerformanceIndicatorTable organizationId={organization.id} />,
  //   },
  //   organization?.isListing
  //     ? {
  //         id: "Торговая Статистика",
  //         label: t("profile_emitents.trading_statistics"),
  //         content: (
  //           <Box>
  //             <TradeTable tickerName={tickerName} />
  //           </Box>
  //         ),
  //       }
  //     : null,
  //   {
  //     id: "facts",
  //     label: t("profile_emitents.essential_facts"),
  //     content: (
  //       <Box>
  //         <EssentialFactsTable />
  //       </Box>
  //     ),
  //   },
  //   {
  //     id: "finance",
  //     label: t("profile_emitents.financial_reports"),
  //     content: (
  //       <Box>
  //         <FinancialReportTable />
  //       </Box>
  //     ),
  //   },
  //   {
  //     id: "dividend",
  //     label: t("profile_emitents.dividends"),
  //     content: (
  //       <Box>
  //         <DividendTable id={id} stockType={stockType} />
  //       </Box>
  //     ),
  //   },
  // ];

  return (
    <Tabs
      variant="bordered"
      tabs={tabs}
      defaultActiveTab="general"
      onChange={tabId => console.log("Active tab:", tabId)}
    />
  );
};
