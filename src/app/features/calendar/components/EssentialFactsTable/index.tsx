import React, { useState, useEffect, useCallback } from "react";
import { Table } from "@/app/shared/ui/components/Table";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { ConvertTypes } from "@/app/features/facts/models/base/ConvertTypes";
import { useTranslations } from "next-intl";
import { Pagination } from "@/app/shared/ui/components/Pagination";
import { Link } from "@/i18n/routing";
import { Text } from "@/app/shared/ui/components/Typography/Text";
import { getOptions } from "./options";
import Select from "@/app/shared/ui/components/Select/Select";
import { DatePicker } from "@/app/shared/date-picker";
import { ClearButton, SearchButton } from "@/app/shared/ui/components/Button/ReusableButton";
import { AutocompleteSelect } from "@/app/shared/ui/components/auto-complete";

interface Option {
  value: string;
  label: string;
}

interface OrganizationObject {
  id: number;
  short_name_text?: string;
  detailinfo?: {
    id: number;
    logo_file?: string;
  };
}

interface BaseFactData {
  id: number;
  factType: string;
  organization_name: string;
  pub_date: string;
  fact_title: string;
  fact_short_title: string | null;
  fact_number: number;
  object_id: number;
  status: string;
  watched: number;
  approved_date: string;
  author: number;
  content_type: number;
  type: number;
  organization: number | OrganizationObject;
  organization_short_name?: string;
  organization_short_name_text?: string;
}

type FactData = BaseFactData;

interface ApiResponse {
  count: number;
  total_pages: number;
  page_size: number;
  current_page: number;
  previous: string | null;
  next: string | null;
  results: FactData[];
}

interface ResultItem {
  id: number;
  full_name_text: string;
  logo?: string;
}

export default function EssentialFactsTable() {
  const [factsData, setFactsData] = useState<FactData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFactType, setSelectedFactType] = useState<Option | null>(null);
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
  const factOptions = getOptions(t);
  const converter = new ConvertTypes();
  const NOT_EXIST_DATE = "-";

  const fetchData = useCallback(
    async (
      page: number = 1,
      filters: {
        selectedOrg: ResultItem | null;
        selectedFactType: Option | null;
        startDate?: Date;
        endDate?: Date;
      } = {
        selectedOrg,
        selectedFactType,
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

        if (filters.selectedOrg) {
          params.append("search", filters.selectedOrg.full_name_text);
        }
        if (filters.startDate) {
          params.append("pub_date__gte", filters.startDate.toISOString().split("T")[0]);
        }
        if (filters.endDate) {
          params.append("pub_date__lte", filters.endDate.toISOString().split("T")[0]);
        }

        const endpoint =
          filters.selectedFactType?.value && filters.selectedFactType.value !== "facts/"
            ? `/api/v2/disclosure/${filters.selectedFactType.value}?${params.toString()}`
            : `/api/v2/disclosure/facts/?${params.toString()}`;

        const data = await FetchService.fetch<ApiResponse>(endpoint);
        const normalized = data.results.map(fact => ({
          ...fact,
          object_id: fact.object_id ?? fact.id,
          organization:
            typeof fact.organization === "number"
              ? fact.organization
              : {
                  id: fact.organization?.id ?? 0,
                  short_name_text: fact.organization?.short_name_text ?? "",
                  detailinfo: fact.organization?.detailinfo ?? undefined,
                },
        }));

        setFactsData(normalized);
        setPagination(prev => ({
          ...prev,
          currentPage: data.current_page,
          totalPages: data.total_pages,
          totalItems: data.count,
        }));
      } catch (error) {
        console.error(t("Errors.fetch_failed"), error);
        setError(t("Errors.fetch_failed"));
      } finally {
        setLoading(false);
      }
    },
    [endDate, pagination.pageSize, selectedFactType, selectedOrg, startDate, t]
  );

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchData(1, { selectedFactType, selectedOrg, startDate, endDate });
  };

  const clearFilters = () => {
    setSelectedOrg(null);
    setSelectedFactType(null);
    setStartDate(undefined);
    setEndDate(undefined);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchData(1, {
      selectedFactType: null,
      selectedOrg: null,
    });
  };

  useEffect(() => {
    fetchData(pagination.currentPage, { selectedFactType, selectedOrg, startDate, endDate });
  }, [endDate, fetchData, pagination.currentPage, selectedFactType, selectedOrg, startDate]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleFactTypeChange = (option: Option | null) => {
    setSelectedFactType(option);
  };

  const getOrganizationName = (record: FactData): string => {
    if (record.organization_short_name) return record.organization_short_name;
    if (record.organization_short_name_text) return record.organization_short_name_text;
    if (typeof record.organization !== "number" && record.organization?.short_name_text)
      return record.organization.short_name_text;
    return record.organization_name || NOT_EXIST_DATE;
  };

  const getOrganizationId = (record: FactData): number | null => {
    if (typeof record.organization === "number") return record.organization;
    return record.organization?.id || null;
  };

  const columns = [
    {
      title: t("TableHeaders.issuer"),
      dataIndex: "organization_short_name",
      align: "left" as const,
      render: (_: string, record: FactData) => {
        const name = getOrganizationName(record);
        const id = getOrganizationId(record);
        return id ? (
          <Link href={`/organizations/${id}`}>
            <Text variant="accent">{name}</Text>
          </Link>
        ) : (
          <Text>{name}</Text>
        );
      },
    },
    {
      title: t("TableHeaders.fact_number"),
      dataIndex: "fact_short_title",
      align: "left" as const,
      render: (_: string, r: FactData) => (
        <Link href={`/facts/${r.fact_number}/${r.object_id}`}>
          <Text variant="accent">
            {r.fact_number}. {r.fact_short_title || r.fact_title}
          </Text>
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
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-3 items-center">
       
          <Select
            options={factOptions}
            value={selectedFactType}
            onChange={handleFactTypeChange}
            placeholder={t("filters.select_type")}
            className="flex-1 min-w-[200px]"
          />
          <DatePicker
            selected={startDate}
            onSelect={setStartDate}
            placeholder={t("filters.start_date")}
            className="flex-1"
          />
          <DatePicker selected={endDate} onSelect={setEndDate} placeholder={t("filters.end_date")} className="flex-1" />
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
      </div>

      <Table columns={columns} data={factsData} bordered={false} loading={loading} />

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
          className="my-4 px-0"
          maxVisiblePages={5}
        />
      )}
    </div>
  );
}
