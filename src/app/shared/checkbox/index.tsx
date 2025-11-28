import React from "react";

interface CheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export const Checkbox = ({ id, checked, onCheckedChange, className = "" }: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={e => onCheckedChange(e.target.checked)}
      className={`h-4 w-4 rounded-xl border-default text-indigo-600 focus:ring-indigo-500 ${className}`}
    />
  );
};
