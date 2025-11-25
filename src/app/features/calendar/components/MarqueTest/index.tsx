"use client";
import { useTranslations } from "next-intl";

export default function TestModeBanner() {
  const t = useTranslations("TestMode");

  return (
    <div className="w-full bg-yellow-100 border-y border-yellow-400 overflow-hidden">
      <div className="flex animate-marquee space-x-8 whitespace-nowrap py-2">
        <span className="text-yellow-800 font-semibold">{t("message" as any)}</span>
        <span className="text-yellow-800 font-semibold">{t("message" as any)}</span>
        <span className="text-yellow-800 font-semibold">{t("message" as any)}</span>
        <span className="text-yellow-800 font-semibold">{t("message" as any)}</span>
        <span className="text-yellow-800 font-semibold">{t("message" as any)}</span>
        <span className="text-yellow-800 font-semibold">{t("message" as any)}</span>
      </div>
    </div>
  );
}
