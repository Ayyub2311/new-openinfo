import React, { ButtonHTMLAttributes } from "react";
import { Loader2, LucideIcon } from "lucide-react";
import { cn } from "@/app/shared/lib/utils/cn";

// Types
export type ButtonVariant = "filled" | "outline" | "ghost" | "link";
export type ButtonColor = "default" | "primary" | "success" | "warning" | "danger" | "gray" | "export";
export type ButtonBorderStyle = "solid" | "dashed" | "dotted" | "none";
export type ButtonShape = "rect" | "rounded" | "pill" | "circle";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonBorderConfig {
  style?: ButtonBorderStyle;
  width?: number;
  color?: string;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  shape?: ButtonShape;
  size?: ButtonSize;
  border?: ButtonBorderConfig | boolean;
  borderRadius?: number;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  iconSize?: number;
  isLoading?: boolean;
  disabled?: boolean;
  active?: boolean;
  hover?: boolean;
  className?: string;
}

// Styles
const variants = {
  filled: {
    default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    primary: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    success: "bg-green-100 text-green-800 hover:bg-green-200",
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    danger: "bg-red-100 text-red-800 hover:bg-red-200",
    gray: "bg-gray-400/25 text-black/90 hover:bg-gray-400/35",
    export: "bg-slate-200 text-sky-700 hover:bg-slate-300",
  },
  outline: {
    default: "border-2 border-default text-gray-800 hover:bg-gray-50",
    primary: "border-2 border-blue-200 text-blue-800 hover:bg-blue-50",
    success: "border-2 border-green-200 text-green-800 hover:bg-green-50",
    warning: "border-2 border-yellow-200 text-yellow-800 hover:bg-yellow-50",
    danger: "border-2 border-red-200 text-red-800 hover:bg-red-50",
    gray: "border-2 border-default text-gray-700 hover:bg-gray-50",
    export: "border-2 border-default text-sky-700 hover:bg-slate-50",
  },
  ghost: {
    default: "text-gray-800 hover:bg-gray-100",
    primary: "text-blue-800 hover:bg-blue-100",
    success: "text-green-800 hover:bg-green-100",
    warning: "text-yellow-800 hover:bg-yellow-100",
    danger: "text-red-800 hover:bg-red-100",
    gray: "text-gray-700 hover:bg-gray-100",
    export: "text-sky-700 hover:bg-slate-100",
  },
  link: {
    default: "text-gray-800 underline hover:text-gray-600",
    primary: "text-blue-800 underline hover:text-blue-600",
    success: "text-green-800 underline hover:text-green-600",
    warning: "text-yellow-800 underline hover:text-yellow-600",
    danger: "text-red-800 underline hover:text-red-600",
    gray: "text-gray-700 underline hover:text-gray-500",
    export: "text-sky-700 underline hover:text-sky-500",
  },
} as const;

const shapes = {
  rect: "",
  rounded: "rounded-xl",
  pill: "rounded-full",
  circle: "rounded-full aspect-square p-0",
} as const;

const sizes = {
  sm: "text-xs px-2 py-1 h-8 min-w-8", // 32px
  md: "text-sm px-3 py-1.5 h-10 min-w-10", // 40px → ✅ standard height
  lg: "text-base px-4 py-2 h-12 min-w-12", // 48px
};

const iconSizes = {
  sm: 14,
  md: 16,
  lg: 18,
} as const;

// Helper function
const getBorderStyles = (border: ButtonProps["border"]) => {
  if (!border) return "";
  if (border === true) return "border-2 border-solid";

  const styles = [];
  if (border.style) styles.push(`border-${border.style}`);
  if (border.width) styles.push(`border-${border.width}`);
  if (border.color) styles.push(`border-${border.color}`);
  return styles.join(" ");
};

// Component
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "filled",
      color = "default",
      shape = "rounded",
      size = "md",
      border,
      borderRadius,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      iconSize,
      isLoading = false,
      disabled = false,
      active = false,
      hover = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const customStyle = {
      ...style,
      ...(borderRadius && { borderRadius: `${borderRadius}px` }),
    };

    const effectiveIconSize = iconSize ?? iconSizes[size];

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        style={customStyle}
        className={cn(
          "inline-flex items-center justify-center font-normal",
          "transition-colors duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant][color],
          shapes[shape],
          sizes[size],
          getBorderStyles(border),
          active && "ring-2 ring-offset-2",
          hover && "hover:shadow-md",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 size={effectiveIconSize} className="animate-spin" />
        ) : (
          <>
            {LeftIcon &&
              (children ? (
                <span className="mr-2">
                  <LeftIcon size={effectiveIconSize} />
                </span>
              ) : (
                <LeftIcon size={effectiveIconSize} />
              ))}

            {children}

            {RightIcon &&
              (children ? (
                <span className="ml-2">
                  <RightIcon size={effectiveIconSize} />
                </span>
              ) : (
                <RightIcon size={effectiveIconSize} />
              ))}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
