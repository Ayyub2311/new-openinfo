import React, { JSX } from "react";
import { TitleProps } from "./types";
import { cn } from "@/app/shared/lib/utils/cn";

export const Title: React.FC<TitleProps> = ({ children, level = 2, variant = "primary", className }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      className={cn(
        "font-bold font-['Open Sans']",
        {
          "text-sky-700": variant === "primary",
          "text-black": variant === "secondary",
          "text-xl": level === 1,
          "text-lg": level === 2,
          "text-base": level === 3,
        },
        className
      )}
    >
      {children}
    </Tag>
  );
};
