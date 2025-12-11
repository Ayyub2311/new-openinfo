"use client"

import { FetchService } from "@/app/shared/lib/api/fetch.service";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface PriceIndex {
  calc_tm: string;
  idx: number;
}

interface PriceIndicesResponse {
  last_index: {
    last_date: string;
    idx: number;
  };
  indices: PriceIndex[];
}

interface ChartDataPoint {
  label: number;
  value: number;
}

const MONTH_TRANSLATIONS: Record<string, Record<string, string>> = {
  ru: { Jan: "Янв", Feb: "Фев", Mar: "Мар", Apr: "Апр", May: "Май", Jun: "Июн", Jul: "Июл", Aug: "Авг", Sep: "Сен", Oct: "Окт", Nov: "Ноя", Dec: "Дек" },
  uz: { Jan: "Yan", Feb: "Fev", Mar: "Mar", Apr: "Apr", May: "May", Jun: "Iyun", Jul: "Iyul", Aug: "Avg", Sep: "Sen", Oct: "Okt", Nov: "Noy", Dec: "Dek" },
};

const UCIChart: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations();

  const [data, setData] = useState<PriceIndicesResponse | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false }) as unknown as React.FC<{
    options: any;
    series: any;
    type: string;
    height?: number;
  }>;

  const formatChartLabel = (timestamp: number) => {
    const d = new Date(timestamp);
    const day = d.getDate();
    const monthEng = d.toLocaleString("en-US", { month: "short" });
    const monthShort = MONTH_TRANSLATIONS[locale as "ru" | "uz"]?.[monthEng] ?? monthEng;
    return `${day} ${monthShort}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await FetchService.fetch<PriceIndicesResponse>("/api/v2/iuzse/price-indices/");
        setData(response);
        setChartData(
          response.indices.map(item => ({
            label: new Date(item.calc_tm).getTime(),
            value: item.idx,
          }))
        );
      } catch (err) {
        console.error(err);
        setError(t("UCIChart.fetch_error"));

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const chartOptions = {
    chart: { id: "uci-area", type: "area", zoom: { autoScaleYaxis: true }, toolbar: { show: true } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      type: "datetime",
      labels: { formatter: (value: number) => formatChartLabel(Number(value)) },
    },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.9 } },
    markers: { size: 0, hover: { size: 6 } },
    colors: ["#8B5CF6"],
    tooltip: {
      x: {
        formatter: (value: number) => {
          const d = new Date(Number(value));
          const day = d.getDate();
          const year = d.getFullYear();
          const monthEng = d.toLocaleString("en-US", { month: "short" });
          const monthShort = MONTH_TRANSLATIONS[locale as "ru" | "uz"]?.[monthEng] ?? monthEng;
          return `${day} ${monthShort} ${year}`;
        },
      },
      y: { formatter: (v: number) => v.toFixed(2) },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-indigo-600 w-10 h-10" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border-l-4 border-red-500 p-3 text-sm text-red-700 flex items-center gap-2 rounded-xl shadow-md"
      >
        <AlertCircle className="w-5 h-5 text-red-500" />
        {error}
      </motion.div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white p-6 w-full mx-auto  border-default">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          <img src="/assets/general-icons/chart-up.svg" className="w-6 h-6 inline align-text-top mt-1 mr-2" />
          {t("UCIChart.title")}
        </h2>
        <p className="text-sm text-gray-600 mt-2">{t("UCIChart.description")}</p>
        <div className="mt-4">
          <p className="text-sm text-gray-700">
            {t("UCIChart.last_updated")}: {new Date(data.last_index.last_date).toLocaleDateString()}
          </p>
          <p className="pt-4 text-xl font-semibold text-indigo-600">
            {t("UCIChart.current_index")}: {data.last_index.idx.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <ApexChart
          options={chartOptions}
          series={[{ name: t("UCIChart.current_index"), data: chartData.map(d => [d.label, d.value]) }]}
          type="area"
          height={250}
        />
      </div>
    </div>
  );
};

export default UCIChart;
