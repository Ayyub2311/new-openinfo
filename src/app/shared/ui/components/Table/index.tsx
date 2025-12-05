import React from "react";
import { TableProps, TableColumn } from "./types";
import { cn } from "@/app/shared/lib/utils/cn";
import Loader from "../Loader";

export interface TableHeaderProps {
  bordered?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  children: React.ReactNode;
  width?: string | number;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ bordered, align, className, colSpan, rowSpan, children, width, }) => {
  return (
    <th
      className={cn(
        "sticky top-0 z-30 bg-white py-2 font-bold text-primary text-sm border-b border-default",
        {
          border: bordered,
          "text-left": align === "left" || !align,
          "text-center": align === "center",
          "text-right": align === "right", "align-top": true,
        },
        className
      )}
      colSpan={colSpan}
      rowSpan={rowSpan}
      style={{ width }}
    >
      {children}
    </th>
  );
};

interface TableDataProps {
  children: React.ReactNode;
  bordered?: boolean;
  align?: "left" | "center" | "right" | "justify" | "char";
  className?: string;
  colSpan?: number;
  rowSpan?: number;
}

export const TableData: React.FC<TableDataProps> = ({ bordered, align, className, children, ...props }) => {
  return (
    <td
      className={cn(
        "py-2 border-b border-default text-secondary",
        {
          border: bordered,
          "text-left": align === "left" || !align,
          "text-center": align === "center",
          "text-right": align === "right",
        },
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
};

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  className,
  rowClassName,
  bordered = true,
  loading = false,
  onCellProps,
}: TableProps<T>) => {
  // Функция для рендеринга заголовков с учетом вложенности
  const renderHeaderRows = (columns: TableColumn<T>[]): React.ReactNode[][] => {
    const rows: React.ReactNode[][] = [];

    const maxDepth = (columns: TableColumn<T>[]): number => {
      return 1 + Math.max(0, ...columns.map(col => (col.children ? maxDepth(col.children) : 0)));
    };

    const depth = maxDepth(columns);

    const traverse = (columns: TableColumn<T>[], row: number = 0) => {
      rows[row] = rows[row] || [];

      columns.forEach((column, columnIndex) => {
        const uniqueKey = `${row}-${column.dataIndex ?? columnIndex}`;
        const cell = (
          <TableHeader
            key={uniqueKey}
            bordered={bordered}
            align={column.align}
            className={column.className}
            colSpan={column.colSpan || 1}
            rowSpan={column.children ? 1 : column.rowSpan || depth - row}
            width={column.width}
          >
            {column.title}
          </TableHeader>
        );

        rows[row].push(cell);

        if (column.children) {
          traverse(column.children, row + 1);
        }
      });
    };

    traverse(columns);
    return rows;
  };

  // Enhanced cell rendering with props callback
  const renderTableCell = (column: TableColumn<T>, record: T, index: number, rowIndex: number, columnIndex: number) => {
    // Get cell customization from table-level callback first

    const key = `${rowIndex}-${column.dataIndex ?? columnIndex}`;

    const tableCellProps = onCellProps?.(column, record, index);

    // If table-level callback returns null, try column-level callback
    const columnCellProps = !tableCellProps && column.getCellProps?.(record[column.dataIndex], record, index);

    // Use table-level props or column-level props or default empty object
    const cellProps = tableCellProps || columnCellProps || {};

    // If render is explicitly false, don't render the cell
    if (cellProps.render === false) {
      return null;
    }

    const value = record[column.dataIndex];
    const content = column.render ? column.render(value, record, index) : value;

    return (
      <TableData
        key={key}
        bordered={bordered}
        align={column.align}
        className={cn(column.className, cellProps.props?.className)}
        style={{ width: column.width }}
        {...cellProps.props}
      >
        {content}
      </TableData>
    );
  };

  // Render title row with centered text spanning all columns
  const renderTitleRow = (record: T, rowIndex: number) => {
    const title = record.title || record.name || ""; // Adjust field name as needed

    return (
      <tr
        key={record.id || rowIndex}
        className={cn(
          "bg-gray-50", // Optional: different background for title rows
          typeof rowClassName === "function" ? rowClassName(record, rowIndex) : rowClassName
        )}
      >
        <TableData
          bordered={bordered}
          align="center"
          colSpan={finalColumns.length}
          className="font-semibold text-center"
        >
          {title}
        </TableData>
      </tr>
    );
  };

  const headerRows = renderHeaderRows(columns);

  // Получаем финальные колонки (на нижнем уровне)
  const getFinalColumns = (columns: TableColumn<T>[]): TableColumn<T>[] => {
    return columns.reduce((acc, column) => {
      if (column.children) {
        return [...acc, ...getFinalColumns(column.children)];
      }
      return [...acc, column];
    }, [] as TableColumn<T>[]);
  };

  const finalColumns = getFinalColumns(columns);

  return (
    <div className={cn("w-full", className)}>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      ) : (
        <table className="w-full table-fixed border-collapse">
          <thead className=" sticky top-0 z-10 bg-white">
            {headerRows.map((row, index) => {
              return <tr key={`header-row-${index}`}>{row}</tr>;
            })}
          </thead>
          <tbody>
            {data.map((record, rowIndex) => {
              // Check if this is a title row
              if (record.is_title) {
                return renderTitleRow(record, rowIndex);
              }

              // Regular data row
              return (
                <tr
                  key={record.id || rowIndex}
                  className={cn(typeof rowClassName === "function" ? rowClassName(record, rowIndex) : rowClassName)}
                >
                  {finalColumns.map((column, columnIndex) =>
                    renderTableCell(column, record, rowIndex, rowIndex, columnIndex)
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
