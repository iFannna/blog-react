"use client";

import type { CSSProperties, ReactNode } from "react";

import { HeaderCellRenderer } from "./renderers/HeaderCell";
import { ns } from "./utils";

import type {
  Column,
  HeaderCellPropsGetter,
  HeaderCellSlotProps,
  HeaderClassGetter,
  KeyType,
  SortBy,
  SortState,
  TableV2CustomizedHeaderSlotParam,
} from "./types";

export interface HeaderRowProps<T = unknown> {
  className?: string;
  columns: Column<T>[];
  columnsStyles: Record<KeyType, CSSProperties>;
  headerIndex: number;
  style?: CSSProperties;
  headerClass?: string | HeaderClassGetter<T>;
  headerCellProps?: Record<string, unknown> | HeaderCellPropsGetter<T>;
  sortBy: SortBy;
  sortState?: SortState;
  onColumnSorted: (column: Column<T>) => void;
  headerRenderer?: (params: TableV2CustomizedHeaderSlotParam<T>) => ReactNode;
  headerCellRenderer?: (params: HeaderCellSlotProps<T>) => ReactNode;
}

/** 对应官方 components/header-row.tsx。 */
export function HeaderRow<T>({
  className,
  columns,
  columnsStyles,
  headerIndex,
  style,
  headerClass,
  headerCellProps,
  sortBy,
  sortState,
  onColumnSorted,
  headerRenderer,
  headerCellRenderer,
}: HeaderRowProps<T>) {
  let cells: ReactNode[] = columns.map((column, columnIndex) => {
    const cellStyle = columnsStyles[column.key as KeyType];

    const slotParams: HeaderCellSlotProps<T> = {
      columns,
      column,
      columnIndex,
      headerIndex,
      style: cellStyle,
      className: "el-table-v2__header-cell-text",
      headerCellProps,
      sortBy,
      sortState,
      onColumnSorted: () => onColumnSorted(column),
    };

    return (
      <HeaderCellRenderer
        key={String(column.key ?? columnIndex)}
        columns={columns}
        column={column}
        columnIndex={columnIndex}
        headerIndex={headerIndex}
        style={cellStyle}
        headerClass={headerClass}
        headerCellProps={headerCellProps}
        sortBy={sortBy}
        sortState={sortState}
        onColumnSorted={() => onColumnSorted(column)}
      >
        {headerCellRenderer?.(slotParams)}
      </HeaderCellRenderer>
    );
  });

  if (headerRenderer) {
    cells = headerRenderer({
      cells,
      columns,
      headerIndex,
    }) as ReactNode[];
  }

  return (
    <div
      className={[ns.e("header-row"), className].filter(Boolean).join(" ")}
      style={style}
      role="row"
    >
      {cells}
    </div>
  );
}
