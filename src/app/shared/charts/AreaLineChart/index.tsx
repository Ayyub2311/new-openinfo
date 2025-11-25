"use client"
import { AreaLineChartProps } from "./types";

const defaultProps: Partial<AreaLineChartProps> = {
  width: 800,
  height: 400,
  padding: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  colors: {
    line: "#4F46E5",
    area: {
      from: "#4F46E5",
      to: "#EEF2FF",
    },
    dots: {
      border: "#4F46E5",
      fill: "#FFFFFF",
    },
  },
  smoothing: 0.3,
  id: "area-line-chart"
};

export const AreaLineChart: React.FC<AreaLineChartProps> = props => {
  const {
    data,
    width,
    height,
    className,
    padding,
    colors,
    maxValue: customMaxValue,
    smoothing,
    lineType,
    id
  } = { ...defaultProps, ...props };

  const graphWidth = width! - padding!.left - padding!.right;
  const graphHeight = height! - padding!.top - padding!.bottom;
  const maxValue = customMaxValue || Math.max(...data.map(d => d.value));

  // Создаем массив точек
  const points = data.map((d, i) => ({
    x: padding!.left + (i * graphWidth) / (data.length - 1),
    y: padding!.top + graphHeight - (d.value * graphHeight) / maxValue,
  }));

  // Функция для создания плавной кривой
  const createSmoothLine = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length < 2) return "";

    const path = [];
    path.push("M", pts[0].x, pts[0].y);

    for (let i = 0; i < pts.length - 1; i++) {
      const current = pts[i];
      const next = pts[i + 1];

      const controlPoint1X = current.x + (next.x - current.x) * smoothing!;
      const controlPoint1Y = current.y;
      const controlPoint2X = next.x - (next.x - current.x) * smoothing!;
      const controlPoint2Y = next.y;

      path.push("C", controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y, next.x, next.y);
    }

    return path.join(" ");
  };

  // Функция для создания прямой линии
  const createStraightLine = (pts: Array<{ x: number; y: number }>) => {
    return pts.map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  };

  // Создаем path для линии в зависимости от типа
  const linePath = lineType === "curved" ? createSmoothLine(points) : createStraightLine(points);

  // Создаем path для области
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding!.top + graphHeight} L ${points[0].x} ${
    padding!.top + graphHeight
  } Z`;

  const gradientId = `areaGradient-${id}`;

  return (
    <div className={className}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors!.area.from} stopOpacity="0.2" />
            <stop offset="100%" stopColor={colors!.area.to} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Область под линией */}
        <path d={areaPath} fill={`url(#${gradientId})`} className="transition-all duration-300" />

        {/* Основная линия */}
        <path d={linePath} stroke={colors!.line} strokeWidth={2} fill="none" className="transition-all duration-300" />

        {/* Точки */}
        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={colors!.dots.fill}
            stroke={colors!.dots.border}
            strokeWidth={2}
            className="transition-all duration-300"
          />
        ))}
      </svg>
    </div>
  );
};
