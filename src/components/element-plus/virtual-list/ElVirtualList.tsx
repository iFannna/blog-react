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
import { VirtualScrollbar } from "./VirtualScrollbar";
import { resetListCacheAfterIndex } from "./dynamic-size-list";
import {
  readStyleCache,
  useItemStyleCache,
  writeStyleCache,
} from "./use-item-style-cache";
import { useWheel } from "./use-wheel";
import {
  BACKWARD,
  FORWARD,
  LTR,
  RTL,
  RTL_OFFSET_NAG,
  RTL_OFFSET_POS_ASC,
  VERTICAL,
} from "./defaults";
import {
  getRTLOffsetType,
  getScrollDir,
  isHorizontal,
  isNumeric,
} from "./utils";

import type { VirtualScrollbarHandle } from "./VirtualScrollbar";
import type {
  Alignment,
  ListCache,
  ListCalculator,
  ListStates,
  VirtualizedListProps,
  VirtualListHandle,
} from "./types";

interface ElVirtualListProps<T> extends VirtualizedListProps<T> {
  calculator: ListCalculator<T>;
  ref?: Ref<VirtualListHandle>;
}

/** 固定/动态尺寸列表的公共实现，对应官方 build-list 的 setup + render。 */
export function ElVirtualList<T>(props: ElVirtualListProps<T>) {
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
    innerWidth,
    direction = LTR,
    useIsScrolling = false,
    perfMode = true,
    scrollbarAlwaysOn = false,
    total,
    itemSize,
    cache = 2,
    layout = VERTICAL,
    initScrollOffset = 0,
    children,
    onItemRendered,
    onScroll,
    onEndReached,
    ref,
  } = props;

  calculator.validateProps?.(props);

  // 缓存对象只创建一次，之后由计算器原地更新（与官方 reactive cache 一致）
  const [dynamicCache] = useState<ListCache | null>(() =>
    calculator.initCache(props),
  );
  const getItemStyleCache = useItemStyleCache(perfMode);

  const [states, setStates] = useState<ListStates>({
    isScrolling: false,
    scrollDir: FORWARD,
    scrollOffset: isNumeric(initScrollOffset) ? initScrollOffset : 0,
    updateRequested: false,
  });

  // 事件回调里需要读到最新状态，同时避免每次渲染重建原生监听
  const statesRef = useRef(states);
  useEffect(() => {
    statesRef.current = states;
  });

  const windowRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLElement | null>(null);
  const scrollbarRef = useRef<VirtualScrollbarHandle | null>(null);
  const [windowEl, setWindowEl] = useState<HTMLElement | null>(null);
  const setWindowNode = useCallback((node: HTMLElement | null) => {
    windowRef.current = node;
    setWindowEl(node);
  }, []);

  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, forceRender] = useReducer((x: number) => x + 1, 0);

  const horizontal = isHorizontal(layout);
  const clientSizeValue = Number(horizontal ? width : height) || 0;

  const estimatedTotalSize = calculator.getEstimatedTotalSize(
    props,
    dynamicCache,
  );
  const maxOffset = Math.max(0, estimatedTotalSize - clientSizeValue);
  const normalizeOffset = (offset: number) =>
    Math.max(0, Math.min(offset, maxOffset));

  const getRange = (
    scrollOffset: number,
    isScrolling: boolean,
    scrollDir: ListStates["scrollDir"],
  ): [number, number, number, number] => {
    if (total === 0) return [0, 0, 0, 0];

    const startIndex = calculator.getStartIndexForOffset(
      props,
      scrollOffset,
      dynamicCache,
    );
    const stopIndex = calculator.getStopIndexForStartIndex(
      props,
      startIndex,
      scrollOffset,
      dynamicCache,
    );

    const cacheBackward =
      !isScrolling || scrollDir === BACKWARD ? Math.max(1, cache) : 1;
    const cacheForward =
      !isScrolling || scrollDir === FORWARD ? Math.max(1, cache) : 1;

    return [
      Math.max(0, startIndex - cacheBackward),
      Math.max(0, Math.min(total - 1, stopIndex + cacheForward)),
      startIndex,
      stopIndex,
    ];
  };

  const getEdgeState = (offset: number) => ({
    start: offset <= 1,
    end: maxOffset - offset <= 1,
  });

  const initialOffset = normalizeOffset(states.scrollOffset);
  const edgeRef = useRef(getEdgeState(initialOffset));

  useEffect(() => {
    edgeRef.current = getEdgeState(
      normalizeOffset(statesRef.current.scrollOffset),
    );
    // 仅在可滚动范围变化时重置，等价于官方 watch(maxOffset)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxOffset]);

  const emitEvents = (state: ListStates = statesRef.current) => {
    if (total > 0) {
      const [cacheStart, cacheEnd, visibleStart, visibleEnd] = getRange(
        state.scrollOffset,
        state.isScrolling,
        state.scrollDir,
      );
      onItemRendered?.(cacheStart, cacheEnd, visibleStart, visibleEnd);
    }

    onScroll?.({
      scrollDir: state.scrollDir,
      scrollOffset: state.scrollOffset,
      updateRequested: state.updateRequested,
    });
  };

  const emitEndReached = (
    scrollDir: ListStates["scrollDir"],
    normalizedOffset: number,
  ) => {
    const next = getEdgeState(normalizedOffset);
    const horizontalEnd = direction === RTL ? "left" : "right";
    const horizontalStart = direction === RTL ? "right" : "left";

    if (scrollDir === FORWARD && next.end && !edgeRef.current.end) {
      onEndReached?.(horizontal ? horizontalEnd : "bottom");
    }
    if (scrollDir === BACKWARD && next.start && !edgeRef.current.start) {
      onEndReached?.(horizontal ? horizontalStart : "top");
    }

    edgeRef.current = next;
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

  const updateScrollOffset = (
    offset: number,
    {
      isScrolling,
      updateRequested,
    }: { isScrolling: boolean; updateRequested: boolean },
  ) => {
    const current = statesRef.current;
    const nextOffset = Math.max(offset, 0);
    if (nextOffset === current.scrollOffset) return current;

    const scrollDir = getScrollDir(current.scrollOffset, nextOffset);
    const next: ListStates = {
      ...current,
      isScrolling,
      scrollDir,
      scrollOffset: nextOffset,
      updateRequested,
    };

    // 同步回写给事件回调，避免在一次事件内连续调用时读到旧值
    statesRef.current = next;
    setStates(next);
    emitEndReached(scrollDir, normalizeOffset(nextOffset));
    scheduleReset();
    return next;
  };

  const scrollTo = (offset: number) => {
    updateScrollOffset(offset, {
      isScrolling: statesRef.current.isScrolling,
      updateRequested: true,
    });
  };

  const scrollToItem = (idx: number, alignment: Alignment = "auto") => {
    const clamped = Math.max(0, Math.min(idx, total - 1));
    scrollTo(
      calculator.getOffset(
        props,
        clamped,
        alignment,
        statesRef.current.scrollOffset,
        dynamicCache,
      ),
    );
  };

  const handleScroll = (event: UIEvent<HTMLElement>) => {
    const el = event.currentTarget;
    let offset: number;

    if (horizontal) {
      let scrollOffset = el.scrollLeft;
      if (direction === RTL) {
        switch (getRTLOffsetType()) {
          case RTL_OFFSET_NAG:
            scrollOffset = -el.scrollLeft;
            break;
          case RTL_OFFSET_POS_ASC:
            scrollOffset = el.scrollLeft;
            break;
          default:
            scrollOffset = el.scrollWidth - el.clientWidth - el.scrollLeft;
            break;
        }
      }
      offset = Math.min(scrollOffset, el.scrollWidth - el.clientWidth);
    } else {
      offset = Math.min(el.scrollTop, el.scrollHeight - el.clientHeight);
    }

    if (offset !== statesRef.current.scrollOffset) {
      updateScrollOffset(offset, {
        isScrolling: true,
        updateRequested: false,
      });
    }
    emitEvents(statesRef.current);
  };

  const handleScrollbarScroll = (distanceToGo: number, totalSteps: number) => {
    if (totalSteps <= 0) return;
    scrollTo(Math.min(maxOffset, (maxOffset / totalSteps) * distanceToGo));
  };

  const onWheel = useWheel(
    {
      atStartEdge: normalizeOffset(states.scrollOffset) <= 1,
      atEndEdge: maxOffset - normalizeOffset(states.scrollOffset) <= 1,
      layout,
    },
    (wheelOffset) => {
      scrollbarRef.current?.onMouseUp();
      scrollTo(
        Math.min(statesRef.current.scrollOffset + wheelOffset, maxOffset),
      );
    },
  );

  useEventListener<WheelEvent>(windowEl, "wheel", onWheel, {
    passive: false,
  });

  const resetScrollTop = () => {
    if (windowRef.current) windowRef.current.scrollTop = 0;
  };

  const getItemStyle = (idx: number): CSSProperties => {
    const itemStyleCache = getItemStyleCache(
      calculator.clearCache && itemSize,
      calculator.clearCache && layout,
      calculator.clearCache && direction,
    );

    const key = String(idx);
    const cached = readStyleCache(itemStyleCache, key);
    if (cached) return cached;

    const offset = calculator.getItemOffset(props, idx, dynamicCache);
    const size = calculator.getItemSize(props, idx, dynamicCache);
    const isRtl = direction === RTL;
    const offsetHorizontal = horizontal ? offset : 0;

    const next: CSSProperties = {
      position: "absolute",
      left: isRtl ? undefined : `${offsetHorizontal}px`,
      right: isRtl ? `${offsetHorizontal}px` : undefined,
      top: !horizontal ? `${offset}px` : 0,
      height: !horizontal ? `${size}px` : "100%",
      width: horizontal ? `${size}px` : "100%",
    };

    writeStyleCache(itemStyleCache, key, next);
    return next;
  };

  const resetAfterIndex = (idx: number, forceUpdate = true) => {
    if (dynamicCache) resetListCacheAfterIndex(dynamicCache, idx);
    getItemStyleCache(-1, null, null);
    if (forceUpdate) forceRender();
  };

  // 句柄中的方法依赖每次渲染的最新闭包，因此不传依赖数组
  useImperativeHandle(ref, () => ({
    windowRef,
    innerRef,
    getItemStyleCache,
    scrollTo,
    scrollToItem,
    resetScrollTop,
    resetAfterIndex,
    states,
  }));

  // 程序化滚动：状态更新后再写回真实滚动位置，对应官方 onUpdated
  useLayoutEffect(() => {
    const el = windowRef.current;
    if (!el || !states.updateRequested) return;

    if (horizontal) {
      if (direction === RTL) {
        switch (getRTLOffsetType()) {
          case RTL_OFFSET_NAG:
            el.scrollLeft = -states.scrollOffset;
            break;
          case RTL_OFFSET_POS_ASC:
            el.scrollLeft = states.scrollOffset;
            break;
          default:
            el.scrollLeft =
              el.scrollWidth - el.clientWidth - states.scrollOffset;
            break;
        }
      } else {
        el.scrollLeft = states.scrollOffset;
      }
    } else {
      el.scrollTop = states.scrollOffset;
    }
  }, [states, horizontal, direction]);

  // 初次挂载：写入 initScrollOffset 并派发一次事件
  useEffect(() => {
    const el = windowRef.current;
    if (el && isNumeric(initScrollOffset)) {
      if (horizontal) el.scrollLeft = initScrollOffset;
      else el.scrollTop = initScrollOffset;
    }
    emitEvents();
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
    // 等价于官方 onMounted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [start, end] = getRange(
    states.scrollOffset,
    states.isScrolling,
    states.scrollDir,
  );

  const items: ReactNode[] = [];
  if (total > 0) {
    for (let index = start; index <= end; index++) {
      items.push(
        <Fragment key={index}>
          {children({
            data,
            index,
            isScrolling: useIsScrolling ? states.isScrolling : undefined,
            style: getItemStyle(index),
          })}
        </Fragment>,
      );
    }
  }

  const Container = containerElement;
  const Inner = innerElement;

  const windowStyle: CSSProperties = {
    position: "relative",
    [horizontal ? "overflowX" : "overflowY"]: "scroll",
    WebkitOverflowScrolling: "touch",
    willChange: "transform",
    direction,
    height: isNumeric(height) ? `${height}px` : height,
    width: isNumeric(width) ? `${width}px` : width,
    ...style,
  };

  const innerStyle: CSSProperties = {
    height: horizontal ? "100%" : `${estimatedTotalSize}px`,
    pointerEvents: states.isScrolling ? "none" : undefined,
    width: horizontal
      ? `${estimatedTotalSize}px`
      : innerWidth !== undefined
        ? isNumeric(innerWidth)
          ? `${innerWidth}px`
          : innerWidth
        : "100%",
    margin: 0,
    boxSizing: "border-box",
  };

  const ratio =
    estimatedTotalSize > 0 && clientSizeValue > 0
      ? (clientSizeValue * 100) / estimatedTotalSize
      : 100;

  return (
    <div
      className={["el-vl__wrapper", scrollbarAlwaysOn && "always-on"]
        .filter(Boolean)
        .join(" ")}
    >
      <Container
        className={["el-vl__window", className].filter(Boolean).join(" ")}
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
        ref={scrollbarRef}
        clientSize={clientSizeValue}
        layout={layout}
        onScroll={handleScrollbarScroll}
        ratio={ratio}
        scrollFrom={maxOffset > 0 ? states.scrollOffset / maxOffset : 0}
        total={total}
        alwaysOn={scrollbarAlwaysOn}
      />
    </div>
  );
}
