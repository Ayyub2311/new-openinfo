// components/Chart.tsx
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { FC } from "react";

// ApexCharts must be dynamically imported in Next.js to avoid SSR issues
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
  series: ApexAxisChartSeries;
  options: ApexOptions;
  type?: "line" | "bar" | "area" | "donut" | "radar";
  height?: number;
  width?: number;
}

const Chart: FC<Props> = ({ series, options, type = "line", height = 350, width = "100%" }) => (
  <ApexChart options={options} series={series} type={type} height={height} width={width} />
);

export default Chart;
