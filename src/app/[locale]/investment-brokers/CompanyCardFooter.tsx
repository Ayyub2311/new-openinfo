"use client";
import React from "react";
import FormatNumbers from "@/app/shared/format-number";
import { Badge } from "@/app/shared/ui/components/Badge";

interface CompanyCardFooterProps {
  year: number;
  onYearChange?: (newYear: number) => void;
  turnover: {
    year: number;
    transactions_count: number;
    transactions_amount: number;
  }[];
  tradeLabel?: string;
  countLabel?: string;
  amountLabel?: string;
  brokerNumber?: string;
}

const CompanyCardFooter: React.FC<CompanyCardFooterProps> = ({
  year,
  onYearChange,
  turnover,
  tradeLabel = "Торги за",
  countLabel = "Кол-во:",
  amountLabel = "Сумма:",
  brokerNumber,
}) => {
  if (!Array.isArray(turnover) || turnover.length === 0) return null;

  const data = turnover.find(t => t.year === year);
  const years = turnover.map(t => t.year).sort((a, b) => b - a);
  if (!data) return null;

  return (
    <div className="w-full bg-slate-100 px-4 py-3">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 text-center lg:text-left items-center lg:items-start">
        {/* Left group: Badge + Year Selector */}
        <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3">
          <Badge variant="primary" size="md" className="whitespace-nowrap">
            {brokerNumber && <div className="text-sm font-medium text-gray-600">№ {brokerNumber}</div>}
          </Badge>

          <div className="flex items-center px-4 py-1 bg-white rounded-full border border-sky-100 whitespace-nowrap">
            <span className="text-sm mr-2">{tradeLabel}</span>
            <select
              className="text-sm bg-transparent outline-none"
              value={year}
              onChange={e => onYearChange?.(parseInt(e.target.value))}
            >
              {years.map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right group: Stats */}
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-6 lg:gap-6">
          <div className="flex items-center whitespace-nowrap">
            <span className="text-sm font-semibold mr-2">{countLabel}</span>
            <span className="text-sm">{data.transactions_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center whitespace-nowrap">
            <span className="text-sm font-semibold mr-2">{amountLabel}</span>
            <span className="text-sm">
              <FormatNumbers value={data.transactions_amount} colorByValue={false} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCardFooter;
