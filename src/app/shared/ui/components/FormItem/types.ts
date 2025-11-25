import { ReactNode } from "react";

export interface FormItemProps {
  label?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}
