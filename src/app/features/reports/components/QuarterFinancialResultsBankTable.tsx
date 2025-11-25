import { Table } from "@/app/shared/ui/components/Table";
import { TableProps } from "@/app/shared/ui/components/Table/types";
import { Text } from "@/app/shared/ui/components/Typography/Text";
import { QuarterFinancialResultsBankResp } from "../models/nested/Quarterfinancialresultsbank";

export interface QuarterFinancialResultsBankTableProps {
  title?: string | React.ReactNode;
  data: QuarterFinancialResultsBankResp[];
}

export function QuarterFinancialResultsTable({ title, data }: QuarterFinancialResultsBankTableProps) {
  const tableProps: TableProps<QuarterFinancialResultsBankResp> = {
    columns: QuarterFinancialResultsBankResp.getColumns,
    data,
    className: "custom-quarterly-financial-results-table",
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      {title && (
        <Text variant="accent" weight="bold" size="lg" className="mb-2">
          {title}
        </Text>
      )}
      <Table {...tableProps} />
    </div>
  );
}
