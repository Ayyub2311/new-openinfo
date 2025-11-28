"use client";

import Link from "next/link";
import CompanyCardFooter from "./CompanyCardFooter";
import Image from "next/image";
import OrgLogo from "@/app/shared/default-logo";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface TurnoverItem {
  year: number;
  transactions_count: number;
  transactions_amount: number;
}

interface CompanyCardProps {
  id?: number;
  clickable?: boolean;
  showFooter?: boolean;
  turnover?: TurnoverItem[];
  broker_number?: string;
  logoSrc?: string;
  companyName?: string;
  phone?: string;
  address?: string;
  email?: string;
  directorName?: string;
  rating?: number;
  websiteLabel?: string;
  websiteUrl?: string;
  countLabel?: string;
  amountLabel?: string;
  tradeLabel?: string;
  directorLabel?: string;
  className?: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  id,
  clickable = false,
  showFooter = false,
  turnover = [],
  logoSrc = "",
  companyName = "",
  phone,
  address,
  email,
  directorName,
  rating,
  tradeLabel = "Торги за",
  directorLabel = "Директор:",
  broker_number = "def",
  className = "",
}) => {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(() => {
    return Array.isArray(turnover) && turnover.length > 0 ? turnover[0].year : undefined;
  });

  const t = useTranslations();

  const [logoSize, setLogoSize] = useState(60);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 640)
        setLogoSize(60); // mobile
      else if (width < 1024)
        setLogoSize(70); // tablet
      else setLogoSize(80); // desktop
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className={`w-full rounded-xl border-2 border-default bg-white ${className}`}>
      <div className="px-3 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-x-6 ">
          {/* Logo */}

          <div className="flex-shrink-0 w-16 sm:w-20 ">
            <OrgLogo id={id} shortName={companyName} logoFile={logoSrc ?? null} size={logoSize} />
          </div>

          <div className="flex-1 min-w-0">
            {clickable && id ? (
              <Link href={`/organizations/${id}`}>
                <h2 className="text-base font-semibold text-sky-600 hover:underline cursor-pointer">{companyName}</h2>
              </Link>
            ) : (
              <h2 className="text-base font-semibold">{companyName}</h2>
            )}

            {phone && (
              <div className="mt-2 flex items-center">
                <div className="w-4 h-4 mr-2 text-black">
                  <Image src="/assets/broker-icons/ph_phone.svg" alt="Broker Icon" width={30} height={30} />
                </div>
                <span className="text-xs">{phone}</span>
              </div>
            )}

            {address && (
              <div className="mt-2 flex items-start">
                <div className="w-4 h-4 mr-2 mt-0.5 text-black">
                  <Image src="/assets/broker-icons/location.svg" alt="Broker Icon" width={30} height={30} />
                </div>
                <span className="text-xs">{address}</span>
              </div>
            )}

            {email && (
              <div className="mt-2 flex items-center">
                <div className="w-4 h-4 mr-2 text-black">
                  <Image src="/assets/broker-icons/email.svg" alt="Broker Icon" width={30} height={30} />
                </div>
                <span className="text-xs">{email}</span>
              </div>
            )}

            {directorName && (
              <div className="text-xs mt-2">
                <strong>{directorLabel}</strong> {directorName}
              </div>
            )}
            {rating && <div className="text-xs mt-1 text-gray-500">⭐ {rating}</div>}
          </div>

          {/* {websiteUrl && (
            <div className="flex flex-col items-end">
              <a
                className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-base font-semibold text-sky-700">{websiteLabel}</span>
              </a>
            </div>
          )} */}
        </div>
      </div>

      {showFooter && Array.isArray(turnover) && turnover.length > 0 && selectedYear !== undefined && (
        <CompanyCardFooter
          year={selectedYear}
          onYearChange={setSelectedYear}
          turnover={turnover}
          tradeLabel={tradeLabel}
          countLabel={t("investment_brokers_menu.quantity")}
          amountLabel={t("investment_brokers_menu.amount")}
          brokerNumber={broker_number}
        />
      )}
    </div>
  );
};

export default CompanyCard;
