import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: Option[];
  value?: Option;
  onChange?: (option: Option) => void;
  placeholder?: string;
  className?: string;
}

const Select = ({ options, value, onChange, placeholder = "Выберите...", className = "w-48" }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    if (!option.disabled) {
      onChange?.(option);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className="flex items-center justify-between px-4 py-2 rounded-full bg-blue-50 text-sm text-gray-700 cursor-pointer select-none w-full min-w-[200px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 truncate text-left">{value ? value.label : placeholder}</div>
        <ChevronDown className="w-4 h-4 ml-2 shrink-0 text-gray-500" />
      </div>

      {isOpen && (
        <ul className="absolute z-50 mt-1 py-1 bg-white border rounded-md shadow-lg max-h-64 overflow-auto text-sm min-w-[12rem]">
          {options.map(option => (
            <li
              key={option.value}
              className={`px-4 py-2 whitespace-nowrap cursor-pointer hover:bg-blue-100 ${
                value?.value === option.value ? "bg-blue-50" : ""
              } ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
