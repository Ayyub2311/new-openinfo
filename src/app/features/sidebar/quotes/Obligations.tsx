import React, { useState, useEffect } from "react";
import Tabs from "@/app/shared/ui/components/Tabs";
import { AreaLineChart } from "@/app/shared/charts/AreaLineChart";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { Table } from "./CustomInteractiveTable";
import { cn } from "@/app/shared/lib/utils/cn";
import { useTranslations } from "next-intl";

interface StockData {
  isin_code: string;
  ticker: string;
  trade_price: number;
  change: number;
  change_percent: number;
  trade_datetime: string;
  [key: string]: any;
}

interface ApiResponse {
  results: StockData[];
  count: number;
}

interface ChartDataPoint {
  label: string;
  value: number;
}

const BondOverviewCombined = () => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("1D");
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState({ table: true, chart: true });
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  const formatIssuerName = (issuerString: string) => {
    if (!issuerString) return "";
    const match = issuerString.match(/<([^>]+)>/);
    return match ? match[1] : issuerString;
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(prev => ({ ...prev, table: true }));
        const response = await FetchService.fetch<ApiResponse>(
          "/api/v2/iuzse/stock-screener/?mkt_id=BND&page_size=100"
        );
        if (response && response.results) {
          setStocks(response.results);
          if (response.results.length > 0) {
            setSelectedStock(response.results[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching stock data:", err);
      } finally {
        setLoading(prev => ({ ...prev, table: false }));
      }
    };
    fetchStockData();
  }, []);

  useEffect(() => {
    if (!selectedStock) return;
    setLoading(prev => ({ ...prev, chart: true }));

    const timeout = setTimeout(() => {
      const baseValue = selectedStock.trade_price;
      let data: ChartDataPoint[] = [];

      switch (activeTab) {
        case "1D":
          data = ["09:00", "12:00", "15:00", "18:00"].map(time => ({
            label: time,
            value: baseValue * (0.9 + Math.random() * 0.2),
          }));
          break;
        case "1W":
          data = ["Mon", "Tue", "Wed", "Thu", "Fri"].map(day => ({
            label: day,
            value: baseValue * (0.9 + Math.random() * 0.2),
          }));
          break;
        case "1M":
          data = Array.from({ length: 30 }, (_, i) => ({
            label: `${i + 1}`,
            value: baseValue * (0.8 + Math.random() * 0.4),
          }));
          break;
        case "6M":
          data = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(month => ({
            label: month,
            value: baseValue * (0.8 + Math.random() * 0.4),
          }));
          break;
        default:
          data = [{ label: selectedStock.ticker, value: baseValue }];
      }

      setChartData(data);
      setLoading(prev => ({ ...prev, chart: false }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [selectedStock, activeTab]);

  const handleRowClick = (record: StockData) => {
    setSelectedStock(record);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <div className="flex flex-col gap-6 justify-start items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              {selectedStock ? `${formatIssuerName(selectedStock.issuer_short_name)}` : "Select a stock"}
            </h2>
          </div>
          <div>
            <Tabs
              tabs={["1D", "1W", "1M", "6M"].map(id => ({ id, label: t(`StockTabs.${id}` as any) }))}
              onChange={setActiveTab}
            />
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          {loading.chart ? (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          ) : (
            <AreaLineChart data={chartData} height={250} />
          )}
        </div>
      </div>

      <div>
        <Table
          columns={[
            {
              dataIndex: "ticker",
              title: t("SecuritiesTableSidebar.ticker"),
              className: "font-semibold text-gray-700",
            },
            {
              dataIndex: "trade_price",
              title: t("SecuritiesTableSidebar.price"),
              align: "right",
              render: price => price.toLocaleString(),
            },
            {
              dataIndex: "change",
              title: t("SecuritiesTableSidebar.change"),
              align: "right",
              render: value => (
                <span className={value < 0 ? "text-red-500" : "text-green-500"}>{value.toFixed(2)}</span>
              ),
            },
            {
              dataIndex: "change_percent",
              title: t("SecuritiesTableSidebar.change_percent"),
              align: "right",
              render: percent => (
                <span className={percent < 0 ? "text-red-500" : "text-green-500"}>
                  {percent > 0 ? "+" : ""}
                  {percent.toFixed(2)}%
                </span>
              ),
            },
          ]}
          data={stocks}
          loading={loading.table}
          onRowClick={handleRowClick}
          rowClassName={record =>
            cn(
              "cursor-pointer transition duration-200 ease-in-out hover:bg-gray-100",
              selectedStock?.isin_code === record.isin_code ? "bg-blue-50" : ""
            )
          }
          bordered={false}
        />
      </div>
    </div>
  );
};

export default BondOverviewCombined;
