"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/app/shared/ui/components/Container";
import CompanyCard from "./CompanyCard";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import Sidebar from "@/app/shared/ui/components/Sidebar";
import { sidebarItems } from "@/app/features/sidebar/components/Sidebar";
import { Pagination } from "@/app/shared/ui/components/Pagination";
import BrokersAutoComplete from "@/app/shared/ui/components/auto-complete/BrokersAutocomplete";
import Select from "@/app/shared/ui/components/Select/Select";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { ClearButton, SearchButton } from "@/app/shared/ui/components/Button/ReusableButton";

const yearOptions = [
  { label: "2019", value: "2019" },
  { label: "2020", value: "2020" },
  { label: "2021", value: "2021" },
  { label: "2022", value: "2022" },
  { label: "2023", value: "2023" },
];

const sortOptionsAmount = [
  { label: "⬆️ По сумме (asc)", value: "asc" },
  { label: "⬇️ По сумме (desc)", value: "desc" },
];

const sortOptionsQuantity = [
  { label: "⬆️ По количеству (asc)", value: "asc" },
  { label: "⬇️ По количеству (desc)", value: "desc" },
];

const PageInvestmentBrokers = () => {
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const t = useTranslations();

  const [brokers, setBrokers] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchValue, setSearchValue] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);

  const fetchBrokers = useCallback(async () => {
    const params = new URLSearchParams();
    if (searchValue?.full_name) params.set("search", searchValue.full_name);
    if (selectedYear) params.set("year", selectedYear);
    if (selectedAmount) params.set("turnover_order", selectedAmount);
    if (selectedQuantity) params.set("transaction_order", selectedQuantity);
    params.set("page", page.toString());

    const data = (await FetchService.fetch(`/api/v2/brokers/list/?${params.toString()}`)) as any;

    setBrokers(data.results);
    setTotalPages(data.total_pages);
    setCount(data.count);
  }, [searchValue, selectedYear, selectedAmount, selectedQuantity, page]);

  useEffect(() => {
    fetchBrokers();
  }, [fetchBrokers]);

  const handleSearch = () => {
    setPage(1);
    fetchBrokers();
  };

  const handleClear = () => {
    setSearchValue(null);
    setSelectedYear("");
    setSelectedAmount(null);
    setSelectedQuantity(null);
    setPage(1);
  };

  const handlePageChange = newPage => {
    setPage(newPage);
  };

  return (
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-4 mt-[30px] mb-[30px]">
          <div className="flex flex-wrap w-full  gap-2 items-center mb-4">
            {/* <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm flex items-center">
              Сортировать брокеров по категориям <ArrowDown className="w-4 h-4 ml-1" />
            </span> */}

            <Select
              value={yearOptions.find(opt => opt.value === selectedYear) || null}
              onChange={opt => setSelectedYear(opt?.value)}
              options={yearOptions}
              placeholder={t("investment_brokers_menu.sort_by_year")}
              className="flex-1 w-full md:min-w-[180px] md:max-w-[400px]"
            />

            <Select
              value={sortOptionsAmount.find(opt => opt.value === selectedAmount) || null}
              onChange={opt => {
                setSelectedAmount(opt?.value);
                setSelectedQuantity(null);
              }}
              options={sortOptionsAmount}
              placeholder={t("investment_brokers_menu.sort_by_amount")}
              className="flex-1 md:min-w-[180px] md:max-w-[400px]"
            />

            <Select
              value={sortOptionsQuantity.find(opt => opt.value === selectedQuantity) || null}
              onChange={opt => {
                setSelectedQuantity(opt?.value);
                setSelectedAmount(null);
              }}
              options={sortOptionsQuantity}
              placeholder={t("investment_brokers_menu.sort_by_quantity")}
              className="flex-1 w-full md:min-w-[180px] md:max-w-[400px]"
            />

            <div className="flex items-center gap-2 w-full">
              <BrokersAutoComplete
                value={searchValue}
                onChange={setSearchValue}
                placeholder={t("filters.search_placeholder")}
                className="w-full min-w-[200px] flex-1"
              />
              <SearchButton onClick={handleSearch} />
              <ClearButton onClick={handleClear} />
            </div>

          </div>

          {/* <div className="flex flex-wrap gap-2 items-center">

          </div> */}

          {brokers.map(broker => (
            <CompanyCard
              key={broker.id}
              id={broker.id}
              clickable={false}
              showFooter={true}
              logoSrc={broker.logo_file ? `https://openinfo.uz/media/${broker.logo_file}` : null}
              companyName={broker.full_name}
              phone={broker.broker_phones?.[0]?.phone_number || "-"}
              address={broker.address}
              email={broker.email}
              directorName={broker.broker_staffs?.find(s => s.position === "DIRECTOR")?.full_name || "-"}
              websiteUrl={broker.web_site}
              broker_number={broker.broker_number}
              turnover={broker.turnover}
            />
          ))}

          <div className="mt-6">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} totalItems={count} />
          </div>
        </div>

        <div className="hidden lg:block">
          <Sidebar items={sidebarItems} />
        </div>
      </div>
    </Container>
  );
};

export default PageInvestmentBrokers;
