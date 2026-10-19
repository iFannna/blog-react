"use client";

import type { CSSProperties, ReactNode } from "react";

import { Row } from "../Row";
import { ns, tryCall } from "../utils";

import type {
  Column,
  ExtraCellPropGetter,
  KeyType,
  RowClassNameGetter,
  RowEventHandlers,
  RowExpandHandler,
  RowHeightChangeHandler,
  RowHoverHandler,
  RowPropsGetter,
  TableV2Row,
  TableV2RowCellRenderParam,
  TableV2RowSlotProps,
} from "../types";

export interface RowRendererProps<T = unknown> {
  className?: string;
  columns: Column<T>[];
  columnsStyles: Record<KeyType, CSSProperties>;
  depthMap: Record<KeyType, number>;
  expandColumnKey?: string;
  expandedRowKeys: KeyType[];
  estimatedRowHeight?: number;
  hasFixedColumns: boolean;
  rowData: TableV2Row;
  rowIndex: number;
  rowKey: KeyType;
  isScrolling?: boolean;
  style?: CSSProperties;
  rowProps?: Record<string, unknown> | RowPropsGetter<T>;
  rowClass?: string | RowClassNameGetter<T>;
  rowEventHandlers?: RowEventHandlers;
  cellProps?: Record<string, unknown> | ExtraCellPropGetter<T>;
  indentSize: number;
  iconSize: number;
  cellRenderer?: (params: TableV2RowCellRenderParam<T>) => ReactNode;
  rowRenderer?: (params: TableV2RowSlotProps<T>) => ReactNode;
  onRowHovered?: RowHoverHandler;
  onRowExpanded?: RowExpandHandler;
  onRowHeightChange?: RowHeightChangeHandler;
}

/** 对应官方 renderers/row.tsx。 */
export function RowRenderer<T>({
  columns,
  columnsStyles,
  depthMap,
  expandColumnKey,
  expandedRowKeys,
  estimatedRowHeight,
  hasFixedColumns,
  rowData,
  rowIndex,
  rowKey,
  isScrolling,
  style,
  rowProps,
  rowClass,
  rowEventHandlers,
  cellProps,
  indentSize,
  iconSize,
  cellRenderer,
  rowRenderer,
  onRowHovered,
  onRowExpanded,
  onRowHeightChange,
}: RowRendererProps<T>) {
  const rowKls = tryCall(
    rowClass,
    { columns, rowData, rowIndex },
    "",
  );

  const additionalProps = tryCall<
    { columns: Column<T>[]; rowData: TableV2Row; rowIndex: number },
    Record<string, unknown>
  >(rowProps, { columns, rowData, rowIndex }, {});

  const currentRowKey = (rowData as Record<KeyType, unknown>)[rowKey] as KeyType;
  const depth = depthMap[currentRowKey] || 0;
  const canExpand = Boolean(expandColumnKey);
  const isFixedRow = rowIndex < 0;
  const isExpanded = canExpand && expandedRowKeys.includes(currentRowKey);

  const kls = [
    ns.e("row"),
    rowKls,
    ns.is("expanded", isExpanded),
    ns.is("fixed", !depth && isFixedRow),
    ns.is("customized", Boolean(rowRenderer)),
    canExpand && rowIndex >= 0 && ns.e(`row-depth-${depth}`),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Row
      {...(additionalProps as Partial<import("../Row").RowProps<T>>)}
      className={kls}
      columns={columns}
      columnsStyles={columnsStyles}
      depth={depth}
      expandColumnKey={expandColumnKey}
      estimatedRowHeight={isFixedRow ? undefined : estimatedRowHeight}
      isScrolling={isScrolling}
      rowIndex={rowIndex}
      rowData={rowData}
      rowKey={currentRowKey}
      expandedRowKeys={expandedRowKeys}
      rowEventHandlers={rowEventHandlers}
      style={style}
      cellProps={cellProps}
      indentSize={indentSize}
      iconSize={iconSize}
      cellRenderer={cellRenderer}
      rowRenderer={rowRenderer}
      onRowExpand={onRowExpanded}
      onRowHover={hasFixedColumns ? onRowHovered : undefined}
      onRowHeightChange={onRowHeightChange}
    />
  );
}
