import { useCallback, useEffect, useRef } from "react";

import { HORIZONTAL } from "./defaults";

import type { LayoutDirection } from "./types";

const isFirefox = () =>
  typeof navigator !== "undefined" &&
  navigator.userAgent.toLowerCase().includes("firefox");

export interface ListWheelState {
  atStartEdge: boolean;
  atEndEdge: boolean;
  layout: LayoutDirection;
}

/**
 * 对应官方 use-wheel：累积一帧内的滚动增量，再用 rAF 合并成一次滚动。
 */
export function useWheel(
  state: ListWheelState,
  onWheelDelta: (offset: number) => void,
) {
  const stateRef = useRef({ state, onWheelDelta });
  const offsetRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    stateRef.current = { state, onWheelDelta };
  });

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  return useCallback((event: WheelEvent) => {
    const { state: current, onWheelDelta: emit } = stateRef.current;

    const cancel = () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    cancel();

    let { deltaX, deltaY } = event;
    // Windows 上按住 Shift 滚动时浏览器只给 deltaY
    if (event.shiftKey && deltaY !== 0) {
      deltaX = deltaY;
      deltaY = 0;
    }

    const newOffset = current.layout === HORIZONTAL ? deltaX : deltaY;
    const edgeReached =
      (newOffset < 0 && current.atStartEdge) ||
      (newOffset > 0 && current.atEndEdge);

    if (edgeReached) return;

    offsetRef.current += newOffset;

    if (!isFirefox() && newOffset !== 0) event.preventDefault();

    frameRef.current = requestAnimationFrame(() => {
      emit(offsetRef.current);
      offsetRef.current = 0;
      frameRef.current = null;
    });
  }, []);
}
