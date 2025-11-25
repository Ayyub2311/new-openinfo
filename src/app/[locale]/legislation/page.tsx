"use client";

import Container from "@/app/shared/ui/components/Container";
import { Link } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LegislationList() {
  const t = useTranslations();

  const laws = [
    {
      url: "https://lex.uz/docs/2662539",
      title: t("Legislation.law2"),
      subtitle: t("Legislation.legislation_law_on_sec"),
    },
    {
      url: "https://lex.uz/docs/5511879",
      title: t("Legislation.law1"),
      subtitle: t("Legislation.legislation_law_on_licesing"),
    },
    {
      url: "https://lex.uz/acts/108854",
      title: t("Legislation.law3"),
      subtitle: t("Legislation.legislation_law_on_exchange"),
    },
    {
      url: "https://lex.uz/docs/2731863",
      title: t("Legislation.law4"),
      subtitle: t("Legislation.legislation_on_investment"),
    },
    {
      url: "https://lex.uz/docs/5870213",
      title: t("Legislation.law5"),
      subtitle: t("Legislation.legislation_resolution_of_the_cabinet"),
    },
    {
      url: "https://lex.uz/docs/5877863",
      title: t("Legislation.law6"),
      subtitle: t("Legislation.legislation_cabinet_of_ministers"),
    },
    {
      url: "https://lex.uz/docs/244717",
      title: t("Legislation.law8"),
      subtitle: t("Legislation.legislation_resolution__of_the_no_189"),
    },
    {
      url: "https://lex.uz/docs/306777",
      title: t("Legislation.law9"),
      subtitle: t("Legislation.legislation_regulation_of_the_cabinet"),
    },
    {
      url: "https://lex.uz/uz/docs/4566059",
      title: t("Legislation.law10"),
      subtitle: t("Legislation.legislation_on_amendments_and_addition"),
    },
    {
      url: "https://lex.uz/docs/4236507",
      title: t("Legislation.law11"),
      subtitle: t("Legislation.legislation_on_amending_clause_1"),
    },
  ];

  return (
    <Container className="mt-10 mb-14 px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-[#124483] mb-5">{t("Legislation.legislation_title")}</h2>
      <div className="flex flex-col gap-4">
        {laws.map((law, idx) => (
          <div key={idx} className="flex flex-col gap-1 border-b pb-3 sm:pb-4 border-[#e6e6e6]">
            <a
              href={law.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start text-[#124483] font-semibold text-base sm:text-lg hover:text-[#0093e9]"
            >
              <Link className="text-[#124483] min-w-[20px] mr-2 mt-0.5" />
              <span className="leading-snug">{law.title}</span>
            </a>
            <span className="text-sm sm:text-base text-[#124483] ml-[26px]">{law.subtitle}</span>
          </div>
        ))}
      </div>
    </Container>
  );
}
