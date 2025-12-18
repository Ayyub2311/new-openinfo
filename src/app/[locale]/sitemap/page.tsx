"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AppstoreOutlined } from "@ant-design/icons";

export default function SiteMapPage() {
  const t = useTranslations();

  const navLinks = [
    { text: t("Navigation.main"), href: "/" },
    { text: t("Navigation.license_certification"), href: "/license-certification" },
    { text: t("Navigation.organizations"), href: "/organizations" },
    { text: t("Navigation.investment_brokers"), href: "/investment-brokers" },
    { text: t("Navigation.legislation"), href: "/legislation" },
  ];

  const externalLinks = [
    {
      text: t("Navigation.issuer_profile"),
      href: "https://openinfo.uz/ru/admin/login/?next=/ru/admin/",
    },
    {
      text: t("Navigation.investor_account"),
      href: "https://invest.openinfo.uz/before-login",
    },
  ];

  return (
    <div className="container mx-auto px-4 lg:px-8 xl:px-0 py-10 text-[#124483]">
      <h2 className="text-xl font-semibold text-[#124483] mb-5">{t("Navigation.navigation_title")}</h2>

      <ul className="space-y-6 text-[1.1rem] font-medium">
        {navLinks.map((link, idx) => (
          // <li key={idx} className="relative pl-6">
          //   <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-[#1c6ff4] shadow-sm opacity-80"></span>
          //   <Link
          //     href={link.href}
          //     className="text-[#277cf5] border-b border-dashed border-[#e6f0fd] hover:text-[#10376a] hover:border-b-2 hover:border-[#124483]"
          //   >
          //     {link.text}
          //   </Link>
          // </li>

          <div key={idx} className="flex flex-col gap-1 border-b pb-3 sm:pb-4 border-[#e6e6e6]">
            <Link
              href={link.href}
              className="flex items-start text-[#124483] font-semibold text-base sm:text-lg hover:text-[#0093e9]"
            >
              <AppstoreOutlined className="text-[#124483] min-w-[20px] mr-2 mt-0.5" />
              <span className="leading-snug">{link.text}</span>

            </Link>
          </div>
        ))}


        <ul className="space-y-3 ml-4 pl-4">
          {externalLinks.map((link, idx) => (
            // <li key={idx} className="relative pl-6">
            //   <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-[#1c6ff4] opacity-80"></span>
            //   <a
            //     href={link.href}
            //     target="_blank"
            //     rel="noopener noreferrer"
            //     className=" text-[#277cf5] hover:text-[#10376a]"
            //   >
            //     {link.text}
            //   </a>
            // </li>


            <div key={idx} className="flex flex-col gap-1 border-b pb-3 sm:pb-4 border-[#e6e6e6]">
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start text-[#124483] font-semibold text-base sm:text-lg hover:text-[#0093e9]"
              >
                <AppstoreOutlined className="text-[#124483] min-w-[20px] mr-2 mt-0.5" />
                <span className="leading-snug">{link.text}</span>

              </a>
            </div>

          ))}
        </ul>
      </ul>
    </div>
  );
}
