import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react";

import type { ScrollDirection } from "../virtual-list";
import type { FixedDir, SortOrder } from "./constants";

export type Alignment = "left" | "center" | "right";
export type FixedDirection = FixedDir;
export type KeyType = string | number | symbol;

/** 行数据是动态结构，沿用 table 模块的 DefaultRow 约定。 */
export type TableV2Row = Record<string, unknown>;

export type Data = TableV2Row & {
  children?: Data[];
};

/* ------------------------------------------------------------------ *
 * Renderer params
 * ------------------------------------------------------------------ */

export interface RowCommonParams {
  rowData: TableV2Row;
  rowIndex: number;
}

export interface ColumnCommonParams<T> {
  columns: Column<T>[];
  column: Column<T>;
  columnIndex: number;
}

export interface CellRendererParams<T>
  extends RowCommonParams,
    ColumnCommonParams<T> {
  cellData: T;
}

export interface HeaderCellRendererParams<T> extends ColumnCommonParams<T> {
  headerIndex: number;
}

export type ClassNameGetterParams<T> = CellRendererParams<T>;

export interface DataGetterParams<T>
  extends RowCommonParams,
    ColumnCommonParams<T> {
  cellData?: T;
}

export type DataGetter<T> = (params: DataGetterParams<T>) => T;
export type ClassNameGetter<T> = (params: ClassNameGetterParams<T>) => string;
export type HeaderClassGetter<T> = (
  params: ColumnCommonParams<T> & { headerIndex: number },
) => string;

export type CellRenderer<T> = (params: CellRendererParams<T>) => ReactNode;
export type HeaderCellRenderer<T> = (
  params: HeaderCellRendererParams<T>,
) => ReactNode;

/* ------------------------------------------------------------------ *
 * Column
 * ------------------------------------------------------------------ */

export interface Column<T = unknown> {
  align?: Alignment;
  class?: string | ClassNameGetter<T>;
  key?: KeyType;
  dataKey?: KeyType;
  fixed?: true | FixedDirection;
  flexGrow?: CSSProperties["flexGrow"];
  flexShrink?: CSSProperties["flexShrink"];
  title?: string;
  hidden?: boolean;
  headerClass?: HeaderClassGetter<T> | string;
  maxWidth?: number;
  minWidth?: number;
  style?: CSSProperties;
  sortable?: boolean;
  width: number;
  cellRenderer?: CellRenderer<T>;
  headerCellRenderer?: HeaderCellRenderer<T>;
  dataGetter?: DataGetter<T>;
  /** 允许业务列携带自定义元数据 */
  [key: string]: unknown;
}

export type Columns<T> = Column<T>[];
export type AnyColumns = Columns<unknown>;

/* ------------------------------------------------------------------ *
 * Sort
 * ------------------------------------------------------------------ */

export interface SortBy {
  key: KeyType;
  order: SortOrder;
}

export type SortState = Record<KeyType, SortOrder>;

/* ------------------------------------------------------------------ *
 * Slot / render prop params（对应官方作用域插槽参数）
 * ------------------------------------------------------------------ */

export interface TableV2CustomizedHeaderSlotParam<T = unknown> {
  cells: ReactNode[];
  columns: Columns<T>;
  headerIndex: number;
}

export interface TableV2RowCellRenderParam<T = unknown> {
  column: Column<T>;
  columns: Column<T>[];
  columnIndex: number;
  depth: number;
  style?: CSSProperties;
  rowData: TableV2Row;
  rowIndex: number;
  isScrolling?: boolean;
  expandIconProps?: {
    rowData: TableV2Row;
    rowIndex: number;
    onExpand: (expand: boolean) => void;
  };
}

export interface TableV2RowSlotProps<T = unknown> {
  cells: ReactNode[];
  columns: Column<T>[];
  depth: number;
  style?: CSSProperties;
  rowData: TableV2Row;
  rowIndex: number;
  isScrolling?: boolean;
}

