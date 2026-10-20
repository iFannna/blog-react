import type { CSSProperties, ReactNode } from "react";
import type { ComponentSize } from "../button/types";

export type DefaultRow = Record<string, unknown>;

export type TableSortOrder = "ascending" | "descending";

export interface Sort {
  prop: string;
  order: TableSortOrder | null;
  init?: boolean;
  silent?: boolean;
}

export interface TreeProps {
  hasChildren?: string;
  children?: string;
  checkStrictly?: boolean;
}

export interface TreeNode {
  expanded?: boolean;
  loading?: boolean;
  noLazyChildren?: boolean;
  indent?: number;
  level?: number;
  display?: boolean;
}

/** 列筛选面板里的一项，对应官方 column.filters。 */
export interface TableFilter {
  text: string;
  value: string;
}

/** load 回调里的树节点信息，对应官方 treeNode。 */
export interface LazyTreeNode extends TreeNode {
  row: DefaultRow | null;
  key: string;
  children?: DefaultRow[];
}

/** 与官方 config.ts 的 cellStarts 对应：几种固定类型列的默认尺寸与排序位。 */
export interface ColumnStarts {
  order: string;
  width?: number;
  minWidth?: number;
  realWidth?: number;
}

export interface TableColumnCtx<T extends DefaultRow = DefaultRow> {
  id: string;
  /** 同层内的创建顺序，用来稳定列顺序 */
  no: number;
  /** 父列（分组表头时才有），null 表示顶层列 */
  parentId: string | null;
  type: "default" | "selection" | "index" | "expand";
  label: string;
  className: string;
  labelClassName: string;
  property: string;
  prop: string;
  width?: string | number;
  minWidth?: string | number;
  align: string;
  headerAlign?: string;
  sortable: boolean;
  sortMethod?: (a: T, b: T) => number;
  sortBy?: string | string[] | ((row: T, index: number, array?: T[]) => string);
  sortOrders: (TableSortOrder | null)[];
  resizable: boolean;
  columnKey: string;
  fixed: "" | "left" | "right";
  showOverflowTooltip: boolean;
  formatter?: (row: T, column: TableColumnCtx<T>, cellValue: unknown, index: number) => ReactNode;
  selectable?: (row: T, index: number) => boolean;
  filterable: boolean;
  filters?: TableFilter[];
  filterMultiple: boolean;
  filterPlacement: string;
  filterClassName: string;
  /** 筛选后回写到列上，表头据此高亮 */
  filteredValue: string[];
  filterMethod?: (value: string, row: T, column: TableColumnCtx<T>) => boolean;
  tooltipFormatter?: (data: { row: T; column: TableColumnCtx<T>; cellValue: unknown }) => ReactNode;
  index: number | ((index: number) => number);
  order: TableSortOrder | null;
  realWidth: number | null;
  /** 展开列的下标 */
  realIndex: number;
  /** 用户传入的单元格渲染函数，对应官方 default 插槽 */
  customRender?: (scope: TableCellScope<T>) => ReactNode;
  /** 用户传入的表头渲染函数，对应官方 header 插槽 */
  customHeaderRender?: (scope: TableHeaderScope<T>) => ReactNode;
  isColumnGroup: boolean;
  children?: TableColumnCtx<T>[];
  /** 表格初值：由 ElTableColumn 计算后写入 */
  level: number;
  colSpan: number;
  rowSpan: number;
}

/** 渲染单元格/表头时传给自定义渲染函数的上下文。 */
export interface TableCellScope<T extends DefaultRow = DefaultRow> {
  row: T;
  column: TableColumnCtx<T>;
  $index: number;
}

export interface TableHeaderScope<T extends DefaultRow = DefaultRow> {
  column: TableColumnCtx<T>;
  $index: number;
}

