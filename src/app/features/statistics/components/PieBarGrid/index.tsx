import PieChart from "@/app/shared/charts/PieChart";
import { UzbekistanMap } from "./UzbekistanMap";

export const PieBarGrid = () => {
  const chartData = [
    { percentage: 75, value: 450, label: "Всего эмитентов" },
    { percentage: 75, value: 450, label: "Всего эмитентов" },
    { percentage: 75, value: 450, label: "Всего эмитентов" },
    { percentage: 75, value: 450, label: "Всего эмитентов" },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-start gap-4 md:gap-6 lg:gap-8 w-full">
      <div className="w-full lg:w-2/3 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-4 mx-auto">
            <div className="relative">
              <PieChart
                percentage={item.percentage}
                size={84}
                strokeWidth={15}
                bgColor="transparent"
                fillColor="#007AFF"
              />
            </div>
            <span className="text-blue-700 text-xl font-bold">{item.value}</span>
            <span className="text-blue-700 text-xs text-center">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="w-full lg:w-1/3 mt-4 lg:mt-0">
        <UzbekistanMap />
      </div>
    </div>
  );
};
