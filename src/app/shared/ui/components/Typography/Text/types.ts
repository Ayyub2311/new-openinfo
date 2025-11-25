import React, { JSX } from "react";

export interface TextProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary" | "inverse" | "accent" | "success" | "link";
  size?: "2xs" | "xs" | "sm" | "md" | "lg";
  weight?: "normal" | "medium" | "semibold" | "bold";
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}
