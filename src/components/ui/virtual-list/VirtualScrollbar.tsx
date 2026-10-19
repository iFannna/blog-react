"use client";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type Ref,
  type TouchEvent as ReactTouchEvent,
} from "react";

import {
  HORIZONTAL,
  SCROLLBAR_MIN_SIZE,
  ScrollbarDirKey,
} from "./defaults";
import { renderThumbStyle } from "./utils";

import type { LayoutDirection } from "./types";

const BAR_MAP = {
  vertical: {
    offset: "offsetHeight",
    size: "height",
    axis: "Y",
    client: "clientY",
    direction: "top",
  },
  horizontal: {
    offset: "offsetWidth",
    size: "width",
    axis: "X",
    client: "clientX",
    direction: "left",
  },
} as const;

export interface VirtualScrollbarProps {
  alwaysOn?: boolean;
  className?: string;
  layout: LayoutDirection;
  total: number;
  ratio: number;
  clientSize: number;
  scrollFrom: number;
  scrollbarSize?: number;
  startGap?: number;
  endGap?: number;
  visible?: boolean;
  onScroll?: (distance: number, totalSteps: number) => void;
}

export interface VirtualScrollbarHandle {
  onMouseUp: () => void;
}

/**
 * 对应官方 ElVirtualScrollBar（竖向 / 横向两个分支）。
 *
 * 拖动期间滑块位置由本地状态驱动；非拖动时直接由 scrollFrom 换算，
 * 避免再通过 effect 回写状态。
 */
export function VirtualScrollbar({
  alwaysOn = false,
  className,
  layout,
  ratio,
  clientSize,
  scrollFrom,
  scrollbarSize = 6,
  startGap = 0,
  endGap = 2,
  onScroll,
  ref,
}: VirtualScrollbarProps & { ref?: Ref<VirtualScrollbarHandle> }) {
  const bar = BAR_MAP[layout];
  const gap = startGap + endGap;
  const trackSize = clientSize - gap;

  const thumbSize = (() => {
    if (!Number.isFinite(ratio) || ratio >= 100) return Number.POSITIVE_INFINITY;
    if (ratio >= 50) return (ratio * trackSize) / 100;

    const maxSize = trackSize / 3;
    return Math.floor(
      Math.min(Math.max((ratio * trackSize) / 100, SCROLLBAR_MIN_SIZE), maxSize),
    );
  })();

  const totalSteps = Number.isFinite(thumbSize)
    ? Math.ceil(clientSize - thumbSize - gap)
    : 0;

  const [isDragging, setIsDragging] = useState(false);
  const [dragTraveled, setDragTraveled] = useState(0);
  const draggingRef = useRef(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const selectStartRef = useRef<typeof document.onselectstart>(null);

  // 原生监听器在拖动开始时才挂载，运行期参数经 ref 读取
  const latestRef = useRef({ bar, totalSteps, onScroll });
  useEffect(() => {
    latestRef.current = { bar, totalSteps, onScroll };
  });

  const traveled = isDragging
    ? dragTraveled
    : Math.max(0, Math.ceil((scrollFrom || 0) * totalSteps));

  const stopDragging = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    setDragTraveled(0);
  };

  const startDrag = (clientPosition: number, element: HTMLElement) => {
    draggingRef.current = true;
    setIsDragging(true);

    const currentBar = latestRef.current.bar;
    dragStartRef.current =
      (element[currentBar.offset] as number) -
      (clientPosition - element.getBoundingClientRect()[currentBar.direction]);

    selectStartRef.current = document.onselectstart;
    document.onselectstart = () => false;
  };

  // 监听器的生命周期跟随 isDragging：开始拖动后挂载，结束或卸载时清理
  useEffect(() => {
    if (!isDragging) return;

    const moveTo = (clientPosition: number) => {
      const {
        bar: currentBar,
        totalSteps: steps,
        onScroll: emit,
      } = latestRef.current;
      const track = trackRef.current;
      const thumb = thumbRef.current;
      if (!track || !thumb) return;

      const prevPage = dragStartRef.current;
      if (!prevPage) return;

      const offset =
        (track.getBoundingClientRect()[currentBar.direction] - clientPosition) *
        -1;
      const thumbClickPosition =
        (thumb[currentBar.offset] as number) - prevPage;
      const distance = offset - thumbClickPosition;

      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);

      frameRef.current = requestAnimationFrame(() => {
        setDragTraveled(Math.max(0, Math.min(distance, steps)));
        emit?.(distance, steps);
        frameRef.current = null;
      });
    };

    const onMouseMove = (event: MouseEvent) => {
      moveTo(event[latestRef.current.bar.client]);
    };
    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      moveTo(event.touches[0][latestRef.current.bar.client]);
    };
    const onMouseUp = () => stopDragging();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      document.onselectstart = selectStartRef.current;
      selectStartRef.current = null;
    };
    // 仅由拖动状态驱动挂载与清理
  }, [isDragging]);

  const handleThumbMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation?.();

    if (event.ctrlKey || [1, 2].includes(event.button)) return;

    startDrag(event[latestRef.current.bar.client], event.currentTarget);
  };

  const handleTrackMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();

    const currentBar = latestRef.current.bar;
    const target = event.target as HTMLElement;
    const offset = Math.abs(
      target.getBoundingClientRect()[currentBar.direction] -
        event[currentBar.client],
    );
    const thumbHalf = (thumbRef.current?.[currentBar.offset] as number) / 2;
    const distance = offset - thumbHalf;

    latestRef.current.onScroll?.(distance, latestRef.current.totalSteps);
  };

  const handleTrackTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    startDrag(event.touches[0][latestRef.current.bar.client], event.currentTarget);
  };

  useImperativeHandle(ref, () => ({ onMouseUp: stopDragging }));

  const trackStyle: CSSProperties = {
    position: "absolute",
    width: `${layout === HORIZONTAL ? trackSize : scrollbarSize}px`,
    height: `${layout === HORIZONTAL ? scrollbarSize : trackSize}px`,
    [ScrollbarDirKey[layout]]: "2px",
    right: "2px",
    bottom: "2px",
    borderRadius: "4px",
  };

  const thumbStyle: CSSProperties = Number.isFinite(thumbSize)
    ? renderThumbStyle(
        {
          bar,
          size: `${thumbSize}px`,
          move: traveled,
        },
        layout,
      )
    : { display: "none" };

  return (
    <div
      ref={trackRef}
      role="presentation"
      className={[
        "el-virtual-scrollbar",
        className,
        (alwaysOn || isDragging) && "always-on",
      ]
        .filter(Boolean)
        .join(" ")}
      style={trackStyle}
      onMouseDown={handleTrackMouseDown}
      onTouchStart={handleTrackTouchStart}
    >
      <div
        ref={thumbRef}
        className="el-scrollbar__thumb"
        style={thumbStyle}
        onMouseDown={handleThumbMouseDown}
      />
    </div>
  );
}
