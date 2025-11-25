import { SwitchProps } from "./types";

export const Switch = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  size = "md",
  color = "blue",
}: SwitchProps) => {
  const sizeClasses = {
    sm: "w-8 h-4",
    md: "w-11 h-6",
    lg: "w-14 h-7",
  };

  const thumbSizeClasses = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const colorClasses = {
    blue: "bg-blue-600 peer-focus:ring-blue-300",
    green: "bg-green-600 peer-focus:ring-green-300",
    red: "bg-red-600 peer-focus:ring-red-300",
    purple: "bg-purple-600 peer-focus:ring-purple-300",
  };

  const translateClasses = {
    sm: "translate-x-4",
    md: "translate-x-5",
    lg: "translate-x-7",
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={e => onChange?.(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`
          rounded-full transition-colors duration-200 ease-in-out
          peer-focus:outline-none peer-focus:ring-4
          ${sizeClasses[size]}
          ${checked ? colorClasses[color] : "bg-gray-200"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        >
          <div
            className={`
            absolute left-0.5 top-0.5 bg-white rounded-full 
            transition-transform duration-200 ease-in-out
            ${thumbSizeClasses[size]}
            ${checked ? translateClasses[size] : "translate-x-0"}
          `}
          />
        </div>
      </div>
      {label && (
        <span
          className={`
          ml-3 font-medium
          ${disabled ? "text-gray-400" : "text-gray-900"}
          ${size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"}
        `}
        >
          {label}
        </span>
      )}
    </label>
  );
};
