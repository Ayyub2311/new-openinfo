import React from "react";

interface DataPoint {
  label: string;
  value: number;
  annotation?: string;
}

interface Dataset {
  name: string;
  color: string;
  data: DataPoint[];
  dashArray?: string;
}

interface MultiLineChartProps {
  datasets: Dataset[];
  width?: number;
  height?: number;
  className?: string;
  title?: string;
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

const defaultProps: Partial<MultiLineChartProps> = {
  width: 800,
  height: 300,
  title: "Growth Rates",
  padding: {
    top: 60,
    right: 40,
    bottom: 60,
    left: 60,
  },
  showLabels: true,
  labelClassName: "text-sm fill-gray-600",
  grid: {
    show: true,
    count: 6,
    color: "#E5E7EB",
    opacity: 0.5,
    width: 1,
    dashArray: "4,4",
    showValues: true,
    valueFormatter: (value: number) => `${value.toFixed(2)}%`,
  },
  dots: {
    show: true,
    radius: 4,
    fill: "white",
  },
  lineSmoothing: 0.3,
};

export const MultiLineChart: React.FC<MultiLineChartProps> = props => {
  const {
    datasets,
    width,
    height,
    className,
    title,
    padding,
    maxValue: customMaxValue,
    showLabels,
    labelClassName,
    grid,
    dots,
    lineSmoothing,
  } = { ...defaultProps, ...props };

  const mergedGrid = { ...defaultProps.grid, ...grid };
  const mergedDots = { ...defaultProps.dots, ...dots };

  const graphWidth = width! - padding!.left - padding!.right;
  const graphHeight = height! - padding!.top - padding!.bottom;

  // Find max value from all datasets
  const maxValue = customMaxValue || Math.max(...datasets.flatMap(dataset => dataset.data.map(d => d.value)));
  const minValue = Math.min(0, ...datasets.flatMap(dataset => dataset.data.map(d => d.value)));

  // Create smooth line function
  const createSmoothLine = (points: Array<[number, number]>) => {
    if (points.length < 2) return "";

    const smoothing = lineSmoothing!;
    const path = [];
    path.push("M", points[0][0], points[0][1]);

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      const controlPoint1X = current[0] + (next[0] - current[0]) * smoothing;
      const controlPoint1Y = current[1];
      const controlPoint2X = next[0] - (next[0] - current[0]) * smoothing;
      const controlPoint2Y = next[1];

      path.push("C", controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y, next[0], next[1]);
    }

    return path.join(" ");
  };

  // Create grid lines
  const createGridLines = () => {
    if (!mergedGrid.show) return null;

    const lines = [];
    const step = (maxValue - minValue) / (mergedGrid.count! - 1);

    for (let i = 0; i < mergedGrid.count!; i++) {
      const value = maxValue - step * i;
      const y = padding!.top + (graphHeight * i) / (mergedGrid.count! - 1);

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

  // Create lines with annotations
  const createLines = () => {
    return datasets.map(dataset => {
      const points = dataset.data.map((d, i) => [
        padding!.left + (i * graphWidth) / (dataset.data.length - 1),
        padding!.top + ((maxValue - d.value) * graphHeight) / (maxValue - minValue),
      ]) as Array<[number, number]>;

      return (
        <g key={dataset.name}>
          {/* Line */}
          <path
            d={createSmoothLine(points)}
            stroke={dataset.color}
            strokeWidth={2}
            strokeDasharray={dataset.dashArray}
            fill="none"
            className="transition-all duration-300"
          />

          {/* Dots and annotations */}
          {mergedDots.show &&
            points.map(([x, y], i) => {
              const annotation = dataset.data[i].annotation;
              return (
                <g key={`${dataset.name}-dot-${i}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={mergedDots.radius}
                    fill={mergedDots.fill}
                    stroke={dataset.color}
                    strokeWidth={2}
                    className="transition-all duration-300"
                  />
                  {annotation && (
                    <g transform={`translate(${x},${y - 20})`}>
                      <circle r="15" fill={dataset.color} className="opacity-20" />
                      <text
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fill={dataset.color}
                        className="text-sm font-medium"
                      >
                        {annotation}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
        </g>
      );
    });
  };

  return (
    <div className={className}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* Title */}
        <text x={padding!.left} y={padding!.top / 2} className="text-xl font-semibold fill-gray-900">
          {title}
        </text>

        {/* Legend */}
        <g transform={`translate(${width! - padding!.right - 200}, ${padding!.top / 2})`}>
          {datasets.map((dataset, i) => (
            <g key={dataset.name} transform={`translate(${i * 160}, 0)`}>
              <circle cx="0" cy="0" r="6" fill={dataset.color} />
              <text x="15" y="0" className={labelClassName} alignmentBaseline="middle">
                {dataset.name}
              </text>
            </g>
          ))}
        </g>

        {/* Grid */}
        {createGridLines()}

        {/* Lines */}
        {createLines()}

        {/* X-axis labels */}
        {showLabels &&
          datasets[0].data.map((point, index) => (
            <text
              key={`x-label-${index}`}
              x={padding!.left + (index * graphWidth) / (datasets[0].data.length - 1)}
              y={height! - padding!.bottom / 2}
              className={labelClassName}
              textAnchor="middle"
            >
              {point.label}
            </text>
          ))}
      </svg>
    </div>
  );
};

export default MultiLineChart;
