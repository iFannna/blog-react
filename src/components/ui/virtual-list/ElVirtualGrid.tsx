"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
  type UIEvent,
} from "react";

import { useEventListener } from "../hooks";
import { getScrollBarWidth } from "../utils";
import { VirtualScrollbar } from "./VirtualScrollbar";
import { resetGridCacheAfterIndices } from "./dynamic-size-grid";
import { useGridWheel } from "./use-grid-wheel";
import {
  readStyleCache,
  useItemStyleCache,
  writeStyleCache,
} from "./use-item-style-cache";
import {
  AUTO_ALIGNMENT,
  BACKWARD,
  FORWARD,
  LTR,
  RTL,
  RTL_OFFSET_NAG,
  RTL_OFFSET_POS_ASC,
} from "./defaults";
import {
  getRTLOffsetType,
  getScrollDir,
  isNumeric,
  isRTL,
} from "./utils";

import type { VirtualScrollbarHandle } from "./VirtualScrollbar";
import type {
  Alignment,
  GridCalculator,
  GridItemKeyGetter,
  GridStates,
  VirtualGridHandle,
  VirtualizedGridProps,
} from "./types";

interface ElVirtualGridProps<T> extends VirtualizedGridProps<T> {
  calculator: GridCalculator<T>;
  ref?: Ref<VirtualGridHandle>;
}

const defaultItemKey: GridItemKeyGetter<unknown> = ({
  columnIndex,
  rowIndex,
}) => `${rowIndex}:${columnIndex}`;

