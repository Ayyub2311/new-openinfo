"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Box from "@/app/shared/ui/components/Box";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { FinancialIndicatorsTable } from "./IndicatorTable";

// Dynamically import ApexCharts for SSR safety
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

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

  const years = [...new Set(performanceData.map(item => item.reporting_year))].sort((a, b) => a - b);

  const indicators = [
    { key: "return_on_equity", label: "ROE", color: "#4F46E5" },
    { key: "return_on_assets", label: "ROA", color: "#374151" },
    // { key: "gross_profit_margin", label: "GrossProfitMargin", color: "#EF4444" },
    { key: "net_profit_margin", label: "NetProfitMargin", color: "#10B981" },
  ];

  const ratios = [{ key: "debt_to_equity_ratio", label: "DebtToEquity", color: "#60A5FA" }];

  const formatSeries = (keys: typeof indicators | typeof ratios) =>
    keys.map(({ key, label, color }) => ({
      name: label,
      data: years.map(year => {
        const yearData = performanceData.find(d => d.reporting_year === year);
        const value = yearData?.[key as keyof PerformanceData];
        return {
          x: year.toString(),
          y: typeof value === "number" ? parseFloat(value.toFixed(2)) : 0,
        };
      }),
      color,
    }));

  const getChartOptions = (title: string, isPercentage: boolean = false) => ({
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => (isPercentage ? `${val.toFixed(2)}%` : `${val.toFixed(2)}`),
    },
    stroke: {
      curve: "smooth",
      width: 5,
    },
    markers: {
      size: 4,
    },
    xaxis: {
      type: "category",
      categories: years.map(y => y.toString()),
    },
    yaxis: {
      labels: {
        formatter: (val: number) => (isPercentage ? `${val.toFixed(0)}%` : val.toFixed(2)),
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => (isPercentage ? `${val.toFixed(2)}%` : val.toFixed(2)),
      },
    },
    title: {
      text: title,
      align: "left",
    },
  });

  return (
    <div>
      {/* Chart Section */}
      <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-6 mb-6">
        <div className="w-full lg:w-[50%]">
          <Box>
            <ApexChart
              options={getChartOptions("KPIs", true) as any}
              series={formatSeries(indicators)}
              type="line"
              height={400}
            />
          </Box>
        </div>
        <div className="w-full lg:w-[50%]">
          <Box>
            <ApexChart
              options={getChartOptions("Ratios", false) as any}
              series={formatSeries(ratios)}
              type="line"
              height={400}
            />
          </Box>
        </div>
      </div>

      {/* <IncomeTable organizationId={organizationId} /> */}
      <FinancialIndicatorsTable organizationId={organizationId} />
    </div>
  );
};

export default PerformanceIndicatorTable;
