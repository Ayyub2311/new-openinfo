import { DescriptionList } from "@/app/shared/ui/components/DescriptionList";
import { DescriptionItem } from "@/app/shared/ui/components/DescriptionList/types";
import { Text } from "@/app/shared/ui/components/Typography/Text";

export interface FactBuilderDescriptionListProps {
  title?: string | React.ReactNode;
  items: DescriptionItem[];
}

export const FactBuilderDescriptionList: React.FC<FactBuilderDescriptionListProps> = ({ title, items }) => {
  return (
    <>
      {title && (
        <Text variant="accent" weight="bold" size="lg">
          {title}
        </Text>
      )}
      <DescriptionList items={items} />
    </>
  );
};
