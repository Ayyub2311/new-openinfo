import React, { useState, useEffect, useCallback } from "react";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { useTranslations } from "next-intl";
import { ConvertTypes } from "@/app/features/facts/models/base/ConvertTypes";
import { Pagination } from "@/app/shared/ui/components/Pagination";
import { Link } from "@/i18n/routing";
import { Text } from "@/app/shared/ui/components/Typography/Text";
import { Badge } from "@/app/shared/ui/components/Badge";
import type { BadgeVariant } from "@/app/shared/ui/components/Badge/types";
import { Table } from "@/app/shared/ui/components/Table";
import { AutocompleteSelect } from "@/app/shared/ui/components/auto-complete";
import { DatePicker } from "@/app/shared/date-picker";
import { ClearButton, SearchButton } from "@/app/shared/ui/components/Button/ReusableButton";
import Select from "@/app/shared/ui/components/Select/Select";
import dayjs from "dayjs";

interface ReportData {
  id: number;
  organization_name: string;
  properties: {
    org_type: string;
    report_type: string;
    report_title: string;
  };
  object_id: number;
  pub_date: string;
  status: string;
  watched: number;
  approved_date: string;
  organization: number;
  author: number;
  content_type: number;
}

interface ApiResponse {
  count: number;
  total_pages: number;
  page_size: number;
  current: number;
  previous: string | null;
  next: string | null;
  results: ReportData[];
}

interface ResultItem {
  id: number;
  full_name_text: string;
  logo?: string;
}

const REPORT_TYPES = ["annual", "quarter"];

const getReportTypeBadgeVariant = (type: string): BadgeVariant => {
  const map: Record<string, BadgeVariant> = {
    annual: "success",
    quarter: "info",
    half_year: "warning",
    other: "default",
  };
  return map[type] || "default";
};

export default function ReportsTable() {
  const [reportsData, setReportsData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedOrg, setSelectedOrg] = useState<ResultItem | null>(null);
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
        reportType: string | null;
        startDate?: Date;
        endDate?: Date;
        selectedOrg?: ResultItem | null;
      } = {
          reportType: selectedReportType,
          startDate,
          endDate,
          selectedOrg,
        }
    ) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          page_size: pagination.pageSize.toString(),
        });

        if (filters.reportType) params.append("report_type", filters.reportType);
        if (filters.selectedOrg) params.append("search", filters.selectedOrg.full_name_text);
        if (filters.startDate) params.append("pub_date__gte", dayjs(filters.startDate).format("YYYY-MM-DD hh:mm:ss"));
        if (filters.endDate) params.append("pub_date__lte", dayjs(filters.endDate).format("YYYY-MM-DD hh:mm:ss"));

        const url = `/api/v2/reports/main/?${params.toString()}`;
        const data = await FetchService.fetch<ApiResponse>(url);
        setReportsData(data.results || []);
        setPagination({
          currentPage: data.current,
          totalPages: data.total_pages,
          pageSize: data.page_size,
          totalItems: data.count,
        });
      } catch (error) {
        console.error(t("Errors.fetch_failed"), error);
        setError(t("Errors.fetch_failed"));
      } finally {
        setLoading(false);
      }
    },
    [endDate, pagination.pageSize, selectedOrg, selectedReportType, startDate, t]
  );

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchData(1, {
      reportType: selectedReportType,
      startDate,
      endDate,
      selectedOrg,
    });
  };

  const clearFilters = () => {
    setSelectedReportType(null);
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedOrg(null);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchData(1, {
      reportType: null,
      startDate: undefined,
      endDate: undefined,
      selectedOrg: null,
    });
  };

  useEffect(() => {
    fetchData(pagination.currentPage, {
      reportType: selectedReportType,
      startDate,
      endDate,
      selectedOrg,
    });
  }, [endDate, fetchData, pagination.currentPage, selectedOrg, selectedReportType, startDate]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleReportTypeChange = (value: string | null) => {
    setSelectedReportType(value);
  };

  const getTranslatedReportType = (type: string) => {
    let label: string;
    switch (type) {
      case "annual":
        label = t("Report.annual");
        break;
      case "quarter":
        label = t("Report.quarter_fallback");
        break;
      default:
        label = type;
        break;
    }
    return label;
  };


  const columns = [
    // {
    //   title: t("TableHeaders.issuer"),
    //   dataIndex: "organization_short_name",
    //   align: "left" as const,
    //   render: (_: string, record: FactData) => {
    //     return record ? (
    //       <Link href={`/organizations/${record.id}`}>
    //         <Text variant="accent">{name}</Text>
    //       </Link>
    //     ) : (
    //       <Text>{name}</Text>
    //     );
    //   },
    // },

    {
      title: t("TableHeaders.issuer"),
      dataIndex: "organization_name",
      align: "left" as const,
      render: (_: string, record: ReportData) => {
        return record.organization ? (
          <Link href={`/organizations/${record.organization}`}>
            <Text variant="accent">{record.organization_name}</Text>
          </Link>
        ) : (
          <Text>{record.organization_name}</Text>
        );
      },
    },
    {
      title: t("TableHeaders.report_types"),
      dataIndex: "properties",
      align: "center" as const,
      className: "w-[200px]",
      render: (value: ReportData["properties"], r: ReportData) => (
        <Link
          href={`/reports/${r.properties.org_type}/${r.properties.report_type}/${r.object_id}`}
          className="flex justify-center"
        >
          <Badge variant={getReportTypeBadgeVariant(value?.report_type)}>
            <span className="truncate block">
              {getTranslatedReportType(value?.report_type)}
            </span>
          </Badge>
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
              ...REPORT_TYPES.map(type => ({
                value: type,
                label: getTranslatedReportType(type), // string now
              })),
            ]}
            value={
              selectedReportType
                ? { value: selectedReportType, label: getTranslatedReportType(selectedReportType) }
                : { value: "", label: t("TableHeaders.all") }
            }
            onChange={opt => handleReportTypeChange(opt?.value || null)}
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

      <Table columns={columns} data={reportsData} bordered={false} loading={loading} />

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          className="my-4 px-4"
          maxVisiblePages={5}
        />
      )}
    </div>
  );
}
