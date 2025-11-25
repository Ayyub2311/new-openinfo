// utils/Num.tsx (or keep inline in the same file)
import React from "react";

type NumProps = {
  value: number | null | undefined;
  decimals?: number;
  suffix?: string; // e.g. "%"
  className?: string;
  locale?: string; // default ru-RU for your project
};

const Num: React.FC<NumProps> = ({ value, decimals = 2, suffix, className, locale = "ru-RU" }) => {
  const num = Number(value ?? 0);
  const text = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);

  return (
    <span className={className}>
      {text}
      {suffix ? ` ${suffix}` : ""}
    </span>
  );
};

export default Num;
