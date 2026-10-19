"use client";

import { useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ColumnContext,
  ColumnContextProvider,
  TableContext,
  type TableContextValue,
} from "./table-context";
import {
  CELL_STARTS,
  getDefaultClassName,
} from "./config";
import type {
  DefaultRow,
  TableCellScope,
  TableColumnCtx,
  TableColumnProps,
  TableHeaderScope,
} from "./context";
import { parseMinWidth, parseWidth } from "./utils";

/**
 * 对应官方 ElTableColumn。
 *
 * 官方在组件 setup 里把 props 折成一个 `TableColumnCtx`，计算好 width / realWidth /
 * 对齐类名等派生字段后注册给 store；React 侧同样在挂载时算好后 `registerColumn`，
 * 并把用户传的渲染函数收进 customRender / customHeaderRender。
 *
 * 组件本身不渲染任何可见内容：真实表格结构由 ElTable 统一生成，
 * 这里的 children 只作为「配置载体」（分组表头时嵌套子列）。
 */
export function ElTableColumn<T extends DefaultRow = DefaultRow>({
  type = "default",
  prop,
  property,
  label,
  labelSlot,
  minWidth,
  width,
  fixed,
  align,
  headerAlign,
  sortable = false,
  sortMethod,
  sortBy,
  sortOrders,
  resizable = true,
  columnKey,
  className,
  labelClassName,
  showOverflowTooltip,
  formatter,
  selectable,
  filterable = false,
  filters,
  filterMultiple = true,
  filterPlacement = "bottom-start",
  filterClassName = "",
  filteredValue,
  filterMethod,
  tooltipFormatter,
  index = 0,
  children,
  renderHeader,
}: TableColumnProps<T> & {
  /** 自定义标签内容，对应官方 header 插槽 */
  labelSlot?: (label: string) => ReactNode;
}) {
  const ctx = useContext(TableContext);

  if (!ctx) {
    throw new Error(
      "[ElTableColumn] must be used inside el-table / el-table-column",
    );
  }

  // 对应官方 table-column 的取值链：列显式传值 -> 表格上下文（表格自身或全局配置）-> false
  const tableShowOverflowTooltip = ctx.showOverflowTooltip;
  const resolvedShowOverflowTooltip =
    showOverflowTooltip ?? tableShowOverflowTooltip ?? false;

  // 父列 id 来自内层 ColumnContext（分组表头时才有值）
  const columnCtx = useContext(ColumnContext);

  // TableContext 的取值类型做了泛型擦除，这里按本组件的行类型取回
  const { registerColumn, unregisterColumn, nextColumnNo, tableSize, tableId } =
    ctx as unknown as TableContextValue<T>;

  const parentColumnId = columnCtx?.parentColumnId ?? null;

  const resolvedProp = prop ?? property ?? "";

  // 序号只在挂载时取一次，保证列 id 与列顺序稳定（与官方 columnIdSeed 同理）
  const [columnNo] = useState(() => nextColumnNo());
  const columnId = columnKey || `${parentColumnId || tableId}_column_${columnNo}`;

  const column: TableColumnCtx<T> = useMemo(() => {
    const starts = CELL_STARTS[type];
    const parsedWidth = parseWidth(width);
    const parsedMinWidth = parseMinWidth(minWidth ?? starts.minWidth);

    const normalizedFixed: "" | "left" | "right" =
      fixed === true || fixed === "left"
        ? "left"
        : fixed === "right"
          ? "right"
          : "";

    const realWidth = Number(
      parsedWidth === undefined ? (parsedMinWidth ?? 80) : parsedWidth,
    );

    const defaultClassName = getDefaultClassName(type);
    const mergedClassName = defaultClassName
      ? className
        ? `${className} el-${defaultClassName}`
        : `el-${defaultClassName}`
      : className || "";

    return {
      id: columnId,
      no: columnNo,
      parentId: parentColumnId,
      type,
      label: label ?? "",
      className: mergedClassName,
      labelClassName: labelClassName ?? "",
      property: resolvedProp,
      prop: resolvedProp,
      width: parsedWidth ?? starts.width,
      minWidth: parsedMinWidth ?? starts.minWidth ?? 80,
      align: align ? `is-${align}` : "",
      headerAlign: headerAlign ? `is-${headerAlign}` : undefined,
      sortable: !!sortable,
      sortMethod,
      sortBy,
      sortOrders: sortOrders ?? ["ascending", "descending", null],
      resizable: resizable && type !== "selection" && type !== "expand",
      columnKey: columnKey ?? "",
      fixed: normalizedFixed,
      showOverflowTooltip: resolvedShowOverflowTooltip,
      formatter,
      selectable,
      // 官方：有 filters 即可筛选，filterable 只是显式开关
      filterable: filterable || !!filters,
      filters,
      filterMultiple,
      filterPlacement,
      filterClassName,
      filteredValue: filteredValue ?? [],
      filterMethod,
      tooltipFormatter,
      index,
      order: null,
      realWidth,
      realIndex: columnNo,
      isColumnGroup: !!(
        typeof children !== "function" && children !== undefined && children !== null
      ),
      children: undefined,
      level: 1,
      colSpan: 1,
      rowSpan: 1,
      customRender:
        typeof children === "function"
          ? (children as (scope: TableCellScope<T>) => ReactNode)
          : undefined,
      customHeaderRender: renderHeader
        ? (renderHeader as (scope: TableHeaderScope<T>) => ReactNode)
        : undefined,
    } as TableColumnCtx<T>;
  }, [
    align,
    children,
    className,
    columnId,
    columnKey,
    columnNo,
    filterClassName,
    filterMethod,
    filterMultiple,
    fixed,
    filterPlacement,
    filterable,
    filteredValue,
    filters,
    formatter,
    headerAlign,
    index,
    label,
    labelClassName,
    minWidth,
    parentColumnId,
    renderHeader,
    resizable,
    resolvedProp,
    selectable,
    resolvedShowOverflowTooltip,
    tooltipFormatter,
    sortBy,
    sortMethod,
    sortOrders,
    sortable,
    type,
    width,
  ]);

  useEffect(() => {
    registerColumn(column);
    return () => unregisterColumn(column.id);
  }, [column, registerColumn, unregisterColumn]);

  // 分组表头的子列通过嵌套 ElTableColumn 表达；这里把自身 id 作为子列的父列 id 下发。
  // 自身不产出可见 DOM，真实表格结构由 ElTable 统一生成。
  // 官方 header 插槽等价能力走 renderHeader；labelSlot 仅保留旧签名兼容。
  void labelSlot;
  void tableSize;
  return (
    <ColumnContextProvider value={{ parentColumnId: columnId }}>
      {typeof children === "function" ? null : children}
    </ColumnContextProvider>
  );
}
