import React from "react";
import { cn } from "@/app/shared/lib/utils/cn";
import { TableColumn, TableProps } from "./types";

export interface TableHeaderProps {
  bordered?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  children: React.ReactNode;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ bordered, align, className, colSpan, rowSpan, children }) => {
  return (
    <th
      className={cn(
        "p-2 font-semibold text-primary border-b",
        {
          border: bordered,
          "text-left": align === "left" || !align,
          "text-center": align === "center",
          "text-right": align === "right",
        },
        className
      )}
      colSpan={colSpan}
      rowSpan={rowSpan}
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
        "p-2 border-b text-secondary",
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
  onRowClick,
}: TableProps<T>) => {
  // Function to render header rows with nested columns
  const renderHeaderRows = (columns: TableColumn<T>[]): React.ReactNode[][] => {
    const rows: React.ReactNode[][] = [];

    const maxDepth = (columns: TableColumn<T>[]): number => {
      return 1 + Math.max(0, ...columns.map(col => (col.children ? maxDepth(col.children) : 0)));
    };

    const depth = maxDepth(columns);

    const traverse = (columns: TableColumn<T>[], row: number = 0) => {
      rows[row] = rows[row] || [];

      columns.forEach(column => {
        const cell = (
          <TableHeader
            key={column.dataIndex}
            bordered={bordered}
            align={column.align}
            className={column.className}
            colSpan={column.colSpan || 1}
            rowSpan={column.children ? 1 : column.rowSpan || depth - row}
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
  const renderTableCell = (column: TableColumn<T>, record: T, index: number) => {
    // Get cell customization from table-level callback first
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
        key={column.dataIndex}
        bordered={bordered}
        align={column.align}
        className={cn(column.className, cellProps.props?.className)}
        {...cellProps.props}
      >
        {content}
      </TableData>
    );
  };

  const headerRows = renderHeaderRows(columns);

  // Get final columns (flatten nested columns)
  const getFinalColumns = (columns: TableColumn<T>[]): TableColumn<T>[] => {
    return columns.reduce((acc, column) => {
      if (column.children) {
        return [...acc, ...getFinalColumns(column.children)];
      }
      return [...acc, column];
    }, [] as TableColumn<T>[]);
  };

  const finalColumns = getFinalColumns(columns);

  // Handle row click
  const handleRowClick = (record: T, index: number) => (event: React.MouseEvent) => {
    // Prevent row click if the click originated from a button, link, or other interactive element
    const target = event.target as HTMLElement;
    const interactiveElements = ["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"];

    if (interactiveElements.includes(target.tagName)) {
      return;
    }

    if (target.closest("button, a, input, select, textarea")) {
      return;
    }

    onRowClick?.(record, index, event);
  };

  return (
    <div className={cn("overflow-x-auto w-full", className)}>
      {loading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center">Loading...</div>}
      <table className="w-full border-collapse">
        <thead>
          {headerRows.map((row, index) => (
            <tr key={index}>{row}</tr>
          ))}
        </thead>
        <tbody>
          {data.map((record, rowIndex) => {
            const rowProps = {
              ...(onRowClick && {
                onClick: handleRowClick(record, rowIndex),
                className: cn(
                  typeof rowClassName === "function" ? rowClassName(record, rowIndex) : rowClassName,
                  onRowClick && "hover:bg-gray-50 cursor-pointer"
                ),
              }),
            };

            return (
              <tr key={rowIndex} {...rowProps}>
                {finalColumns.map(column => renderTableCell(column, record, rowIndex))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
