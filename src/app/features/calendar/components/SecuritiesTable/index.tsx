import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { useTranslations } from "next-intl";
import { ConvertTypes } from "@/app/features/facts/models/base/ConvertTypes";
import Select from "@/app/shared/ui/components/Select/Select";
import { Pagination } from "@/app/shared/ui/components/Pagination";
import { Text } from "@/app/shared/ui/components/Typography/Text";
import { Link } from "@/i18n/routing";
import { Table } from "@/app/shared/ui/components/Table";
import { AutocompleteSelect } from "@/app/shared/ui/components/auto-complete";
import { DatePicker } from "@/app/shared/date-picker";
import { ClearButton, SearchButton } from "@/app/shared/ui/components/Button/ReusableButton";

interface EmissionData {
  organization_id: number;
  organization_name: string;
  content_type_name: string;
  pub_date: string;
  approved_date: string;
  type: string;
  id: number;
}

interface ResultItem {
  id: number;
  full_name_text: string;
  logo?: string;
}

const apiMap: Record<string, string> = {
  jsc: "/api/v2/emissions/jsc/",
  bank: "/api/v2/emissions/bank/",
  pc: "/api/v2/emissions/pc/",
  llc: "/api/v2/emissions/llc/",
};

export default function SecuritiesTable() {
  const [data, setData] = useState<EmissionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("jsc");
  const [selectedOrg, setSelectedOrg] = useState<ResultItem | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [pendingSearch, setPendingSearch] = useState<boolean>(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
  });

  const t = useTranslations();
  const converter = useMemo(() => new ConvertTypes(), []);
  const NOT_EXIST_DATE = "-";

  const formatDate = useCallback(
    (dateString: string) => {
      try {
        return converter.formatDate(dateString) || NOT_EXIST_DATE;
      } catch {
        return NOT_EXIST_DATE;
      }
    },
    [converter]
  );

  const fetchData = useCallback(
    async (
      type: string,
      page: number = 1,
      filters: {
        selectedOrg?: ResultItem | null;
        startDate?: Date;
        endDate?: Date;
      } = {
          selectedOrg,
          startDate,
          endDate,
        }
    ) => {
      setLoading(true);
      setError(null);

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

      const url = `${apiMap[type]}?${params.toString()}`;

      try {
        const response = await FetchService.fetch<any>(url);

        const normalized = (response.results || []).map(
          (item: any): EmissionData => ({
            organization_id: item.organization.id,
            organization_name: item.organization?.short_name_text || "-",
            content_type_name: item.content_type_name || "-",
            pub_date: formatDate(item.pub_date),
            approved_date: formatDate(item.approved_date),
            type,
            id: item.id,
          })
        );

        setData(normalized);
        setPagination({
          currentPage: response.current_page || page,
          totalPages: response.total_pages || 1,
          pageSize: response.page_size || 10,
          totalItems: response.count || 0,
        });
      } catch (err) {
        console.error(t("SecuritiesTable.fetch_failed"), err);
        setError(t("SecuritiesTable.fetch_failed"));
      } finally {
        setLoading(false);
      }
    },
    [endDate, formatDate, pagination.pageSize, selectedOrg, startDate, t]
  );

  const handleSearch = () => {
    setPendingSearch(false);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchData(selectedType, 1, { selectedOrg, startDate, endDate });
  };

  const clearFilters = () => {
    setSelectedOrg(null);
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedType("jsc");
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchData("jsc", 1, {
      selectedOrg: null,
      startDate: undefined,
      endDate: undefined,
    });
  };

  useEffect(() => {
    if (!pendingSearch) {
      fetchData(selectedType, pagination.currentPage, { selectedOrg, startDate, endDate });
    }
  }, [endDate, fetchData, pagination.currentPage, pendingSearch, selectedOrg, selectedType, startDate]);

  const handleTypeChange = (option: { value: string }) => {
    const selected = option?.value || "jsc";
    setSelectedType(selected);
    setPendingSearch(true);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const columns = [
    {
      title: t("SecuritiesTable.organization_name") || "Organization Name",
      dataIndex: "organization_name",
      align: "left" as const,
      render: (_: string, record: EmissionData) => {
        if (record.organization_id) {
          return (
            <Link href={`/organizations/${record.organization_id}`}>
              <Text variant="accent">{record.organization_name}</Text>
            </Link>
          );
        }
        return <Text>{record.organization_name}</Text>;
      },
    },
    {
      title: t("SecuritiesTable.publication_date") || "Publication Date",
      dataIndex: "pub_date",
      render: (pub_date: string, record: any) => {
        console.log(record);
        return (
          <Link href={`/emissions/${selectedType}/${record.id}`}>
            <Text variant="accent">{pub_date}</Text>
          </Link>
        );
      },
      align: "center" as const,
    },
  ];

  return (
    <div className="py-4 space-y-4">
      <div className="flex flex-wrap gap-2 mb-3 items-center">

        <div className="w-full gap-2 flex flex-wrap sm:flex-nowrap">
          <Select
            placeholder={t("SecuritiesTable.select_type")}
            value={{ value: selectedType, label: t(`SecuritiesTable.options.${selectedType}` as any) }}
            onChange={handleTypeChange}
            options={Object.keys(apiMap).map(key => ({
              value: key,
              label: t(`SecuritiesTable.options.${key}` as any),
            }))}
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
            className="w-full"
          />
          <SearchButton onClick={handleSearch} />
          <ClearButton onClick={clearFilters} />
        </div>

      </div>

      {error && <div className="text-red-600">{error}</div>}

      <Table columns={columns} data={data} bordered={false} loading={loading} />

      {pagination.totalPages > 1 && (
        <Pagination
          totalItems={pagination.totalItems}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          onPageChange={handlePageChange}
          className="mt-4"
        />
      )}
    </div>
  );
}
