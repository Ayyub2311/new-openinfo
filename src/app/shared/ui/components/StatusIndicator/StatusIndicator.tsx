import { StatusIndicatorProps } from "./types";

const sizeClasses = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
};

const statusColors = {
  active: "bg-green-500",
  inactive: "bg-gray-400",
  warning: "bg-amber-500",
  error: "bg-red-500",
};

export const StatusIndicator = ({ status, size = "sm", pulse = false, className }: StatusIndicatorProps) => (
  <div className="relative">
    {pulse && (
      <div
        className={`
          absolute 
          ${sizeClasses[size]} 
          rounded-full 
          ${statusColors[status]} 
          animate-ping 
          opacity-75
        `}
      />
    )}
    <div
      className={`
        relative
        ${sizeClasses[size]} 
        rounded-full 
        ${statusColors[status]} 
        ${className}
      `}
      role="status"
      aria-label={`Status: ${status}`}
    />
  </div>
);
