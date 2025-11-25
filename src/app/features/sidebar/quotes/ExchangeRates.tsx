import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import ExchangeRatesTable from "./ExchangeRatesTable";

interface ExchangeRateData {
  id: number;
  Code: string;
  Ccy: string;
  CcyNm_RU: string;
  CcyNm_UZ: string;
  CcyNm_UZC: string;
  CcyNm_EN: string;
  Nominal: string;
  Rate: number;
  Diff: number;
  Date: string;
  logo: string;
}

const ExchangeRates = () => {
  const t = useTranslations();
  const [tableData, setTableData] = useState<ExchangeRateData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTradeData = async () => {
    try {
      setLoading(true);
      const response = await FetchService.fetch<ExchangeRateData[]>("/api/v2/home/exchange-rates/");

      if (!Array.isArray(response)) {
        throw new Error("Invalid response format");
      }

      const parsedData = response.map(item => ({
        ...item,
        Rate: Number(item.Rate),
        Diff: Number(item.Diff),
        change_percent: Number(item.Diff / item.Rate),
      }));

      setTableData(parsedData);
    } catch (error) {
      console.error("Error fetching trade data:", error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTradeData();
  }, []);

  return <ExchangeRatesTable tableData={tableData as any} loading={loading} t={t} />;
};

export default ExchangeRates;
