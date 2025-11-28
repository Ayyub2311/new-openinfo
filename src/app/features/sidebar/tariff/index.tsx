import FormItem from "@/app/shared/ui/components/FormItem";
import Input from "@/app/shared/ui/components/Input";
import Radio from "@/app/shared/ui/components/Radio";
// import Tabs from "@/app/shared/ui/components/Tabs";
import { Text } from "@/app/shared/ui/components/Typography/Text";
import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import {
  Board,
  calculateCommissionCostsBuy,
  calculateCommissionCostsSell,
  calculateCommissionRate,
  calculateTaxRateWhenSell,
  calculateTotalCostsBuy,
  calculateTotalCostsSell,
  OperationContinueType,
  OperationType,
  StockType,
} from "./calculator";

// Map tab IDs to board types
const tabToBoard: Record<string, Board> = {
  g1: "main",
  t1: "nego",
  nc: "fop",
  ipo: "ipo",
};

const Calculator: React.FC = () => {
  // Basic inputs as strings for better UX
  const [quantityStr, setQuantityStr] = useState<string>("");
  const [unitPriceStr, setUnitPriceStr] = useState<string>("");
  const [brokerCommissionStr, setBrokerCommissionStr] = useState<string>("");

  // Operation types
  const [operationType, setOperationType] = useState<OperationType>("sell");
  const [operationContinue, setOperationContinue] = useState<OperationContinueType>("1");

  // Board and stock type
  const [activeTab, setActiveTab] = useState<string>("g1");
  const [stockType, setStockType] = useState<StockType>("STK");

  // Calculated values
  const [transactionAmount, setTransactionAmount] = useState<number>(0);
  const [commissionCosts, setCommissionCosts] = useState<number>(0);
  const [totalCosts, setTotalCosts] = useState<number>(0);

  // Convert string inputs to numbers for calculations
  const quantity = Number(quantityStr) || 0;
  const unitPrice = Number(unitPriceStr) || 0;
  const brokerCommission = Number(brokerCommissionStr) || 0;

  // Handle calculations
  useEffect(() => {
    // Calculate transaction amount
    const calculated = quantity * unitPrice;
    setTransactionAmount(calculated);

    // Get the board from the active tab
    const board = tabToBoard[activeTab];

    // Calculate commission rate
    const commissionRate = calculateCommissionRate(board, stockType, calculated);

    if (operationType === "sell") {
      // Calculate tax rate for sell operations
      const taxRate = calculateTaxRateWhenSell(board, stockType);

      // Calculate commission costs
      const costs = calculateCommissionCostsSell(
        calculated,
        commissionRate,
        brokerCommission,
        operationContinue,
        taxRate
      );
      setCommissionCosts(costs);

      // Calculate total (net amount)
      setTotalCosts(calculateTotalCostsSell(calculated, costs));
    } else {
      // Calculate commission costs for buy
      const costs = calculateCommissionCostsBuy(calculated, commissionRate, brokerCommission);
      setCommissionCosts(costs);

      // Calculate total (total to pay)
      setTotalCosts(calculateTotalCostsBuy(calculated, costs));
    }
  }, [quantity, unitPrice, brokerCommission, operationType, operationContinue, activeTab, stockType]);

  return (
    <div className="w-full">
      <h2 className="text-lg font-medium mb-4">
        РАСЧЕТ СТОИМОСТИ РАСХОДОВ ПРИ СОВЕРШЕНИИ СДЕЛОК НА РФБ &quot;ТОШКЕНТ&quot;
      </h2>
      <div className="w-full space-y-4">
        <p className="font-medium mb-4 text-blue-500">Данные о ценной бумаге</p>
        <FormItem label="Quantity">
          <Input
            type="number"
            id="quantity"
            value={quantityStr}
            onChange={e => setQuantityStr(e.target.value)}
            placeholder="0"
          />
        </FormItem>
        <FormItem label="Price">
          <Input
            type="number"
            id="price"
            value={unitPriceStr}
            onChange={e => setUnitPriceStr(e.target.value)}
            placeholder="0"
          />
        </FormItem>
        <FormItem label="Broker Commission (%)">
          <Input
            type="number"
            id="brokerCommission"
            value={brokerCommissionStr}
            onChange={e => setBrokerCommissionStr(e.target.value)}
            placeholder="0"
          />
        </FormItem>

        <Text variant="accent">Transaction Type</Text>
        <div className="flex flex-col gap-4 mt-5">
          <div className="flex gap-4">
            <Radio
              label="Покупка"
              value="buy"
              checked={operationType === "buy"}
              onChange={() => setOperationType("buy")}
            />
            <Radio
              label="Продажа"
              value="sell"
              checked={operationType === "sell"}
              onChange={() => setOperationType("sell")}
            />
          </div>
          {operationType === "sell" && (
            <div className="flex gap-4">
              <Radio
                label="Первичное размещение"
                value="1"
                checked={operationContinue === "1"}
                onChange={() => setOperationContinue("1")}
              />
              <Radio
                label="Вторичное обращение"
                value="2"
                checked={operationContinue === "2"}
                onChange={() => setOperationContinue("2")}
              />
            </div>
          )}
        </div>

        <div className="w-full">
          <p className="font-medium mb-4 text-blue-500">Торговые площадки</p>
          <div className="w-full lg:w-[347px] overflow-x-auto">
            <Tabs
              items={[
                { key: "g1", label: "Main (G1)" },
                { key: "t1", label: "Nego (T1)" },
                { key: "nc", label: "FOP (NC)" },
                { key: "ipo", label: "IPO/SPO/PO" },
              ]}
              defaultActiveKey="1"
              onChange={tabId => setActiveTab(tabId)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 xl:grid-cols-4 mt-4">
            {["STK", "SMS", "BND", "SMB"].map(type => (
              <label
                key={type}
                className={`border rounded-xl py-1 px-3 flex items-center gap-2 justify-center cursor-pointer ${stockType === type ? "bg-blue-100 border-blue-500" : "border-black"
                  }`}
              >
                <input
                  type="radio"
                  name="stockType"
                  value={type}
                  checked={stockType === type}
                  onChange={() => setStockType(type as StockType)}
                  className="form-radio"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div>
            <label className="block font-medium mb-1">Сумма сделки:</label>
            <input
              type="text"
              value={transactionAmount.toLocaleString()}
              readOnly
              className="w-full border rounded-xl px-3 py-2 bg-gray-100 dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Итого комиссионные расходы:</label>
            <input
              type="text"
              value={commissionCosts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              readOnly
              className="w-full border rounded-xl px-3 py-2 bg-gray-100 dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              {operationType === "sell" ? "Общая сумма к получению составляет:" : "Общая сумма к оплате составляет:"}
            </label>
            <input
              type="text"
              value={totalCosts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              readOnly
              className="w-full border rounded-xl px-3 py-2 bg-gray-100 dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
