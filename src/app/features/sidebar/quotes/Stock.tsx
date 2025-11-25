import React, { useState, useEffect, useCallback } from "react";
import Tabs from "@/app/shared/ui/components/Tabs";
import { AreaLineChart } from "@/app/shared/charts/AreaLineChart";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { Table } from "./CustomInteractiveTable";
import { cn } from "@/app/shared/lib/utils/cn";
import { useTranslations } from "next-intl";
import { Button } from "@/app/shared/ui/components/Button";
import { ChevronDown } from "lucide-react";

interface StockData {
  isin_code: string;
  ticker: string;
  trade_price: number;
  change: number;
  parval: number;
  change_percent: number;
  trade_datetime: string;
  issuer_short_name?: string;
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

const StockOverviewCombined = () => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("1D");
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [displayedStocks, setDisplayedStocks] = useState<StockData[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState({ table: true, chart: true });
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const DEFAULT_DISPLAY_COUNT = 5;

  const formatIssuerName = (issuerString: string) => {
    if (!issuerString) return "";
    const match = issuerString.match(/<([^>]+)>/);
    return match ? match[1] : issuerString;
  };

  const sortData = useCallback(() => {
    return (data: StockData[]) => {
      if (!sortColumn) return data;
      return [...data].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortDirection === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    };
  }, [sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    const isSame = sortColumn === column;
    const direction = isSame && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
    const baseData = showAll ? stocks : stocks.slice(0, DEFAULT_DISPLAY_COUNT);
    setDisplayedStocks(sortData()(baseData));
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(prev => ({ ...prev, table: true }));
        const response = await FetchService.fetch<ApiResponse>(
          "/api/v2/iuzse/stock-screener/?mkt_id=STK&page_size=100"
        );
        if (response && response.results) {
          setStocks(response.results);
          const baseData = response.results.slice(0, DEFAULT_DISPLAY_COUNT);
          setDisplayedStocks(sortData()(baseData));
          setShowAll(false);
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
  }, [sortData]);

  useEffect(() => {
    const baseData = showAll ? stocks : stocks.slice(0, DEFAULT_DISPLAY_COUNT);
    setDisplayedStocks(sortData()(baseData));
  }, [showAll, stocks, sortColumn, sortDirection, sortData]);

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

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <div className="flex flex-col justify-start items-start mb-4">
          <div className="mr-4">
            <h2 className="text-xl font-semibold text-gray-700">
              {selectedStock ? `${formatIssuerName(selectedStock.issuer_short_name ?? "")}` : "Select a stock"}
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
        <p className="font-semibold text-gray-600">{t("UCIChart.uci-today")}:</p>
        <Table
          columns={[
            {
              dataIndex: "ticker",
              title: t("SecuritiesTableSidebar.ticker"),
              className: "font-semibold text-gray-700",
            },
            {
              dataIndex: "trade_price",
              title: (
                <div
                  className="flex items-center cursor-pointer select-none gap-1"
                  onClick={() => handleSort("trade_price")}
                >
                  {t("SecuritiesTableSidebar.price")}
                  <span className="text-xs text-gray-400">
                    <span
                      className={cn(
                        "inline-block",
                        sortColumn === "trade_price" && sortDirection === "asc" ? "text-black font-bold" : ""
                      )}
                    >
                      ↑
                    </span>
                    <span
                      className={cn(
                        "inline-block ml-0.5",
                        sortColumn === "trade_price" && sortDirection === "desc" ? "text-black font-bold" : ""
                      )}
                    >
                      ↓
                    </span>
                  </span>
                </div>
              ),
              align: "right",
              render: price => price.toLocaleString(),
            },

            {
              dataIndex: "change",
              title: (
                <div
                  className="flex items-center cursor-pointer select-none gap-1"
                  onClick={() => handleSort("change")}
                >
                  {t("SecuritiesTableSidebar.change")}
                  <span className="text-xs text-gray-400">
                    <span
                      className={cn(
                        "inline-block",
                        sortColumn === "change" && sortDirection === "asc" ? "text-black font-bold" : ""
                      )}
                    >
                      ↑
                    </span>
                    <span
                      className={cn(
                        "inline-block ml-0.5",
                        sortColumn === "change" && sortDirection === "desc" ? "text-black font-bold" : ""
                      )}
                    >
                      ↓
                    </span>
                  </span>
                </div>
              ),
              align: "right",
              render: value => (
                <span className={value < 0 ? "text-red-500" : "text-green-500"}>{value.toFixed(2)}</span>
              ),
            },

            {
              dataIndex: "change_percent",
              title: (
                <div
                  className="flex items-center cursor-pointer select-none gap-1"
                  onClick={() => handleSort("change_percent")}
                >
                  {t("SecuritiesTableSidebar.change_percent")}
                  <span className="text-xs text-gray-400">
                    <span
                      className={cn(
                        "inline-block",
                        sortColumn === "change_percent" && sortDirection === "asc" ? "text-black font-bold" : ""
                      )}
                    >
                      ↑
                    </span>
                    <span
                      className={cn(
                        "inline-block ml-0.5",
                        sortColumn === "change_percent" && sortDirection === "desc" ? "text-black font-bold" : ""
                      )}
                    >
                      ↓
                    </span>
                  </span>
                </div>
              ),
              align: "right",
              render: percent => (
                <span className={percent < 0 ? "text-red-500" : "text-green-500"}>
                  {percent > 0 ? "+" : ""}
                  {percent.toFixed(2)}%
                </span>
              ),
            },
          ]}
          data={displayedStocks}
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

        {stocks.length > DEFAULT_DISPLAY_COUNT && (
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={toggleShowAll} className="flex items-center gap-2">
              {showAll ? t("Actions.show_less") : t("Actions.show_more")}
              <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockOverviewCombined;
