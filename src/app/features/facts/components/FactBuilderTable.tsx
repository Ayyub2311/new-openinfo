import { Table } from "@/app/shared/ui/components/Table";
import { TableProps } from "@/app/shared/ui/components/Table/types";
import { Text } from "@/app/shared/ui/components/Typography/Text";

export interface FactBuilderTableProps<T> {
  title?: string | React.ReactNode;
  tableProps: TableProps<T>;
}

export function FactBuilderTable<T>({ title, tableProps }: FactBuilderTableProps<T>) {
  return (
    <>
      {title && (
        <Text variant="accent" weight="bold" size="lg">
          {title}
        </Text>
      )}
      <Table {...tableProps} bordered={false} />
    </>
  );
}
