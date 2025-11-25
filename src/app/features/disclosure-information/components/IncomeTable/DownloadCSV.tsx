import { Button } from "@/app/shared/ui/components/Button";
import { Upload } from "lucide-react";
import React from "react";
type Cell = string | number;
type Row = Array<Cell>;

const DownloadCSV: React.FC<{ reports: Row[] }> = ({ reports }) => {
  // Функция для преобразования массива в строку CSV
  const convertToCSV = arr => {
    return arr.map(row => row.join(";")).join("\n");
  };

  // Функция для скачивания массива в формате CSV
  const downloadCSV = () => {
    const csvContent = convertToCSV(reports);

    // Создаем Blob объект с данными CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Создаем URL для Blob
    const url = URL.createObjectURL(blob);

    // Создаем временный элемент ссылки для скачивания
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.csv"); // Имя файла

    // Добавляем ссылку в DOM, запускаем скачивание и удаляем ссылку
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Очищаем URL объект
    URL.revokeObjectURL(url);
  };

  return (
    <Button color="export" onClick={downloadCSV} leftIcon={Upload}>
      Export
    </Button>
  );
};

export default DownloadCSV;
