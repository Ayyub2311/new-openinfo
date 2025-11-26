"use client";

import { useEffect, useState } from "react";
import Container from "@/app/shared/ui/components/Container";
import { Table } from "@/app/shared/ui/components/Table";
import { Pagination } from "@/app/shared/ui/components/Pagination";
import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import Input from "@/app/shared/ui/components/Input";
import { ClearButton, SearchButton } from "@/app/shared/ui/components/Button/ReusableButton";
import { useTranslations } from "next-intl";

interface Certificate {
  id: number;
  owner_full_name: string;
  category: string;
  issuance_date: string;
  expiration_date: string;
}

interface CertificateResponse {
  results: Certificate[];
  count: number;
  total_pages: number;
  current: number;
}

const AttestationTable = () => {
  const [data, setData] = useState<Certificate[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");

  const t = useTranslations();

  const fetchData = async () => {
    const query = new URLSearchParams();
    if (searchName) query.append("search", searchName);
    query.append("page", page.toString());

    const res = await FetchService.fetch<CertificateResponse>(`api/v2/reestr/certificates/?${query.toString()}`);
    setData(res.results);
    setTotalPages(res.total_pages);
    setCount(res.count);
  };

  const handleSearch = () => {
    setPage(1);
    fetchData();
  };

  const handleClear = () => {
    setSearchName("");
    setPage(1);
    fetchData();
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const columns: TableColumn<Certificate>[] = [
    {
      title: t("AttestationTabs.full_name_owner_certificate"),
      dataIndex: "owner_full_name",
      render: (value: string) => <span className="text-sm">{value}</span>,
    },
    {
      title: t("AttestationTabs.category"),
      dataIndex: "category",
      render: (value: string) => <span className="text-sm">{value}</span>,
    },
    {
      title: t("AttestationTabs.date_issue_certificate"),
      dataIndex: "issuance_date",
      render: (value: string) => <span className="text-sm">{value}</span>,
    },
    {
      title: t("AttestationTabs.date_expiration_certificate"),
      dataIndex: "expiration_date",
      render: (value: string) => <span className="text-sm">{value}</span>,
    },
  ];

  return (
    <Container style={{ padding: "0" }}>
      {/* Filters */}
      <div className="flex gap-4 items-center mb-4">

        <a
          href="https://license.gov.uz/auth"
          target="_blank"
          className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm whitespace-nowrap"
        >
          → Получить лицензию
        </a>

        <Input
          placeholder={t("AttestationTabs.full_name_owner_certificate")}
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          className="rounded-full  bg-blue-50 w-full"
        />

        <SearchButton onClick={handleSearch} />
        <ClearButton onClick={handleClear} />

        <span className="whitespace-nowrap">{t("AttestationTabs.as_of_date")} 07.06.2024</span>
      </div>

      <Table
        data={data}
        columns={columns}
        bordered={false}
        className="bg-white rounded shadow-sm"
        rowClassName="hover:bg-gray-50"
      />

      <div className="mt-4">
        <Pagination
          currentPage={page}
          totalItems={count}
          totalPages={totalPages}
          onPageChange={newPage => setPage(newPage)}
        />
      </div>
    </Container>
  );
};

export default AttestationTable;
