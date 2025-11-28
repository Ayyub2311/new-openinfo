"use client";

import React from "react";
import { useLocale } from "next-intl";

type Locale = "en" | "ru" | "uz";

interface Props {
  value: number | string;
  className?: string;
  showCurrency?: boolean;
  colorByValue?: boolean;
  decimals?: number | "auto";
  suffix?: string;
}

export default function FormatNumbers({
  value,
  className = "",
  showCurrency = true,
  colorByValue = true,
  decimals = "auto",
  suffix = "",
}: Props) {
  const locale = useLocale() as Locale;

  if (value === null || value === undefined) return <span>-</span>;

  // Sanitize string input
  let parsedValue: number;
  if (typeof value === "string") {
    // Remove non-breaking spaces and replace comma with dot
    const cleaned = value.replace(/\s/g, "").replace(",", ".");
    parsedValue = parseFloat(cleaned);
  } else {
    parsedValue = value;
  }

  if (isNaN(parsedValue)) return <span>-</span>;

  const abs = Math.abs(parsedValue);
  // const number = (n: number) => n.toLocaleString(locale, { maximumFractionDigits: 1 });
  const number = (n: number) =>
    n.toLocaleString(locale, {
      minimumFractionDigits: decimals === "auto" ? (n % 1 === 0 ? 0 : 2) : decimals,
      maximumFractionDigits: decimals === "auto" ? (n % 1 === 0 ? 0 : 2) : decimals,
    });

  let bigSuffix = "";
  let factor = 1;

  if (abs >= 1_000_000_000_000) {
    bigSuffix = locale === "ru" ? "трлн" : locale === "uz" ? "trl" : "tn";
    factor = 1_000_000_000_000;
  } else if (abs >= 1_000_000_000) {
    bigSuffix = locale === "ru" ? "млрд" : locale === "uz" ? "mlrd" : "bn";
    factor = 1_000_000_000;
  } else if (abs >= 1_000_000) {
    bigSuffix = locale === "ru" ? "млн" : "mln";
    factor = 1_000_000;
  }

  const currency = locale === "uz" ? "so‘m" : "сум";
  const short = `${number(parsedValue / factor)} ${bigSuffix}${showCurrency ? ` ${currency}` : ""
    }${suffix ? suffix : ""}`;

  const full = `${parsedValue.toLocaleString(locale)}${showCurrency ? ` ${currency}` : ""}${suffix ? suffix : ""}`;

  const textColor =
    colorByValue && parsedValue < 0 ? "text-red-600" : colorByValue && parsedValue > 0 ? "text-green-600" : "";

  return (
    <div className="relative group inline-block">
      <span className={`${textColor} ${className}`}>{short}</span>
      <div className="absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded-xl px-2 py-1 -top-5 left-1/2 -translate-x-1/2 select-text whitespace-nowrap">
        {full}
      </div>
    </div>
  );
}
