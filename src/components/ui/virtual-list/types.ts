import type {
  CSSProperties,
  ElementType,
  ReactNode,
  RefObject,
} from "react";

export type Alignment = "auto" | "smart" | "center" | "start" | "end";
export type ItemSize = (idx: number) => number;
export type Direction = "ltr" | "rtl";
export type LayoutDirection = "horizontal" | "vertical";
export type RTLOffsetType =
  | "negative"
  | "positive-descending"
  | "positive-ascending";
export type ScrollDirection = "forward" | "backward";
export type EndReachedDirection = "top" | "bottom" | "left" | "right";

export interface ListItem {
  offset: number;
  size: number;
}

export interface ListCache {
  items: Record<number, ListItem>;
  estimatedItemSize: number;
  lastVisitedIndex: number;
}

export interface GridCache {
  column: Record<number, ListItem>;
  row: Record<number, ListItem>;
  estimatedColumnWidth: number;
  estimatedRowHeight: number;
  lastVisitedColumnIndex: number;
  lastVisitedRowIndex: number;
}

export interface ListStates {
  isScrolling: boolean;
  scrollDir: ScrollDirection;
  scrollOffset: number;
  updateRequested: boolean;
}

export interface GridStates {
  isScrolling: boolean;
  scrollLeft: number;
  scrollTop: number;
  updateRequested: boolean;
  xAxisScrollDir: ScrollDirection;
  yAxisScrollDir: ScrollDirection;
}

export interface ListRenderParams<T> {
  data: T[];
  index: number;
  isScrolling?: boolean;
  style: CSSProperties;
}

export interface GridRenderParams<T> {
  columnIndex: number;
  rowIndex: number;
  data: T[];
  key: string | number;
  isScrolling?: boolean;
  style: CSSProperties;
}

export type GridItemKeyGetter<T> = (args: {
  columnIndex: number;
  data: T[];
  rowIndex: number;
}) => string | number;

export interface VirtualizedSharedProps<T = unknown> {
  /** 数据源，原样透传给 render prop */
  data?: T[];
  height: number | string;
  width?: number | string;
  className?: string;
  style?: CSSProperties;
  /** 滚动容器的元素类型或组件 */
  containerElement?: ElementType;
  /** 内容容器的元素类型或组件 */
  innerElement?: ElementType;
  innerProps?: Record<string, unknown> & {
    className?: string;
    style?: CSSProperties;
  };
  innerWidth?: number | string;
  direction?: Direction;
  /** 渲染时是否下发 isScrolling */
  useIsScrolling?: boolean;
  /** 对应官方 perfMode：为 true 时缓存每种样式参数组合 */
  perfMode?: boolean;
  scrollbarAlwaysOn?: boolean;
}

export interface VirtualizedListProps<T = unknown>
  extends VirtualizedSharedProps<T> {
  total: number;
  itemSize: number | ItemSize;
  estimatedItemSize?: number;
  /** 可视区外上下各预渲染的项数，默认 2 */
  cache?: number;
  layout?: LayoutDirection;
  initScrollOffset?: number;
  children: (params: ListRenderParams<T>) => ReactNode;
  onItemRendered?: (
    cacheStart: number,
    cacheEnd: number,
    visibleStart: number,
    visibleEnd: number,
  ) => void;
  onScroll?: (params: {
    scrollDir: ScrollDirection;
    scrollOffset: number;
    updateRequested: boolean;
  }) => void;
  onEndReached?: (direction: EndReachedDirection) => void;
}

export interface VirtualizedGridProps<T = unknown>
  extends VirtualizedSharedProps<T> {
  totalColumn: number;
  totalRow: number;
  columnWidth: number | ItemSize;
  rowHeight: number | ItemSize;
  estimatedColumnWidth?: number;
  estimatedRowHeight?: number;
  columnCache?: number;
  rowCache?: number;
  initScrollLeft?: number;
  initScrollTop?: number;
  itemKey?: GridItemKeyGetter<T>;
  hScrollbarSize?: number;
  vScrollbarSize?: number;
  scrollbarStartGap?: number;
  scrollbarEndGap?: number;
  role?: string;
  children: (params: GridRenderParams<T>) => ReactNode;
  onItemRendered?: (params: {
    columnCacheStart: number;
    columnCacheEnd: number;
    columnVisibleStart: number;
    columnVisibleEnd: number;
    rowCacheStart: number;
    rowCacheEnd: number;
    rowVisibleStart: number;
    rowVisibleEnd: number;
  }) => void;
  onScroll?: (params: {
    xAxisScrollDir: ScrollDirection;
    scrollLeft: number;
    yAxisScrollDir: ScrollDirection;
    scrollTop: number;
    updateRequested: boolean;
  }) => void;
}

