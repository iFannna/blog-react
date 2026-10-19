"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  ElDynamicSizeGrid,
  ElFixedSizeGrid,
  type Alignment as ScrollStrategy,
  type VirtualGridHandle,
} from "../virtual-list";
import { Header } from "./Header";
import { ns, sum } from "./utils";

import type { HeaderExpose } from "./Header";
import type {
  Column,
  KeyType,
  RowsRenderedParams,
  ScrollParams,
  TableGridRowSlotParams,
  TableV2HeaderRendererParams,
  TableV2Row,
} from "./types";

export interface TableGridProps<T = unknown> {
  className?: string;
  columns: Column<T>[];
  data: TableV2Row[];
  fixedData?: TableV2Row[];
  estimatedRowHeight?: number;
  width: number;
  height: number;
  headerWidth: number;
  headerHeight: number | number[];
  bodyWidth: number;
  rowHeight: number;
  cache?: number;
  useIsScrolling?: boolean;
  scrollbarAlwaysOn?: boolean;
  scrollbarStartGap?: number;
  scrollbarEndGap?: number;
  style?: CSSProperties;
  getRowHeight: (rowIndex: number) => number;
  rowKey: KeyType;
  renderRow: (params: TableGridRowSlotParams<T>) => ReactNode;
  renderHeader: (params: TableV2HeaderRendererParams<T>) => ReactNode;
  onRowsRendered?: (params: RowsRenderedParams) => void;
  onScroll?: (params: ScrollParams) => void;
}

export interface TableGridHandle {
  forceUpdate: () => void;
  totalHeight?: number;
  scrollTo: (
    leftOrOptions: number | { scrollLeft?: number; scrollTop?: number },
    top?: number,
  ) => void;
  scrollToTop: (scrollTop: number) => void;
  scrollToRow: (row: number, strategy?: ScrollStrategy) => void;
  resetAfterRowIndex: (index: number, forceUpdate?: boolean) => void;
}

