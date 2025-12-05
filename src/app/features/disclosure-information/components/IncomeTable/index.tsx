"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Box from "@/app/shared/ui/components/Box";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { useTranslations } from "next-intl";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { IncomeTable as IncTable } from "./IncomeTable";

interface FinancialData {
  reporting_year: number;
  net_profit?: number;
  net_revenue?: number;
  total_assets?: number;
  total_liabilites?: number;
  return_on_assets?: number;
  return_on_equity?: number;
  cost_of_risk?: number;
}

interface Props {
  organizationId: string;
}

export const IncomeTable = ({ organizationId }: Props) => {
  const t = useTranslations();
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await FetchService.fetch<{ results: FinancialData[] }>(
          `/api/v2/reports/financial_indicators/?organization_id=${organizationId}`
        );
        setFinancialData(response.results || []);
      } catch (err) {
        console.error("Error fetching financial data:", err);
        setError("Ошибка загрузки данных");
      }
    };

    fetchData();
  }, [organizationId]);

  const years = useMemo(
    () => [...new Set(financialData.map(item => item.reporting_year))].sort((a, b) => a - b),
    [financialData]
  );

  const formatBarSeries = [
    {
      name: t("IncomeTable.netProfit"),
      data: years.map(year => {
        const item = financialData.find(d => d.reporting_year === year);
        return item?.net_profit ?? 0;
      }),
    },
    {
      name: t("IncomeTable.netRevenue"),
      data: years.map(year => {
        const item = financialData.find(d => d.reporting_year === year);
        return item?.net_revenue ?? 0;
      }),
    },
  ];

  const formatLineSeries = [
    {
      name: t("IncomeTable.totalAssets"),
      data: years.map(year => {
        const item = financialData.find(d => d.reporting_year === year);
        return item?.total_assets ?? 0;
      }),
    },
    {
      name: t("IncomeTable.totalLiabilities"),
      data: years.map(year => {
        const item = financialData.find(d => d.reporting_year === year);
        return item?.total_liabilites ?? 0;
      }),
    },
  ];

  const chartBarOptions = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: years.map(String),
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${(val / 1_000_000_000).toFixed(1)} ${t("IncomeTable.billion")}`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
    colors: ["#3B82F6", "#10B981"],
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toLocaleString()} UZS`,
      },
    },
  };

  const chartLineOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 4,
    },
    markers: {
      size: 4,
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${(val / 1_000_000_000).toFixed(2)} ${t("IncomeTable.billion")}`,
      background: {
        enabled: true,
        borderRadius: 6,
      },
    },
    xaxis: {
      categories: years.map(String),
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${(val / 1_000_000_000).toFixed(1)} ${t("IncomeTable.billion")}`,
      },
    },
    colors: ["#6366F1", "#1F2937"],
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toLocaleString()} UZS`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
  };

  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* Charts */}
      <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-6 mb-6">
        {/* Bar Chart */}
        <div className="w-full lg:w-[50%]">
          <Box>
            {/* TODO: option type ni fix qilish kerak */}
            <ApexChart options={chartBarOptions as any} series={formatBarSeries} type="bar" height={400} />
          </Box>
        </div>

        {/* Line Chart */}
        <div className="w-full lg:w-[50%]">
          <Box>
            {/* TODO: option type ni fix qilish kerak */}
            <ApexChart options={chartLineOptions as any} series={formatLineSeries} type="line" height={400} />
          </Box>
        </div>
      </div>

      <IncTable organizationId={organizationId} />
    </div>
  );
};

export default IncomeTable;
