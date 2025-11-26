// PageOrganizations.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Container from "@/app/shared/ui/components/Container";
import CompanyCard from "./CompanyCard";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import Sidebar from "@/app/shared/ui/components/Sidebar";
import { sidebarItems } from "@/app/features/sidebar/components/Sidebar";
import { Pagination } from "@/app/shared/ui/components/Pagination";
import { AutocompleteSelect } from "@/app/shared/ui/components/auto-complete";
import Select from "@/app/shared/ui/components/Select/Select";
import Loader from "@/app/shared/ui/components/Loader";

import { ClearButton, SearchButton } from "@/app/shared/ui/components/Button/ReusableButton";

interface Organization {
  id: number;
  detailinfo: {
    logo_file: string;
    phone_number: string;
    director_name: string;
    created_at: string;
  };
  full_name_text: string;
  address: string;
  email?: string;
  web_site?: string;
  inn?: string;
  cessation_date?: string;
  status_from_stat_uz?: string;
  is_listing?: boolean;
  subscription_id?: number | null;
  is_subscribed?: boolean;
}

interface OrganizationsResponse {
  count: number;
  total_pages: number;
  page_size: number;
  current: number;
  results: Organization[];
}

interface ResultItem {
  id: number;
  full_name_text: string;
  logo?: string;
}

const PageOrganizations = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("filters") as (key: string) => string;

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selectedOrg, setSelectedOrg] = useState<ResultItem | null>(null);
  const [statusRFB, setStatusRFB] = useState<string>(null);
  const [statusAO, setStatusAO] = useState<string>(null);
  const [orgType, setOrgType] = useState<string>(null);

  const statusOptions = [
    { label: t("active"), value: "active" },
    { label: t("inactive"), value: "inactive" },
    { label: t("liquidated"), value: "liquidated" },
    { label: t("not_available"), value: "not_available" },
  ];

  const listedOptions = [
    { label: t("all"), value: "" },
    { label: t("listed"), value: "true" },
    { label: t("unlisted"), value: "false" },
  ];

  const orgTypes = [
    { label: t("all"), value: "" },
    { label: t("jsc"), value: "1" },
    { label: t("banks"), value: "5" },
    { label: t("insurance_companies"), value: "6" },
    { label: t("llc"), value: "8" },
  ];

  useEffect(() => {
    const fetchOrgs = async () => {
      setLoading(true);
      const params = new URLSearchParams(window.location.search);
      params.delete("_rsc");

      try {
        const data = await FetchService.fetch<OrganizationsResponse>(
          `/api/v2/organizations/organizations/?${params.toString()}`
        );

        setOrganizations(data.results);
        setTotalPages(data.total_pages);
        setCount(data.count);
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgs();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSelectedOrg(null);
    setStatusRFB(null);
    setStatusAO(null);
    setOrgType(null);
    setPage(1);
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>("input[placeholder][type='text']");
      if (input) input.value = "";
    }, 10);
    router.push(`${window.location.pathname}?page=1`);
  };

  const updateQuery = () => {
    const params = new URLSearchParams();
    if (selectedOrg?.full_name_text) params.set("search", selectedOrg.full_name_text);
    if (statusRFB) params.set("is_listing", statusRFB);
    if (statusAO) params.set("status_from_stat_uz", statusAO);
    if (orgType) params.set("name_suffix_id", orgType);
    params.set("page", "1");
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-4 mt-[30px] mb-[30px]">
          <div className="px-0 flex flex-wrap gap-2 mt-3 mb-3 items-center">
            <Select
              value={listedOptions.find(opt => opt.value === statusRFB) || null}
              onChange={opt => setStatusRFB(opt?.value ?? "")}
              options={listedOptions}
              placeholder={t("rfb_status")}
              className="flex-1   w-full"
            />
            <Select
              value={statusOptions.find(opt => opt.value === statusAO) || null}
              onChange={opt => setStatusAO(opt.value)}
              options={statusOptions}
              placeholder={t("jsc_status")}
              className="flex-1    w-full"
            />
            <Select
              value={orgTypes.find(opt => opt.value === orgType) || null}
              onChange={opt => setOrgType(opt.value)}
              options={orgTypes}
              placeholder={t("organization_type")}
              className="flex-1 w-full"
            />

<AutocompleteSelect
              value={selectedOrg}
              onChange={setSelectedOrg}
              placeholder={t("search_placeholder")}
              className="flex-1  w-full min-w-[400px]"
            />

            <SearchButton
              onClick={() => {
                setPage(1);
                updateQuery();
              }}
            />
            <ClearButton onClick={handleResetFilters} />
          </div>

          {loading ? (
            <div className="text-center py-10 text-blue-500 font-medium text-lg">
              <Loader />
            </div>
          ) : (
            <>
              {organizations.map(organization => (
                <CompanyCard
                  key={organization.id}
                  id={organization.id}
                  clickable={true}
                  showFooter={false}
                  logoSrc={`${organization.detailinfo.logo_file}`}
                  companyName={organization.full_name_text}
                  phone={organization.detailinfo.phone_number}
                  address={organization.address}
                  email={organization.email}
                  directorName={organization.detailinfo.director_name}
                  websiteUrl={organization.web_site}
                  inn={organization.inn}
                  cessation_date={organization.detailinfo.created_at}
                  status_from_stat_uz={organization.status_from_stat_uz}
                  isListing={organization?.is_listing}
                  subscription_id={organization.subscription_id}
                  is_subscribed={organization.is_subscribed}
                />
              ))}

              <div className="mt-6">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={count}
                />
              </div>
            </>
          )}
        </div>
        <div className="hidden lg:block">
          <Sidebar items={sidebarItems} />
        </div>
      </div>
    </Container>
  );
};

export default PageOrganizations;
