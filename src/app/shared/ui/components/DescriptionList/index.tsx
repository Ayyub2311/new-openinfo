import { cn } from "@/app/shared/lib/utils/cn";
import { Text } from "../Typography/Text/Text";
import { DescriptionListProps } from "./types";

export const DescriptionList: React.FC<DescriptionListProps> = ({ items, className }) => {
  return (
    <div className={cn("w-full", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex border-b border-default">
          <div className="py-4 w-1/3">
            <Text variant="secondary" className="font-semibold">
              {item.label}
            </Text>
          </div>
          <div className="py-4 w-2/3">{typeof item.value === "string" ? <Text>{item.value}</Text> : item.value}</div>
        </div>
      ))}
    </div>
  );
};
