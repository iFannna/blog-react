"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

import {
  FixedDir,
  SortOrder,
  oppositeOrderMap,
  placeholderSign,
} from "./constants";
import { addUnit, calcColumnStyle, enforceUnit, isObject, sum } from "./utils";

import type { TableGridHandle } from "./TableGrid";
import type {
  Column,
  Data,
  TableV2Row,
  KeyType,
  RowsRenderedParams,
  ScrollParams,
  SortBy,
  TableV2Props,
} from "./types";
import type { Alignment as ScrollStrategy } from "../virtual-list";

export type { ScrollStrategy };

type Heights = Record<KeyType, number>;

/** 对应官方 ScrollPos，主表与左右固定表共享的滚动偏移。 */
export interface ScrollPos {
  scrollLeft: number;
  scrollTop: number;
}

interface HeightRecords {
  left: Heights;
  main: Heights;
  right: Heights;
}

const DEFAULT_HEADER_HEIGHT = 50;
const DEFAULT_ROW_HEIGHT = 50;
const DEFAULT_SCROLLBAR_SIZE = 6;

/**
 * Table V2 的 React 版状态中枢，逐项对应官方的
 * useColumns / useData / useRow / useScrollbar / useStyles。
 */
export function useTable<T>(
  props: TableV2Props<T>,
  rootRef: RefObject<HTMLElement | null>,
) {
  const rowKey = props.rowKey ?? "id";
  const rowHeight = props.rowHeight ?? DEFAULT_ROW_HEIGHT;
  const headerHeightProp = props.headerHeight ?? DEFAULT_HEADER_HEIGHT;
  const footerHeightValue = props.footerHeight ?? 0;
  const vScrollbarSize = props.vScrollbarSize ?? DEFAULT_SCROLLBAR_SIZE;
  const hScrollbarSize = props.hScrollbarSize ?? DEFAULT_SCROLLBAR_SIZE;
  const fixed = Boolean(props.fixed);
  const sortBy = (props.sortBy ?? {}) as SortBy;

  // 回调单独取出，避免 useCallback 依赖整个 props 对象而反复失效
  const {
    sortState: sortStateProp,
    onColumnSort,
    onExpandedRowsChange,
    onRowExpand,
    onRowsRendered: onRowsRenderedProp,
    onScroll: onScrollProp,
  } = props;

  /* ------------------------------------------------------------------ *
   * useColumns
   * ------------------------------------------------------------------ */

  const columns = useMemo<Column<T>[]>(
    () =>
      (props.columns ?? []).map((column, index) => ({
        ...column,
        key: column.key ?? column.dataKey ?? index,
      })),
    [props.columns],
  );

  const visibleColumns = useMemo(
    () => columns.filter((column) => !column.hidden),
    [columns],
  );

  const fixedColumnsOnLeft = useMemo(
    () =>
      visibleColumns.filter(
        (column) => column.fixed === FixedDir.LEFT || column.fixed === true,
      ),
    [visibleColumns],
  );

  const fixedColumnsOnRight = useMemo(
    () => visibleColumns.filter((column) => column.fixed === FixedDir.RIGHT),
    [visibleColumns],
  );

  const normalColumns = useMemo(
    () => visibleColumns.filter((column) => !column.fixed),
    [visibleColumns],
  );

  /** 主表包含固定列的占位单元格，保证横向滚动时列宽对齐。 */
  const mainColumns = useMemo<Column<T>[]>(() => {
    const ret: Column<T>[] = [];
    fixedColumnsOnLeft.forEach((column) => {
      ret.push({ ...column, placeholderSign });
    });
    normalColumns.forEach((column) => ret.push(column));
    fixedColumnsOnRight.forEach((column) => {
      ret.push({ ...column, placeholderSign });
    });
    return ret;
  }, [fixedColumnsOnLeft, normalColumns, fixedColumnsOnRight]);

  const hasFixedColumns =
    fixedColumnsOnLeft.length > 0 || fixedColumnsOnRight.length > 0;

  const columnsStyles = useMemo<Record<KeyType, CSSProperties>>(() => {
    return columns.reduce<Record<KeyType, CSSProperties>>((styles, column) => {
      styles[column.key as KeyType] = calcColumnStyle(column, fixed);
      return styles;
    }, {});
  }, [columns, fixed]);

  const columnsTotalWidth = useMemo(
    () => visibleColumns.reduce((width, column) => width + column.width, 0),
    [visibleColumns],
  );

  const getColumn = useCallback(
    (key: KeyType) => columns.find((column) => column.key === key),
    [columns],
  );

  const onColumnSorted = useCallback(
    (column: Column<T>) => {
      const key = column.key as KeyType;
      let order: SortOrder;

      if (isObject(sortStateProp)) {
        order = oppositeOrderMap[
          (sortStateProp as Record<KeyType, SortOrder>)[key]
        ] as SortOrder;
      } else {
        order = oppositeOrderMap[
          (sortBy.order ?? SortOrder.ASC) as SortOrder
        ] as SortOrder;
      }

      onColumnSort?.({ column, key, order });
    },
    [sortStateProp, onColumnSort, sortBy.order],
  );

  /* ------------------------------------------------------------------ *
   * Expanded keys（受控 / 非受控）
   * ------------------------------------------------------------------ */

  const isExpandedControlled = props.expandedRowKeys !== undefined;
  const [innerExpandedRowKeys, setInnerExpandedRowKeys] = useState<KeyType[]>(
    () =>
      props.defaultExpandedRowKeys
        ? [...props.defaultExpandedRowKeys]
        : [],
  );

  const expandedRowKeys = isExpandedControlled
    ? props.expandedRowKeys!
    : innerExpandedRowKeys;

  /* ------------------------------------------------------------------ *
   * useData：按展开状态拍平树数据并记录层级
   * ------------------------------------------------------------------ */

  const { data, depthMap } = useMemo(() => {
    const source: TableV2Row[] = props.data ?? [];
    const depths: Record<KeyType, number> = {};
    const keyOf = (item: TableV2Row) =>
      (item as Record<KeyType, unknown>)[rowKey] as KeyType;

    if (!props.expandColumnKey) {
      return { data: source, depthMap: depths };
    }

    const keysSet = new Set(expandedRowKeys);
    if (keysSet.size === 0) {
      source.forEach((item) => {
        depths[keyOf(item)] = 0;
      });
      return { data: source, depthMap: depths };
    }

    const array: TableV2Row[] = [];
    let copy = source.slice();
    copy.forEach((item) => {
      depths[keyOf(item)] = 0;
    });

    while (copy.length > 0) {
      const item = copy.shift()!;
      array.push(item);

      const children = (item as Data).children;
      if (
        keysSet.has(keyOf(item)) &&
        Array.isArray(children) &&
        children.length > 0
      ) {
        copy = [...children, ...copy];
        children.forEach((child: Data) => {
          depths[keyOf(child)] = (depths[keyOf(item)] ?? 0) + 1;
        });
      }
    }

    return { data: array, depthMap: depths };
  }, [props.data, props.expandColumnKey, rowKey, expandedRowKeys]);

  /* ------------------------------------------------------------------ *
   * useRow：动态行高、展开、hover、渲染回调
   * ------------------------------------------------------------------ */

  const mainTableRef = useRef<TableGridHandle>(null);
  const leftTableRef = useRef<TableGridHandle>(null);
  const rightTableRef = useRef<TableGridHandle>(null);

  const isDynamic = typeof props.estimatedRowHeight === "number";
  const [isResetting, setIsResetting] = useState(false);
  const [isScrolling] = useState(false);
  const [rowHeights, setRowHeights] = useState<Heights>({});
  const rowHeightsRef = useRef(rowHeights);
  const pendingRowHeightsRef = useRef<Heights>({});
  const resetIndexRef = useRef<number | null>(null);
  const heightRecordsRef = useRef<HeightRecords>({
    left: {},
    main: {},
    right: {},
  });
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRenderedRowIndexRef = useRef(-1);

  useEffect(() => {
    rowHeightsRef.current = rowHeights;
  }, [rowHeights]);

  useEffect(
    () => () => {
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
    },
    [],
  );

  const flushRowHeights = useCallback(() => {
    if (flushTimerRef.current) clearTimeout(flushTimerRef.current);

    flushTimerRef.current = setTimeout(() => {
      const pending = pendingRowHeightsRef.current;
      const index = resetIndexRef.current ?? 0;

      pendingRowHeightsRef.current = {};
      resetIndexRef.current = null;

      setIsResetting(true);
      setRowHeights((previous) => ({ ...previous, ...pending }));

      // 缓存里保存的旧行高必须先失效，下一次渲染才会用新值重新计算
      [mainTableRef, leftTableRef, rightTableRef].forEach((tableRef) => {
        tableRef.current?.resetAfterRowIndex(index, false);
      });

      setIsResetting(false);
    }, 0);
  }, []);

  const onRowHeightChange = useCallback(
    (
      { rowKey: changedRowKey, height, rowIndex }: {
        rowKey: KeyType;
        height: number;
        rowIndex: number;
      },
      fixedDirection: boolean | FixedDir | undefined,
    ) => {
      const records = heightRecordsRef.current;
      if (!fixedDirection) {
        records.main[changedRowKey] = height;
      } else if (fixedDirection === FixedDir.RIGHT) {
        records.right[changedRowKey] = height;
      } else {
        records.left[changedRowKey] = height;
      }

      const maximumHeight = Math.max(
        records.left[changedRowKey] || 0,
        records.right[changedRowKey] || 0,
        records.main[changedRowKey] || 0,
      );

      if (rowHeightsRef.current[changedRowKey] !== maximumHeight) {
        const resetIndex = resetIndexRef.current;
        resetIndexRef.current =
          resetIndex === null
            ? rowIndex
            : Math.min(resetIndex, rowIndex);

        pendingRowHeightsRef.current[changedRowKey] = maximumHeight;
        flushRowHeights();
      }
    },
    [flushRowHeights],
  );

  const onRowHovered = useCallback(
    ({ hovered, rowKey: hoveredRowKey }: { hovered: boolean; rowKey: KeyType }) => {
      if (isScrolling) return;

      const tableRoot = rootRef.current;
      if (!tableRoot) return;

      const escaped = String(hoveredRowKey).replace(/["\\]/g, "\\$&");
      tableRoot
        .querySelectorAll(`[rowkey="${escaped}"]`)
        .forEach((row) => {
          row.classList.toggle("is-hovered", hovered);
        });
    },
    [isScrolling, rootRef],
  );

  const onRowExpanded = useCallback(
    ({
      expanded,
      rowData,
      rowIndex,
      rowKey: expandedRowKey,
    }: {
      expanded: boolean;
      rowKey: KeyType;
      rowData: TableV2Row;
      rowIndex: number;
    }) => {
      const next = [...expandedRowKeys];
      const currentKeyIndex = next.indexOf(expandedRowKey);

      if (expanded) {
        if (currentKeyIndex === -1) next.push(expandedRowKey);
      } else if (currentKeyIndex > -1) {
        next.splice(currentKeyIndex, 1);
      }

      if (!isExpandedControlled) {
        setInnerExpandedRowKeys(next);
      }

      onExpandedRowsChange?.(next);
      onRowExpand?.({
        expanded,
        rowData,
        rowIndex,
        rowKey: expandedRowKey,
      });

      // 展开会重建行节点，下一帧把 hover 状态补回去
      setTimeout(() => onRowHovered({ hovered: true, rowKey: expandedRowKey }), 0);
    },
    [
      expandedRowKeys,
      isExpandedControlled,
      onRowHovered,
      onExpandedRowsChange,
      onRowExpand,
    ],
  );

  const onRowsRendered = useCallback(
    (params: RowsRenderedParams) => {
      onRowsRenderedProp?.(params);
      if (params.rowCacheEnd > lastRenderedRowIndexRef.current) {
        lastRenderedRowIndexRef.current = params.rowCacheEnd;
      }
    },
    [onRowsRenderedProp],
  );

  /* ------------------------------------------------------------------ *
   * useScrollbar
   * ------------------------------------------------------------------ */

  const scrollPosRef = useRef<ScrollPos>({ scrollLeft: 0, scrollTop: 0 });

  const doScroll = useCallback((params: ScrollPos) => {
    mainTableRef.current?.scrollTo(params);
    leftTableRef.current?.scrollToTop(params.scrollTop);
    rightTableRef.current?.scrollToTop(params.scrollTop);
  }, []);

  const scrollTo = useCallback(
    (params: { scrollLeft?: number; scrollTop?: number }) => {
      const current = scrollPosRef.current;
      scrollPosRef.current = {
        scrollLeft: params.scrollLeft ?? current.scrollLeft,
        scrollTop: params.scrollTop ?? current.scrollTop,
      };
      doScroll(scrollPosRef.current);
    },
    [doScroll],
  );

  const scrollToTop = useCallback(
    (scrollTop: number) => {
      scrollPosRef.current = { ...scrollPosRef.current, scrollTop };
      doScroll(scrollPosRef.current);
    },
    [doScroll],
  );

  const scrollToLeft = useCallback(
    (scrollLeft: number) => {
      scrollPosRef.current = { ...scrollPosRef.current, scrollLeft };
      mainTableRef.current?.scrollTo(scrollPosRef.current);
    },
    [],
  );

  const scrollToRow = useCallback(
    (row: number, strategy: ScrollStrategy = "auto") => {
      mainTableRef.current?.scrollToRow(row, strategy);
    },
    [],
  );

  const endReachedRef = useRef<{
    rowsHeight: number;
    windowHeight: number;
    mainTableHeight: number;
    headerHeight: number;
    onEndReached?: (remainDistance: number) => void;
  }>({
    rowsHeight: 0,
    windowHeight: 0,
    mainTableHeight: 0,
    headerHeight: 0,
  });
  const isEndReachedRef = useRef(false);

  const onMaybeEndReached = useCallback(() => {
    const state = endReachedRef.current;
    if (!state.onEndReached) return;

    const { scrollTop } = scrollPosRef.current;
    const remainDistance =
      state.rowsHeight - (scrollTop + state.windowHeight) + hScrollbarSize;

    if (
      !isEndReachedRef.current &&
      lastRenderedRowIndexRef.current >= 0 &&
      state.rowsHeight <=
        scrollTop + state.mainTableHeight - state.headerHeight
    ) {
      isEndReachedRef.current = true;
      state.onEndReached(remainDistance);
    } else {
      isEndReachedRef.current = false;
    }
  }, [hScrollbarSize]);

  const onScroll = useCallback(
    (params: ScrollParams) => {
      const previousTop = scrollPosRef.current.scrollTop;

      scrollPosRef.current = {
        scrollLeft: params.scrollLeft,
        scrollTop: params.scrollTop,
      };

      doScroll(scrollPosRef.current);
      onScrollProp?.(params);

      if (params.scrollTop > previousTop) onMaybeEndReached();
    },
    [doScroll, onMaybeEndReached, onScrollProp],
  );

  const onVerticalScroll = useCallback(
    ({ scrollTop }: ScrollPos) => {
      if (scrollTop !== scrollPosRef.current.scrollTop) {
        scrollToTop(scrollTop);
      }
    },
    [scrollToTop],
  );

  /* ------------------------------------------------------------------ *
   * useStyles
   * ------------------------------------------------------------------ */

  const rowsHeight = useMemo(() => {
    if (isDynamic) {
      return Object.values(rowHeights).reduce(
        (total, height) => total + height,
        0,
      );
    }
    return data.length * rowHeight;
  }, [isDynamic, rowHeights, data.length, rowHeight]);

  const headerHeight = useMemo(
    () => sum(headerHeightProp),
    [headerHeightProp],
  );

  const fixedRowsHeight = (props.fixedData?.length || 0) * rowHeight;

  const styles = useMemo(() => {
    const bodyWidth = fixed
      ? Math.max(Math.round(columnsTotalWidth), props.width - vScrollbarSize)
      : props.width - vScrollbarSize;

    let mainTableHeight = props.height - footerHeightValue;

    if ((props.maxHeight ?? 0) > 0) {
      const total =
        headerHeight + fixedRowsHeight + rowsHeight + hScrollbarSize;
      mainTableHeight = Math.min(
        total,
        (props.maxHeight as number) - footerHeightValue,
      );
    }

    const fixedTableHeight =
      (props.maxHeight ?? 0) > 0
        ? mainTableHeight
        : Math.min(
            mainTableHeight,
            rowsHeight + headerHeight + fixedRowsHeight,
          );

    const windowHeight =
      mainTableHeight - headerHeight - fixedRowsHeight;

    const rootStyle = enforceUnit({
      ...(props.style ?? {}),
      height: props.height,
      width: props.width,
    });

    return {
      bodyWidth,
      mainTableHeight,
      fixedTableHeight,
      windowHeight,
      rootStyle,
      footerStyle: enforceUnit({ height: footerHeightValue }),
      emptyStyle: {
        top: addUnit(headerHeight),
        bottom: addUnit(footerHeightValue),
        width: addUnit(props.width),
      } as CSSProperties,
      leftTableWidth: sum(fixedColumnsOnLeft.map((column) => column.width)),
      rightTableWidth: sum(fixedColumnsOnRight.map((column) => column.width)),
    };
  }, [
    fixed,
    columnsTotalWidth,
    props.width,
    props.height,
    props.maxHeight,
    props.style,
    vScrollbarSize,
    hScrollbarSize,
    footerHeightValue,
    headerHeight,
    fixedRowsHeight,
    rowsHeight,
    fixedColumnsOnLeft,
    fixedColumnsOnRight,
  ]);

  useEffect(() => {
    endReachedRef.current = {
      rowsHeight,
      windowHeight: styles.windowHeight,
      mainTableHeight: styles.mainTableHeight,
      headerHeight,
      onEndReached: props.onEndReached,
    };
  }, [
    rowsHeight,
    styles.windowHeight,
    styles.mainTableHeight,
    headerHeight,
    props.onEndReached,
  ]);

  useEffect(() => {
    isEndReachedRef.current = false;
  }, [rowsHeight]);

  const getRowHeight = useCallback(
    (rowIndex: number) => {
      if (!props.estimatedRowHeight) return rowHeight;

      const item = data[rowIndex];
      if (!item) return props.estimatedRowHeight;

      const currentKey = (item as Record<KeyType, unknown>)[rowKey] as KeyType;
      return rowHeights[currentKey] || props.estimatedRowHeight;
    },
    [props.estimatedRowHeight, rowHeight, data, rowHeights, rowKey],
  );

  const showEmpty =
    data.length === 0 &&
    (Array.isArray(props.fixedData) ? props.fixedData.length === 0 : true);

  return {
    // columns
    columns,
    visibleColumns,
    columnsStyles,
    columnsTotalWidth,
    fixedColumnsOnLeft,
    fixedColumnsOnRight,
    normalColumns,
    mainColumns,
    hasFixedColumns,
    getColumn,
    getColumnStyle: (key: KeyType) => columnsStyles[key],
    onColumnSorted,

    // data
    data,
    depthMap,
    expandedRowKeys,
    showEmpty,

    // states
    isDynamic,
    isResetting,
    isScrolling,
    rowHeights,

    // refs
    mainTableRef,
    leftTableRef,
    rightTableRef,

    // metadata
    bodyWidth: styles.bodyWidth,
    mainTableHeight: styles.mainTableHeight,
    fixedTableHeight: styles.fixedTableHeight,
    windowHeight: styles.windowHeight,
    headerHeight,
    footerHeight: footerHeightValue,
    rootStyle: styles.rootStyle,
    footerStyle: styles.footerStyle,
    emptyStyle: styles.emptyStyle,
    leftTableWidth: styles.leftTableWidth,
    rightTableWidth: styles.rightTableWidth,

    // methods
    getRowHeight,

    // handlers
    onRowHovered,
    onRowExpanded,
    onRowsRendered,
    onRowHeightChange,
    onScroll,
    onVerticalScroll,
    scrollTo,
    scrollToLeft,
    scrollToTop,
    scrollToRow,
  };
}

export type UseTableReturn = ReturnType<typeof useTable>;
