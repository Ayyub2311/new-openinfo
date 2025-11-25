import { Table } from "@/app/shared/ui/components/Table";
import { TableProps } from "@/app/shared/ui/components/Table/types";
import { Text } from "@/app/shared/ui/components/Typography/Text";
import { QuarterBalanceSheetBankResp } from "../models/nested/Quarterbalancesheetbank";

export interface QuarterBalanceSheetBankTableProps {
  title?: string | React.ReactNode;
  data: QuarterBalanceSheetBankResp[];
}

export function QuarterBalanceSheetTable({ title, data }: QuarterBalanceSheetBankTableProps) {
  const tableProps: TableProps<QuarterBalanceSheetBankResp> = {
    columns: QuarterBalanceSheetBankResp.getColumns,
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
