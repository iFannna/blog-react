"use client";

import { useEffect, useRef, useState } from "react";

import { useResizeObserver } from "../hooks";

import type { AutoResizeSize, AutoResizerProps } from "./types";

/**
 * 对应官方 useAutoResize：用 contentRect 减去四边 padding。
 *
 * 用 state 保存元素而不是 ref，因为 useResizeObserver 需要在元素
 * 挂载后重新绑定观察器。
 */
export function useAutoResize({
  onResize,
}: Pick<AutoResizerProps, "onResize">) {
  const [sizer, setSizer] = useState<HTMLDivElement | null>(null);
  const [size, setSize] = useState<AutoResizeSize>({ width: 0, height: 0 });

  const onResizeRef = useRef(onResize);
  useEffect(() => {
    onResizeRef.current = onResize;
  });

  useResizeObserver(sizer, (entry) => {
    const { width, height } = entry.contentRect;
    const style = getComputedStyle(entry.target);

    const left = Number.parseInt(style.paddingLeft) || 0;
    const right = Number.parseInt(style.paddingRight) || 0;
    const top = Number.parseInt(style.paddingTop) || 0;
    const bottom = Number.parseInt(style.paddingBottom) || 0;

    const next = {
      width: width - left - right,
      height: height - top - bottom,
    };

    setSize((prev) =>
      prev.width === next.width && prev.height === next.height ? prev : next,
    );
    onResizeRef.current?.(next);
  });

  return { sizer: setSizer, width: size.width, height: size.height };
}
