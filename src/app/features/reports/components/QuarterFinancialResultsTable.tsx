import { Table } from "@/app/shared/ui/components/Table";
import { TableProps } from "@/app/shared/ui/components/Table/types";
import { Text } from "@/app/shared/ui/components/Typography/Text";
import { QuarterFinancialResultsResp } from "../models/nested/Quarterfinancialresultsresp";

export interface QuarterFinancialResultsTableProps {
  title?: string | React.ReactNode;
  data: QuarterFinancialResultsResp[];
}

export function QuarterFinancialResultsTable({ title, data }: QuarterFinancialResultsTableProps) {
  const tableProps: TableProps<QuarterFinancialResultsResp> = {
    columns: QuarterFinancialResultsResp.getColumns,
    data,
    className: "custom-quarterly-financial-results-table",
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl">
      {title && (
        <Text variant="accent" weight="bold" size="lg" className="mb-2">
          {title}
        </Text>
      )}
      <Table {...tableProps} />
    </div>
  );
}
