"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "../../components/Badge";
import Divider from "../../components/Divider";
import { StockCardPrice } from "./StockCardPrice";
import OrgLogo from "@/app/shared/default-logo";
import { useTranslations } from "next-intl";
import { WatchlistStar } from "@/app/features/watchlist/Watchlist";

interface StockTypeOption {
  label: string;
  value: string;
  type: string;
  is_listing?: boolean;
  is_in_watchlist?: boolean;
  stock_id?: number | string;
  watchlist_item_id?: number;
}

interface StockCardProps {
  companyName: string;
  ticker: string;
  stockId?: string;
  price: string | number;
  priceChange: number;
  percentageChange: string;
  companyLogo: string;
  stockTypeOptions: StockTypeOption[];
  orgId: number;
  status_rfb?: boolean;
  selectedShareOption?: StockTypeOption;
  is_item_in_watchlist?: boolean;
  watchlist_item_id?: number;
  onWatchlistChangeRefetch?: () => void;
}

const StockCard: React.FC<StockCardProps> = ({
  companyName,
  ticker,
  price,
  priceChange,
  percentageChange,
  companyLogo,
  orgId,
  stockTypeOptions,
  status_rfb,
  onWatchlistChangeRefetch,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const initialIsuCd = searchParams.get("isu_cd") || stockTypeOptions[0]?.value;
  const [selectedIsuCd, setSelectedIsuCd] = useState(initialIsuCd);
  // const [isInWatchlist, setIsInWatchlist] = useState(is_item_in_watchlist || false);
  // const [watchlistItemId, setWatchlistItemId] = useState<number | null>(watchlist_item_id || null);

  const selectedOption = stockTypeOptions.find(option => option.value === selectedIsuCd);
  useEffect(() => {
    const currentIsuCd = searchParams.get("isu_cd");
    const currentStockType = searchParams.get("stock_type");
    const matchedOption = stockTypeOptions.find(option => option.value === selectedIsuCd);

    if ((!currentIsuCd || !currentStockType) && matchedOption) {
      const newQueryParams = new URLSearchParams(searchParams.toString());
      newQueryParams.set("isu_cd", matchedOption.value);
      newQueryParams.set("stock_type", matchedOption.type);
      router.replace(`?${newQueryParams.toString()}`, { scroll: false });
    }
  }, [selectedIsuCd, stockTypeOptions, router, searchParams, selectedOption]);

  const handleStockTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newIsuCd = event.target.value;
    const matchedOption = stockTypeOptions.find(option => option.value === newIsuCd);
    if (!matchedOption) return;

    const newQueryParams = new URLSearchParams(searchParams.toString());
    newQueryParams.set("isu_cd", matchedOption.value);
    newQueryParams.set("stock_type", matchedOption.type);

    router.push(`?${newQueryParams.toString()}`, { scroll: false });
    setSelectedIsuCd(newIsuCd);
  };

  const currentStatus = selectedOption?.is_listing ?? status_rfb ?? false;

  return (
    <div className="flex gap-2 flex-col lg:flex-row md:flex-row   items-start lg:items-center justify-between px-3 bg-white transition duration-300  border  rounded-b-none rounded-xl border-default space-y-4 lg:space-y-0 wrap">
      {/* Left: Logo & Company Info */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full lg:w-auto">
        <div className="flex items-center gap-5">
          <OrgLogo
            id={orgId}
            shortName={companyName}
            size={65}
            logoFile={companyLogo ? `https://openinfo.uz/media/${companyLogo}` : null}
          />
          <div className="flex items-center">
            <div className="flex flex-col">
              <h1 className="text-gray-800 font-semibold ">{companyName}</h1>
              <div className="flex p-0 m-0 gap-1 items-center">
                {ticker && <p className="text-sm p-0 font-semibold  text-gray-500">{ticker}</p>} -
                {selectedIsuCd && <p className="text-sm p-0 font-semibold text-gray-500">{selectedIsuCd}</p>}
              </div>
            </div>
            <div className="ml-7 flex items-center gap-2">
              {/* <span className="text-xs text-gray-600">{t("Organizations.exchange_status")}:</span> */}
              <Badge variant={currentStatus ? "success" : "danger"} size="md">
                <span className="text-xs hidden md:block">{t("Organizations.exchange_status")} :</span> &nbsp;
                <span className="text-xs ">
                  {currentStatus ? t("Organizations.listing") : t("Organizations.delisting")}
                </span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Right: Price + Change + Dropdown */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-end w-full lg:w-auto gap-4 m-0 ">
          {/* Divider */}
          <div className="hidden lg:flex items-center h-20">
            <Divider orientation="vertical" />
          </div>

          {/* Price & Percentage */}
          <div className="flex sm:flex-row items:center gap-2 content-center items-center  m-0  lg:ml-7  font-h ">
            <StockCardPrice percentageChange={percentageChange} price={price} priceChange={priceChange} />
            <WatchlistStar
              stockIsin={selectedIsuCd}
              stockExchangeStatus={currentStatus ? "listing" : "otc"}
              is_in_watchlist={!!selectedOption?.is_in_watchlist}
              watchlist_id={selectedOption?.watchlist_item_id ?? null}
              hasShare={!!selectedOption}
              size={24}
              key={selectedIsuCd}
              onChange={onWatchlistChangeRefetch}
            />

            <div className=" sm:block lg:hidden md:hidden w-auto min-w-0">
              {selectedOption && (
                <select
                  value={selectedIsuCd}
                  onChange={handleStockTypeChange}
                  className="block w-full max-w-full sm:max-w-[95vw] truncate px-1 py-2 border border-default rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  {stockTypeOptions.map(option => (
                    <option key={option.value} value={option.value} className="truncate">
                      {t(`issuer_profile.${option.type}` as any)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Dropdown */}

      <div className="hidden md:block lg:block">
        {selectedOption && (
          <select
            value={selectedIsuCd}
            onChange={handleStockTypeChange}
            className="px-1 py-2 border border-default rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition "
          >
            {stockTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {t(`issuer_profile.${option.type}` as any)}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export { StockCard };
