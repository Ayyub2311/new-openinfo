"use client"
import React, { useState, useEffect, useCallback } from "react";
import Tabs from "@/app/shared/ui/components/Tabs";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { Table } from "./CustomInteractiveTable";
import { cn } from "@/app/shared/lib/utils/cn";
import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { Button } from "@/app/shared/ui/components/Button";
import { ChevronDown } from "lucide-react";

interface StockData {
  isin_code: string;
  ticker: string;
  trade_price: number;
  change: number;
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
  label: number;
  value: number;
}

const StockOverviewCombined = () => {
  const locale = useLocale();
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("1W");
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [displayedStocks, setDisplayedStocks] = useState<StockData[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState({ table: true, chart: true });
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const DEFAULT_DISPLAY_COUNT = 5;



  // const formatdate = (timestamp: number, tab: string) => {
  //   const date = new Date(timestamp);
  //   return new Intl.DateTimeFormat(locale, {
  //     day: "2-digit",
  //     month: "short",
  //     year: "2-digit",
  //     weekday: undefined,
  //   }).format(date);
  // }

  const ApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
  }) as unknown as React.FC<{
    options: ApexOptions;
    series: any;
    type: string;
    height?: number;
    width?: number;
  }>
  type LocaleKey = "ru" | "uz";

  const MONTH_TRANSLATIONS: Record<LocaleKey, Record<string, string>> = {

    ru: {
      Jan: "Янв",
      Feb: "Фев",
      Mar: "Мар",
      Apr: "Апр",
      May: "Май",
      Jun: "Июн",
      Jul: "Июл",
      Aug: "Авг",
      Sep: "Сен",
      Oct: "Окт",
      Nov: "Ноя",
      Dec: "Дек",
    },
    uz: {
      Jan: "Yan",
      Feb: "Fev",
      Mar: "Mar",
      Apr: "Apr",
      May: "May",
      Jun: "Iyun",
      Jul: "Iyul",
      Aug: "Avg",
      Sep: "Sen",
      Oct: "Okt",
      Nov: "Noy",
      Dec: "Dek",
    },
  };

  const formatIssuerName = (issuerString: string) => {
    if (!issuerString) return "";
    const match = issuerString.match(/<([^>]+)>/);
    return match ? match[1] : issuerString;
  };

  const formatChartLabel = (timestamp: number, tab: string) => {
    const d = new Date(timestamp);
    const day = d.getDate();
    const year = String(d.getFullYear()).slice(2);

    const monthEng = d.toLocaleString("en-US", { month: "short" });
    const monthShort = MONTH_TRANSLATIONS[locale as "ru" | "uz"]?.[monthEng] ?? monthEng;

    if (tab === "1W" || tab === "1M") {
      return `${day} ${monthShort}`;
    }

    return `${day} ${monthShort} '${year}`;
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

  const chartOptions: ApexOptions = {
    chart: { id: "stock-area", type: "area", zoom: { autoScaleYaxis: true }, toolbar: { show: true } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      type: "datetime",
      labels: {
        formatter: (value) => formatChartLabel(Number(value), activeTab),
      }
    },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.9, stops: [0, 100] },
    },
    markers: { size: 0, hover: { size: 6 } },
    colors: ["#3B82F6"],
    tooltip: {
      x: {
        formatter: (value) => {
          const d = new Date(Number(value));
          const day = d.getDate();
          const year = String(d.getFullYear());

          const monthEng = d.toLocaleString("en-US", { month: "short" });
          const monthShort = MONTH_TRANSLATIONS[locale as "ru" | "uz"]?.[monthEng] ?? monthEng;

          return `${day} ${monthShort} ${year}`;
        }
      },
      y: { formatter: (v: number) => v.toFixed(2) },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(prev => ({ ...prev, table: true }));
      try {
        const response = await FetchService.fetch<ApiResponse>(
          "/api/v2/iuzse/stock-screener/?mkt_id=BND&page_size=100"
        );


        if (response && response.results) {

          const sortedResults = [...response.results].sort((a, b) => a.ticker.localeCompare(b.ticker));

          setStocks(sortedResults);

          const baseData = sortedResults.slice(0, DEFAULT_DISPLAY_COUNT);
          setDisplayedStocks(sortData()(baseData));

          setSelectedStock(sortedResults[0]);
          setShowAll(false);
        }
      } catch (err) {
        console.error("Error fetching stock data:", err);
      } finally {
        setLoading(prev => ({ ...prev, table: false }));
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    if (!selectedStock) return;

    const fetchHistoricalData = async () => {
      try {
        setLoading(prev => ({ ...prev, chart: true }));

        const endDate = new Date();
        const startDate = new Date();

        switch (activeTab) {
          case "1W":
            startDate.setDate(endDate.getDate() - 7);
            break;
          case "1M":
            startDate.setMonth(endDate.getMonth() - 1);
            break;
          case "6M":
            startDate.setMonth(endDate.getMonth() - 6);
            break;
          case "1Y":
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;
        }

        const startStr = startDate.toISOString().split("T")[0];
        const endStr = endDate.toISOString().split("T")[0];

        const endpoint = `/api/v2/iuzse/conclusions/?isu_cd=${selectedStock.isin_code}&start_date=${startStr}&end_date=${endStr}`;

        const response = await FetchService.fetch<{ results: any[] }>(endpoint);

        const aggregated: Record<string, number> = {};
        response.results
          .filter(item => item.close && item.close > 0)
          .forEach(item => {
            const dayKey = new Date(item.date).toISOString().split("T")[0];
            aggregated[dayKey] = Number(item.close.toFixed(2));
          });

        const formatted: [number, number][] = response.results
          .filter(item => item.close && item.close > 0)
          .map<[number, number]>(item => [
            new Date(item.date).getTime(),
            Number(item.close.toFixed(2)),
          ])
          .reverse();


        setChartData(formatted.map(([X, y]): ChartDataPoint => ({ label: X, value: y })));
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(prev => ({ ...prev, chart: false }));
      }
    };

    fetchHistoricalData();
  }, [selectedStock, activeTab]);

  const handleRowClick = useCallback((record: StockData) => {
    setSelectedStock(record);
  }, []);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };


  useEffect(() => {
    const baseData = showAll ? stocks : stocks.slice(0, DEFAULT_DISPLAY_COUNT);
    setDisplayedStocks(sortData()(baseData));
  }, [showAll, stocks, sortColumn, sortDirection, sortData]);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <div className="flex flex-col gap-6 justify-start items-start mb-4">
          <div className="mr-4">
            <h2 className="text-xl font-semibold text-gray-700">
              {selectedStock ? `${formatIssuerName(selectedStock.issuer_short_name ?? "")}` : t("Sidebar.SelectBond")}
            </h2>
          </div>
          <div className="w-full overflow-x-auto">
            <Tabs
              tabs={["1W", "1M", "6M", "1Y"].map(id => ({ id, label: t(`StockTabs.${id}` as any) }))}
              onChange={setActiveTab}
              variant="pill"
              tabGap="gap-4 xl:gap-0"
            />
          </div>
        </div>
        <div className="w-full h-64 flex items-center justify-center">
          {loading.chart ? (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          ) : (


            <div className="w-full">
              <ApexChart
                options={chartOptions}
                series={[
                  {
                    name: t("SecuritiesTableSidebar.price"),
                    data: chartData.map(d => [d.label, d.value]),
                  },
                ]}
                type="area"
                height={250}
              />
            </div>

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
