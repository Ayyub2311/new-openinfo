"use client";

import { useState, useEffect, useMemo } from "react";
import { Table } from "@/app/shared/ui/components/Table";
import { Text } from "@/app/shared/ui/components/Typography/Text/Text";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { ConvertTypes } from "@/app/features/facts/models/base/ConvertTypes";
import { Pagination } from "@/app/shared/ui/components/Pagination";
import { useTranslations } from "next-intl";

interface DividendData {
  id: number;
  pub_date: string;
  common_share_percent?: string;
  common_share_amount?: number;
  priviliged_share_percent?: string;
  priviliged_share_amount?: number;
  bond_percent?: string;
  bond_amount?: number;
}

interface DividendTableProps {
  stockType: "common" | "privileged" | "bond";
  id: string | string[];
}

export const DividendTable = ({ stockType, id }: DividendTableProps) => {
  const [data, setData] = useState<DividendData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
  });

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const converter = useMemo(() => new ConvertTypes(), []);
  const NOT_EXIST_DATE = "-";

  useEffect(() => {
    const fetchData = async (page = 1) => {
      setLoading(true);
      try {
        const response = await FetchService.fetch<{
          results: DividendData[];
          count: number;
          total_pages: number;
          page_size: number;
          current_page: number;
        }>(`/api/v2/disclosure/dividend-calendar/?organization_id=${id}&stock_type=${stockType}&page=${page}`);
        setData(response.results || []);
        setPagination({
          currentPage: response.current_page,
          totalPages: response.total_pages,
          pageSize: response.page_size,
          totalItems: response.count,
        });
      } catch (err) {
        console.error("Error fetching dividends:", err);
        setError("Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stockType, id]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: "#",
        dataIndex: "order",
        key: "order",
        align: "center" as const,
        width: 50,
        render: (_: any, __: any, index: number) => (
          <span>{(pagination.currentPage - 1) * pagination.pageSize + index + 1}</span>
        ),
      },
      {
        title: t("profile_emitents.date"),
        dataIndex: "pub_date",
        key: "id",
        render: (v: string) => <Text weight="bold">{converter.formatDate(v) || NOT_EXIST_DATE}</Text>,
      },
    ];

    let stockColumns = [];

    if (stockType === "common") {
      stockColumns = [
        {
          title: t("profile_emitents.amount"),
          dataIndex: "common_share_amount",
          key: "common_share_amount",
          render: (value: number | undefined) => (value ? `${value} uzs` : "-"),
        },
        {
          title: t("profile_emitents.profitability"),
          dataIndex: "common_share_percent",
          key: "common_share_percent",
          align: "right" as const,
          render: (value: string | undefined) => (value ? `${value}%` : "-"),
        },
      ];
    } else if (stockType === "privileged") {
      stockColumns = [
        {
          title: t("profile_emitents.amount"),
          dataIndex: "priviliged_share_amount",
          key: "priviliged_share_amount",
          render: (value: number | undefined) => (value ? `${value} uzs` : "-"),
        },
        {
          title: t("profile_emitents.profitability"),
          dataIndex: "priviliged_share_percent",
          key: "priviliged_share_percent",
          align: "right" as const,
          render: (value: string | undefined) => (value ? `${value}%` : "-"),
        },
      ];
    } else if (stockType === "bond") {
      stockColumns = [
        {
          title: t("profile_emitents.amount"),
          dataIndex: "bond_amount",
          key: "bond_amount",
          render: (value: number | undefined) => (value ? `${value} uzs` : "-"),
        },
        {
          title: t("profile_emitents.profitability"),
          dataIndex: "bond_percent",
          key: "bond_percent",
          align: "right" as const,
          render: (value: string | undefined) => (value ? `${value}%` : "-"),
        },
      ];
    }

    return [...baseColumns, ...stockColumns];
  }, [converter, pagination.currentPage, pagination.pageSize, stockType, t]);

  const tableData = useMemo(
    () =>
      data.map(item => ({
        key: item.id.toString(),
        pub_date: item.pub_date,
        common_share_amount: item.common_share_amount ?? "-",
        common_share_percent: item.common_share_percent ?? "-",
        priviliged_share_amount: item.priviliged_share_amount ?? "-",
        priviliged_share_percent: item.priviliged_share_percent ?? "-",
        bond_amount: item.bond_amount ?? "-",
        bond_percent: item.bond_percent ?? "-",
      })),
    [data]
  );

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Table bordered={false} columns={columns} data={tableData} />
      <div className="mt-4">
        <Pagination
          totalItems={pagination.totalItems}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
