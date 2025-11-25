"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import OrgLogo from "@/app/shared/default-logo";
import CompanyCardFooter from "./CompanyCardFooter";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { SubscribeToggle } from "@/app/features/sidebar/notification/SubscribeToggle";

const CompanyCard: React.FC<any> = ({
  id,
  clickable = false,
  inn,
  status_from_stat_uz,
  cessation_date,
  companyName = "",
  phone,
  isListing,
  address,
  email,
  directorName,
  rating,
  websiteUrl = "#",
  logoSrc,
  className = "",
  is_subscribed = false,
  subscription_id = null,
}) => {
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
    <div className={`w-full rounded border border-gray-300 bg-white ${className}`}>
      <div className="px-3 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-x-6 ">
          {/* Logo */}

          <div className="flex-shrink-0 w-16 sm:w-20 ">
            <OrgLogo
              id={id}
              shortName={companyName}
              size={logoSize}
              logoFile={logoSrc && `https://openinfo.uz/media/${logoSrc}`}
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3 text-sm">
            {clickable && id ? (
              <Link href={`/organizations/${id}`}>
                <h2 className="text-base font-semibold text-sky-600 break-words max-w-full hover:underline">
                  {companyName}
                </h2>
              </Link>
            ) : (
              <h2 className="text-base font-semibold break-words max-w-full">{companyName}</h2>
            )}

            {/* Phone */}
            <div className="flex items-center">
              <Image src="/assets/broker-icons/ph_phone.svg" alt="Phone" width={16} height={16} className="mr-2" />
              <span>{phone || "-"}</span>
            </div>

            {/* Address */}
            <div className="flex items-start">
              <Image
                src="/assets/broker-icons/location.svg"
                alt="Address"
                width={16}
                height={16}
                className="mr-2 mt-0.5"
              />
              <span>{address || "-"}</span>
            </div>

            {/* Email */}
            <div className="flex items-center">
              <Image src="/assets/broker-icons/email.svg" alt="Email" width={16} height={16} className="mr-2" />
              <span>{email || "-"}</span>
            </div>

            {/* Director */}
            <div>
              <strong>{t("issuer_profile.director")}:</strong> {directorName || "-"}
            </div>

            {/* Rating */}
            {rating && <div className="text-gray-500">⭐ {rating}</div>}
          </div>

          {/* Website link */}
          <div className="sm:flex-shrink-0 sm:self-start flex items-center gap-3">
            <a
              href={`http://${websiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-sky-700 font-semibold text-sm w-full sm:w-auto text-center"
            >
              {t("issuer_profile.website")}
            </a>
            <SubscribeToggle
              size={28}
              organizationId={id}
              isSubscribed={is_subscribed}
              subscriptionId={subscription_id}
            />
          </div>
        </div>
      </div>

      <CompanyCardFooter inn={inn} isListing={isListing} status={status_from_stat_uz} statusDate={cessation_date} />
    </div>
  );
};

export default CompanyCard;