export interface TableV2HeaderRendererParams<T = unknown> {
  className?: string;
  columns: Columns<T>;
  headerIndex: number;
  style?: CSSProperties;
}

export interface TableV2HeaderRowCellRendererParams<T = unknown> {
  columns: Columns<T>;
  column: Column<T>;
  columnIndex: number;
  headerIndex: number;
  style?: CSSProperties;
}

export interface TableV2HeaderRowRendererParams<T = unknown> {
  cells: ReactNode[];
  columns: Columns<T>;
  headerIndex: number;
}

/** Vue 版 `header-cell` 作用域插槽在 React 侧的等价参数。 */
export interface HeaderCellSlotProps<T = unknown>
  extends TableV2HeaderRowCellRendererParams<T> {
  className: string;
  headerCellProps?: Record<string, unknown> | HeaderCellPropsGetter<T>;
  sortBy: SortBy;
  sortState?: SortState;
  onColumnSorted: (e: ReactMouseEvent) => void;
}

/* ------------------------------------------------------------------ *
 * Row events / handlers
 * ------------------------------------------------------------------ */

export interface RowExpandParams extends RowCommonParams {
  expanded: boolean;
  rowKey: KeyType;
}

export interface RowHoverParams extends Partial<RowCommonParams> {
  event?: MouseEvent;
  hovered: boolean;
  rowKey: KeyType;
}

export interface RowEventHandlerParams extends RowCommonParams {
  rowKey: KeyType;
  event: Event;
}

export interface RowHeightChangedParams {
  rowKey: KeyType;
  height: number;
  rowIndex: number;
}

export type RowExpandHandler = (params: RowExpandParams) => void;
export type RowHoverHandler = (params: RowHoverParams) => void;
export type RowEventHandler = (params: RowEventHandlerParams) => void;
export type RowHeightChangeHandler = (
  row: RowHeightChangedParams,
  fixedDirection: boolean | FixedDirection | undefined,
) => void;

export interface RowEventHandlers {
  onClick?: RowEventHandler;
  onContextmenu?: RowEventHandler;
  onDblclick?: RowEventHandler;
  onMouseenter?: RowEventHandler;
  onMouseleave?: RowEventHandler;
}

/* ------------------------------------------------------------------ *
 * Table events
 * ------------------------------------------------------------------ */

export interface ScrollParams {
  scrollLeft: number;
  scrollTop: number;
  xAxisScrollDir?: ScrollDirection;
  yAxisScrollDir?: ScrollDirection;
  updateRequested?: boolean;
}

export interface RowsRenderedParams {
  rowCacheStart: number;
  rowCacheEnd: number;
  rowVisibleStart: number;
  rowVisibleEnd: number;
}

export interface ColumnSortParams<T> {
  column: Column<T>;
  key: KeyType;
  order: SortOrder;
}

export type ColumnSortHandler<T> = (params: ColumnSortParams<T>) => void;
export type ColumnResizeHandler<T> = (column: Column<T>, width: number) => void;
export type ExpandedRowsChangeHandler = (expandedRowKeys: KeyType[]) => void;

export interface ExtraCellPropGetter<T> {
  (
    params: ColumnCommonParams<T> & RowCommonParams & { cellData: T },
  ): Record<string, unknown>;
}

export interface HeaderClassNameGetter<T> {
  (params: { columns: Column<T>[]; headerIndex: number }): string;
}

export interface RowClassNameGetter<T> {
  (params: { columns: Column<T>[] } & RowCommonParams): string;
}

/** 兼容旧命名，语义与 RowClassNameGetter 一致。 */
export type RowClassGetter<T> = RowClassNameGetter<T>;

export type RowPropsGetter<T> = (params: {
  columns: Column<T>[];
  rowData: TableV2Row;
  rowIndex: number;
}) => Record<string, unknown>;

