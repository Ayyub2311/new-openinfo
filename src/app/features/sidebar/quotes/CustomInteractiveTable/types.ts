import { ReactNode, MouseEvent } from "react";

export interface TableColumn<T> {
  title: ReactNode;
  dataIndex: string;
  key?: string;
  align?: "left" | "center" | "right";
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  render?: (value: any, record: T, index: number) => ReactNode;
  getCellProps?: (
    value: any,
    record: T,
    index: number
  ) => {
    props?: React.TdHTMLAttributes<HTMLTableCellElement>;
    render?: boolean;
  };
  children?: TableColumn<T>[];
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  rowClassName?: string | ((record: T, index: number) => string);
  bordered?: boolean;
  loading?: boolean;
  onCellProps?: (
    column: TableColumn<T>,
    record: T,
    index: number
  ) => {
    props?: React.TdHTMLAttributes<HTMLTableCellElement>;
    render?: boolean;
  };
  onRowClick?: (record: T, index: number, event: MouseEvent) => void;
}
