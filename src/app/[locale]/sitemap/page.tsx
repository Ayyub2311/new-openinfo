"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

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
    <div className="container mx-auto px-4 py-10 text-[#124483]">
      <ul className="space-y-6 text-[1.1rem] font-medium">
        {navLinks.map((link, idx) => (
          <li key={idx} className="relative pl-6">
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-[#1c6ff4] shadow-sm opacity-80"></span>
            <Link
              href={link.href}
              className="text-[#277cf5] border-b border-dashed border-[#e6f0fd] hover:text-[#10376a] hover:border-b-2 hover:border-[#124483]"
            >
              {link.text}
            </Link>
          </li>
        ))}

        <li className="mt-8">
          <span className="uppercase font-bold text-[#144276] text-[0.95rem] mb-2 block"></span>
          <ul className="space-y-3 border-l-2 border-[#e6f0fd] ml-4 pl-4">
            {externalLinks.map((link, idx) => (
              <li key={idx} className="relative pl-6">
                <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-[#1c6ff4] opacity-80"></span>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="italic text-[#277cf5] hover:text-[#10376a]"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}
