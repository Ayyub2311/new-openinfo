import { FetchService } from "@/app/shared/lib/api/fetch.service";
import React, { useEffect, useState } from "react";
import { AreaLineChart } from "./CustomAreaLineChart";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

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

const UCIChart: React.FC = () => {
  const t = useTranslations();
  const [data, setData] = useState<PriceIndicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await FetchService.fetch<PriceIndicesResponse>("/api/v2/iuzse/price-indices/");
        setData(response);
      } catch (err) {
        setError(t("UCIChart.fetch_error"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

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

  const chartData = data.indices.map(item => ({
    label: new Date(item.calc_tm).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: item.idx,
  }));

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
        <AreaLineChart data={chartData} className="w-full h-full" />
      </div>
    </div>
  );
};

export default UCIChart;
