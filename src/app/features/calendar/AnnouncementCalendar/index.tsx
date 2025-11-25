"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Table } from "@/app/shared/ui/components/Table";
import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { useTranslations } from "next-intl";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { Pagination } from "@/app/shared/ui/components/Pagination";
import { Text } from "@/app/shared/ui/components/Typography/Text";
import { ConvertTypes } from "../../facts/models/base/ConvertTypes";

interface AnnouncementItem {
  id: number;
  organization_name: string;
  organization_id: number;
  title: string;
  pub_date: string;
  meeting_date: string | null;
  ticker?: string;
}

interface ApiResponse {
  count: number;
  total_pages: number;
  page_size: number;
  current: number;
  previous: string | null;
  next: string | null;
  results: AnnouncementItem[];
}

const converter = new ConvertTypes();

export default function AnnouncementCalendarTable() {
  const [data, setData] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
  });

  const t = useTranslations();

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await FetchService.fetch<ApiResponse>(`/api/v2/announcement/calendar/?page=${page}`);
      setData(res.results || []);
      setPagination({
        currentPage: res.current,
        totalPages: res.total_pages,
        pageSize: res.page_size,
        totalItems: res.count,
      });
    } catch (error) {
      console.error("Failed to load announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const columns = useMemo<TableColumn<AnnouncementItem>[]>(
    () => [
      {
        title: t("AnnouncementTable.organization"),
        dataIndex: "organization_name",
        render: (_, record) => (
          <a
            href={`https://new.openinfo.uz/organizations/${record.organization_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Text variant="accent">{record.organization_name}</Text>
          </a>
        ),
      },
      {
        title: t("AnnouncementTable.title"),
        dataIndex: "right",
        render: (_, record) => (
          <a href={`/announce/${record.id}`}>
            <Text variant="accent">{record.title}</Text>
          </a>
        ),
      },
      {
        title: t("AnnouncementTable.pub_date"),
        dataIndex: "pub_date",
        align: "right",
        render: (_, record) => converter.formatDate(record.pub_date),
      },
      {
        title: t("AnnouncementTable.meeting_date"),
        dataIndex: "meeting_date",
        align: "right",
        render: (_, record) => (record.meeting_date ? converter.formatDate(record.meeting_date) : "-"),
      },
    ],
    [t]
  );

  return (
    <div className="p-4 space-y-4">
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
