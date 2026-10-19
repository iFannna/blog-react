import { useCallback, useEffect, useRef } from "react";

export interface GridWheelState {
  atXStartEdge: boolean;
  atXEndEdge: boolean;
  atYStartEdge: boolean;
  atYEndEdge: boolean;
}

/**
 * 对应官方 use-grid-wheel：二维滚动增量合并。
 *
 * 触摸板的斜向滚动只取绝对值更大的轴，避免表格同时横向纵向抖动。
 */
export function useGridWheel(
  state: GridWheelState,
  onWheelDelta: (x: number, y: number) => void,
) {
  const stateRef = useRef({ state, onWheelDelta });
  const offsetRef = useRef({ x: 0, y: 0 });
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

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    let x = event.deltaX;
    let y = event.deltaY;

    if (Math.abs(x) > Math.abs(y)) y = 0;
    else x = 0;

    if (event.shiftKey && y !== 0) {
      x = y;
      y = 0;
    }

    const xEdgeReached =
      (x < 0 && current.atXStartEdge) || (x > 0 && current.atXEndEdge);
    const yEdgeReached =
      (y < 0 && current.atYStartEdge) || (y > 0 && current.atYEndEdge);

    if (xEdgeReached || yEdgeReached) {
      // 纵向已到边界但浏览器仍想横向滚动时，阻止浏览器后退
      if (event.deltaX !== 0 && x === 0) event.preventDefault();
      return;
    }

    offsetRef.current.x += x;
    offsetRef.current.y += y;

    event.preventDefault();

    frameRef.current = requestAnimationFrame(() => {
      emit(offsetRef.current.x, offsetRef.current.y);
      offsetRef.current = { x: 0, y: 0 };
      frameRef.current = null;
    });
  }, []);
}
