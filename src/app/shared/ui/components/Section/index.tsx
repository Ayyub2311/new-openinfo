import React from "react";
import { ChevronDown } from "lucide-react";
import { SectionProps } from "./types";

const Section: React.FC<SectionProps> = ({
  title,
  children,
  icon: Icon = ChevronDown,
  showIcon = false,
  iconClassName = "w-5 h-5",
}) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold font-['Open Sans']">{title}</h2>
      {showIcon && <Icon className={iconClassName} />}
    </div>
    {children}
  </div>
);

export default Section;
