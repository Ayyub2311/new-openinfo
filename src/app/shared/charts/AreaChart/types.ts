import { ChartDataPoint, GridLineConfig } from "../types";

export interface AreaChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  areaColor?: {
    from: string;
    to: string;
  };
  lineColor?: string;
  lineWidth?: number;
  areaOpacity?: number;
  className?: string;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  maxValue?: number;
  showLabels?: boolean;
  labelClassName?: string;
  grid?: GridLineConfig;
  id?: string;
}
