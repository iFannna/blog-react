"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/** 官方 virtual-list 的 cache 默认值：窗口上下各预渲染 2 项。 */
const CACHE = 2;
/** 官方 SCROLLBAR_MIN_SIZE。 */
const SCROLLBAR_MIN_SIZE = 20;
/** 官方固定尺寸列表的滚动条宽度。 */
const SCROLLBAR_SIZE = 6;
/** 官方 makeThumbStyle 的 translate 单位是 px（与 el-scrollbar 的百分比不同）。 */
const GAP = 4;

export interface TransferVirtualListProps<T> {
  data: T[];
  /** 行高，对应官方 item-size。 */
  itemSize: number;
  /** 可视区高度，对应官方传给 FixedSizeList 的 height（由面板测量得到）。 */
  height: number;
  className?: string;
  renderItem: (item: T, index: number, style: CSSProperties) => ReactNode;
}

/**
 * 对应官方 ElFixedSizeList 在 Transfer 中的用法（竖向、定高）。
 *
 * 只保留竖向定高这一条路径，省去方向、动态尺寸与 RTL 分支，
 * DOM 与官方一致：.el-vl__wrapper > .el-vl__window > 内容 + .el-virtual-scrollbar。
 */
export function TransferVirtualList<T>({
  data,
  itemSize,
  height,
  className,
  renderItem,
}: TransferVirtualListProps<T>) {
  const [scrollOffset, setScrollOffset] = useState(0);
  const windowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const total = data.length;
  /** 官方 estimatedTotalSize = itemSize * total。 */
  const estimatedTotalSize = itemSize * total;

  /** 官方 itemsToRender：可见区间外再各留 cache 项，避免滚动时白屏。 */
  const startIndex = Math.max(
    0,
    Math.min(total - 1, Math.floor(scrollOffset / itemSize)),
  );
  const stopIndex = Math.max(
    0,
    Math.min(
      total - 1,
      startIndex +
        Math.ceil((height + scrollOffset - startIndex * itemSize) / itemSize) -
        1,
    ),
  );
  const from = Math.max(0, startIndex - CACHE);
  const to = Math.max(0, Math.min(total - 1, stopIndex + CACHE));

  const items: ReactNode[] = [];
  // 空数据时 total - 1 会钳制成 0，区间变成 [0, 0]，不能据此渲染
  for (let index = from; index <= to && total > 0; index++) {
    items.push(
      renderItem(data[index], index, {
        position: "absolute",
        left: 0,
        top: index * itemSize,
        height: itemSize,
        width: "100%",
      }),
    );
  }

  const windowStyle: CSSProperties = {
    position: "relative",
    overflowY: "scroll",
    WebkitOverflowScrolling: "touch",
    willChange: "transform",
    height,
  };

  const innerStyle: CSSProperties = {
    height: estimatedTotalSize,
    width: "100%",
    margin: 0,
    boxSizing: "border-box",
  };

  const handleScroll = () => {
    const el = windowRef.current;
    if (!el) return;
    setScrollOffset(el.scrollTop);
  };

  /** 官方 scrollTo：滚动偏移量同时写回状态与原生滚动容器。 */
  const scrollTo = useCallback((offset: number) => {
    setScrollOffset(offset);
    const el = windowRef.current;
    if (el) el.scrollTop = offset;
  }, []);

  // 数据或行高变化后旧偏移可能越界，按官方 maxOffset 收敛。
  // 只回写原生滚动位置，位移引起的 state 同步交给随后的 onScroll 回调，
  // 避免在 effect 里直接 setState 造成额外一次渲染。
  useEffect(() => {
    const el = windowRef.current;
    if (!el) return;

    const maxOffset = Math.max(0, estimatedTotalSize - height);
    if (el.scrollTop > maxOffset) el.scrollTop = maxOffset;
  }, [estimatedTotalSize, height]);

  // --- 滚动条，对应官方 ElVirtualScrollBar 的竖向分支 ---

  const trackSize = Math.max(0, height - GAP);
  const ratio = height > 0 && estimatedTotalSize > 0 ? (height * 100) / estimatedTotalSize : 100;

  const thumbSize = (() => {
    if (ratio >= 100 || !Number.isFinite(ratio)) return Number.POSITIVE_INFINITY;
    if (ratio >= 50) return (ratio * trackSize) / 100;
    const maxSize = trackSize / 3;
    return Math.floor(Math.min(Math.max((ratio * trackSize) / 100, SCROLLBAR_MIN_SIZE), maxSize));
  })();

  const maxOffset = Math.max(0, estimatedTotalSize - height);
  const totalSteps = Number.isFinite(thumbSize) ? Math.max(0, height - thumbSize - GAP) : 0;
  const traveled =
    maxOffset > 0 ? Math.round((scrollOffset / maxOffset) * totalSteps) : 0;

  const trackStyle: CSSProperties = {
    position: "absolute",
    width: SCROLLBAR_SIZE,
    height: trackSize,
    top: 2,
    right: 2,
    bottom: 2,
    borderRadius: 4,
  };

  const thumbStyle: CSSProperties = {
    width: "100%",
    height: Number.isFinite(thumbSize) ? thumbSize : "100%",
    display: Number.isFinite(thumbSize) ? undefined : "none",
    transform: `translateY(${traveled}px)`,
  };

  /** 官方 onScrollbarScroll：把滑块位移换算成列表偏移。 */
  const handleBarScroll = useCallback(
    (distanceToGo: number, steps: number) => {
      if (steps <= 0) return;
      scrollTo(Math.min(maxOffset, (maxOffset / steps) * distanceToGo));
    },
    [maxOffset, scrollTo],
  );

  /**
   * 拖动过程中要用到最新的位移与总步数，effect 不能因它们变化而重新挂监听
   * （重新挂载会打断正在进行的一次拖动），因此经 ref 读取。
   */
  const dragStateRef = useRef({ traveled, totalSteps, handleBarScroll });
  useEffect(() => {
    dragStateRef.current = { traveled, totalSteps, handleBarScroll };
  }, [traveled, totalSteps, handleBarScroll]);

  useLayoutEffect(() => {
    const thumb = thumbRef.current;
    if (!thumb) return;

    let startY = 0;
    let startTraveled = 0;

    const onMouseMove = (event: MouseEvent) => {
      if (!draggingRef.current) return;
      const { totalSteps: steps, handleBarScroll: scrollBar } =
        dragStateRef.current;
      const distance = startTraveled + (event.clientY - startY);
      scrollBar(Math.max(0, Math.min(distance, steps)), steps);
    };
    const onMouseUp = () => {
      draggingRef.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.onselectstart = null;
    };

    const onThumbMouseDown = (event: MouseEvent) => {
      event.stopPropagation();
      if (event.button !== 0) return;
      draggingRef.current = true;
      startY = event.clientY;
      startTraveled = dragStateRef.current.traveled;
      document.onselectstart = () => false;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    thumb.addEventListener("mousedown", onThumbMouseDown);
    return () => {
      thumb.removeEventListener("mousedown", onThumbMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  /** 官方 clickTrackHandler：点击轨道空白处直接跳转。 */
  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    const rect = track.getBoundingClientRect();
    const offset = Math.abs(rect.top - event.clientY);
    const half = thumb.offsetHeight / 2;
    handleBarScroll(Math.max(0, Math.min(offset - half, totalSteps)), totalSteps);
  };

  return (
    <div className="el-vl__wrapper">
      <div
        ref={windowRef}
        className={["el-vl__window", className].filter(Boolean).join(" ")}
        style={windowStyle}
        onScroll={handleScroll}
      >
        <div style={innerStyle}>{items}</div>
      </div>
      <div
        ref={trackRef}
        role="presentation"
        className="el-virtual-scrollbar"
        style={trackStyle}
        onClick={handleTrackClick}
      >
        <div
          ref={thumbRef}
          className="el-scrollbar__thumb"
          style={thumbStyle}
        />
      </div>
    </div>
  );
}
