import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react"; // Using lucide-react for icons
import Image from "next/image";

// Helper function for formatting numbers
const financial = (value: number): string => {
  return value.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// TypeScript interface for the data
interface ExchangeRateData {
  Ccy: string;
  Rate: string | number;
  Diff: number;
  change_percent: number;
  logo?: string;
}

interface ExchangeRatesTableProps {
  tableData: ExchangeRateData[];
  loading: boolean;
  t: (key: string) => string; // Translation function
}

const ExchangeRatesTable: React.FC<ExchangeRatesTableProps> = ({ tableData, loading, t }) => {
  return (
    <div className="w-full overflow-x-auto">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left">{t("ExchangeRatesTable.currency")}</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">{t("ExchangeRatesTable.rate")}</th>
              <th className="py-3 px-4 text-right">{t("ExchangeRatesTable.diff")}</th>
              <th className="py-3 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((record, index) => (
              <tr key={`${record.Ccy}-${index}`} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex gap-3 items-center">
                    {record.logo && (
                      <Image width={7} height={7} src={record.logo} className="w-7 h-7 rounded-full" alt={record.Ccy} />
                    )}

                    <span className="font-semibold text-blue-900">{record.Ccy}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-gray-900 font-semibold">
                    {record.Rate ? Number(record.Rate).toLocaleString("ru-RU") : "N/A"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-semibold ${record.Diff < 0 ? "text-red-500" : "text-green-500"}`}>
                    {financial(record.Diff)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end items-center">
                    {record.Diff > 0 ? (
                      <ArrowUp className="w-5 h-5 text-green-500" />
                    ) : record.Diff < 0 ? (
                      <ArrowDown className="w-5 h-5 text-red-500" />
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExchangeRatesTable;