/** 固定/动态尺寸网格的公共实现，对应官方 build-grid。 */
export function ElVirtualGrid<T>(props: ElVirtualGridProps<T>) {
  const {
    calculator,
    data = [],
    height,
    width,
    className,
    style,
    containerElement = "div",
    innerElement = "div",
    innerProps = {},
    direction = LTR,
    useIsScrolling = false,
    perfMode = true,
    scrollbarAlwaysOn = false,
    totalColumn,
    totalRow,
    columnWidth,
    rowHeight,
    itemKey = defaultItemKey as GridItemKeyGetter<T>,
    hScrollbarSize = 6,
    vScrollbarSize = 6,
    scrollbarStartGap = 0,
    scrollbarEndGap = 2,
    columnCache = 2,
    rowCache = 2,
    initScrollLeft = 0,
    initScrollTop = 0,
    role,
    children,
    onItemRendered,
    onScroll,
    ref,
  } = props;

  calculator.validateProps?.(props);

  // 缓存对象只创建一次，之后由计算器原地更新（与官方 reactive cache 一致）
  const [cache] = useState(() => calculator.initCache(props));
  const getItemStyleCache = useItemStyleCache(perfMode);

  const [states, setStates] = useState<GridStates>({
    isScrolling: false,
    scrollLeft: isNumeric(initScrollLeft) ? initScrollLeft : 0,
    scrollTop: isNumeric(initScrollTop) ? initScrollTop : 0,
    updateRequested: false,
    xAxisScrollDir: FORWARD,
    yAxisScrollDir: FORWARD,
  });

  const statesRef = useRef(states);
  useEffect(() => {
    statesRef.current = states;
  });

  const windowRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLElement | null>(null);
  const hScrollbarRef = useRef<VirtualScrollbarHandle | null>(null);
  const vScrollbarRef = useRef<VirtualScrollbarHandle | null>(null);
  const [windowEl, setWindowEl] = useState<HTMLElement | null>(null);
  const setWindowNode = useCallback((node: HTMLElement | null) => {
    windowRef.current = node;
    setWindowEl(node);
  }, []);

  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, forceRender] = useReducer((x: number) => x + 1, 0);

  const parsedHeight = Number.parseInt(`${height}`, 10) || 0;
  const parsedWidth = Number.parseInt(`${width}`, 10) || 0;

  const estimatedTotalHeight = calculator.getEstimatedTotalHeight(props, cache);
  const estimatedTotalWidth = calculator.getEstimatedTotalWidth(props, cache);

  const getColumnsToRender = (
    scrollLeft: number,
    isScrolling: boolean,
    scrollDir: GridStates["xAxisScrollDir"],
  ): [number, number, number, number] => {
    if (totalColumn === 0 || totalRow === 0) return [0, 0, 0, 0];

    const startIndex = calculator.getColumnStartIndexForOffset(
      props,
      scrollLeft,
      cache,
    );
    const stopIndex = calculator.getColumnStopIndexForStartIndex(
      props,
      startIndex,
      scrollLeft,
      cache,
    );

    const cacheBackward =
      !isScrolling || scrollDir === BACKWARD
        ? Math.max(1, columnCache)
        : 1;
    const cacheForward =
      !isScrolling || scrollDir === FORWARD ? Math.max(1, columnCache) : 1;

    return [
      Math.max(0, startIndex - cacheBackward),
      Math.max(0, Math.min(totalColumn - 1, stopIndex + cacheForward)),
      startIndex,
      stopIndex,
    ];
  };

  const getRowsToRender = (
    scrollTop: number,
    isScrolling: boolean,
    scrollDir: GridStates["yAxisScrollDir"],
  ): [number, number, number, number] => {
    if (totalColumn === 0 || totalRow === 0) return [0, 0, 0, 0];

    const startIndex = calculator.getRowStartIndexForOffset(
      props,
      scrollTop,
      cache,
    );
    const stopIndex = calculator.getRowStopIndexForStartIndex(
      props,
      startIndex,
      scrollTop,
      cache,
    );

    const cacheBackward =
      !isScrolling || scrollDir === BACKWARD ? Math.max(1, rowCache) : 1;
    const cacheForward =
      !isScrolling || scrollDir === FORWARD ? Math.max(1, rowCache) : 1;

    return [
      Math.max(0, startIndex - cacheBackward),
      Math.max(0, Math.min(totalRow - 1, stopIndex + cacheForward)),
      startIndex,
      stopIndex,
    ];
  };

  const emitEvents = (state: GridStates = statesRef.current) => {
    if (totalColumn > 0 && totalRow > 0) {
      const [
        columnCacheStart,
        columnCacheEnd,
        columnVisibleStart,
        columnVisibleEnd,
      ] = getColumnsToRender(
        state.scrollLeft,
        state.isScrolling,
        state.xAxisScrollDir,
      );
      const [rowCacheStart, rowCacheEnd, rowVisibleStart, rowVisibleEnd] =
        getRowsToRender(state.scrollTop, state.isScrolling, state.yAxisScrollDir);

      onItemRendered?.({
        columnCacheStart,
        columnCacheEnd,
        columnVisibleStart,
        columnVisibleEnd,
        rowCacheStart,
        rowCacheEnd,
        rowVisibleStart,
        rowVisibleEnd,
      });
    }

    onScroll?.({
      xAxisScrollDir: state.xAxisScrollDir,
      scrollLeft: state.scrollLeft,
      yAxisScrollDir: state.yAxisScrollDir,
      scrollTop: state.scrollTop,
      updateRequested: state.updateRequested,
    });
  };

  const resetIsScrolling = useCallback(() => {
    const current = statesRef.current;
    if (current.isScrolling) {
      const next = { ...current, isScrolling: false };
      statesRef.current = next;
      setStates(next);
    }
    getItemStyleCache(-1, null, null);
  }, [getItemStyleCache]);

  const scheduleReset = useCallback(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(resetIsScrolling, 0);
  }, [resetIsScrolling]);

  const scrollTo = (options: { scrollLeft?: number; scrollTop?: number }) => {
    const current = statesRef.current;
    const scrollLeft = Math.max(options.scrollLeft ?? current.scrollLeft, 0);
    const scrollTop = Math.max(options.scrollTop ?? current.scrollTop, 0);

    if (
      scrollTop === current.scrollTop &&
      scrollLeft === current.scrollLeft
    ) {
      return;
    }

    const next: GridStates = {
      ...current,
      xAxisScrollDir: getScrollDir(current.scrollLeft, scrollLeft),
      yAxisScrollDir: getScrollDir(current.scrollTop, scrollTop),
      scrollLeft,
      scrollTop,
      updateRequested: true,
    };

    statesRef.current = next;
    setStates(next);
    scheduleReset();
    emitEvents(next);
  };

  const handleScroll = (event: UIEvent<HTMLElement>) => {
    const el = event.currentTarget;
    const current = statesRef.current;

    if (
      current.scrollTop === el.scrollTop &&
      current.scrollLeft === el.scrollLeft
    ) {
      return;
    }

    let scrollLeft = el.scrollLeft;
    if (isRTL(direction)) {
      switch (getRTLOffsetType()) {
        case RTL_OFFSET_NAG:
          scrollLeft = -el.scrollLeft;
          break;
        case RTL_OFFSET_POS_ASC:
          scrollLeft = el.scrollLeft;
          break;
        default:
          scrollLeft = el.scrollWidth - el.clientWidth - el.scrollLeft;
          break;
      }
    }

    const scrollTop = Math.max(
      0,
      Math.min(el.scrollTop, el.scrollHeight - el.clientHeight),
    );

    const next: GridStates = {
      ...current,
      isScrolling: true,
      scrollLeft,
      scrollTop,
      updateRequested: true,
      xAxisScrollDir: getScrollDir(current.scrollLeft, scrollLeft),
      yAxisScrollDir: getScrollDir(current.scrollTop, el.scrollTop),
    };

    statesRef.current = next;
    setStates(next);
    scheduleReset();
    emitEvents(next);
  };

  const handleVerticalScroll = (distance: number, totalSteps: number) => {
    if (totalSteps <= 0) return;
    const offset =
      ((estimatedTotalHeight - parsedHeight) / totalSteps) * distance;
    scrollTo({
      scrollTop: Math.min(estimatedTotalHeight - parsedHeight, offset),
    });
  };

  const handleHorizontalScroll = (distance: number, totalSteps: number) => {
    if (totalSteps <= 0) return;
    const offset =
      ((estimatedTotalWidth - parsedWidth) / totalSteps) * distance;
    scrollTo({
      scrollLeft: Math.min(estimatedTotalWidth - parsedWidth, offset),
    });
  };

  const onWheel = useGridWheel(
    {
      atXStartEdge: states.scrollLeft <= 0,
      atXEndEdge: states.scrollLeft >= estimatedTotalWidth - parsedWidth,
      atYStartEdge: states.scrollTop <= 0,
      atYEndEdge: states.scrollTop >= estimatedTotalHeight - parsedHeight,
    },
    (x, y) => {
      hScrollbarRef.current?.onMouseUp();
      vScrollbarRef.current?.onMouseUp();
      scrollTo({
        scrollLeft: Math.min(
          statesRef.current.scrollLeft + x,
          estimatedTotalWidth - parsedWidth,
        ),
        scrollTop: Math.min(
          statesRef.current.scrollTop + y,
          estimatedTotalHeight - parsedHeight,
        ),
      });
    },
  );

  useEventListener<WheelEvent>(windowEl, "wheel", onWheel, {
    passive: false,
  });

  const scrollToItem = (
    rowIndex = 0,
    columnIndex = 0,
    alignment: Alignment = AUTO_ALIGNMENT,
  ) => {
    const current = statesRef.current;
    const clampedColumn = Math.max(0, Math.min(columnIndex, totalColumn - 1));
    const clampedRow = Math.max(0, Math.min(rowIndex, totalRow - 1));
    const scrollBarWidth = getScrollBarWidth();

    scrollTo({
      scrollLeft: calculator.getColumnOffset(
        props,
        clampedColumn,
        alignment,
        current.scrollLeft,
        cache,
        estimatedTotalWidth > parsedWidth ? scrollBarWidth : 0,
      ),
      scrollTop: calculator.getRowOffset(
        props,
        clampedRow,
        alignment,
        current.scrollTop,
        cache,
        estimatedTotalHeight > parsedHeight ? scrollBarWidth : 0,
      ),
    });
  };

  const getItemStyle = (rowIndex: number, columnIndex: number) => {
    const itemStyleCache = getItemStyleCache(
      calculator.clearCache && columnWidth,
      calculator.clearCache && rowHeight,
      calculator.clearCache && direction,
    );
    const key = `${rowIndex},${columnIndex}`;
    const cached = readStyleCache(itemStyleCache, key);
    if (cached) return cached;

    const [, left] = calculator.getColumnPosition(
      props,
      columnIndex,
      cache,
    );
    const rtl = isRTL(direction);
    const [heightValue, top] = calculator.getRowPosition(
      props,
      rowIndex,
      cache,
    );
    const [widthValue] = calculator.getColumnPosition(
      props,
      columnIndex,
      cache,
    );

    const next: CSSProperties = {
      position: "absolute",
      left: rtl ? undefined : `${left}px`,
      right: rtl ? `${left}px` : undefined,
      top: `${top}px`,
      height: `${heightValue}px`,
      width: `${widthValue}px`,
    };

    writeStyleCache(itemStyleCache, key, next);
    return next;
  };

  const resetAfter = (
    indices: { columnIndex?: number; rowIndex?: number },
    forceUpdate = true,
  ) => {
    resetGridCacheAfterIndices(cache, indices);
    getItemStyleCache(-1, null, null);
    if (forceUpdate) forceRender();
  };

  const resetAfterColumnIndex = (columnIndex: number, forceUpdate = true) =>
    resetAfter({ columnIndex }, forceUpdate);

  const resetAfterRowIndex = (rowIndex: number, forceUpdate = true) =>
    resetAfter({ rowIndex }, forceUpdate);

  // 句柄中的方法依赖每次渲染的最新闭包，因此不传依赖数组
  useImperativeHandle(ref, () => ({
    windowRef,
    innerRef,
    getItemStyleCache,
    scrollTo,
    scrollToItem,
    resetAfterColumnIndex,
    resetAfterRowIndex,
    resetAfter,
    states,
  }));

  // --- 触摸板拖动，对应官方 use-grid-touch ---

  const touchRef = useRef({
    states,
    estimatedTotalWidth,
    estimatedTotalHeight,
    parsedWidth,
    parsedHeight,
    scrollTo,
  });
  useEffect(() => {
    touchRef.current = {
      states,
      estimatedTotalWidth,
      estimatedTotalHeight,
      parsedWidth,
      parsedHeight,
      scrollTo,
    };
  });

  const touchStartRef = useRef({ x: 0, y: 0 });
  const touchDeltaRef = useRef({ x: 0, y: 0 });
  const touchFrameRef = useRef<number | null>(null);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (touchFrameRef.current !== null) {
      cancelAnimationFrame(touchFrameRef.current);
      touchFrameRef.current = null;
    }
    touchStartRef.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
    touchDeltaRef.current = { x: 0, y: 0 };
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    event.preventDefault();
    if (touchFrameRef.current !== null) {
      cancelAnimationFrame(touchFrameRef.current);
      touchFrameRef.current = null;
    }

    touchDeltaRef.current.x +=
      touchStartRef.current.x - event.touches[0].clientX;
    touchDeltaRef.current.y +=
      touchStartRef.current.y - event.touches[0].clientY;
    touchStartRef.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };

    touchFrameRef.current = requestAnimationFrame(() => {
      const current = touchRef.current;
      const maxScrollLeft =
        current.estimatedTotalWidth - current.parsedWidth;
      const maxScrollTop =
        current.estimatedTotalHeight - current.parsedHeight;

      current.scrollTo({
        scrollLeft: Math.min(
          current.states.scrollLeft + touchDeltaRef.current.x,
          maxScrollLeft,
        ),
        scrollTop: Math.min(
          current.states.scrollTop + touchDeltaRef.current.y,
          maxScrollTop,
        ),
      });

      touchDeltaRef.current = { x: 0, y: 0 };
      touchFrameRef.current = null;
    });
  }, []);

  useEventListener<TouchEvent>(windowEl, "touchstart", handleTouchStart, {
    passive: true,
  });
  useEventListener<TouchEvent>(windowEl, "touchmove", handleTouchMove, {
    passive: false,
  });

  // --- 程序化滚动同步真实位置 ---

  useLayoutEffect(() => {
    const el = windowRef.current;
    if (!el || !states.updateRequested) return;

    if (direction === RTL) {
      switch (getRTLOffsetType()) {
        case RTL_OFFSET_NAG:
          el.scrollLeft = -states.scrollLeft;
          break;
        case RTL_OFFSET_POS_ASC:
          el.scrollLeft = states.scrollLeft;
          break;
        default:
          el.scrollLeft =
            el.scrollWidth - el.clientWidth - states.scrollLeft;
          break;
      }
    } else {
      el.scrollLeft = Math.max(0, states.scrollLeft);
    }

    el.scrollTop = Math.max(0, states.scrollTop);
  }, [states, direction]);

  useEffect(() => {
    const el = windowRef.current;
    if (el) {
      if (isNumeric(initScrollLeft)) el.scrollLeft = initScrollLeft;
      if (isNumeric(initScrollTop)) el.scrollTop = initScrollTop;
    }
    emitEvents();
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      if (touchFrameRef.current !== null) {
        cancelAnimationFrame(touchFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 渲染 ---

  const [columnStart, columnEnd] = getColumnsToRender(
    states.scrollLeft,
    states.isScrolling,
    states.xAxisScrollDir,
  );
  const [rowStart, rowEnd] = getRowsToRender(
    states.scrollTop,
    states.isScrolling,
    states.yAxisScrollDir,
  );

  const items: ReactNode[] = [];
  if (totalRow > 0 && totalColumn > 0) {
    for (let row = rowStart; row <= rowEnd; row++) {
      for (let column = columnStart; column <= columnEnd; column++) {
        const key = itemKey({ columnIndex: column, data, rowIndex: row });
        items.push(
          <Fragment key={key}>
            {children({
              columnIndex: column,
              rowIndex: row,
              data,
              key,
              isScrolling: useIsScrolling ? states.isScrolling : undefined,
              style: getItemStyle(row, column),
            })}
          </Fragment>,
        );
      }
    }
  }

  const Container = containerElement;
  const Inner = innerElement;

  const windowStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    WebkitOverflowScrolling: "touch",
    willChange: "transform",
    direction,
    height: isNumeric(height) ? `${height}px` : height,
    width: isNumeric(width) ? `${width}px` : width,
    ...style,
  };

  const innerStyle: CSSProperties = {
    height: `${estimatedTotalHeight}px`,
    pointerEvents: states.isScrolling ? "none" : undefined,
    width: `${estimatedTotalWidth}px`,
    margin: 0,
    boxSizing: "border-box",
  };

  const horizontalRatio =
    estimatedTotalWidth > 0 && parsedWidth > 0
      ? (parsedWidth * 100) / estimatedTotalWidth
      : 100;
  const verticalRatio =
    estimatedTotalHeight > 0 && parsedHeight > 0
      ? (parsedHeight * 100) / estimatedTotalHeight
      : 100;

  return (
    <div
      className={["el-vl__wrapper", scrollbarAlwaysOn && "always-on"]
        .filter(Boolean)
        .join(" ")}
      role={role}
    >
      <Container
        className={className}
        style={windowStyle}
        onScroll={handleScroll}
        ref={setWindowNode}
      >
        <Inner
          {...innerProps}
          style={{ ...innerProps.style, ...innerStyle }}
          ref={innerRef}
        >
          {items}
        </Inner>
      </Container>

      <VirtualScrollbar
        ref={hScrollbarRef}
        alwaysOn={scrollbarAlwaysOn}
        startGap={scrollbarStartGap}
        endGap={scrollbarEndGap}
        className="el-vl__horizontal"
        clientSize={parsedWidth}
        layout="horizontal"
        onScroll={handleHorizontalScroll}
        ratio={horizontalRatio}
        scrollFrom={
          estimatedTotalWidth > parsedWidth
            ? states.scrollLeft / (estimatedTotalWidth - parsedWidth)
            : 0
        }
        total={totalRow}
        scrollbarSize={hScrollbarSize}
      />

      <VirtualScrollbar
        ref={vScrollbarRef}
        alwaysOn={scrollbarAlwaysOn}
        startGap={scrollbarStartGap}
        endGap={scrollbarEndGap}
        className="el-vl__vertical"
        clientSize={parsedHeight}
        layout="vertical"
        onScroll={handleVerticalScroll}
        ratio={verticalRatio}
        scrollFrom={
          estimatedTotalHeight > parsedHeight
            ? states.scrollTop / (estimatedTotalHeight - parsedHeight)
            : 0
        }
        total={totalColumn}
        scrollbarSize={vScrollbarSize}
      />
    </div>
  );
}
