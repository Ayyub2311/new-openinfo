// app/shared/ui/components/UnlistedOrganizationNotice.tsx
import React from "react";
import Container from "@/app/shared/ui/components/Container";
import { useTranslations } from "next-intl";

const UnlistedOrganizationNotice = () => {
  const t = useTranslations() as (key: string) => string;

  return (
    <Container>
      <div className="flex flex-col items-center justify-center text-center mt-4 mb-4 py-20 px-6">
        {/* <img src="/images/unlisted-coming-soon.png" alt="Coming Soon" className="w-28 h-28 mb-6 opacity-70" /> */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{t("UnlistedNotice.title")}</h2>
        <p className="text-gray-600 text-base max-w-md">{t("UnlistedNotice.description")}</p>
        <p className="text-sm text-gray-400 mt-4">{t("UnlistedNotice.footer")}</p>
      </div>
    </Container>
  );
};

export default UnlistedOrganizationNotice;
