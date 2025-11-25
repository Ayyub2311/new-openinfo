"use client";

import { useEffect, useState } from "react";
import Container from "@/app/shared/ui/components/Container";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { Table } from "@/app/shared/ui/components/Table";
import type { TableColumn } from "@/app/shared/ui/components/Table/types";
import { useTranslations } from "next-intl";
import Link from "next/link";

import FormatNumbers from "@/app/shared/format-number";
import { Text } from "@/app/shared/ui/components/Typography/Text";

interface ScreenerRow {
  id: number;
  ticker: string;
  short_name_text: string;
  isu_cd: string;
  market_cap: number;
  ttm_earnings: number;
  price_to_earnings: number;
  price_to_book: number;
  ttm_cutoff: string;
  advanced_kpis: {
    return_on_equity: number | string;
    return_on_assets: number | string;
    net_margin: number | string;
    debt_to_equity_ratio: number | string;
    total_equity: number | string;
  };
  trading_statistics: {
    volume_7_day: number;
    volume_1_month: number;
    volume_1_year: number;
    month_over_month_percent: string;
    year_over_year_percent: string;
    year_to_date_percent: string;
  };
}

const MarketScreenerTable = () => {
  const [originalData, setOriginalData] = useState<ScreenerRow[]>([]);
  const [filteredData, setFilteredData] = useState<ScreenerRow[]>([]);
  const [sortKey, setSortKey] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState("");
  const [viewMode, setViewMode] = useState<"basic" | "advanced" | "trading">("basic");

  const t = useTranslations("MarketScreener") as (key: string) => string;
  const tCommon = useTranslations() as (key: string) => string;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await FetchService.fetch<{ results: ScreenerRow[] }>("/api/v2/organizations/market-screener/");
        if (res?.results) {
          setOriginalData(res.results);
          setFilteredData(res.results);
        }
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    const lower = value.toLowerCase();
    const filtered = originalData.filter(
      row =>
        row.short_name_text.toLowerCase().includes(lower) ||
        row.ticker.toLowerCase().includes(lower) ||
        row.isu_cd.toLowerCase().includes(lower)
    );
    setFilteredData(filtered);
  };

  const handleSort = (key: string) => {
    if (key === sortKey) {
      if (sortOrder === "desc") {
        setSortOrder("asc");
      } else if (sortOrder === "asc") {
        setSortKey(undefined);
        setSortOrder(undefined);
      }
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const getValue = (row: ScreenerRow, key: string) => {
    if (key.startsWith("advanced_kpis.")) {
      return (row.advanced_kpis as any)[key.replace("advanced_kpis.", "")];
    } else if (key.startsWith("trading_statistics.")) {
      return (row.trading_statistics as any)[key.replace("trading_statistics.", "")];
    }
    return (row as any)[key];
  };

  const sortedData =
    sortKey && sortOrder
      ? [...filteredData].sort((a, b) => {
          const aVal = getValue(a, sortKey);
          const bVal = getValue(b, sortKey);

          if (aVal == null) return 1;
          if (bVal == null) return -1;

          if (typeof aVal === "string") {
            return sortOrder === "asc" ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
          }

          return sortOrder === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
        })
      : filteredData;

  const renderSortableHeader = (label: string, key: string) => (
    <div onClick={() => handleSort(key)} className="cursor-pointer">
      {label} {sortKey === key && <span className="text-xs text-gray-600">{sortOrder === "asc" ? "↑" : "↓"}</span>}
    </div>
  );

  const baseColumns: TableColumn<ScreenerRow>[] = [
    {
      title: renderSortableHeader(t("ticker"), "ticker"),
      dataIndex: "ticker",
      render: (value: string) => value,
    },
    {
      title: renderSortableHeader(t("short_name_text"), "short_name_text"),
      dataIndex: "short_name_text",
      render: (_, record) => (
        <Link href={`/organizations/${record.id}`}>
          <Text variant="primary">{record.short_name_text}</Text>
        </Link>
      ),
    },
    {
      title: renderSortableHeader(t("market_cap"), "market_cap"),
      dataIndex: "market_cap",
      render: (value: number) => <FormatNumbers value={value} />,
    },
    {
      title: renderSortableHeader(t("ttm_earnings"), "ttm_earnings"),
      dataIndex: "ttm_earnings",
      render: (value: number) => <FormatNumbers value={value} />,
    },
    {
      title: renderSortableHeader(t("price_to_earnings"), "price_to_earnings"),
      dataIndex: "price_to_earnings",
      render: (value: number) => <FormatNumbers value={value} />,
    },
    {
      title: renderSortableHeader(t("price_to_book"), "price_to_book"),
      dataIndex: "price_to_book",
      render: (value: number) => <FormatNumbers value={value} />,
    },
    {
      title: t("ttm_cutoff"),
      dataIndex: "ttm_cutoff",
      render: (value: string, record) => {
        const isPositive = record.ttm_earnings > 0;
        return (
          <span className="inline-flex items-center gap-2 text-sm">
            <span className={`w-2 h-2 rounded-full ${isPositive ? "bg-green-500" : "bg-red-500"}`} />
            {value}
          </span>
        );
      },
    },
  ];

  const advancedColumns: TableColumn<ScreenerRow>[] = [
    {
      title: renderSortableHeader("ROE", "advanced_kpis.return_on_equity"),
      dataIndex: "advanced_kpis.return_on_equity",
      render: (_, row) => `${row.advanced_kpis.return_on_equity}%`,
    },
    {
      title: renderSortableHeader("ROA", "advanced_kpis.return_on_assets"),
      dataIndex: "advanced_kpis.return_on_assets",
      render: (_, row) => `${row.advanced_kpis.return_on_assets}%`,
    },
    {
      title: renderSortableHeader("Net Margin", "advanced_kpis.net_margin"),
      dataIndex: "advanced_kpis.net_margin",
      render: (_, row) => `${row.advanced_kpis.net_margin}%`,
    },
    {
      title: renderSortableHeader("D/E Ratio", "advanced_kpis.debt_to_equity_ratio"),
      dataIndex: "advanced_kpis.debt_to_equity_ratio",
      render: (_, row) => `${row.advanced_kpis.debt_to_equity_ratio}%`,
    },
    {
      title: renderSortableHeader("Total Equity", "advanced_kpis.total_equity"),
      dataIndex: "advanced_kpis.total_equity",
      render: (_, row) => <FormatNumbers value={Number(row.advanced_kpis.total_equity)} />,
    },
  ];

  const tradingColumns: TableColumn<ScreenerRow>[] = [
    {
      title: renderSortableHeader("Volume 7d", "trading_statistics.volume_7_day"),
      dataIndex: "trading_statistics.volume_7_day",
      render: (_, row) => <FormatNumbers value={row.trading_statistics.volume_7_day} />,
    },
    {
      title: renderSortableHeader("Volume 1m", "trading_statistics.volume_1_month"),
      dataIndex: "trading_statistics.volume_1_month",
      render: (_, row) => <FormatNumbers value={row.trading_statistics.volume_1_month} />,
    },
    {
      title: renderSortableHeader("Volume 1y", "trading_statistics.volume_1_year"),
      dataIndex: "trading_statistics.volume_1_year",
      render: (_, row) => <FormatNumbers value={row.trading_statistics.volume_1_year} />,
    },
    {
      title: renderSortableHeader("MoM %", "trading_statistics.month_over_month_percent"),
      dataIndex: "trading_statistics.month_over_month_percent",
      render: (_, row) => (
        <span
          className={Number(row.trading_statistics.month_over_month_percent) < 0 ? "text-red-500" : "text-green-600"}
        >
          {row.trading_statistics.month_over_month_percent}%
        </span>
      ),
    },
    {
      title: renderSortableHeader("YoY %", "trading_statistics.year_over_year_percent"),
      dataIndex: "trading_statistics.year_over_year_percent",
      render: (_, row) => (
        <span className={Number(row.trading_statistics.year_over_year_percent) < 0 ? "text-red-500" : "text-green-600"}>
          {row.trading_statistics.year_over_year_percent}%
        </span>
      ),
    },
    {
      title: renderSortableHeader("YtD %", "trading_statistics.year_to_date_percent"),
      dataIndex: "trading_statistics.year_to_date_percent",
      render: (_, row) => (
        <span className={Number(row.trading_statistics.year_to_date_percent) < 0 ? "text-red-500" : "text-green-600"}>
          {row.trading_statistics.year_to_date_percent}%
        </span>
      ),
    },
  ];

  const columns =
    viewMode === "basic"
      ? baseColumns
      : viewMode === "advanced"
        ? [...baseColumns.slice(0, 2), ...advancedColumns]
        : [...baseColumns.slice(0, 2), ...tradingColumns];

  return (
    <Container className="p-4">
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder={tCommon("filters.placeholder_search")}
            value={searchInput}
            onChange={e => handleSearchChange(e.target.value)}
            className="w-full sm:w-96 h-10 pl-5 pr-12 rounded-full border"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("basic")}
              className={`px-4 py-1.5 rounded-full text-sm ${viewMode === "basic" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              Basic KPIs
            </button>
            <button
              onClick={() => setViewMode("advanced")}
              className={`px-4 py-1.5 rounded-full text-sm ${viewMode === "advanced" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              Advanced KPIs
            </button>
            <button
              onClick={() => setViewMode("trading")}
              className={`px-4 py-1.5 rounded-full text-sm ${viewMode === "trading" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              Trading Statistics
            </button>
          </div>
        </div>
        <Table
          loading={loading}
          bordered={false}
          columns={columns}
          data={sortedData}
          className="w-full overflow-auto"
          rowClassName="hover:bg-gray-50"
        />
        <div className="px-4 py-3 bg-gray-50 border-t">
          <p className="text-sm text-gray-600">{t("found")}</p>
        </div>
      </div>
    </Container>
  );
};

export default MarketScreenerTable;
