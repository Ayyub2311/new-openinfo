export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface GridLineConfig {
  show?: boolean;
  count?: number;
  color?: string;
  opacity?: number;
  width?: number;
  dashArray?: string;
  showLabels?: boolean;
  labelFormatter?: (value: number) => string;
  labelClassName?: string;
}

export interface LineDataPoint {
  label: string;
  value: number;
}

export interface LineDataSet {
  name: string;
  color: string;
  data: LineDataPoint[];
}
