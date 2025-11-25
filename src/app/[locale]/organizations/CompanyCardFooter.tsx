// CompanyCardFooter.tsx
import { useTranslations } from "next-intl";
import React from "react";

interface CompanyCardFooterProps {
  inn: string;
  status: string;
  statusDate: string;
  innLabel?: string;
  statusLabel?: string;
  statusDateLabel?: string;
  isListing?: boolean;
}

const CompanyCardFooter: React.FC<CompanyCardFooterProps> = ({ inn, status }) => {
  const t = useTranslations();

  const statusBadgeColor = {
    active: "bg-green-100 text-green-700 border border-green-200",
    ceased: "bg-red-100 text-red-700 border border-red-200",
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    default: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  const getStatusClass = (key: string) =>
    statusBadgeColor[key as keyof typeof statusBadgeColor] || statusBadgeColor.default;

  return (
    <div className="w-full bg-slate-50 px-4 py-3 rounded-b border-t border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-700 text-center sm:text-left">
        {/* INN */}
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
          <span className="font-medium">{t("issuer_profile.registration_numbers.inn")}</span>
          <span className="inline-block rounded-full px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            {inn ?? "-"}
          </span>
        </div>

        {/* Status RFB */}
        {/* <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
          <span className="font-medium">{t("issuer_profile.rfb_status")}</span>
          <span className="inline-block rounded-full px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            {isListing ?? "-"}
          </span>
        </div> */}

        {/* Status */}
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
          <span className="font-medium">{t("issuer_profile.status_activity")}</span>
          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(status)}`}>
            {t(`status_activity.${status}` as any)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompanyCardFooter;
