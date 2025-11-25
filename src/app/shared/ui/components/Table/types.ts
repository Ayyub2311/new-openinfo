export interface TableColumn<T> {
  title?: string | React.ReactNode;
  dataIndex?: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  className?: string;
  rowSpan?: number;
  colSpan?: number;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  children?: TableColumn<T>[]; // Для группировки колонок
  getCellProps?: (
    value: unknown,
    record: T,
    index: number
  ) => {
    props?: React.TdHTMLAttributes<HTMLTableCellElement>;
    render?: boolean;
  } | null;
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
  } | null;
}
