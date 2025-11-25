import { LineDataSet } from "../types";

export interface MultiLineChartProps {
  datasets: LineDataSet[];
  width?: number;
  height?: number;
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
  grid?: {
    show?: boolean;
    count?: number;
    color?: string;
    opacity?: number;
    width?: number;
    dashArray?: string;
    showValues?: boolean;
    valueFormatter?: (value: number) => string;
  };
  dots?: {
    show?: boolean;
    radius?: number;
    fill?: string;
  };
  lineSmoothing?: number;
}
