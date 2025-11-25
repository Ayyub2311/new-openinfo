// Type definitions from our calculator functions
export type Board = "main" | "nego" | "fop" | "ipo";
export type StockType = "STK" | "SMS" | "BND" | "SMB";
export type OperationType = "buy" | "sell";
export type OperationContinueType = "1" | "2"; // '1' for first-hand, '2' for second-hand

// Functions from our calculator
export function calculateCommissionRate(board: Board, stockType: StockType, transactionAmount: number): number {
  const isLessThanTenBillion = transactionAmount <= 10000000000;
  const isLessThanHundredBillion = transactionAmount <= 100000000000;

  switch (board) {
    case "main":
      switch (stockType) {
        case "STK":
          return isLessThanTenBillion ? 0.36 : 0.26;
        case "BND":
          return 0.0555;
        case "SMS":
          return isLessThanTenBillion ? 0.48 : 0.38;
        case "SMB":
          return 0.131;
        default:
          return 0;
      }
    case "nego":
      switch (stockType) {
        case "STK":
          return isLessThanHundredBillion ? 0.26 : 0.16;
        case "BND":
          return 0.0555;
        case "SMS":
          return isLessThanHundredBillion ? 0.48 : 0.38;
        case "SMB":
          return 0.091;
        default:
          return 0;
      }
    case "fop":
      switch (stockType) {
        case "STK":
        case "SMS":
          return 0.1;
        default:
          return 0;
      }
    case "ipo":
      switch (stockType) {
        case "STK":
          return 0.3;
        default:
          return 0;
      }
    default:
      return 0;
  }
}

export function calculateTaxRateWhenSell(board: Board, stockType: StockType): number {
  switch (board) {
    case "main":
    case "nego":
    case "fop":
    case "ipo":
      switch (stockType) {
        case "STK":
        case "BND":
          return 0.01;
        case "SMS":
        case "SMB":
          return 0.3;
        default:
          return 0;
      }
    default:
      return 0;
  }
}

export function calculateCommissionCostsSell(
  transactionAmount: number,
  commissionRate: number,
  brokerCommission: number,
  operationType: OperationContinueType,
  taxRate: number
): number {
  const exchangeCommission = (transactionAmount * commissionRate) / 100;
  const brokerFee = transactionAmount * (brokerCommission / 100);

  if (operationType === "1") {
    return exchangeCommission + brokerFee;
  } else {
    const tax = transactionAmount * (taxRate / 100);
    return exchangeCommission + brokerFee + tax;
  }
}

export function calculateCommissionCostsBuy(
  transactionAmount: number,
  commissionRate: number,
  brokerCommission: number
): number {
  const exchangeCommission = (transactionAmount * commissionRate) / 100;
  const brokerFee = transactionAmount * (brokerCommission / 100);
  return exchangeCommission + brokerFee;
}

export function calculateTotalCostsSell(transactionAmount: number, commissionCosts: number): number {
  return transactionAmount - commissionCosts;
}

export function calculateTotalCostsBuy(transactionAmount: number, commissionCosts: number): number {
  return transactionAmount + commissionCosts;
}
