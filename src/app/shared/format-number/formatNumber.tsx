export function formatNumber(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) {
    return "0";
  }

  // Разделяем на целую и дробную части
  const parts = num.toFixed(2).split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Добавляем пробелы каждые 3 цифры справа
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // Убираем .00 для целых чисел
  if (decimalPart === "00") {
    return formattedInteger;
  }

  return `${formattedInteger}.${decimalPart}`;
}
