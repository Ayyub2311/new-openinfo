import { ChartLabelIndicatorProps } from "./types";

const sizeClasses = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
};

export const ChartLabelIndicator = ({ color, size = "sm", className }: ChartLabelIndicatorProps) => (
  <div className={`${sizeClasses[size]} rounded-xl ${color} ${className}`} role="presentation" />
);
