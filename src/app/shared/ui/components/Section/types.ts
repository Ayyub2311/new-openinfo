import { LucideIcon } from "lucide-react";

export interface SectionProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  icon?: LucideIcon;
  showIcon?: boolean;
  iconClassName?: string;
}