/** 对应官方 table-grid.tsx：一个虚拟网格 + 表头，左右固定表复用同一实现。 */
export const TableGrid = forwardRef<TableGridHandle, TableGridProps>(
  function TableGrid(props, ref) {
    const headerRef = useRef<HeaderExpose>(null);
    const bodyRef = useRef<VirtualGridHandle>(null);
    const scrollLeftRef = useRef(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const headerHeight = sum(props.headerHeight);
    const fixedRowHeight = (props.fixedData?.length || 0) * props.rowHeight;
    const gridHeight = Math.max(0, props.height - headerHeight - fixedRowHeight);
    const hasHeader = headerHeight + fixedRowHeight > 0;
    const isDynamic = typeof props.estimatedRowHeight === "number";

    const scrollTo = (
      leftOrOptions: number | { scrollLeft?: number; scrollTop?: number },
      top?: number,
    ) => {
      if (typeof leftOrOptions === "object") {
        const nextLeft = leftOrOptions.scrollLeft ?? 0;
        headerRef.current?.scrollToLeft(nextLeft);
        scrollLeftRef.current = nextLeft;
        setScrollLeft(nextLeft);
        bodyRef.current?.scrollTo(leftOrOptions);
      } else {
        headerRef.current?.scrollToLeft(leftOrOptions);
        scrollLeftRef.current = leftOrOptions;
        setScrollLeft(leftOrOptions);
        bodyRef.current?.scrollTo({
          scrollLeft: leftOrOptions,
          scrollTop: top,
        });
      }
    };

    const scrollToTop = (scrollTop: number) => {
      bodyRef.current?.scrollTo({ scrollTop });
    };

    const scrollToRow = (row: number, strategy: ScrollStrategy = "auto") => {
      const body = bodyRef.current;
      if (!body) return;

      const previousScrollLeft = scrollLeftRef.current;
      body.scrollToItem(row, 0, strategy);

      if (previousScrollLeft) {
        scrollTo({ scrollLeft: previousScrollLeft });
      }
    };

    const resetAfterRowIndex = (index: number, forceUpdate = true) => {
      bodyRef.current?.resetAfterRowIndex(index, forceUpdate);
    };

    const forceUpdate = () => {
      bodyRef.current?.resetAfter({ rowIndex: 0 }, true);
    };

    useImperativeHandle(ref, () => ({
      forceUpdate,
      totalHeight: isDynamic
        ? undefined
        : props.data.length * props.rowHeight,
      scrollTo,
      scrollToTop,
      scrollToRow,
      resetAfterRowIndex,
    }));

    const handleScroll = (params: {
      scrollLeft: number;
      scrollTop: number;
      xAxisScrollDir?: ScrollParams["xAxisScrollDir"];
      yAxisScrollDir?: ScrollParams["yAxisScrollDir"];
      updateRequested?: boolean;
    }) => {
      scrollLeftRef.current = params.scrollLeft;
      setScrollLeft(params.scrollLeft);
      props.onScroll?.(params);
    };

    const itemKey = ({
      data,
      rowIndex,
    }: {
      columnIndex: number;
      data: TableV2Row[];
      rowIndex: number;
    }) =>
      (data[rowIndex] as Record<KeyType, unknown>)[props.rowKey] as
        | string
        | number;

    const headerContent = hasHeader ? (
      <Header
        ref={headerRef}
        className={ns.e("header-wrapper")}
        columns={props.columns}
        fixedHeaderData={props.fixedData}
        headerHeight={props.headerHeight}
        rowWidth={props.headerWidth}
        rowHeight={props.rowHeight}
        width={props.width}
        height={Math.min(headerHeight + fixedRowHeight, props.height)}
        scrollLeft={scrollLeft}
        renderHeader={props.renderHeader}
        renderRow={props.renderRow}
      />
    ) : null;

    const commonGridProps = {
      data: props.data,
      itemKey,
      useIsScrolling: props.useIsScrolling,
      totalColumn: 1,
      columnCache: 0,
      totalRow: props.data.length,
      rowCache: props.cache ?? 2,
      width: props.width,
      height: gridHeight,
      className: ns.e("body"),
      role: "rowgroup",
      scrollbarAlwaysOn: props.scrollbarAlwaysOn,
      scrollbarStartGap: props.scrollbarStartGap,
      scrollbarEndGap: props.scrollbarEndGap,
      perfMode: false,
      onItemRendered: (params: {
        rowCacheStart: number;
        rowCacheEnd: number;
        rowVisibleStart: number;
        rowVisibleEnd: number;
      }) => {
        props.onRowsRendered?.({
          rowCacheStart: params.rowCacheStart,
          rowCacheEnd: params.rowCacheEnd,
          rowVisibleStart: params.rowVisibleStart,
          rowVisibleEnd: params.rowVisibleEnd,
        });
      },
      onScroll: handleScroll,
      children: (params: {
        data: TableV2Row[];
        rowIndex: number;
        isScrolling?: boolean;
        style: CSSProperties;
      }) =>
        props.renderRow({
          columns: props.columns,
          rowData: params.data[params.rowIndex],
          rowIndex: params.rowIndex,
          isScrolling: params.isScrolling,
          style: params.style,
        }),
    };

    return (
      <div
        role="table"
        className={[ns.e("table"), props.className].filter(Boolean).join(" ")}
        style={props.style}
      >
        {isDynamic ? (
          <ElDynamicSizeGrid
            {...commonGridProps}
            ref={bodyRef}
            columnWidth={() => props.bodyWidth}
            rowHeight={props.getRowHeight}
            estimatedColumnWidth={props.bodyWidth}
            estimatedRowHeight={props.estimatedRowHeight}
          />
        ) : (
          <ElFixedSizeGrid
            {...commonGridProps}
            ref={bodyRef}
            columnWidth={props.bodyWidth}
            rowHeight={props.rowHeight}
          />
        )}

        {headerContent}
      </div>
    );
  },
);
