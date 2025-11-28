import React from "react";
import { BoxProps } from "./types";

const Box = ({ variant = "primary", className = "", children }: BoxProps) => {
  const baseStyles = "rounded-xl border";

  const variantStyles = {
    primary: "border-default",
    secondary: "border-default",
  };

  return <div className={`p-6 ${baseStyles} ${variantStyles[variant]} ${className}`}>{children}</div>;
};

export default Box;
