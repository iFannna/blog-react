"use client";

import { useEffect, useRef } from "react";

/**
 * 对应官方 @vueuse/core 的 useResizeObserver。
 *
 * 回调放进 ref，避免调用方每次渲染新建函数导致 observer 反复重建。
 * target 为 null 时（SSR、首次渲染）直接跳过，挂载后再由调用方传入元素。
 */
export function useResizeObserver(
  target: Element | null | undefined,
  callback: (entry: ResizeObserverEntry) => void,
  options?: ResizeObserverOptions,
) {
  const callbackRef = useRef(callback);
  const optionsRef = useRef(options);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (!target || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) callbackRef.current(entry);
    });

    observer.observe(target, optionsRef.current);

    return () => observer.disconnect();
  }, [target]);
}
