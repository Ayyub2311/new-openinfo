import React from "react";
import { PieChartProps } from "./types";

const PieChart: React.FC<PieChartProps> = ({
  percentage = 96,
  size = 100,
  strokeWidth = 8,
  bgColor = "#E6F0FF",
  fillColor = "#3B82F6",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (percentage * circumference) / 100;
  const gapDash = ((100 - percentage) * circumference) / 100;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={bgColor} strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${gapDash}`}
          fill="none"
        />
      </svg>
      <span className="absolute text-xl font-semibold">{percentage}%</span>
    </div>
  );
};

export default PieChart;
