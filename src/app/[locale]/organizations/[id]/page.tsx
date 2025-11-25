"use client";

import { DisclosureOfInformationTabs } from "@/app/features/disclosure-information/components/DisclosureOfInformationTabs";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import Container from "@/app/shared/ui/components/Container";
import { StockCard } from "@/app/shared/ui/containers/StockCard";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

interface OrganizationData {
  id: number;
  is_listing: boolean;
  short_name_text: string;
  exchange_ticket_name: string;
  detailinfo?: {
    logo_file?: string;
  };
  info_rfb?: {
    default_isu_cd?: string;
  };
  uzse_info?: {
    shares?: {
      type: string;
      isu_cd: string;
      isu_srt_cd: string;
      trade_price: string;
      price_change: number;
      price_change_percent: number;
      parval: number | string;
      is_in_watchlist?: boolean;
      watchlist_item_id?: number;
    }[];
  };
  otc_info?: {
    shares?: {
      type: string;
      id: number;
      isu_cd: string;
      isu_srt_cd: string;
      trade_price: string;
      price_change: number;
      price_change_percent: number;
      parval: number | string;
      is_in_watchlist?: boolean;
      watchlist_item_id?: number;
      stock_id?: number | string;
    }[];
  };
}

const OrganizationPage = () => {
  const { id } = useParams();

  const [organization, setOrganization] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const isuCdFromQuery = searchParams.get("isu_cd");

  // const shares = organization?.uzse_info?.shares || [];
  const shares = useMemo(() => {
    return organization?.is_listing ? organization?.uzse_info?.shares || [] : organization?.otc_info?.shares || [];
  }, [organization]);

  const selectedShare = useMemo(() => {
    return (
      shares.find(share => share.isu_cd === isuCdFromQuery) ||
      shares.find(share => share.isu_cd === organization?.info_rfb?.default_isu_cd) ||
      shares[0]
    );
    // add all values read inside the memo:
  }, [shares, isuCdFromQuery, organization?.info_rfb?.default_isu_cd]);

  const stockTypeOptions = shares.map(share => ({
    label: share.type,
    value: share.isu_cd,
    type: share.type.includes("Привил") ? "privileged" : share.type.includes("Облигац") ? "bond" : "common",
    status_rfb: organization?.is_listing,
    is_in_watchlist: share?.is_in_watchlist,
    watchlist_item_id: share?.watchlist_item_id,
  }));

  // ✅ Memoize the fetcher so useEffect doesn't re-run on every render
  const fetchOrganization = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await FetchService.fetch<OrganizationData>(`/api/v2/organizations/organizations/${id}/`);
      setOrganization(res);
      setError(null);
    } catch (err) {
      console.error("Error fetching organization data:", err);
      setError("Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    (async () => {
      await fetchOrganization();
    })();
  }, [fetchOrganization]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  // if (organization?.is_listing === false) {
  //   return <UnlistedOrganizationNotice />;
  // }

  return (
    <Container>
      <div className="mt-[30px]">
        <StockCard
          orgId={organization.id}
          companyName={organization?.short_name_text || "Неизвестная компания"}
          percentageChange={selectedShare?.price_change_percent?.toFixed(2) || "0.00"}
          price={parseFloat(selectedShare?.trade_price || `${selectedShare?.parval}` || "0.00")}
          priceChange={parseFloat(selectedShare?.price_change?.toFixed(2) || "0.00")}
          ticker={selectedShare?.isu_srt_cd || organization?.exchange_ticket_name || null}
          stockId={selectedShare?.type || "Неизвестный тип акций"}
          companyLogo={organization?.detailinfo?.logo_file || null}
          stockTypeOptions={stockTypeOptions}
          status_rfb={organization?.is_listing}
          is_item_in_watchlist={selectedShare?.is_in_watchlist}
          watchlist_item_id={selectedShare?.watchlist_item_id}
          onWatchlistChangeRefetch={fetchOrganization}
        />
      </div>
      <div className=" mb-[30px]">
        <DisclosureOfInformationTabs
          organization={organization}
          tickerName={selectedShare?.isu_srt_cd || organization?.exchange_ticket_name || "Неизвестный тикер"}
        />
      </div>
    </Container>
  );
};

export default OrganizationPage;
