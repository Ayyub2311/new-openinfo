"use client";

import { useEffect, useState } from "react";
import Container from "@/app/shared/ui/components/Container";
import { Table } from "@/app/shared/ui/components/Table";
import { Pagination } from "@/app/shared/ui/components/Pagination";
import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import Image from "next/image";
import Link from "next/link";
import Select, { Option } from "@/app/shared/ui/components/Select/Select";

import { ClearButton, SearchButton } from "@/app/shared/ui/components/Button/ReusableButton";
import Input from "@/app/shared/ui/components/Input";
import { useTranslations } from "next-intl";

interface License {
  id: number;
  organization: string;
  activity_type: string;
  license_number: string;
  issue_date: string;
  logo_file?: string;
  pdf_file: string;
}

interface LicenseResponse {
  results: License[];
  count: number;
  total_pages: number;
  current: number;
}

const LicenseTable = () => {
  const [data, setData] = useState<License[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [activityType, setActivityType] = useState<Option | undefined>();
  const [organization, setOrganization] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const t = useTranslations();

  const activityOptions: Option[] = [
    { value: "investment_intermediary", label: t("AttestationTabs.investment_intermediary") },
    { value: "investment_manager", label: t("AttestationTabs.investment_manager") },
    { value: "investment_consultant", label: t("AttestationTabs.investment_consultant") },
  ];

  const fetchData = async () => {
    const query = new URLSearchParams();
    if (activityType?.value) query.append("activity_type", activityType.value);
    if (organization) query.append("organization__icontains", organization);
    if (licenseNumber) query.append("license_number__icontains", licenseNumber);
    query.append("page", page.toString());

    const res = await FetchService.fetch<LicenseResponse>(`api/v2/brokers/licenses/?${query.toString()}`);
    setData(res.results);
    setTotalPages(res.total_pages);
    setCount(res.count);
  };

  const handleSearch = () => {
    setPage(1);
    fetchData();
  };

  const handleClear = () => {
    setActivityType(undefined);
    setOrganization("");
    setLicenseNumber("");
    setPage(1);
    fetchData();
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const columns: TableColumn<License>[] = [
    {
      title: t("AttestationTabs.organization_column"),
      dataIndex: "organization",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-900">{record.organization}</span>
        </div>
      ),
    },
    {
      title: t("AttestationTabs.service_name"),
      dataIndex: "activity_type",
      render: (value: string) => {
        const a: any = `AttestationTabs.${value}`;
        return t(a);
      },
    },
    {
      title: t("AttestationTabs.license_number"),
      dataIndex: "license_number",
      render: (value: string) => <span className="text-sm font-medium">{value}</span>,
    },
    {
      title: t("AttestationTabs.date_issue"),
      dataIndex: "issue_date",
      render: (value: string) => <span className="text-sm">{value}</span>,
    },
    {
      title: t("AttestationTabs.download"),
      dataIndex: "pdf_file",
      align: "center",
      render: value => (
        <Link
          href={`https://openinfo.uz/media/${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 underline"
        >
          <Image src="/PDF.png" alt="PDF" className="w-6 h-6" width={30} height={20} />
        </Link>
      ),
    },
  ];

  return (
    <Container>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <a
          href="https://license.gov.uz/auth"
          target="_blank"
          className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm"
        >
          → {t("AttestationTabs.get_license")}
        </a>

        <Select
          options={activityOptions}
          value={activityType}
          onChange={setActivityType}
          placeholder={t("AttestationTabs.service_name")}
        />

        <Input
          placeholder={t("AttestationTabs.organization_column")}
          value={organization}
          onChange={e => setOrganization(e.target.value)}
          className="rounded-full bg-blue-50 max-w-sm"
        />
        <Input
          placeholder={t("AttestationTabs.license_number")}
          value={licenseNumber}
          onChange={e => setLicenseNumber(e.target.value)}
          className="rounded-full bg-blue-50 max-w-sm"
        />

        <SearchButton onClick={handleSearch} />
        <ClearButton onClick={handleClear} />
      </div>

      {/* Table */}
      <Table
        data={data}
        columns={columns}
        bordered={false}
        className="bg-white rounded shadow-sm"
        rowClassName="hover:bg-gray-50"
      />

      {/* Pagination */}
      <div className="mt-4">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={count} />
      </div>
    </Container>
  );
};

export default LicenseTable;
