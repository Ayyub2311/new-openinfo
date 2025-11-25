"use client";

import React from "react";
import { Badge } from "../../components/Badge";
import { ArrowUp, ArrowDown } from "lucide-react";
import FormatNumbers from "@/app/shared/format-number";

export const StockCardPrice: React.FC<{
  percentageChange: string;
  price: any;
  priceChange: number;
  className?: string;
}> = ({ price, priceChange, percentageChange, className = "" }) => {
  // Determine if priceChange is positive
  const isPositive = priceChange >= 0;

  return (
    <div className={`flex  lg:flex-row  gap-4 lg:gap-[30px] items-start lg:items-center w-full lg:w-auto ${className}`}>
      <div className="flex flex-col">
        <span className="text-lg lg:text-2xl font-bold leading-6 text-[#0369A1] whitespace-nowrap">
          {<FormatNumbers value={price} colorByValue={false} className="font-bold" showCurrency={false} />} UZS
        </span>

        <div className="flex items-center gap-1 text-sm whitespace-nowrap">
          {isPositive && <span className="text-green-500">+</span>}
          <span className={isPositive ? "text-[#22C55E]" : "text-red-500"}>
            {<FormatNumbers value={priceChange} showCurrency={false} colorByValue={false} />} UZS
          </span>
        </div>
      </div>
      <div className="flex self-start lg:self-auto">
        <Badge className="text-sm gap-1" size="md" variant={isPositive ? "success" : "danger"}>
          {isPositive ? (
            <ArrowUp size={18} className="text-[#22C55E]" />
          ) : (
            <ArrowDown size={18} className="text-red-500" />
          )}
          {percentageChange}%
        </Badge>
      </div>
    </div>
  );
};
