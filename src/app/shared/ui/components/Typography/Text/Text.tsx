import React from "react";
import { cn } from "@/app/shared/lib/utils/cn";
import { TextProps } from "./types";

export const Text: React.FC<TextProps> = ({
  children,
  variant = "primary",
  size = "md",
  weight = "normal",
  className,
  as: Tag = "div",
}) => {
  return (
    <Tag
      className={cn(
        "font-['Open Sans']",
        {
          "text-primary": variant === "primary",
          "text-secondary": variant === "secondary",
          "text-tertiary": variant === "tertiary",
          "text-inverse": variant === "inverse",
          "text-accent": variant === "accent",
          "text-success": variant === "success",
          "text-accent underline cursor-pointer": variant === "link",
        },
        {
          "text-[10px]": size === "2xs",
          "text-xs": size === "xs",
          "text-sm": size === "sm",
          "text-base": size === "md",
          "text-lg": size === "lg",
        },
        {
          "font-normal": weight === "normal",
          "font-medium": weight === "medium",
          "font-semibold": weight === "semibold",
          "font-bold": weight === "bold",
        },
        className
      )}
    >
      {children}
    </Tag>
  );
};
