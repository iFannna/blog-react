"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { placeholderSign } from "./constants";
import { CellRenderer } from "./renderers/Cell";

import type {
  Column,
  Data,
  ExtraCellPropGetter,
  KeyType,
  RowEventHandlers,
  RowExpandParams,
  RowHeightChangeHandler,
  RowHoverParams,
  TableV2Row,
  TableV2RowCellRenderParam,
  TableV2RowSlotProps,
} from "./types";

const ROW_EVENT_PROP_MAP: Record<string, string> = {
  onClick: "onClick",
  onContextmenu: "onContextMenu",
  onDblclick: "onDoubleClick",
  onMouseenter: "onMouseEnter",
  onMouseleave: "onMouseLeave",
};

export interface RowProps<T = unknown> {
  className?: string;
  columns: Column<T>[];
  columnsStyles: Record<KeyType, CSSProperties>;
  depth: number;
  expandColumnKey?: string;
  estimatedRowHeight?: number;
  isScrolling?: boolean;
  rowData: TableV2Row;
  rowIndex: number;
  rowKey: KeyType;
  expandedRowKeys: KeyType[];
  style?: CSSProperties;
  rowEventHandlers?: RowEventHandlers;
  cellProps?: Record<string, unknown> | ExtraCellPropGetter<T>;
  indentSize?: number;
  iconSize?: number;
  cellRenderer?: (params: TableV2RowCellRenderParam<T>) => ReactNode;
  rowRenderer?: (params: TableV2RowSlotProps<T>) => ReactNode;
  onRowExpand?: (params: RowExpandParams) => void;
  onRowHover?: (params: RowHoverParams) => void;
  onRowHeightChange?: RowHeightChangeHandler;
  /** rowProps 的透传属性，对应官方 Row 的 inheritAttrs。 */
  [key: string]: unknown;
}

/** 对应官方 components/row.tsx，同时承担动态行高的测量。 */
export function Row<T = unknown>(props: RowProps<T>) {
  const {
    className,
    columns,
    columnsStyles,
    depth,
    expandColumnKey,
    estimatedRowHeight,
    isScrolling,
    rowData,
    rowIndex,
    rowKey,
    expandedRowKeys,
    style,
    rowEventHandlers,
    cellProps,
    indentSize = 12,
    iconSize = 12,
    cellRenderer,
    rowRenderer,
    onRowExpand,
    onRowHover,
    onRowHeightChange,
    ...rest
  } = props;

  const rowRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState(false);
  const measurable =
    typeof estimatedRowHeight === "number" && rowIndex >= 0;

  // 测量回调每次渲染都可能变化，用 ref 固定首次挂载时调用的版本
  const latestRef = useRef({
    columns,
    onRowHeightChange,
    rowKey,
    rowIndex,
  });
  useEffect(() => {
    latestRef.current = { columns, onRowHeightChange, rowKey, rowIndex };
  });

  useEffect(() => {
    if (!measurable) return;

    const element = rowRef.current;
    if (!element) return;

    const height = element.getBoundingClientRect().height;
    setMeasured(true);

    const timer = setTimeout(() => {
      const latest = latestRef.current;
      const firstColumn = latest.columns[0];
      const isPlaceholder =
        firstColumn?.placeholderSign === placeholderSign;

      latest.onRowHeightChange?.(
        {
          rowKey: latest.rowKey,
          height,
          rowIndex: latest.rowIndex,
        },
        firstColumn && !isPlaceholder ? firstColumn.fixed : undefined,
      );
    }, 0);

    return () => clearTimeout(timer);
  }, [measurable]);

  const onExpand = (expanded: boolean) => {
    onRowExpand?.({ expanded, rowData, rowIndex, rowKey });
  };

  const cells: ReactNode[] = columns.map((column, columnIndex) => {
    const children = (rowData as Data).children;
    const expandable =
      Array.isArray(children) &&
      children.length > 0 &&
      column.key === expandColumnKey;

    const params: TableV2RowCellRenderParam<T> = {
      column,
      columns,
      columnIndex,
      depth,
      style: columnsStyles[column.key as KeyType],
      rowData,
      rowIndex,
      isScrolling,
      expandIconProps: expandable
        ? { rowData, rowIndex, onExpand }
        : undefined,
    };

    return (
      <CellRenderer
        key={String(column.key ?? columnIndex)}
        {...params}
        cellProps={cellProps}
        expandColumnKey={expandColumnKey}
        indentSize={indentSize}
        iconSize={iconSize}
        rowKey={rowKey}
        expandedRowKeys={expandedRowKeys}
      >
        {cellRenderer?.(params)}
      </CellRenderer>
    );
  });

  let content: ReactNode = cells;
  if (rowRenderer) {
    content = rowRenderer({
      cells,
      columns,
      depth,
      style,
      rowData,
      rowIndex,
      isScrolling,
    });
  }

  const eventHandlers: Record<string, (event: Event) => void> = {};

  Object.entries(rowEventHandlers ?? {}).forEach(([eventName, handler]) => {
    if (typeof handler !== "function") return;
    const reactEventName = ROW_EVENT_PROP_MAP[eventName];
    if (!reactEventName) return;

    eventHandlers[reactEventName] = (event: Event) => {
      handler({ event, rowData, rowIndex, rowKey });
    };
  });

  if (onRowHover) {
    const existedEnter = eventHandlers.onMouseEnter;
    const existedLeave = eventHandlers.onMouseLeave;

    eventHandlers.onMouseEnter = (event: Event) => {
      onRowHover({ event: event as unknown as MouseEvent, hovered: true, rowData, rowIndex, rowKey });
      existedEnter?.(event);
    };
    eventHandlers.onMouseLeave = (event: Event) => {
      onRowHover({ event: event as unknown as MouseEvent, hovered: false, rowData, rowIndex, rowKey });
      existedLeave?.(event);
    };
  }

  const rowStyle =
    measurable && !measured
      ? (() => {
          // 未测量前不能写死高度，否则量到的永远是估计值
          const exceptHeight = { ...(style ?? {}) };
          delete exceptHeight.height;
          return exceptHeight;
        })()
      : style;

  const rowKeyAttr = { rowkey: String(rowKey) };

  return (
    <div
      {...(rest as HTMLAttributes<HTMLDivElement>)}
      ref={rowRef}
      className={className}
      style={rowStyle}
      role="row"
      {...rowKeyAttr}
      {...eventHandlers}
    >
      {content}
    </div>
  );
}