export interface ListCalculator<T> {
  getItemOffset: (
    props: VirtualizedListProps<T>,
    index: number,
    cache: ListCache | null,
  ) => number;
  getItemSize: (
    props: VirtualizedListProps<T>,
    index: number,
    cache: ListCache | null,
  ) => number;
  getEstimatedTotalSize: (
    props: VirtualizedListProps<T>,
    cache: ListCache | null,
  ) => number;
  getOffset: (
    props: VirtualizedListProps<T>,
    index: number,
    alignment: Alignment,
    scrollOffset: number,
    cache: ListCache | null,
  ) => number;
  getStartIndexForOffset: (
    props: VirtualizedListProps<T>,
    offset: number,
    cache: ListCache | null,
  ) => number;
  getStopIndexForStartIndex: (
    props: VirtualizedListProps<T>,
    startIndex: number,
    scrollOffset: number,
    cache: ListCache | null,
  ) => number;
  initCache: (props: VirtualizedListProps<T>) => ListCache | null;
  clearCache: boolean;
  validateProps?: (props: VirtualizedListProps<T>) => void;
}

export interface GridCalculator<T> {
  getColumnOffset: (
    props: VirtualizedGridProps<T>,
    index: number,
    alignment: Alignment,
    scrollLeft: number,
    cache: GridCache,
    scrollbarWidth: number,
  ) => number;
  getColumnPosition: (
    props: VirtualizedGridProps<T>,
    index: number,
    cache: GridCache,
  ) => [number, number];
  getColumnStartIndexForOffset: (
    props: VirtualizedGridProps<T>,
    offset: number,
    cache: GridCache,
  ) => number;
  getColumnStopIndexForStartIndex: (
    props: VirtualizedGridProps<T>,
    startIndex: number,
    scrollLeft: number,
    cache: GridCache,
  ) => number;
  getEstimatedTotalHeight: (
    props: VirtualizedGridProps<T>,
    cache: GridCache,
  ) => number;
  getEstimatedTotalWidth: (
    props: VirtualizedGridProps<T>,
    cache: GridCache,
  ) => number;
  getRowOffset: (
    props: VirtualizedGridProps<T>,
    index: number,
    alignment: Alignment,
    scrollTop: number,
    cache: GridCache,
    scrollbarWidth: number,
  ) => number;
  getRowPosition: (
    props: VirtualizedGridProps<T>,
    index: number,
    cache: GridCache,
  ) => [number, number];
  getRowStartIndexForOffset: (
    props: VirtualizedGridProps<T>,
    offset: number,
    cache: GridCache,
  ) => number;
  getRowStopIndexForStartIndex: (
    props: VirtualizedGridProps<T>,
    startIndex: number,
    scrollTop: number,
    cache: GridCache,
  ) => number;
  initCache: (props: VirtualizedGridProps<T>) => GridCache;
  clearCache: boolean;
  validateProps?: (props: VirtualizedGridProps<T>) => void;
}

export interface VirtualListHandle {
  windowRef: RefObject<HTMLElement | null>;
  innerRef: RefObject<HTMLElement | null>;
  getItemStyleCache: (
    a: unknown,
    b: unknown,
    c: unknown,
  ) => Record<string, CSSProperties>;
  scrollTo: (offset: number) => void;
  scrollToItem: (idx: number, alignment?: Alignment) => void;
  resetScrollTop: () => void;
  resetAfterIndex: (idx: number, forceUpdate?: boolean) => void;
  states: ListStates;
}

export interface VirtualGridHandle {
  windowRef: RefObject<HTMLElement | null>;
  innerRef: RefObject<HTMLElement | null>;
  getItemStyleCache: (
    a: unknown,
    b: unknown,
    c: unknown,
  ) => Record<string, CSSProperties>;
  scrollTo: (options: { scrollLeft?: number; scrollTop?: number }) => void;
  scrollToItem: (
    rowIndex?: number,
    columnIndex?: number,
    alignment?: Alignment,
  ) => void;
  resetAfterColumnIndex: (idx: number, forceUpdate?: boolean) => void;
  resetAfterRowIndex: (idx: number, forceUpdate?: boolean) => void;
  resetAfter: (
    indices: { columnIndex?: number; rowIndex?: number },
    forceUpdate?: boolean,
  ) => void;
  states: GridStates;
}
