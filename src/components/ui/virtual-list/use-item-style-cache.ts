import { useMemo } from "react";

import type { CSSProperties } from "react";

type StyleCache = Record<string, CSSProperties>;

/**
 * 对应官方 useCache：把「参数组合 → 单项样式表」缓存起来。
 *
 * perfMode 为 true 时按参数组合分别缓存（memoize），否则只保留最近一组
 * （memoize-one）。参数传入 -1 表示清空，这是官方 reset 的约定。
 */
export function createItemStyleCache(perfMode: boolean) {
  const memo = new Map<string, StyleCache>();
  let lastKey: string | null = null;
  let lastCache: StyleCache = {};

  return (a: unknown, b: unknown, c: unknown): StyleCache => {
    if (a === -1) {
      memo.clear();
      lastKey = null;
      lastCache = {};
      return lastCache;
    }

    const key = JSON.stringify([a, b, c]);

    if (perfMode) {
      const cached = memo.get(key);
      if (cached) return cached;

      const created: StyleCache = {};
      memo.set(key, created);
      return created;
    }

    if (lastKey === key) return lastCache;

    lastKey = key;
    lastCache = {};
    return lastCache;
  };
}

export function useItemStyleCache(perfMode: boolean) {
  return useMemo(() => createItemStyleCache(perfMode), [perfMode]);
}

/**
 * 读写放在独立函数里：React Compiler 会把组件内的直接赋值视为
 * 修改不可变值而报错，缓存对象本身是可变的备忘录。
 */
export function readStyleCache(cache: StyleCache, key: string) {
  return cache[key];
}

export function writeStyleCache(
  cache: StyleCache,
  key: string,
  style: CSSProperties,
) {
  cache[key] = style;
}
