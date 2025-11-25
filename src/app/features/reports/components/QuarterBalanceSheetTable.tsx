import { Table } from "@/app/shared/ui/components/Table";
import { TableProps } from "@/app/shared/ui/components/Table/types";
import { Text } from "@/app/shared/ui/components/Typography/Text";
import { QuarterBalanceSheetResp } from "../models/nested/Quarterbalancesheet";

export interface QuarterBalanceSheetTableProps {
  title?: string | React.ReactNode;
  data: QuarterBalanceSheetResp[];
}

export function QuarterBalanceSheetTable({ title, data }: QuarterBalanceSheetTableProps) {
  const tableProps: TableProps<QuarterBalanceSheetResp> = {
    columns: QuarterBalanceSheetResp.getColumns,
    data,
    className: "border rounded-lg",
  };

  return (
    <>
      {title && (
        <Text variant="accent" weight="bold" size="lg">
          {title}
        </Text>
      )}
      <Table {...tableProps} />
    </>
  );
}
