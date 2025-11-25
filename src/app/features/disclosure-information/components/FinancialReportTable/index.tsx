"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Table } from "@/app/shared/ui/components/Table";
import { Pagination } from "@/app/shared/ui/components/Pagination";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import Select from "@/app/shared/ui/components/Select/Select";
import { DatePicker } from "@/app/shared/date-picker";

import Link from "next/link";
import Image from "next/image";
import { ClearButton, SearchButton } from "@/app/shared/ui/components/Button/ReusableButton";
import { Text } from "@/app/shared/ui/components/Typography/Text";
import { useTranslations } from "next-intl";

interface ReportApiResponse {
  results: any[];
  count: number;
  total_pages: number;
  page_size: number;
  current_page: number;
}

const reportStandards = [
  { label: "NSBU", value: "main" },
  { label: "MSFO", value: "msfo" },
  { label: "Audition", value: "audition" },
];

export const FinancialReportTable = () => {
  const { id } = useParams();

  const t = useTranslations("");

  const reportTypes = [
    { label: t("filters.all"), value: "" },
    { label: "Quarter", value: "quarter" },
    { label: "Annual", value: "annual" },
  ];

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, pageSize: 10, totalItems: 0 });
  const [filters, setFilters] = useState({
    reportStandard: { label: "NSBU", value: "main" },
    reportType: { label: t("filters.select_report_type" as any), value: "" },
    selectedYear: "",
    startDate: undefined,
    endDate: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const fetchReports = async (activeFilters = appliedFilters, page = 1) => {
    setLoading(true);
    try {
      const { selectedYear, startDate, endDate } = activeFilters;
      const safeStandard = activeFilters?.reportStandard?.value || "main";

      const params = new URLSearchParams({
        organization_id: Array.isArray(id) ? id[0] : id || "",
        page: page.toString(),
        page_size: "10",
      });

      if (activeFilters?.reportType?.value) {
        params.append("report_type", activeFilters.reportType.value);
      }

      if (selectedYear) {
        params.append("pub_date__year", selectedYear);
      }

      if (startDate) {
        params.append("pub_date__gte", startDate.toISOString().split("T")[0]);
      }

      if (endDate) {
        params.append("pub_date__lte", endDate.toISOString().split("T")[0]);
      }

      const response = await FetchService.fetch<ReportApiResponse>(
        `/api/v2/reports/${safeStandard}/?${params.toString()}`
      );

      setData(response.results || []);
      setPagination({
        currentPage: response.current_page || 1,
        totalPages: response.total_pages,
        pageSize: response.page_size,
        totalItems: response.count,
      });
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePageChange = page => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    fetchReports(page);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters(filters);
    fetchReports(filters, 1);
  };

  const handleClear = () => {
    const resetFilters = {
      reportStandard: { label: "NSBU", value: "main" },
      reportType: { label: t("filters.all"), value: "" },
      selectedYear: "",
      startDate: undefined,
      endDate: undefined,
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    fetchReports(resetFilters, 1);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "order",
      width: 20,
      render: (_: any, __, index: number) => (
        <span>{(pagination.currentPage - 1) * pagination.pageSize + index + 1}</span>
      ),
    },
    {
      title: t("financial_reports_tab.report_date"),
      dataIndex: "pub_date",
      render: (text, record) => <span>{new Date(record.pub_date).toLocaleDateString("ru-RU")}</span>,
    },
    {
      title: t("financial_reports_tab.report_type"),
      dataIndex: "report_title",
      render: (text, record) => {
        const isMain = appliedFilters.reportStandard.value === "main";
        const hasValidLinkData = record.properties?.org_type && record.properties?.report_type && record.object_id;

        return isMain && hasValidLinkData ? (
          <Link
            href={`/reports/${record.properties.org_type}/${record.properties.report_type}/${record.object_id}`}
            target="_blank"
          >
            <Text variant="accent">
              {record.properties?.report_title || (record.report_type === 1 ? "Annual" : "Quarter")}
            </Text>
          </Link>
        ) : (
          <span>{record.properties?.report_title || (record.report_type === 1 ? "Annual" : "Quarter")}</span>
        );
      },
    },
    {
      title: t("financial_reports_tab.download_report"),
      align: "center" as const, // ✅ Fix 3
      render: (_, record) => {
        const isMain = appliedFilters.reportStandard.value === "main";
        const hasValidMain = record.properties?.org_type && record.properties?.report_type && record.object_id;
        const hasPdf = record.pdf_file || record.id;

        return (
          <div className="flex items-center gap-2 justify-center">
            {hasPdf && (
              <a
                target="_blank"
                href={
                  isMain
                    ? `https://openinfo.uz/ru/reports/to_pdf${record.id}`
                    : `https://openinfo.uz/media/${record.pdf_file}`
                }
                download
              >
                <Image src="/PDF.png" alt="PDF" width={24} height={24} />
              </a>
            )}

            {isMain && hasValidMain && (
              <a
                href={`https://new.openinfo.uz/api/v2/reports/export-excel/?report_type=${record.properties.report_type}&org_type=${record.properties.org_type}&report_id=${record.object_id}&lang=ru`}
                download
              >
                <Image src="/assets/general-icons/icons-excel.svg" alt="Excel" width={24} height={24} />
              </a>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <Select
          options={reportStandards}
          value={filters.reportStandard}
          onChange={val => handleFilterChange("reportStandard", val)}
          placeholder="Report Standard"
          className="w-full max-w-full md:w-auto lg:w-auto"
        />
        <Select
          options={reportTypes}
          value={filters.reportType}
          onChange={val => handleFilterChange("reportType", val)}
          placeholder={t("filters.select_report_type" as any)}
          className="w-full max-w-full md:w-auto lg:w-auto"
        />
        {filters.reportType.value !== "annual" && (
          <DatePicker
            selected={filters.startDate}
            onSelect={date => handleFilterChange("startDate", date)}
            placeholder={t("filters.start_date")}
            className="w-full max-w-full md:w-auto lg:w-auto"
          />
        )}

        {filters.reportType.value !== "annual" && (
          <DatePicker
            selected={filters.endDate}
            onSelect={date => handleFilterChange("endDate", date)}
            placeholder={t("filters.end_date")}
            className="w-full max-w-full md:w-auto lg:w-auto"
          />
        )}
        {filters.reportType.value === "annual" && (
          <DatePicker
            picker="year"
            selected={filters.selectedYear ? new Date(Number(filters.selectedYear), 0) : undefined}
            onSelect={date => handleFilterChange("selectedYear", date ? date.getFullYear().toString() : "")}
            placeholder={t("filters.pick_year")}
            className="w-full max-w-full md:w-auto lg:w-auto"
          />
        )}
        <div className="filter-actions flex items-center gap-3">
          <SearchButton onClick={handleSearch} />
          <ClearButton onClick={handleClear} />
        </div>
      </div>

      <Table bordered={false} columns={columns} data={data} loading={loading} />

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
