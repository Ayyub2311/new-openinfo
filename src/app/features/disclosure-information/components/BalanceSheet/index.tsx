"use client";

import { useEffect, useState } from "react";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import IncomeTable from "../IncomeTable";

interface PerformanceData {
  reporting_year: number;
  net_profit_margin?: number;
  return_on_assets?: number;
  return_on_equity?: number;
  debt_ratio?: number;
  debt_to_equity_ratio?: number;
  gross_profit_margin?: number;
}

interface Props {
  organizationId: number;
}

export const PerformanceIndicatorTable = ({ organizationId }: Props) => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await FetchService.fetch<{
          results: PerformanceData[];
        }>(`/api/v2/reports/financial_indicators/?organization_id=${organizationId}`);

        setPerformanceData(response.results || []);
      } catch (err) {
        console.error("Error fetching performance data:", err);
        setError("Ошибка загрузки данных");
      }
    };

    fetchPerformanceData();
  }, [organizationId]);

  if (error) return <div>{error}</div>;
  if (performanceData.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <IncomeTable organizationId={`${organizationId}`} />
    </div>
  );
};

export default PerformanceIndicatorTable;
