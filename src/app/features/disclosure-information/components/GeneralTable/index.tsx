"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/app/shared/ui/components/Button";
import { useSearchParams } from "next/navigation";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { SplitPanelContainer } from "@/app/shared/ui/components/SplitPanel/SplitPanel";
import { Globe, AtSign } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import FormatNumbers from "@/app/shared/format-number";
import { StockCardPrice } from "@/app/shared/ui/containers/StockCard/StockCardPrice";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface GeneralTableProps {
  id: string | string[];
  isListing?: boolean | null;
}

const GeneralTable: React.FC<GeneralTableProps> = ({ id, isListing }) => {
  const searchParams = useSearchParams();
  const selectedIsuCd = searchParams.get("isu_cd");

  const [organization, setOrganization] = useState<any | null>(null);
  const [series, setSeries] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("1Y");

  const locale = useLocale();
  const t = useTranslations();

  const periods = ["1M", "3M", "6M", "1Y", "3Y"];

  const getTranslatedPeriod = (period: string) => {
    return t(`profile_emitents.period.${period.toLowerCase()}` as any);
  };

  useEffect(() => {
    if (!id) return;
    const fetchOrg = async () => {
      try {
        const response = await FetchService.fetch(`/api/v2/organizations/organizations/${id}/`);
        setOrganization(response);
      } catch (err) {
        console.error("Error fetching organization:", err);
      }
    };
    fetchOrg();
  }, [id, selectedIsuCd]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!organization || !selectedIsuCd) return;
      try {
        const { start_date, end_date } = calculateDates(selectedPeriod);

        const endpoint = isListing
          ? `/api/v2/iuzse/conclusions/?isu_cd=${selectedIsuCd}&start_date=${start_date}&end_date=${end_date}`
          : `/api/v2/iuzse/otc-conclusions/?isu_cd=${selectedIsuCd}&start_date=${start_date}&end_date=${end_date}`;

        const response = await FetchService.fetch<{ results: any[] }>(endpoint);

        const formatted = response.results
          .filter(item => item.close && item.close > 0)
          .map(item => [new Date(item.date).getTime(), Number(item.close.toFixed(2))])
          .reverse();

        setSeries([{ name: t("SecuritiesTableSidebar.price"), data: formatted }]);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    if (organization) fetchChartData();
  }, [selectedPeriod, selectedIsuCd, organization, isListing]);

  const calculateDates = (period: string) => {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case "1M":
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "3M":
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case "6M":
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case "1Y":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case "3Y":
        startDate.setFullYear(endDate.getFullYear() - 3);
        break;
    }

    return {
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
    };
  };

  const MONTH_TRANSLATIONS: Record<string, string> = {
    ru: {
      Jan: "Янв",
      Feb: "Фев",
      Mar: "Мар",
      Apr: "Апр",
      May: "Май",
      Jun: "Июн",
      Jul: "Июл",
      Aug: "Авг",
      Sep: "Сен",
      Oct: "Окт",
      Nov: "Ноя",
      Dec: "Дек",
    },
    uz: {
      Jan: "Yan",
      Feb: "Fev",
      Mar: "Mar",
      Apr: "Apr",
      May: "May",
      Jun: "Iyun",
      Jul: "Iyul",
      Aug: "Avg",
      Sep: "Sen",
      Oct: "Okt",
      Nov: "Noy",
      Dec: "Dek",
    },
  };

  const formatChartLabel = (timestamp: number, tab: string) => {
    const d = new Date(timestamp);
    const day = d.getDate();
    const year = String(d.getFullYear()).slice(2);

    const monthEng = d.toLocaleString("en-US", { month: "short" });
    const monthShort = MONTH_TRANSLATIONS[locale as "ru" | "uz"]?.[monthEng] ?? monthEng;

    if (tab === "1W" || tab === "1M") {
      return `${day} ${monthShort}`;
    }

    return `${day} ${monthShort} '${year}`;
  };

  const chartOptions = {
    chart: {
      id: "area-datetime",
      type: "area",
      zoom: {
        autoScaleYaxis: true,
      },
      toolbar: {
        show: true,
      },
    },
    grid: {
      padding: {
        top: 20,
        bottom: 0,
        left: 10,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      type: "datetime",
      tickAmount: 6,
      labels: {
        formatter: (value) => formatChartLabel(Number(value), selectedPeriod),
      },
    },
    tooltip: {
      x: {
        formatter: (value) => {
          const d = new Date(Number(value));
          const day = d.getDate();
          const year = String(d.getFullYear());

          const monthEng = d.toLocaleString("en-US", { month: "short" });
          const monthShort = MONTH_TRANSLATIONS[locale as "ru" | "uz"]?.[monthEng] ?? monthEng;

          return `${day} ${monthShort} ${year}`;
        }
      },
      y: {
        formatter: (val: number) => `${val.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
    markers: {
      size: 0,
      hover: {
        size: 6,
      },
    },
    colors: ["#3B82F6"],
  };
  const shares = isListing ? (organization?.uzse_info?.shares ?? []) : (organization?.otc_info?.shares ?? []);

  const selectedShare = selectedIsuCd ? shares.find(s => s?.isu_cd === selectedIsuCd) || shares[0] : shares[0];

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-6 ">
        {/* Chart Panel */}
        <div className="w-full lg:w-[70%]">
          <div className="p-3 rounded-xl border">
            <div className="flex flex-col ">
              <div className="flex flex-wrap gap-2">
                {periods.map(period => (
                  <Button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    color="gray"
                    variant="ghost"
                    size="sm"
                    className={`px-3 py-1.5 font-semibold text-gray-600 text-sm focus:bg-[#0369A1] active:bg-[#0369A1] ${selectedPeriod === period ? "bg-[#0369A1] text-white" : "bg-gray-100 "}`}
                  >
                    {getTranslatedPeriod(period)}
                  </Button>
                ))}
              </div>
              <div className="w-full overflow-x-auto">
                <ApexChart options={chartOptions as any} series={series} type="area" height={300} />
              </div>
            </div>
          </div>
        </div>

        {/* Side Info */}
        <div className="w-full lg:w-[30%]">
          <SplitPanelContainer
            orientation="vertical"
            items={[
              <StockCardPrice
                key="price"
                percentageChange={selectedShare?.price_change_percent || 0}
                price={selectedShare?.trade_price || selectedShare?.parval}
                priceChange={selectedShare?.price_change || 0}
                className={"justify-between"}
              />,

              <div key="contact" className="flex flex-col gap-4 justify-center">
                {organization?.web_site && (
                  <div className="flex items-center gap-2">
                    <Globe size={14} color="#4b5563" />
                    <a
                      href={
                        organization.web_site.startsWith("http")
                          ? organization.web_site
                          : `http://${organization.web_site}`
                      }
                      target="_blank"
                      className="font-semibold text-gray-600 text-sm hover:underline truncate"
                    >
                      {organization.web_site}
                    </a>
                  </div>
                )}
                {organization?.email && (
                  <div className="flex items-center gap-2">
                    <AtSign color="#4b5563" size={14} />
                    <a
                      href={`mailto:${organization.email}`}
                      className="font-semibold text-gray-600 text-sm hover:underline truncate"
                    >
                      {organization.email}
                    </a>
                  </div>
                )}
              </div>,
              <div key="meta" className="flex flex-col gap-2 h-full justify-center">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-600">{t("profile_emitents.market_cap")} </span>
                  <FormatNumbers
                    className="font-semibold"
                    value={
                      isListing
                        ? organization?.uzse_info?.market_capitalization
                        : organization?.otc_info?.market_capitalization
                    }
                  />
                </div>
                {(() => {
                  const shares = isListing
                    ? organization?.uzse_info?.shares || []
                    : organization?.otc_info?.shares || [];
                  const total = shares.reduce((sum, s) => sum + (s.list_shrs || 0), 0);

                  const getPercent = (type: string) => {
                    const count = shares.filter(s => s.type === type).reduce((s, c) => s + (c.list_shrs || 0), 0);
                    return total ? ((count / total) * 100).toFixed(2) : "0.00";
                  };

                  return (
                    <div className="">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-gray-600">{t("profile_emitents.preferred_stock")}</span>
                        <span className="font-semibold  text-[#0369A1]">{getPercent("Привилегированные акции")}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-gray-600">{t("profile_emitents.common_stock")}</span>
                        <span className="font-semibold text-[#0369A1] ">{getPercent("Простые акции")}%</span>
                      </div>
                    </div>
                  );
                })()}
              </div>,
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralTable;
