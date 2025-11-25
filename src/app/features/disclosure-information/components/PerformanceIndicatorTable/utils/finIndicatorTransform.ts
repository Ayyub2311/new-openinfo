export const isRatio = (key: string): boolean => {
  const ratioKeys = [
    "return_on_assets",
    "return_on_equity",
    "cost_of_risk",
    "net_profit_margin",
    "debt_to_equity_ratio",
  ];
  return ratioKeys.includes(key);
};

export const transformData = (results: Record<string, any>[]): { rows: Record<string, any>[]; years: number[] } => {
  const yearSet = new Set<number>();
  const rowMap: Record<string, Record<string, any>> = {};

  results.forEach(item => {
    const year = item.reporting_year;
    yearSet.add(year);

    Object.entries(item).forEach(([key, val]) => {
      if (key === "reporting_year") return;
      if (!rowMap[key]) rowMap[key] = { title: key };
      rowMap[key][year] = val;
    });
  });

  return {
    rows: Object.values(rowMap),
    years: Array.from(yearSet).sort((a, b) => a - b),
  };
};
