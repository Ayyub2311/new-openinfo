"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table } from "@/app/shared/ui/components/Table";
import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { useTranslations } from "next-intl";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { Pagination } from "@/app/shared/ui/components/Pagination";
import { Text } from "@/app/shared/ui/components/Typography/Text";
import { ConvertTypes } from "@/app/features/facts/models/base/ConvertTypes";
import Image from "next/image";

interface DividendItem {
  id: number;
  organization: string;
  decision_date: string;
  link: string;
  bond_amount: number;
  bond_percent: string;
  bond_start_date: string;
  bond_end_date: string;
  common_share_amount: number;
  common_share_percent: string;
  common_share_start_date: string;
  common_share_end_date: string;
  priviliged_share_amount: number;
  priviliged_share_percent: string;
  priviliged_share_start_date: string;
  priviliged_share_end_date: string;
}

type DividendType = "simple" | "privileged" | "bond";
const converter = new ConvertTypes();

interface ApiResponse {
  count: number;
  total_pages: number;
  page_size: number;
  current_page: number;
  previous: string | null;
  next: string | null;
  results: DividendItem[];
}

export default function DividendCalendarTable() {
  const [data, setData] = useState<DividendItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<DividendType>("simple");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
  });
  const t = useTranslations();

  const typeOptions = useMemo(
    () => [
      { value: "simple", label: t("DividendTable.ordinary") },
      { value: "privileged", label: t("DividendTable.preferred") },
      { value: "bond", label: t("DividendTable.bond") },
    ],
    [t]
  );

  const fetchData = useCallback(
    async (page = 1, stockType: DividendType = type) => {
      setLoading(true);
      try {
        const res = await FetchService.fetch<ApiResponse>(
          `api/v2/disclosure/dividend-calendar/?stock_type=${stockType}&page=${page}&search=&ordering=`
        );
        setData(res.results || []);
        setPagination({
          currentPage: res.current_page,
          totalPages: res.total_pages,
          pageSize: res.page_size,
          totalItems: res.count,
        });
      } catch (error) {
        console.error("Failed to load dividend calendar:", error);
      } finally {
        setLoading(false);
      }
    },
    [type]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTypeChange = (newType: DividendType) => {
    setType(newType);
    fetchData(1, newType);
  };

  const handlePageChange = (page: number) => {
    fetchData(page, type);
  };

  const columns = useMemo<TableColumn<DividendItem>[]>(
    () => [
      {
        title: t("DividendTable.issuer_name"),
        dataIndex: "organization",
        render: (_, record) => (
          <a href={record.link} target="_blank" rel="noopener noreferrer">
            <Text variant="accent">{record.organization}</Text>
          </a>
        ),
      },
      {
        title: t("DividendTable.decision_date"),
        dataIndex: "decision_date",
        align: "right",
        render: (_, record) => converter.formatDate(record.decision_date),
      },
      {
        title: t("DividendTable.amount"),
        dataIndex: "amount",
        align: "right",
        render: (_, record) => {
          const amount =
            type === "simple"
              ? record.common_share_amount
              : type === "privileged"
                ? record.priviliged_share_amount
                : record.bond_amount;
          return amount.toLocaleString("ru-RU");
        },
      },
      {
        title: t("DividendTable.percent"),
        dataIndex: "percent",
        align: "right",
        render: (_, record) => {
          const percent =
            type === "simple"
              ? record.common_share_percent
              : type === "privileged"
                ? record.priviliged_share_percent
                : record.bond_percent;
          return percent;
        },
      },
      ...(type === "bond"
        ? [
            {
              title: t("DividendTable.annual_interest"),
              dataIndex: "annual_interest",
              align: "right" as const, // ✅ fix
            },
          ]
        : []),

      {
        title: t("DividendTable.start_date"),
        dataIndex: "start_date",
        align: "right",
        render: (_, record) => {
          const date =
            type === "simple"
              ? record.common_share_start_date
              : type === "privileged"
                ? record.priviliged_share_start_date
                : record.bond_start_date;
          return converter.formatDate(date) || "-";
        },
      },
      {
        title: t("DividendTable.end_date"),
        dataIndex: "end_date",
        align: "right",
        render: (_, record) => {
          const date =
            type === "simple"
              ? record.common_share_end_date
              : type === "privileged"
                ? record.priviliged_share_end_date
                : record.bond_end_date;
          return converter.formatDate(date) || "-";
        },
      },
    ],
    [type, t]
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2 overflow-auto">
          {typeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleTypeChange(option.value as DividendType)}
              className={`px-4 py-2 rounded-full text-sm transition-all border text-nowrap border-gray-300 ${
                type === option.value ? "bg-blue-500 text-white border-blue-500" : "text-blue-700 hover:bg-blue-100"
              }`}
            >
              {option.label}
            </button>
          ))}
          <a
            href={`/disclosure/dividend-calendar/download-excel/?stock_type=${type}&search=`}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-gray-300 text-blue-700 hover:border-blue-500 transition-all"
            download
            target="_blank"
          >
            {t("DividendTable.download")}
            <Image
              src="/assets/general-icons/excel-icon2.svg"
              alt="Excel icon"
              className="w-4 h-4"
              width={40}
              height={40}
            />
          </a>
        </div>
      </div>

      <Table columns={columns} data={data} loading={loading} bordered={false} />

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
