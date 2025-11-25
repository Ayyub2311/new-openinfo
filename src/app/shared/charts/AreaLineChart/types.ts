import { LineDataPoint } from "../types";

export interface AreaLineChartProps {
  data: LineDataPoint[];
  width?: number;
  height?: number;
  className?: string;
  lineType?: "straight" | "curved";
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  colors?: {
    line: string;
    area: {
      from: string;
      to: string;
    };
    dots: {
      border: string;
      fill: string;
    };
  };
  maxValue?: number;
  smoothing?: number;
  id?: string;
}
