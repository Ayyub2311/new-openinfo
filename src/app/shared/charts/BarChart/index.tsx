import React from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface Dataset {
  name: string;
  color: string;
  data: DataPoint[];
}

interface BarChartProps {
  datasets: Dataset[];
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
  barWidth?: number;
  barOpacity?: number;
  showValues?: boolean;
  valueClassName?: string;
}

const defaultProps: Partial<BarChartProps> = {
  width: 800,
  height: 300,
  padding: {
    top: 20,
    right: 20,
    bottom: 40,
    left: 60,
  },
  showLabels: true,
  labelClassName: "text-xs fill-black/90",
  grid: {
    show: true,
    count: 6,
    color: "#E5E7EB",
    opacity: 0.5,
    width: 1,
    dashArray: "",
    showValues: true,
    valueFormatter: (value: number) => value.toLocaleString(),
  },
  barWidth: 40,
  barOpacity: 1,
  showValues: true,
  valueClassName: "text-xs fill-black/90",
};

export const BarChart: React.FC<BarChartProps> = props => {
  const {
    datasets,
    width,
    height,
    className,
    padding,
    maxValue: customMaxValue,
    showLabels,
    labelClassName,
    grid,
    barWidth,
    barOpacity,
    showValues,
    valueClassName,
  } = { ...defaultProps, ...props };

  const mergedGrid = { ...defaultProps.grid, ...grid };
  const graphWidth = width! - padding!.left - padding!.right;
  const graphHeight = height! - padding!.top - padding!.bottom;

  // Calculate maximum value and data points per dataset
  const maxValue = customMaxValue || Math.max(...datasets.flatMap(dataset => dataset.data.map(d => d.value)));
  const dataPoints = datasets[0].data.length;
  const totalDatasets = datasets.length;

  // Calculate bar group dimensions
  const groupWidth = graphWidth / dataPoints;
  const totalBarWidth = barWidth! * totalDatasets;
  const barSpacing = (groupWidth - totalBarWidth) / 2;

  // Create grid lines
  const createGridLines = () => {
    if (!mergedGrid.show) return null;

    const lines = [];
    for (let i = 0; i < mergedGrid.count!; i++) {
      const y = padding!.top + (graphHeight * i) / (mergedGrid.count! - 1);
      const value = maxValue - (maxValue * i) / (mergedGrid.count! - 1);

      lines.push(
        <g key={`grid-line-${i}`}>
          <line
            x1={padding!.left}
            y1={y}
            x2={width! - padding!.right}
            y2={y}
            stroke={mergedGrid.color}
            strokeWidth={mergedGrid.width}
            strokeOpacity={mergedGrid.opacity}
            strokeDasharray={mergedGrid.dashArray}
          />
          {mergedGrid.showValues && (
            <text x={padding!.left - 10} y={y} className={labelClassName} textAnchor="end" dominantBaseline="middle">
              {mergedGrid.valueFormatter!(value)}
            </text>
          )}
        </g>
      );
    }
    return lines;
  };

  // Create bars
  const createBars = () => {
    return datasets.map((dataset, datasetIndex) => (
      <g key={dataset.name}>
        {dataset.data.map((point, pointIndex) => {
          const x = padding!.left + pointIndex * groupWidth + barSpacing + datasetIndex * barWidth!;
          const barHeight = (point.value * graphHeight) / maxValue;
          const y = height! - padding!.bottom - barHeight;

          return (
            <g key={`${dataset.name}-${pointIndex}`}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={dataset.color}
                fillOpacity={barOpacity}
                className="transition-all duration-300 hover:opacity-80"
              />
              {showValues && (
                <text x={x + barWidth! / 2} y={y - 5} className={valueClassName} textAnchor="middle">
                  {point.value}
                </text>
              )}
            </g>
          );
        })}
      </g>
    ));
  };

  return (
    <div className={className}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* Grid */}
        {createGridLines()}

        {/* Bars */}
        {createBars()}

        {/* X-axis labels */}
        {showLabels &&
          datasets[0].data.map((point, index) => (
            <text
              key={`x-label-${index}`}
              x={padding!.left + index * groupWidth + groupWidth / 2}
              y={height! - padding!.bottom / 2}
              className={labelClassName}
              textAnchor="middle"
            >
              {point.label}
            </text>
          ))}

        {/* Legend */}
        <g transform={`translate(${padding!.left}, ${padding!.top / 2})`}>
          {datasets.map((dataset, index) => (
            <g key={dataset.name} transform={`translate(${index * 120}, 0)`}>
              <rect width="12" height="12" fill={dataset.color} />
              <text x="20" y="10" className={labelClassName}>
                {dataset.name}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default BarChart;