export type HeaderPropsGetter<T> = (params: {
  columns: Column<T>[];
  headerIndex: number;
}) => Record<string, unknown>;

export type HeaderCellPropsGetter<T> = (
  params: HeaderCellSlotProps<T>,
) => Record<string, unknown>;

/* ------------------------------------------------------------------ *
 * Component props
 * ------------------------------------------------------------------ */

export interface TableV2Props<T = unknown> {
  cache?: number;
  estimatedRowHeight?: number;
  rowKey?: KeyType;

  /* Header */
  headerClass?: string | HeaderClassNameGetter<T>;
  headerProps?: Record<string, unknown> | HeaderPropsGetter<T>;
  headerCellProps?:
    | Record<string, unknown>
    | HeaderCellPropsGetter<T>;
  headerHeight?: number | number[];

  /* Footer */
  footerHeight?: number;

  /* Row */
  rowClass?: string | RowClassNameGetter<T>;
  rowProps?: Record<string, unknown> | RowPropsGetter<T>;
  rowHeight?: number;
  rowEventHandlers?: RowEventHandlers;

  /* Cell */
  cellProps?: Record<string, unknown> | ExtraCellPropGetter<T>;

  /* Data */
  columns: Column<T>[];
  data: TableV2Row[];
  dataGetter?: DataGetter<unknown>;
  fixedData?: TableV2Row[];

  /* Tree */
  expandColumnKey?: string;
  expandedRowKeys?: KeyType[];
  defaultExpandedRowKeys?: KeyType[];

  /* Attributes */
  className?: string;
  fixed?: boolean;
  style?: CSSProperties;
  width: number;
  height: number;
  maxHeight?: number;
  useIsScrolling?: boolean;
  indentSize?: number;
  iconSize?: number;
  hScrollbarSize?: number;
  vScrollbarSize?: number;
  scrollbarAlwaysOn?: boolean;

  /* Sorting */
  sortBy?: SortBy;
  sortState?: SortState;

  /* Handlers */
  onColumnSort?: ColumnSortHandler<T>;
  onExpandedRowsChange?: ExpandedRowsChangeHandler;
  onEndReached?: (remainDistance: number) => void;
  onRowExpand?: RowExpandHandler;
  onScroll?: (params: ScrollParams) => void;
  onRowsRendered?: (params: RowsRenderedParams) => void;

  /* Slots → React props */
  /** 对应官方 #row 作用域插槽 */
  rowRenderer?: (params: TableV2RowSlotProps<T>) => ReactNode;
  /** 对应官方 #cell 作用域插槽 */
  cellRenderer?: (params: TableV2RowCellRenderParam<T>) => ReactNode;
  /** 对应官方 #header 作用域插槽 */
  headerRenderer?: (params: TableV2CustomizedHeaderSlotParam<T>) => ReactNode;
  /** 对应官方 #header-cell 作用域插槽 */
  headerCellRenderer?: (params: HeaderCellSlotProps<T>) => ReactNode;
  /** 对应官方 #footer 插槽 */
  footer?: ReactNode;
  /** 对应官方 #empty 插槽 */
  empty?: ReactNode;
  /** 对应官方 #overlay 插槽 */
  overlay?: ReactNode;
}

export interface TableV2Expose {
  scrollTo: (param: { scrollLeft?: number; scrollTop?: number }) => void;
  scrollToLeft: (scrollLeft: number) => void;
  scrollToTop: (scrollTop: number) => void;
  scrollToRow: (
    row: number,
    strategy?: "auto" | "smart" | "center" | "start" | "end",
  ) => void;
}

/** 内部使用：TableGrid 向 Row 下发的网格行参数。 */
export interface TableGridRowSlotParams<T = unknown> {
  className?: string;
  columns: Column<T>[];
  rowData: TableV2Row;
  rowIndex: number;
  isScrolling?: boolean;
  style?: CSSProperties;
}

export type { SortOrder };
