import { ToggleProps } from "./types";

const Toggle = ({ isOn = false, onChange, disabled = false }: ToggleProps) => {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!isOn)}
      disabled={disabled}
      className={`
        relative h-6 w-12 rounded-full transition-colors
        ${isOn ? "bg-blue-600" : "bg-gray-400/25"}
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
      `}
    >
      <span
        className={`
          absolute left-0.5 top-0.5 h-5 w-5 rounded-full
          bg-white transition-transform
          ${isOn ? "translate-x-6" : "translate-x-0"}
        `}
      />
    </button>
  );
};

export default Toggle;
