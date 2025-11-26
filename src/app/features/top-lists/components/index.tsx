"use client";

import { useEffect, useState } from "react";
import { Table } from "@/app/shared/ui/components/Table";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { useTranslations } from "next-intl";
import OrgLogo from "@/app/shared/default-logo";
import FormatNumbers from "@/app/shared/format-number";
import Container from "@/app/shared/ui/components/Container";

const TradeAnalyticsTables = () => {
  const [byDeals, setByDeals] = useState([]);
  const [byVolume, setByVolume] = useState([]);
  const t = useTranslations();

  useEffect(() => {
    const fetchData = async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      const formatDate = (date: Date) => date.toISOString().split("T")[0];
      const start = formatDate(startDate);
      const end = formatDate(endDate);

      try {
        const data = await FetchService.fetch<any>(
          `/api/v2/iuzse/trade-analytics/?start_date=${start}&end_date=${end}`
        );

        const createNameCell = (item: any) => (
          <div className="flex items-center gap-3 w-full max-w-full whitespace-normal">
            {/* {item.logo && (
              <Image
                src={`https://openinfo.uz/media/${item.logo}`}
                alt={item.ticker}
                width={24}
                height={24}
                className="object-contain rounded-sm shrink-0"
                unoptimized
              />

            )} */}
            <OrgLogo id={item.order} shortName={item.issuer_short_name} size={40} />
            <div className="flex flex-col">
              <span className="font-medium text-sm leading-snug break-words">{item.issuer_short_name}</span>
              <span className="text-xs text-600 font-normal">({item.ticker})</span>
            </div>
          </div>
        );

        setByDeals(
          data.top_issuers_by_transaction.slice(0, 5).map((item: any) => ({
            name: createNameCell(item),
            price: Number(item.total_transactions).toLocaleString("ru-RU"),
          }))
        );

        setByVolume(
          data.top_issuers_by_volume.slice(0, 5).map((item: any) => ({
            name: createNameCell(item),
            price: Number(item.total_volume).toLocaleString("ru-RU"),
          }))
        );
      } catch (error) {
        console.error("Error fetching trade analytics:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container className="flex flex-col md:flex-row gap-6"
    style={{
      padding: "0"
    }}>
      <div className="w-full md:w-1/2">
        <div className="d-flex flex-column mb-2">
          <h2 className="text-lg font-semibold  text-900 ">{t("TradeAnalytics.top_by_deals")}</h2>
          <span>({t("TradeAnalytics.last_30_days")})</span>
        </div>

        <Table
          columns={[
            { title: t("TradeAnalytics.issuer"), dataIndex: "name", className: "w-full" },
            { title: t("TradeAnalytics.deals"), dataIndex: "price", className: "text-right whitespace-nowrap" },
          ]}
          data={byDeals}
          bordered={false}
        />
      </div>
      <div className="w-full md:w-1/2">
        <div className="d-flex flex-column mb-2">
          <h2 className="text-lg font-semibold text-900 ">{t("TradeAnalytics.top_by_volume")}</h2>
          <span>({t("TradeAnalytics.last_30_days")})</span>
        </div>

        <Table
          columns={[
            { title: t("TradeAnalytics.issuer"), dataIndex: "name", className: "w-full" },
            {
              title: t("TradeAnalytics.volume"),
              dataIndex: "price",
              className: "text-right whitespace-nowrap",
              render: value => {
                if (typeof value === "string") {
                  const cleaned = value
                    .replace(/\u00A0/g, "") // remove non-breaking spaces
                    .replace(/\s/g, "") // remove regular spaces just in case
                    .replace(",", "."); // convert decimal comma to dot

                  const numValue = Number(cleaned);
                  return isNaN(numValue) ? (
                    <span>-</span>
                  ) : (
                    <FormatNumbers value={numValue} colorByValue={false} showCurrency={false} />
                  );
                }

                return typeof value === "number" ? (
                  <FormatNumbers value={value} colorByValue={false} />
                ) : (
                  <span>-</span>
                );
              },
            },
          ]}
          data={byVolume}
          bordered={false}
        />
      </div>
    </Container>
  );
};

export default TradeAnalyticsTables;
