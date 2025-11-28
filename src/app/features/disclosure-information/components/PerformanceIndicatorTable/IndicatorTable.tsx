"use client";

import { useEffect, useState } from "react";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import FormatNumbers from "@/app/shared/format-number";
import { transformData, isRatio } from "./utils/finIndicatorTransform";
import { useTranslations } from "next-intl";

interface Row {
  title: string;
  [year: string]: number | string;
}

export function FinancialIndicatorsTable({ organizationId }: { organizationId: number }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const t = useTranslations("finindicator_table");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await FetchService.fetch(`/api/v2/reports/financial_indicators/?organization_id=${organizationId}`);
        const { rows: transformedRows, years: transformedYears } = transformData(((res as any).results || []) as any);
        setRows(transformedRows as any);
        setYears(transformedYears);
      } catch (e) {
        console.error("Failed to load financial indicators", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [organizationId]);

  const renderTable = (type: "ratios" | "sums") => {
    const filtered = rows.filter(row => (type === "ratios" ? isRatio(row.title) : !isRatio(row.title)));

    return (
      <div className="overflow-auto border rounded-xl mb-6">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-xs text-gray-600 font-semibold">
              <th className="p-3 border border-default">Indicators</th>
              {years.map(year => (
                <th key={year} className="p-3 border border-default text-center">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.title}>
                <td className="p-3 font-medium text-gray-700 border border-default bg-gray-50">
                  {t(row.title as any) || row.title.replaceAll("_", " ")}
                </td>
                {years.map(year => {
                  const val = row[year];
                  let formatted: React.ReactNode = "-"; // ✅ start with default

                  if (val !== "-" && val !== undefined && val !== null) {
                    formatted =
                      type === "ratios" ? (
                        <>{Number(val).toFixed(2)}%</>
                      ) : (
                        <FormatNumbers value={Number(val)} showCurrency={true} colorByValue={false} />
                      );
                  }

                  return (
                    <td key={year} className="p-3 text-center border border-default">
                      {formatted}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <>
      <h2 className="font-semibold text-lg mb-2"> {t("sums" as any)}</h2>
      {renderTable("sums")}
      <h2 className="font-semibold text-lg mb-2">{t("ratios" as any)}</h2>
      {renderTable("ratios")}
    </>
  );
}
