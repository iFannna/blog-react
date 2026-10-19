"use client";

import { useCallback, useContext, useState } from "react";
import { ZIndexContextKey } from "./context";

/**
 * 对应官方 packages/hooks/use-z-index。
 *
 * 官方机制：模块级 zIndex ref + increasingInjection.current 组成全局计数器，
 * 每次 nextZIndex 递增它并返回 `initialZIndex + 计数器`。
 * initialZIndex 默认 2000，可由 ConfigProvider 的 zIndex 覆盖。
 */
export const defaultInitialZIndex = 2000;

let counter = 0;

/** 对应官方 nextZIndex：递增全局计数器并返回 base + 计数器。 */
export function nextZIndex(base: number = defaultInitialZIndex): number {
  counter += 1;
  return base + counter;
}

/**
 * 对应官方 useZIndex。
 * overrides 为组件自身的 zIndex prop；未传时以 ConfigProvider 下发的 zIndex 为初值。
 */
export function useZIndex(overrides?: number) {
  const configZIndex = useContext(ZIndexContextKey);

  const baseZIndex =
    typeof configZIndex === "number" ? configZIndex : defaultInitialZIndex;

  // 与官方一致：挂载时先占一个递增层级（浮层内容立即需要一个 z-index）
  const [zIndex, setZIndex] = useState(() =>
    typeof overrides === "number" ? overrides : nextZIndex(baseZIndex),
  );

  // 组件自身传了 zIndex 时以它为准，与官方 isNumber(props.zIndex) 分支一致
  const explicitZIndex = overrides;

  const next = useCallback(() => {
    const value =
      typeof explicitZIndex === "number"
        ? explicitZIndex
        : nextZIndex(baseZIndex);
    setZIndex(value);
    return value;
  }, [baseZIndex, explicitZIndex]);

  return { initialZIndex: baseZIndex, currentZIndex: zIndex, setZIndex, nextZIndex: next };
}
