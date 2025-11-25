import Link from "next/link";
import { CardProps } from "./types";
import OrgLogo from "@/app/shared/default-logo";
import { useTranslations } from "next-intl";

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  className = "",
  width = 50,
  fact_number,
  object_id,
  org_id,
  org_short_name,
  logoFile,
}) => {
  const t = useTranslations();
  return (
    <div
      className={`flex flex-col justify-between p-4  rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      <div className="flex gap-4 items-start">
        <OrgLogo id={org_id} shortName={org_short_name} logoFile={logoFile} size={width} />
        <div className="flex flex-col min-w-0">
          {/* Org Name as link */}
          <Link
            href={`/organizations/${org_id}`}
            className="text-sm text-blue-700 font-medium hover:underline truncate"
          >
            {`${org_short_name}`}
          </Link>

          {/* Fact Title & Date */}
          <Link href={`/facts/${fact_number}/${object_id}`} className="mt-1">
            <h3 className="text-sm font-semibold leading-snug line-clamp-2 text-gray-900 dark:text-white">{title}</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">{subtitle}</span>
          </Link>
        </div>
      </div>
      <div className="mt-1">
        <Link
          href={`/facts/${fact_number}/${object_id}`}
          className="inline-block text-xs text-primary-600  font-medium"
        >
          {t("Actions.show_more")} →
        </Link>
      </div>
    </div>
  );
};

export default Card;
