import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/app/shared/lib/utils/cn";
import { TableColumn, TableProps } from "@/app/shared/ui/components/Table/types";
import Select, { Option } from "@/app/shared/ui/components/Select/Select";
import { useTranslations } from "next-intl";

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
        "p-200 border-b text-secondary",
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

// Helper function to get nested property values
const getNestedValue = (obj: Record<string, any>, path: string | string[]): any => {
  if (!path) return undefined;
  if (typeof path === "string") return obj[path];
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
};

export interface SelectTableProps<T> extends TableProps<T> {
  selectProp?: string | string[];
  selectOptions?: Option[];
  selectedValue?: string | null;
  onSelectChange?: (value: string | null) => void;
  showFilter?: boolean;
}

export const SelectTable = <T extends Record<string, any>>({
  columns,
  data,
  className,
  rowClassName,
  bordered = true,
  loading = false,
  onCellProps,
  selectProp,
  selectOptions,
  selectedValue,
  onSelectChange,
  showFilter = true,
}: SelectTableProps<T>) => {
  const t = useTranslations();
  const defaultOption: Option = useMemo(() => ({ value: "", label: t("TableHeaders.all") }), [t]);
  const [filterValue, setFilterValue] = useState<Option>(defaultOption);

  // Sync internal state with external selectedValue prop
  useEffect(() => {
    if (selectedValue === null || selectedValue === undefined) {
      setFilterValue(defaultOption);
    } else if (selectOptions) {
      const option = selectOptions.find(opt => opt.value === selectedValue);
      if (option) {
        setFilterValue(option);
      }
    }
  }, [selectedValue, selectOptions, defaultOption]);

  // Generate unique values for filter dropdown
  const uniqueValues: Option[] = selectOptions
    ? selectOptions
    : selectProp
      ? Array.from(
          new Set(
            data.map(item => getNestedValue(item, selectProp)).filter(value => value !== undefined && value !== null)
          )
        ).map(value => ({
          value: value.toString(),
          label: value.toString(),
        }))
      : [];

  // Filter data based on selected value (client-side filtering)
  const filteredData =
    selectProp && filterValue.value && !onSelectChange // Only filter client-side if not using controlled mode
      ? data.filter(item => getNestedValue(item, selectProp)?.toString() === filterValue.value)
      : data;

  const handleSelectChange = (option: Option) => {
    setFilterValue(option);
    if (onSelectChange) {
      onSelectChange(option.value === "" ? null : option.value);
    }
  };

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

  const renderTableCell = (column: TableColumn<T>, record: T, index: number) => {
    const tableCellProps = onCellProps?.(column, record, index);
    const columnCellProps = !tableCellProps && column.getCellProps?.(record[column.dataIndex], record, index);
    const cellProps = tableCellProps || columnCellProps || {};

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
    <div className={cn("overflow-x-auto", className)}>
      {showFilter && selectProp && (
        <div className="mb-4">
          <Select options={[defaultOption, ...uniqueValues]} value={filterValue} onChange={handleSelectChange} />
        </div>
      )}
      {loading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center">Loading...</div>}
      <table className="w-full border-collapse">
        <thead>
          {headerRows.map((row, index) => (
            <tr key={index}>{row}</tr>
          ))}
        </thead>
        <tbody>
          {filteredData.map((record, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(typeof rowClassName === "function" ? rowClassName(record, rowIndex) : rowClassName)}
            >
              {finalColumns.map(column => renderTableCell(column, record, rowIndex))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
