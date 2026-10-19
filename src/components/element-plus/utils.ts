/**
 * 与官方 packages/utils/dom/style.ts 的 addUnit 对齐：
 * 数字和数字字符串补单位，其余字符串原样返回。
 */
export function addUnit(value?: string | number, defaultUnit = "px") {
  if (!value && value !== 0) return "";

  if (typeof value === "number") return `${value}${defaultUnit}`;

  if (typeof value === "string") {
    return /^\d+(\.\d+)?$/.test(value) ? `${value}${defaultUnit}` : value;
  }

  return "";
}

export const isNil = (value: unknown): value is null | undefined =>
  value === null || value === undefined;

export const isClient = typeof window !== "undefined";

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === "[object Object]";

/** 官方用 lodash get，这里只支持点路径与数组路径。 */
export function get<T = unknown>(
  source: unknown,
  path: string | Array<string | number>,
  defaultValue?: T,
): T {
  const keys = Array.isArray(path)
    ? path
    : path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);

  let current: unknown = source;

  for (const key of keys) {
    if (current === null || current === undefined) return defaultValue as T;
    current = (current as Record<string | number, unknown>)[key];
  }

  return (current === undefined ? defaultValue : current) as T;
}

export function pick<T extends Record<string, unknown>>(
  source: T,
  keys: string[],
): Partial<T> {
  const result: Partial<T> = {};

  for (const key of keys) {
    if (key in source) result[key as keyof T] = source[key] as T[keyof T];
  }

  return result;
}

export function omit<T extends Record<string, unknown>>(
  source: T,
  keys: string[],
): Partial<T> {
  const result: Partial<T> = { ...source };

  for (const key of keys) delete result[key as keyof T];

  return result;
}

export function flattenDeep<T>(input: Array<T | T[]>): T[] {
  const result: T[] = [];

  for (const item of input) {
    if (Array.isArray(item)) result.push(...flattenDeep(item));
    else result.push(item as T);
  }

  return result;
}

export function findLastIndex<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
): number {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i], i, array)) return i;
  }

  return -1;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** 官方多处使用 lodash isEmpty 判断空值。 */
export function isEmpty(value: unknown): boolean {
  if (isNil(value)) return true;
  if (typeof value === "string" || Array.isArray(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (isPlainObject(value)) return Object.keys(value).length === 0;

  return false;
}

export function cloneDeep<T>(value: T, cache = new WeakMap<object, unknown>()): T {
  if (value === null || typeof value !== "object") return value;

  const cached = cache.get(value as object);
  if (cached !== undefined) return cached as T;

  if (value instanceof Date) return new Date(value.getTime()) as T;
  if (value instanceof RegExp) return new RegExp(value.source, value.flags) as T;

  if (Array.isArray(value)) {
    const result: unknown[] = [];
    cache.set(value, result);
    for (const item of value) result.push(cloneDeep(item, cache));
    return result as T;
  }

  if (value instanceof Map) {
    const result = new Map();
    cache.set(value, result);
    value.forEach((item, key) => result.set(key, cloneDeep(item, cache)));
    return result as T;
  }

  if (value instanceof Set) {
    const result = new Set();
    cache.set(value, result);
    value.forEach((item) => result.add(cloneDeep(item, cache)));
    return result as T;
  }

  const result: Record<string, unknown> = {};
  cache.set(value as object, result);
  for (const key of Object.keys(value)) {
    result[key] = cloneDeep((value as Record<string, unknown>)[key], cache);
  }

  return result as T;
}

/** 结构比较，覆盖官方用到的 isEqual 场景（基础值、数组、普通对象、Date）。 */
export function isEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;

  if (left instanceof Date && right instanceof Date) {
    return left.getTime() === right.getTime();
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    return (
      left.length === right.length &&
      left.every((item, index) => isEqual(item, right[index]))
    );
  }

  if (isPlainObject(left) && isPlainObject(right)) {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);

    return (
      leftKeys.length === rightKeys.length &&
      leftKeys.every(
        (key) => key in right && isEqual(left[key], (right as Record<string, unknown>)[key]),
      )
    );
  }

  return false;
}

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait = 0,
  immediate = false,
) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Args) => {
    if (timer) clearTimeout(timer);

    if (immediate && !timer) fn(...args);

    timer = setTimeout(() => {
      timer = null;
      if (!immediate) fn(...args);
    }, wait);
  };

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  return debounced;
}

/** 对应 lodash memoize，缓存以首个参数为 key。 */
export function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  resolver?: (...args: Args) => unknown,
) {
  const cache = new Map<unknown, Result>();

  const memoized = (...args: Args): Result => {
    const key = resolver ? resolver(...args) : args[0];

    if (cache.has(key)) return cache.get(key) as Result;

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };

  memoized.cache = cache;
  return memoized;
}

export function getElement(target: string | HTMLElement | null | undefined) {
  if (!target) return null;
  if (typeof target !== "string") return target;
  if (!isClient) return null;

  return document.querySelector<HTMLElement>(target);
}

let scrollBarWidth: number | undefined;

/** 官方 useScrollbarWidth 的等价实现；服务端返回 0。 */
export function getScrollBarWidth() {
  if (!isClient) return 0;
  if (scrollBarWidth !== undefined) return scrollBarWidth;

  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  outer.style.position = "absolute";
  outer.style.top = "-9999px";
  document.body.appendChild(outer);

  const widthWithoutScrollBar = outer.offsetWidth;
  outer.style.overflow = "scroll";

  const inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);

  const widthWithScrollBar = inner.offsetWidth;
  scrollBarWidth = widthWithoutScrollBar - widthWithScrollBar;
  document.body.removeChild(outer);

  return scrollBarWidth;
}
