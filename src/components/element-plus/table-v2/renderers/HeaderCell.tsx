"use client";

import type {
  CSSProperties,
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react";

import { useTranslator } from "../../config-provider/context";
import { Alignment, SortOrder, oppositeOrderMap, placeholderSign } from "../constants";
import { enforceUnit, ns, tryCall } from "../utils";
import { SortIcon } from "./SortIcon";

import type {
  HeaderCellSlotProps,
  HeaderCellPropsGetter,
  HeaderClassGetter,
  SortBy,
  SortState,
  TableV2HeaderRowCellRendererParams,
} from "../types";

export interface HeaderCellRendererProps<T = unknown>
  extends TableV2HeaderRowCellRendererParams<T> {
  headerClass?: string | HeaderClassGetter<T>;
  headerCellProps?: Record<string, unknown> | HeaderCellPropsGetter<T>;
  sortBy: SortBy;
  sortState?: SortState;
  onColumnSorted: (e: ReactMouseEvent) => void;
  /** 对应官方 #header-cell 作用域插槽的输出。 */
  children?: ReactNode;
}

/** 对应官方 renderers/header-cell.tsx。 */
export function HeaderCellRenderer<T>({
  columns,
  column,
  columnIndex,
  headerIndex,
  style,
  headerClass,
  headerCellProps,
  sortBy,
  sortState,
  onColumnSorted,
  children,
}: HeaderCellRendererProps<T>) {
  const t = useTranslator();
  const cellStyle = enforceUnit(style ?? {});

  if (column.placeholderSign === placeholderSign) {
    return (
      <div
        className={ns.em("header-row-cell", "placeholder")}
        style={cellStyle}
      />
    );
  }

  const { headerCellRenderer, sortable } = column;

  const cellProps: HeaderCellSlotProps<T> = {
    columns,
    column,
    columnIndex,
    headerIndex,
    style: cellStyle,
    className: ns.e("header-cell-text"),
    headerCellProps,
    sortBy,
    sortState,
    onColumnSorted,
  };

  const Cell = headerCellRenderer ? (
    headerCellRenderer(cellProps)
  ) : children !== undefined ? (
    children
  ) : (
    <div className={ns.e("header-cell-text")} title={column.title}>
      {column.title}
    </div>
  );

  let sorting = false;
  let sortOrder: SortOrder = SortOrder.ASC;
  let ariaSort: "ascending" | "descending" | undefined;

  if (sortState) {
    const order = (sortState as Record<string | number | symbol, SortOrder>)[
      column.key as string | number | symbol
    ];
    sorting = Boolean(oppositeOrderMap[order]);
    sortOrder = sorting ? order : SortOrder.ASC;
  } else {
    sorting = column.key === sortBy.key;
    sortOrder = sorting ? sortBy.order : SortOrder.ASC;
  }

  if (sortOrder === SortOrder.ASC) {
    ariaSort = "ascending";
  } else if (sortOrder === SortOrder.DESC) {
    ariaSort = "descending";
  }

  const cellKls = [
    ns.e("header-cell"),
    tryCall(headerClass, { columns, column, columnIndex, headerIndex }, ""),
    column.align === Alignment.CENTER && ns.is("align-center"),
    column.align === Alignment.RIGHT && ns.is("align-right"),
    sortable && ns.is("sortable"),
  ]
    .filter(Boolean)
    .join(" ");

  const extraProps = tryCall<HeaderCellSlotProps<T>, Record<string, unknown>>(
    headerCellProps,
    cellProps,
    {},
  ) as Record<string, unknown>;

  // 与单元格同理，headerCellProps 的 style 需要与列宽样式合并
  const {
    style: extraHeaderCellStyle,
    ...restHeaderCellProps
  } = extraProps as { style?: CSSProperties } & Record<string, unknown>;

  const mergedHeaderCellStyle = extraHeaderCellStyle
    ? { ...cellStyle, ...extraHeaderCellStyle }
    : cellStyle;

  return (
    <div
      {...(restHeaderCellProps as HTMLAttributes<HTMLDivElement>)}
      onClick={column.sortable ? onColumnSorted : undefined}
      aria-sort={sortable ? ariaSort : undefined}
      className={cellKls}
      style={mergedHeaderCellStyle}
      data-key={String(column.key)}
      role="columnheader"
    >
      {Cell}

      {sortable && (
        <SortIcon
          className={[
            ns.e("sort-icon"),
            sorting && ns.is("sorting"),
          ]
            .filter(Boolean)
            .join(" ")}
          sortOrder={sortOrder}
          ariaLabel={t("el.table.sortLabel", {
            column: column.title || "",
          })}
        />
      )}
    </div>
  );
}
