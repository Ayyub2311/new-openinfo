"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Table } from "@/app/shared/ui/components/Table";
import { Text } from "@/app/shared/ui/components/Typography/Text/Text";
import Box from "@/app/shared/ui/components/Box";
import { FetchService } from "@/app/shared/lib/api/fetch.service";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TradeData {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  change: number;
  trading_volume: number;
  trading_value: number;
}

interface MonthlyTradeData {
  month: string;
  trading_volume: number;
  trading_value: number;
}

export const TradeTable = ({ tickerName }: any) => {
  const searchParams = useSearchParams();
  const isuCd = searchParams.get("isu_cd");

  const [dailyData, setDailyData] = useState<TradeData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyTradeData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Format helper for YYYY-MM-DD
  function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  const today = new Date();
  const pastDate = new Date();
  pastDate.setFullYear(today.getFullYear() - 3);

  const startDate = formatDate(pastDate); // e.g. 2022-08-28
  const endDate = formatDate(today); // e.g. 2025-08-28

  // Fetch table data (daily)
  useEffect(() => {
    if (!isuCd) return;

    const fetchDailyData = async () => {
      try {
        const response = await FetchService.fetch<{ results: TradeData[] }>(
          `/api/v2/iuzse/conclusions/?isu_cd=${isuCd}&start_date=${startDate}&end_date=${endDate}`
        );
        setDailyData(response.results || []);
      } catch (err) {
        console.error("Error fetching daily trade data:", err);
        setError("Ошибка загрузки данных таблицы");
      }
    };

    fetchDailyData();
  }, [endDate, isuCd, startDate]);

  // Fetch chart data (monthly)
  useEffect(() => {
    if (!isuCd) return;

    const fetchMonthlyData = async () => {
      try {
        const response = await FetchService.fetch<MonthlyTradeData[]>(
          `/api/v2/iuzse/conclusions-monthly/?isu_cd=${isuCd}`
        );
        setMonthlyData(response || []);
      } catch (err) {
        console.error("Error fetching monthly trade data:", err);
        setError("Ошибка загрузки данных для графиков");
      }
    };

    fetchMonthlyData();
  }, [isuCd]);

  const chartOptions = (title: string, unit: "UZS" | "Pcs") => ({
    chart: {
      type: "area",
      toolbar: { show: true },
      zoom: { enabled: true },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "straight",
      width: 2,
    },
    xaxis: {
      type: "datetime",
      labels: {
        format: "yyyy",
        style: { fontSize: "12px", colors: "#777" },
      },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => {
          if (unit === "UZS") {
            return val >= 1_000_000_000
              ? `${(val / 1_000_000_000).toFixed(1)} bn`
              : val >= 1_000_000
                ? `${(val / 1_000_000).toFixed(1)} m`
                : val.toLocaleString();
          }
          return val >= 1_000_000 ? `${(val / 1_000_000).toFixed(1)} m` : val.toLocaleString();
        },
      },
    },
    tooltip: {
      x: { format: "MMM yyyy" },
      y: {
        formatter: (val: number) => (unit === "UZS" ? `${val.toLocaleString()} UZS` : `${val.toLocaleString()} pcs`),
      },
    },
    title: {
      text: title,
      align: "left",
      style: { fontSize: "16px", fontWeight: 600 },
    },
  });

  if (!isuCd) return <div className="text-red-500">Missing ISU_CD in URL</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* Charts */}
      <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-6 mb-6">
        <div className="w-full lg:w-[50%]">
          <Box>
            {monthlyData.length > 0 ? (
              <ApexChart
                options={chartOptions(`${tickerName} volume (UZS)`, "UZS") as any}
                series={[
                  {
                    name: "Volume UZS monthly",
                    data: monthlyData.map(item => ({
                      x: new Date(item.month).toISOString(),
                      y: item.trading_value,
                    })),
                  },
                ]}
                type="area"
                height={400}
              />
            ) : (
              <div>No monthly trading data available</div>
            )}
          </Box>
        </div>
        <div className="w-full lg:w-[50%]">
          <Box>
            {monthlyData.length > 0 ? (
              <ApexChart
                options={chartOptions(`${tickerName} volume (Pcs)`, "Pcs") as any}
                series={[
                  {
                    name: "Volume Pcs monthly",
                    data: monthlyData.map(item => ({
                      x: new Date(item.month).toISOString(),
                      y: item.trading_volume,
                    })),
                  },
                ]}
                type="area"
                height={400}
              />
            ) : (
              <div>No monthly trading data available</div>
            )}
          </Box>
        </div>
      </div>

      {/* Table */}
      <Table
        bordered={false}
        className="max-h-[70vh] overflow-y-auto"
        columns={[
          {
            title: "Дата",
            dataIndex: "date",
            render: (v: string) => <Text weight="bold">{new Date(v).toLocaleDateString()}</Text>,
          },
          {
            title: "Closing Price",
            dataIndex: "close",
            align: "right",
          },
          {
            title: "Opening Price",
            dataIndex: "open",
            align: "right",
          },
          {
            title: "Volume Pcs",
            dataIndex: "trading_volume",
            align: "right",
          },
          {
            title: "Volume UZS",
            dataIndex: "trading_value",
            align: "right",
          },
        ]}
        data={dailyData.map((item, index) => ({
          key: index.toString(),
          date: item.date,
          close: item.close,
          open: item.open,
          trading_volume: item.trading_volume.toLocaleString(),
          trading_value: item.trading_value.toLocaleString(),
        }))}
      />
    </div>
  );
};