/** 给 ElTable 用的完整 props。 */
export interface TableProps<T extends DefaultRow = DefaultRow> {
  data?: T[];
  size?: ComponentSize;
  width?: string | number;
  height?: string | number;
  maxHeight?: string | number;
  fit?: boolean;
  stripe?: boolean;
  border?: boolean;
  rowKey?: string | ((row: T) => string);
  showHeader?: boolean;
  showSummary?: boolean;
  sumText?: string;
  summaryMethod?: (data: { columns: TableColumnCtx<T>[]; data: T[] }) => ReactNode[];
  rowClassName?: string | ((data: { row: T; rowIndex: number }) => string);
  rowStyle?: CSSProperties | ((data: { row: T; rowIndex: number }) => CSSProperties);
  cellClassName?:
    | string
    | ((data: { row: T; rowIndex: number; column: TableColumnCtx<T>; columnIndex: number }) => string);
  cellStyle?:
    | CSSProperties
    | ((data: { row: T; rowIndex: number; column: TableColumnCtx<T>; columnIndex: number }) => CSSProperties);
  headerRowClassName?: string | ((data: { rowIndex: number }) => string);
  headerRowStyle?: CSSProperties | ((data: { rowIndex: number }) => CSSProperties);
  headerCellClassName?:
    | string
    | ((data: { rowIndex: number; columnIndex: number; column: TableColumnCtx<T> }) => string);
  headerCellStyle?:
    | CSSProperties
    | ((data: { rowIndex: number; columnIndex: number; column: TableColumnCtx<T> }) => CSSProperties);
  highlightCurrentRow?: boolean;
  emptyText?: string;
  defaultSort?: Sort;
  spanMethod?: (data: {
    row: T;
    rowIndex: number;
    column: TableColumnCtx<T>;
    columnIndex: number;
  }) => number[] | { rowspan: number; colspan: number } | undefined;
  tableLayout?: "fixed" | "auto";
  scrollbarAlwaysOn?: boolean;
  showOverflowTooltip?: boolean;
  /** 溢出提示主题，缺省回落到 ConfigProvider.table.tooltipEffect */
  tooltipEffect?: "dark" | "light";
  tooltipFormatter?: (data: { row: T; column: TableColumnCtx<T>; cellValue: unknown }) => ReactNode;
  /** 树形数据：children / hasChildren / checkStrictly */
  treeProps?: TreeProps;
  /** 懒加载子节点，需配合 rowKey */
  lazy?: boolean;
  load?: (row: T, treeNode: LazyTreeNode, resolve: (data: T[]) => void) => void;
  defaultExpandAll?: boolean;
  expandRowKeys?: string[];
  /** 树形层级缩进，官方默认 16 */
  indent?: number;
  /** 空数据插槽，对应官方 empty 插槽 */
  empty?: ReactNode;
  /** 表格尾部追加内容，对应官方 append 插槽 */
  append?: ReactNode;
  /** 展开行内容，对应官方 renderExpanded */
  renderExpanded?: (data: { row: T; $index: number; expanded: boolean }) => ReactNode;
  /** 展开行是否可展开 */
  rowExpandable?: (row: T, index: number) => boolean;
  onSelect?: (selection: T[], row: T) => void;
  onSelectAll?: (selection: T[]) => void;
  onSelectionChange?: (selection: T[]) => void;
  onRowClick?: (row: T, column: TableColumnCtx<T> | null, event: React.MouseEvent) => void;
  onCellClick?: (row: T, column: TableColumnCtx<T>, cell: HTMLTableCellElement, event: React.MouseEvent) => void;
  onSortChange?: (data: { column: TableColumnCtx<T> | null; prop: string | null; order: TableSortOrder | null }) => void;
  onFilterChange?: (filters: Record<string, string[]>) => void;
  onCurrentChange?: (currentRow: T | null, oldCurrentRow: T | null) => void;
  onExpandChange?: (row: T, expanded: boolean) => void;
  onHeaderClick?: (column: TableColumnCtx<T>, event: React.MouseEvent) => void;
  onHeaderDragend?: (
    newWidth: number,
    oldWidth: number,
    column: TableColumnCtx<T>,
    event: MouseEvent,
  ) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export interface TableColumnProps<T extends DefaultRow = DefaultRow> {
  type?: "default" | "selection" | "index" | "expand";
  prop?: string;
  property?: string;
  label?: string;
  width?: string | number;
  minWidth?: string | number;
  fixed?: boolean | "left" | "right";
  align?: "left" | "center" | "right";
  headerAlign?: "left" | "center" | "right";
  sortable?: boolean | "custom";
  sortMethod?: (a: T, b: T) => number;
  sortBy?: string | string[] | ((row: T, index: number, array?: T[]) => string);
  sortOrders?: (TableSortOrder | null)[];
  resizable?: boolean;
  columnKey?: string;
  className?: string;
  labelClassName?: string;
  showOverflowTooltip?: boolean;
  formatter?: (row: T, column: TableColumnCtx<T>, cellValue: unknown, index: number) => ReactNode;
  selectable?: (row: T, index: number) => boolean;
  filterable?: boolean;
  filters?: TableFilter[];
  filterMultiple?: boolean;
  filterPlacement?: string;
  filterClassName?: string;
  filteredValue?: string[];
  filterMethod?: (value: string, row: T, column: TableColumnCtx<T>) => boolean;
  tooltipFormatter?: (data: { row: T; column: TableColumnCtx<T>; cellValue: unknown }) => ReactNode;
  index?: number | ((index: number) => number);
  /** 自定义单元格内容，对应官方 default 插槽 */
  children?: ReactNode | ((scope: TableCellScope<T>) => ReactNode);
  /** 自定义表头内容，对应官方 header 插槽 */
  renderHeader?: (scope: TableHeaderScope<T>) => ReactNode;
}

/** 表格实例的公开方法，对应官方 Table 的 defineExpose。 */
export interface TableExpose<T extends DefaultRow = DefaultRow> {
  clearSelection: () => void;
  getSelectionRows: () => T[];
  toggleRowSelection: (row: T, selected?: boolean, ignoreSelectable?: boolean) => void;
  toggleAllSelection: () => void;
  setCurrentRow: (row?: T | null) => void;
  toggleRowExpansion: (row: T, expanded?: boolean) => void;
  clearSort: () => void;
  sort: (prop: string, order: TableSortOrder) => void;
  clearFilter: (columnKeys?: string | string[]) => void;
  doLayout: () => void;
}
