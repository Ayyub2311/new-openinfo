type Locale = "en" | "ru" | "uz";

export function formatMoney(value: number, locale: Locale = "en") {
  if (value === null || value === undefined) {
    return "-";
  }
  console.log(value, "locale");
  const abs = Math.abs(value);
  const number = (n: number) => n?.toLocaleString(undefined, { maximumFractionDigits: 1 });

  if (abs >= 1_000_000_000) {
    const label = locale === "ru" ? "млрд" : locale === "uz" ? "mlrd" : "bn";
    return `${number(value / 1_000_000_000)} ${label}`;
  } else if (abs >= 1_000_000) {
    const label = locale === "ru" ? "млн" : "mln";
    return `${number(value / 1_000_000)} ${label}`;
  } else {
    return `${number(value)} ${locale === "uz" ? "so‘m" : "сум"}`;
  }
}
