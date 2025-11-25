"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Table } from "@/app/shared/ui/components/Table";
import { Pagination } from "@/app/shared/ui/components/Pagination";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import Select from "@/app/shared/ui/components/Select/Select";
import { DatePicker } from "@/app/shared/date-picker";
import { SearchButton, ClearButton } from "@/app/shared/ui/components/Button/ReusableButton";
import Link from "next/link";
import Image from "next/image";
import { Text } from "@/app/shared/ui/components/Typography/Text";
import { useTranslations } from "next-intl";
import { ConvertTypes } from "@/app/features/facts/models/base/ConvertTypes";
import { getOptions } from "@/app/features/calendar/components/EssentialFactsTable/options";

const converter = new ConvertTypes();

interface OrganizationDetails {
  id: number;
  short_name_text?: string;
  full_name_text?: string;
  detailinfo?: {
    id: number;
    logo_file?: string;
    director_name?: string;
  };
  [key: string]: any; // Optional: allow other properties
}

interface FactData {
  id: number;
  fact_number: number;
  fact_title: string;
  fact_short_title: string | null;
  pub_date: string;
  object_id?: number;
  organization_name: string;
  organization_short_name?: string;
  organization: number | OrganizationDetails; // <-- ✅ FIX HERE
}

interface ApiResponse {
  results: FactData[];
  current_page: number;
  total_pages: number;
  page_size: number;
  count: number;
}

export const EssentialFactsTable = () => {
  const { id } = useParams();
  const t = useTranslations("");
  const [data, setData] = useState<FactData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
  });

  const factOptions = getOptions(t);

  const [filters, setFilters] = useState({
    factType: { label: t("filters.fact_type"), value: "facts/" },
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  const fetchFacts = async (activeFilters = appliedFilters, page = 1) => {
    setLoading(true);
    try {
      const { factType, startDate, endDate } = activeFilters;
      const params = new URLSearchParams({
        organization_id: Array.isArray(id) ? id[0] : id || "",
        page: page.toString(),
        page_size: "10",
      });

      if (startDate) params.append("pub_date__gte", startDate.toISOString().split("T")[0]);
      if (endDate) params.append("pub_date__lte", endDate.toISOString().split("T")[0]);

      const url = `/api/v2/disclosure/${factType.value}?${params.toString()}`;
      const response = await FetchService.fetch<ApiResponse>(url);

      const normalized = (response.results || []).map(fact => ({
        ...fact,
        object_id: fact.object_id ?? fact.id,
        organization:
          typeof fact.organization === "number"
            ? {
                id: fact.organization,
                short_name_text: fact.organization_short_name,
                full_name_text: fact.organization_name,
              }
            : fact.organization,
      }));

      setData(normalized);

      setPagination({
        currentPage: response.current_page || 1,
        totalPages: response.total_pages,
        pageSize: response.page_size,
        totalItems: response.count,
      });
    } catch (err) {
      console.error("Error fetching facts:", err);
      setError("Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchFacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    fetchFacts(appliedFilters, page);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters(filters);
    fetchFacts(filters, 1);
  };

  const handleClear = () => {
    const reset = {
      factType: { label: "All", value: "facts/" },
      startDate: undefined,
      endDate: undefined,
    };
    setFilters(reset);
    setAppliedFilters(reset);
    fetchFacts(reset, 1);
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      {/* Filter UI */}
      <div className="flex flex-wrap gap-4 mb-4 w-full">
        <Select
          options={factOptions}
          value={filters.factType}
          onChange={val => handleFilterChange("factType", val)}
          placeholder={t("filters.fact_type")}
          className="w-full max-w-full md:w-auto lg:w-auto"
        />
        <DatePicker
          selected={filters.startDate}
          onSelect={val => handleFilterChange("startDate", val)}
          placeholder={t("filters.start_date")}
          className="w-full max-w-full md:w-auto lg:w-auto"
        />
        <DatePicker
          selected={filters.endDate}
          onSelect={val => handleFilterChange("endDate", val)}
          placeholder={t("filters.end_date")}
          className="w-full max-w-full md:w-auto lg:w-auto"
        />
        <div className="filter-actions flex items-center gap-3">
          <SearchButton onClick={handleSearch} />
          <ClearButton onClick={handleClear} />
        </div>
      </div>

      {/* Table */}
      <Table
        bordered={false}
        columns={[
          {
            title: "#",
            dataIndex: "order",
            render: (_: any, __: any, index: number) => (
              <span>{(pagination.currentPage - 1) * pagination.pageSize + index + 1}</span>
            ),
          },
          {
            title: t("essential_factsTab.fact_number"),
            dataIndex: "fact_number",
            align: "center",
            width: 100,
            render: (text: string) => <span>{text}</span>,
          },
          {
            title: t("essential_factsTab.disclosure_date"),
            dataIndex: "approved_date",
            align: "center",
            width: 200,
            render: (_: any, r: FactData) => <span>{converter.formatDate(r.pub_date)}</span>,
          },
          {
            title: t("essential_factsTab.essential_fact_title"),
            dataIndex: "fact_short_title",
            render: (_: string, r: any) => {
              const title = r.fact_short_title || r.fact_title;
              const objectId = r.object_id ?? r.id;
              return (
                <Link href={`/facts/${r.fact_number}/${objectId}`}>
                  <Text variant="accent">{title}</Text>
                </Link>
              );
            },
          },
          {
            title: "",
            dataIndex: "action",
            align: "center",
            width: 200,
            render: (_: any, r: any) => {
              const currentFactType = appliedFilters.factType?.value || "facts/";
              const pdfUrl =
                currentFactType !== "facts/"
                  ? `https://openinfo.uz/ru/facts/go_pdf/?fact=${r.fact_number}&id=${r.id}`
                  : `https://openinfo.uz/ru/facts/to_pdf/${r.id}`;

              return (
                <div className="flex items-center gap-2 justify-center">
                  <a href={pdfUrl} rel="noopener noreferrer">
                    <Image src="/PDF.png" alt="PDF" width={30} height={20} />
                  </a>
                </div>
              );
            },
          },
        ]}
        data={data}
        loading={loading}
      />

      {/* Pagination */}
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
