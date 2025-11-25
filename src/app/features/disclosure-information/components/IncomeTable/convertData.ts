/**
 * Функция для преобразования исходных данных в требуемый формат
 * @param {Array} inputData - Входной массив данных
 * @returns {Array} Преобразованный массив объектов
 */
export function convertData(inputData) {
  const resultMap = new Map();

  inputData.forEach((yearData, index) => {
    const reportingYear = yearData.reporting_year;

    yearData.accounting_report.forEach(report => {
      const key = `${report.title_id}_${report.tnum}`;

      // Format the value with Russian locale
      const formattedValue =
        report.value !== null && report.value !== undefined
          ? Number(report.value).toLocaleString("ru-RU", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : "-";

      if (resultMap.has(key)) {
        const existingRecord = resultMap.get(key);
        existingRecord[`value_${reportingYear}_${index}`] = formattedValue;
      } else {
        const newRecord = {
          title_id: report.title_id,
          title: report.title,
          tnum: report.tnum,
          [`value_${reportingYear}_${index}`]: formattedValue,
        };
        resultMap.set(key, newRecord);
      }
    });
  });

  return Array.from(resultMap.values());
}
