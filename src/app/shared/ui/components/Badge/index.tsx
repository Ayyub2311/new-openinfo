import React from "react";

import { BadgeProps } from "./types";
import { cn } from "@/app/shared/lib/utils/cn";

const variants = {
  default: "bg-gray-100 text-gray-800",
  primary: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-cyan-100 text-cyan-800",
  purple: "bg-purple-100 text-purple-800",
} as const;

const sizes = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
} as const;

const iconSizes = {
  sm: 14,
  md: 16,
  lg: 18,
} as const;

const dotColors = {
  default: "bg-gray-400",
  primary: "bg-blue-400",
  success: "bg-green-400",
  warning: "bg-yellow-400",
  danger: "bg-red-400",
  info: "bg-cyan-400",
  purple: "bg-purple-400",
} as const;

export const Badge = ({
  children,
  variant = "default",
  size = "md",
  dot = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className,
}: BadgeProps) => {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn("inline-flex items-center font-medium rounded-full", variants[variant], sizes[size], className)}
      >
        {dot && <span className={cn("w-2 h-2 mr-1.5 rounded-full", dotColors[variant])} />}
        {LeftIcon && (
          <span className="mr-1.5">
            <LeftIcon size={iconSizes[size]} />
          </span>
        )}
        {children}
        {RightIcon && (
          <span className="ml-1.5">
            <RightIcon size={iconSizes[size]} />
          </span>
        )}
      </span>
    </div>
  );
};
