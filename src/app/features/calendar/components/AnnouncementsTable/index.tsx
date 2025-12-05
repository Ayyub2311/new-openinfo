import React, { useState, useEffect, useCallback } from "react";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { ConvertTypes } from "@/app/features/facts/models/base/ConvertTypes";
import { useTranslations } from "next-intl";
import { Pagination } from "@/app/shared/ui/components/Pagination";
import { Link } from "@/i18n/routing";
import { Text } from "@/app/shared/ui/components/Typography/Text";
import { Badge } from "@/app/shared/ui/components/Badge";
import type { BadgeVariant } from "@/app/shared/ui/components/Badge/types";
import { Table } from "@/app/shared/ui/components/Table";
import Select from "@/app/shared/ui/components/Select/Select";
import { DatePicker } from "@/app/shared/date-picker";
import { ClearButton, SearchButton } from "@/app/shared/ui/components/Button/ReusableButton";
import { AutocompleteSelect } from "@/app/shared/ui/components/auto-complete";

interface AnnouncementData {
  id: number;
  organization_name: string;
  an_type: string;
  pub_date: string;
  object_id: number;
  properties?: any;
  organization?;
  organization_short_name_text: string;
}

interface AnnouncementApiResponse {
  count: number;
  total_pages: number;
  page_size: number;
  current: number;
  previous: string | null;
  next: string | null;
  results: AnnouncementData[];
}

interface ResultItem {
  id: number;
  full_name_text: string;
  logo?: string;
}

type AnnouncementType = "tender" | "meetings" | "jobs" | "investments" | "corporal_management" | "others";

const ANNOUNCEMENT_TYPES: AnnouncementType[] = [
  "tender",
  "meetings",
  "jobs",
  "investments",
  "corporal_management",
  "others",
];

const getTypeBadgeVariant = (type: string): BadgeVariant => {
  const map: Record<string, BadgeVariant> = {
    tender: "warning",
    meetings: "info",
    jobs: "success",
    investments: "primary",
    corporal_management: "purple",
    others: "default",
  };

  return map[type] || "default";
};

export default function AnnouncementsTable() {
  const [announcementsData, setAnnouncementsData] = useState<AnnouncementData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<AnnouncementType | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<ResultItem | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
  });

  const t = useTranslations();
  const converter = new ConvertTypes();
  const NOT_EXIST_DATE = "-";

  const fetchData = useCallback(
    async (
      page: number = 1,
      filters: {
        type: AnnouncementType | null;
        selectedOrg?: ResultItem | null;
        startDate?: Date;
        endDate?: Date;
      } = {
          type: selectedType,
          selectedOrg,
          startDate,
          endDate,
        }
    ) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          page_size: pagination.pageSize.toString(),
        });

        if (filters.type) params.append("an_type", filters.type);
        if (filters.selectedOrg) params.append("search", filters.selectedOrg.full_name_text);
        if (filters.startDate) params.append("pub_date__gte", filters.startDate.toISOString().split("T")[0]);
        if (filters.endDate) params.append("pub_date__lte", filters.endDate.toISOString().split("T")[0]);

        const url = `/api/v2/announcement/main/?${params.toString()}`;
        const data = await FetchService.fetch<AnnouncementApiResponse>(url);
        setAnnouncementsData(data.results || []);
        setPagination({
          currentPage: data.current || 1,
          totalPages: data.total_pages || 1,
          pageSize: data.page_size || 10,
          totalItems: data.count || 0,
        });
      } catch (error) {
        console.error(t("Errors.fetch_failed"), error);
        setError(t("Errors.fetch_failed"));
      } finally {
        setLoading(false);
      }
    },
    [endDate, pagination.pageSize, selectedOrg, selectedType, startDate, t]
  );

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchData(1, {
      type: selectedType,
      selectedOrg,
      startDate,
      endDate,
    });
  };

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedOrg(null);
    setStartDate(undefined);
    setEndDate(undefined);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchData(1, {
      type: null,
      selectedOrg: null,
      startDate: undefined,
      endDate: undefined,
    });
  };

  useEffect(() => {
    fetchData(pagination.currentPage, {
      type: selectedType,
      selectedOrg,
      startDate,
      endDate,
    });
  }, [endDate, fetchData, pagination.currentPage, selectedOrg, selectedType, startDate]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const columns = [
    {
      title: t("TableHeaders.issuer"),
      dataIndex: "organization_short_name_text",
      align: "left" as const,
      render: (_: string, record: AnnouncementData) => {
        return record.organization ? (
          <Link href={`/organizations/${record.organization}`}>
            <Text variant="accent">{record.organization_short_name_text}</Text>
          </Link>
        ) : (
          <Text>{record.organization_short_name_text}</Text>
        );
      },
    },

    {
      title: t("TableHeaders.an_type"),
      dataIndex: "id",
      align: "center" as const,
      render: (_value, record: AnnouncementData) => (
        <Link href={`/announce/${record.id}`} className="flex justify-center">
          <Badge variant={getTypeBadgeVariant(record.an_type)}>{t(`AnnouncementTypes.${record.an_type}` as any)}</Badge>
        </Link>
      ),
    },

    {
      title: t("TableHeaders.disclosure_date"),
      dataIndex: "pub_date",
      align: "center" as const,
      render: (text: string) => converter.formatDate(text) || NOT_EXIST_DATE,
    },
  ];

  if (error) return <div>{error}</div>;

  return (
    <div className="py-4 space-y-4">
      <div className="flex flex-wrap gap-2 mb-3 items-center">

        <div className="w-full gap-2 flex flex-wrap sm:flex-nowrap">
          <Select
            options={[
              { value: "", label: t("TableHeaders.all") },
              ...ANNOUNCEMENT_TYPES.map(type => ({
                value: type,
                label: t(`AnnouncementTypes.${type}`),
              })),
            ]}
            value={
              selectedType
                ? { value: selectedType, label: t(`AnnouncementTypes.${selectedType}`) }
                : { value: "", label: t("TableHeaders.all") }
            }
            onChange={opt => setSelectedType((opt?.value as AnnouncementType) || null)}
            placeholder={t("filters.select_type")}
            className="w-full"
          />
          <DatePicker
            selected={startDate}
            onSelect={setStartDate}
            placeholder={t("filters.start_date")}
            className="w-full"
          />
          <DatePicker selected={endDate} onSelect={setEndDate} placeholder={t("filters.end_date")} className="w-full" />
        </div>

        <div className="flex items-center gap-2 w-full">
          <AutocompleteSelect
            value={selectedOrg}
            onChange={setSelectedOrg}
            placeholder={t("filters.search_placeholder")}
            className="flex-1 w-full"
          />
          <SearchButton onClick={handleSearch} />
          <ClearButton onClick={clearFilters} />
        </div>

      </div>

      <Table columns={columns} data={announcementsData} bordered={false} loading={loading} />

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
          className="my-4 px-4"
          maxVisiblePages={7}
        />
      )}
    </div>
  );
}
