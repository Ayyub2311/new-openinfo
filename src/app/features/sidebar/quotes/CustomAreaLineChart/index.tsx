"use client";
import React from "react";

interface AreaLineChartProps {
  data: { label: string; value: number }[];
  width?: number;
  height?: number;
  className?: string;
}

export const AreaLineChart: React.FC<AreaLineChartProps> = ({ data, width = 800, height = 400, className }) => {
  const padding = { top: 40, right: 40, bottom: 40, left: 50 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.value)) * 1.02; // Slightly scale up for better visuals
  const minValue = Math.min(...data.map(d => d.value)) * 0.98;

  const points = data.map((d, i) => ({
    x: padding.left + (i * graphWidth) / (data.length - 1),
    y: padding.top + graphHeight - ((d.value - minValue) * graphHeight) / (maxValue - minValue),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + graphHeight} L ${
    points[0].x
  } ${padding.top + graphHeight} Z`;

  const gradientId = `gradient-${Math.random()}`;

  return (
    <div className={className}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* Gradient Background */}
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#EEF2FF" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Area Fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} className="transition-all duration-500 ease-in-out" />

        {/* Line */}
        <path
          d={linePath}
          stroke="#4F46E5"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />

        {/* Dots with Animation */}
        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={6}
            fill="white"
            stroke="#4F46E5"
            strokeWidth={2}
            className="hover:scale-125 transition-transform duration-300 ease-in-out"
          />
        ))}
      </svg>
    </div>
  );
};
