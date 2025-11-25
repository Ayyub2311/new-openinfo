export interface DescriptionItem {
  label: string;
  value: string | React.ReactNode;
}

export interface DescriptionListProps {
  items: DescriptionItem[];
  className?: string;
}
