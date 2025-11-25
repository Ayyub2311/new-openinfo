"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Title } from "@/app/shared/ui/components/Typography/Title";
import Divider from "@/app/shared/ui/components/Divider";

interface ReportTitleProps {
  type: "annual" | "quarter";
  category: "jsc" | "bank" | "insurance" | "llc" | "micro";
  year: string;
  quarter?: string;
  className?: string;
}

export const ReportTitle: React.FC<ReportTitleProps> = ({ type, category, year, quarter }) => {
  const t = useTranslations();

  const entityName = t(`Report.entity.${category}` as never);

  const formattedTitle =
    type === "annual"
      ? `${entityName} ${t("Report.annual")} ${year}`
      : quarter
        ? `${entityName} Q${quarter} ${t("Report.quarter")} ${year}`
        : `${entityName} ${t("Report.quarter_fallback")} ${year}`;

  return (
    <div>
      <Title level={1} className="mt-5 mb-5 text-[1.5rem] text-center">
        {formattedTitle}
      </Title>
      <Divider />
    </div>
  );
};
