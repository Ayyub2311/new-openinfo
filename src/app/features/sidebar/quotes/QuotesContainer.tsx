"use client";

import Tabs from "@/app/shared/ui/components/Tabs";
import { Tab } from "@/app/shared/ui/components/Tabs/types";
import React from "react";
import StockOverviewCombined from "./Stock";
import { useTranslations } from "next-intl";
import BondOverviewCombined from "./Obligations";
import ExchangeRatesTable from "./ExchangeRates";
import UCIBarChart from "./UCI";

export default function QuotesPages() {
  const t = useTranslations();

  const tabs: Tab[] = [
    {
      id: "stock",
      label: t("QuotesTabs.stock"),
      content: <StockOverviewCombined />,
    },
    {
      id: "obligations",
      label: t("QuotesTabs.obligations"),
      content: <BondOverviewCombined />,
    },

    {
      id: "exchange-rates",
      label: t("QuotesTabs.exchange_rates"),
      content: <ExchangeRatesTable />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Tabs tabs={tabs} />

      <UCIBarChart />
    </div>
  );
}
