"use client";
import React, { useEffect, useRef, useState } from "react";
import { AreaChartProps } from "./types";

const defaultProps: Partial<AreaChartProps> = {
  areaColor: {
    from: "#2A83E4",
    to: "#CEEDFB",
  },
  lineColor: "#1256A0",
  lineWidth: 2,
  areaOpacity: 0.7,
  padding: {
    top: 20,
    right: 20,
    bottom: 40,
    left: 60,
  },
  showLabels: true,
  labelClassName: "text-xs fill-primary",
  grid: {
    show: true,
    count: 6,
    color: "#E5E7EB",
    opacity: 1,
    width: 1,
    dashArray: "",
    showLabels: true,
    labelFormatter: (value: number) => value.toLocaleString(),
    labelClassName: "text-xs fill-primary",
  },
  id: "area-chart",
};

export const AreaChart: React.FC<AreaChartProps> = props => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const {
    data,
    areaColor,
    lineColor,
    lineWidth,
    areaOpacity,
    className,
    padding,
    maxValue: customMaxValue,
    showLabels,
    labelClassName,
    grid,
    id,
  } = { ...defaultProps, ...props };

  const mergedGrid = { ...defaultProps.grid, ...grid };
  const graphWidth = dimensions.width - padding!.left - padding!.right;
  const graphHeight = dimensions.height - padding!.top - padding!.bottom;
  const maxValue = customMaxValue || Math.max(...data.map(d => d.value));

  const createPaths = () => {
    const points = data
      .map((d, i) => {
        const x = padding!.left + (i * graphWidth) / (data.length - 1);
        const y = padding!.top + graphHeight - (d.value * graphHeight) / maxValue;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const linePath = points;
    const areaPath = `${points} L ${padding!.left + graphWidth} ${padding!.top + graphHeight} L ${padding!.left} ${
      padding!.top + graphHeight
    } Z`;

    return { linePath, areaPath };
  };

  const createGridLines = () => {
    if (!mergedGrid.show) return null;

    const lines = [];
    const step = maxValue / (mergedGrid.count! - 1);

    for (let i = 0; i < mergedGrid.count!; i++) {
      const y = padding!.top + (graphHeight * i) / (mergedGrid.count! - 1);
      const value = maxValue - step * i;

      lines.push(
        <g key={`grid-line-${i}`}>
          <line
            x1={padding!.left}
            y1={y}
            x2={dimensions.width - padding!.right}
            y2={y}
            stroke={mergedGrid.color}
            strokeWidth={mergedGrid.width}
            strokeOpacity={mergedGrid.opacity}
            strokeDasharray={mergedGrid.dashArray}
          />
          {mergedGrid.showLabels && (
            <text
              x={padding!.left - 8}
              y={y}
              className={mergedGrid.labelClassName}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {mergedGrid.labelFormatter!(value)}
            </text>
          )}
        </g>
      );
    }

    return lines;
  };

  const { linePath, areaPath } = createPaths();
  const gradientId = `areaGradient-${id}`;

  return (
    <div ref={containerRef} className={`w-full h-full ${className || ""}`}>
      {dimensions.width > 0 && dimensions.height > 0 && (
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="50%" y1="0%" x2="50%" y2="100%" gradientUnits="userSpaceOnUse">
              <stop stopColor={areaColor!.from} />
              <stop offset="1" stopColor={areaColor!.to} />
            </linearGradient>
          </defs>

          {createGridLines()}

          <path
            d={areaPath}
            fill={`url(#${gradientId})`}
            fillOpacity={areaOpacity}
            className="transition-all duration-300"
          />

          <path
            d={linePath}
            stroke={lineColor}
            strokeWidth={lineWidth}
            fill="none"
            className="transition-all duration-300"
          />

          {showLabels &&
            data.map((point, index) => (
              <text
                key={`x-label-${index}`}
                x={padding!.left + (index * graphWidth) / (data.length - 1)}
                y={dimensions.height - padding!.bottom / 2}
                className={labelClassName}
                textAnchor="middle"
              >
                {point.label}
              </text>
            ))}
        </svg>
      )}
    </div>
  );
};

export default AreaChart;
