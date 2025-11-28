import React from "react";

interface RadioProps {
  checked?: boolean;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  size?: "default" | "small";
}

const Radio: React.FC<RadioProps> = ({
  checked = false,
  label,
  value,
  onChange,
  className = "",
  disabled = false,
  size = "default",
}) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(value);
    }
  };

  if (size === "small") {
    return (
      <div
        className={`inline-flex items-start cursor-pointer ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
        onClick={handleClick}
      >
        <div className="relative w-3 h-3">
          {/* Outer circle for small size */}
          <div
            className={`w-3 h-3 rounded-full border transition-colors
              ${checked ? "border-sky-700" : "border-black/60"}
              ${disabled ? "border-default" : ""}
            `}
          />

          {/* Inner circle (dot) for small size with style positioning */}
          {checked && (
            <div
              style={{ left: "2px", top: "2px" }}
              className={`absolute w-2 h-2 rounded-full transition-colors
                ${disabled ? "bg-gray-300" : "bg-sky-700"}
              `}
            />
          )}
        </div>

        {/* Label */}
        <span
          className={`ml-1.5 text-xs font-normal transition-colors
            ${checked ? "text-sky-700" : "text-black/60"}
            ${disabled ? "text-gray-300" : ""}
          `}
        >
          {label}
        </span>
      </div>
    );
  }

  // Default size rendering
  return (
    <div
      className={`inline-flex items-start cursor-pointer ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
      onClick={handleClick}
    >
      <div className="relative w-4 h-4">
        {/* Outer circle */}
        <div
          className={`w-4 h-4 rounded-full border transition-colors
            ${checked ? "border-sky-700" : "border-black/60"}
            ${disabled ? "border-default" : ""}
          `}
        />

        {/* Inner circle (dot) */}
        {checked && (
          <div
            className={`w-3 h-3 absolute left-[2px] top-[2px] rounded-full transition-colors
              ${disabled ? "bg-gray-300" : "bg-sky-700"}
            `}
          />
        )}
      </div>

      {/* Label */}
      <span
        className={`ml-2 text-xs font-normal transition-colors
          ${checked ? "text-sky-700" : "text-black/60"}
          ${disabled ? "text-gray-300" : ""}
        `}
      >
        {label}
      </span>
    </div>
  );
};

export default Radio;
