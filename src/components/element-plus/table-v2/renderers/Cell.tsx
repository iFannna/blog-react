"use client";

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

import { useTranslator } from "../../config-provider/context";
import { ElIcon } from "../../icon/ElIcon";
import { ArrowRight } from "../../generated/icons";
import { TableCell } from "../Cell";
import { Alignment, placeholderSign } from "../constants";
import { enforceUnit, get, ns, tryCall } from "../utils";

import type {
  Column,
  ExtraCellPropGetter,
  KeyType,
  TableV2RowCellRenderParam,
} from "../types";

export interface CellRendererProps<T = unknown>
  extends TableV2RowCellRenderParam<T> {
  cellProps?: Record<string, unknown> | ExtraCellPropGetter<T>;
  expandColumnKey?: string;
  indentSize: number;
  iconSize: number;
  rowKey: KeyType;
  expandedRowKeys: KeyType[];
  /** 对应官方 #cell 作用域插槽的输出。 */
  children?: ReactNode;
}

/** 对应官方 renderers/cell.tsx。 */
export function CellRenderer<T>({
  columns,
  column,
  columnIndex,
  depth,
  rowData,
  rowIndex,
  isScrolling,
  expandIconProps,
  style,
  cellProps: extraCellPropSource,
  expandColumnKey,
  indentSize,
  iconSize,
  rowKey,
  expandedRowKeys,
  children,
}: CellRendererProps<T>) {
  const t = useTranslator();
  const cellStyle = enforceUnit(style ?? {});

  if (column.placeholderSign === placeholderSign) {
    return (
      <div className={ns.em("row-cell", "placeholder")} style={cellStyle} />
    );
  }

  const { cellRenderer, dataKey, dataGetter } = column;

  const cellData =
    typeof dataGetter === "function"
      ? dataGetter({ columns, column, columnIndex, rowData, rowIndex })
      : get(rowData, dataKey ?? "");


  const extraCellProps = tryCall<
    {
      cellData: T;
      columns: Column<T>[];
      column: Column<T>;
      columnIndex: number;
      rowIndex: number;
      rowData: typeof rowData;
    },
    Record<string, unknown>
  >(
    extraCellPropSource,
    {
      cellData: cellData as T,
      columns,
      column,
      columnIndex,
      rowIndex,
      rowData,
    },
    {},
  ) as Record<string, unknown>;

  // cellProps 可能只想改背景色，这里合并而不是整体覆盖，避免丢失列宽
  const {
    style: extraCellStyle,
    ...restCellProps
  } = extraCellProps as { style?: CSSProperties } & Record<string, unknown>;

  const mergedCellStyle = extraCellStyle
    ? { ...cellStyle, ...extraCellStyle }
    : cellStyle;

  const contentProps = {
    columns,
    column,
    columnIndex,
    cellData: cellData as T,
    isScrolling,
    rowData,
    rowIndex,
    depth,
    style: cellStyle,
    expandIconProps,
    className: ns.e("cell-text"),
  };

  const Cell = cellRenderer ? (
    cellRenderer(contentProps)
  ) : children !== undefined ? (
    children
  ) : (
    <TableCell
      className={ns.e("cell-text")}
      cellData={cellData}
    />
  );

  const cellKls = [
    ns.e("row-cell"),
    column.class,
    column.align === Alignment.CENTER && ns.is("align-center"),
    column.align === Alignment.RIGHT && ns.is("align-right"),
  ]
    .filter(Boolean)
    .join(" ");

  const expandable =
    rowIndex >= 0 && expandColumnKey && column.key === expandColumnKey;
  const expanded =
    rowIndex >= 0 &&
    expandedRowKeys.includes(
      (rowData as Record<KeyType, unknown>)[rowKey] as KeyType,
    );

  let iconOrPlaceholder: ReactNode;

  if (expandable) {
    const iconStyle: CSSProperties = {
      marginInlineStart: depth * indentSize,
    };

    if (expandIconProps) {
      iconOrPlaceholder = (
        <button
          type="button"
          className={[
            ns.e("expand-icon"),
            ns.is("expanded", expanded),
          ]
            .filter(Boolean)
            .join(" ")}
          style={iconStyle}
          aria-label={t(
            expanded ? "el.table.collapseRowLabel" : "el.table.expandRowLabel",
          )}
          aria-expanded={expanded}
          onClick={() => expandIconProps.onExpand(!expanded)}
        >
          <ElIcon size={iconSize}>
            <ArrowRight />
          </ElIcon>
        </button>
      );
    } else {
      // 非叶子节点保持缩进占位，保证同层文本对齐
      iconOrPlaceholder = (
        <div
          style={{
            ...iconStyle,
            width: `${iconSize}px`,
            height: `${iconSize}px`,
          }}
        />
      );
    }
  }

  return (
    <div
      className={cellKls}
      style={mergedCellStyle}
      {...(restCellProps as HTMLAttributes<HTMLDivElement>)}
      role="cell"
    >
      {iconOrPlaceholder}
      {Cell}
    </div>
  );
}
