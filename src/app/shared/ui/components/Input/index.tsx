import React, { forwardRef } from "react";
import { InputProps } from "./types";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = "text", value, onChange, placeholder, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-1 rounded border border-slate-200 text-base font-normal
        focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
        disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
        ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
