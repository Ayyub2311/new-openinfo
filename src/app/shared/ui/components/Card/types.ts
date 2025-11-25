export interface CardProps {
  imageUrl?: string;
  imageAlt?: string;
  title?: string;
  subtitle?: string;
  className?: string;

  // New
  fact_number?: string | number;
  object_id?: string | number;
  org_id?: number;
  org_short_name?: string;
  logoFile?: string;
  children?: React.ReactNode;

  width?: number;
}

export interface CardGridProps {
  items: CardProps[];
  className?: string;
}
