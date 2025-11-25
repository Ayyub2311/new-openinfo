import { ButtonHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

export type ButtonColor = "default" | "primary" | "success" | "warning" | "danger" | "gray" | "export";
export type ButtonShape = "default" | "round" | "dashed" | "link" | "rect";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  shape?: ButtonShape;
  size?: ButtonSize;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}
