import React from "react";
import { BoxProps } from "./types";

const Box = ({ variant = "primary", className = "", children }: BoxProps) => {
  const baseStyles = "rounded border";

  const variantStyles = {
    primary: "border-[#D9DCDF]",
    secondary: "border-[#F1F1F1]",
  };

  return <div className={`p-6 ${baseStyles} ${variantStyles[variant]} ${className}`}>{children}</div>;
};

export default Box;
