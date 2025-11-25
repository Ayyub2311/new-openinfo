import React from "react";
import { FormItemProps } from "./types";

const FormItem: React.FC<FormItemProps> = ({ label, required = false, error, children, className = "" }) => {
  return (
    <div className={`w-full relative ${className}`}>
      {label && (
        <label className="block mb-1 text-xs text-black/90 font-normal">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {children}

      {error && <span className="mt-1 text-xs text-red-500 absolute left-0 -bottom-5">{error}</span>}
    </div>
  );
};

export default FormItem;
