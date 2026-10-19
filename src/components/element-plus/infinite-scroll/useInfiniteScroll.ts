"use client";

import { useEffect, useRef, type RefObject } from "react";

/** 对应官方 SCOPE，仅作标识；React 无指令实例，不挂到 DOM 上。 */
export const INFINITE_SCROLL_SCOPE = "ElInfiniteScroll";
/** 对应官方 CHECK_INTERVAL：immediate 模式下重新检查「内容是否撑满」的节流间隔。 */
export const CHECK_INTERVAL = 50;
/** 对应官方 DEFAULT_DELAY：滚动监听节流延迟。 */
export const DEFAULT_DELAY = 200;
/** 对应官方 DEFAULT_DISTANCE：触发距离。 */
export const DEFAULT_DISTANCE = 0;

export interface UseInfiniteScrollOptions {
  /** 到达底部时的回调，对应 v-infinite-scroll 的绑定值 */
  onLoad: () => void;
  /** 是否禁用，对应 infinite-scroll-disabled */
  disabled?: boolean;
  /** 节流延迟 ms，对应 infinite-scroll-delay */
  delay?: number;
  /** 触发距离 px，对应 infinite-scroll-distance */
  distance?: number;
  /** 内容不足一屏时是否立即触发，对应 infinite-scroll-immediate */
  immediate?: boolean;
}

interface ScrollState {
  container: HTMLElement | Window;
  containerEl: HTMLElement;
  lastScrollTop: number;
  observer?: MutationObserver;
}

/** 对应官方 getOffsetTop（utils/dom/position.ts）。 */
function getOffsetTop(el: HTMLElement): number {
  let offset = 0;
  let parent: HTMLElement | null = el;

  while (parent) {
    offset += parent.offsetTop;
    parent = parent.offsetParent as HTMLElement | null;
  }

  return offset;
}

/** 对应官方 getOffsetTopDistance：把 el 的顶边换算到容器的坐标系。 */
function getOffsetTopDistance(el: HTMLElement, containerEl: HTMLElement): number {
  return Math.abs(getOffsetTop(el) - getOffsetTop(containerEl));
}

/** 对应官方 utils/dom/scroll.ts 的 isScroll。 */
function isScroll(el: HTMLElement, isVertical: boolean): boolean {
  const overflow = window.getComputedStyle(el)[
    isVertical ? "overflowY" : "overflowX"
  ];
  return ["scroll", "auto", "overlay"].some((value) => overflow.includes(value));
}

/**
 * 对应官方 getScrollContainer：沿父链找第一个可滚动祖先，走到根则返回 window。
 * 元素自身可滚动时容器就是它自己，这也是官方 handleScroll 里 container === el 分支的由来。
 */
function getScrollContainer(
  el: HTMLElement,
  isVertical: boolean,
): HTMLElement | Window | undefined {
  let parent: HTMLElement | null = el;

  while (parent) {
    if (parent === document.documentElement) return window;
    if (isScroll(parent, isVertical)) return parent;
    parent = parent.parentNode as HTMLElement | null;
  }

  return undefined;
}

/**
 * 对应 lodash throttle 的默认形态（leading + trailing）。
 * 官方滚动节流 wait 取 delay，immediate 的补充检查节流 wait 取 CHECK_INTERVAL。
 */
function createThrottle(fn: () => void, wait: number) {
  let timer: number | undefined;
  let lastCalled = 0;

  const invoke = () => {
    const remaining = wait - (Date.now() - lastCalled);

    if (remaining <= 0) {
      lastCalled = Date.now();
      fn();
      return;
    }

    if (timer !== undefined) return;
    timer = window.setTimeout(() => {
      timer = undefined;
      lastCalled = Date.now();
      fn();
    }, remaining);
  };

  const cancel = () => {
    if (timer === undefined) return;
    window.clearTimeout(timer);
    timer = undefined;
  };

  return { invoke, cancel };
}

/** 对应官方 handleScroll 里 shouldTrigger 的两分支判定。 */
function shouldLoad(el: HTMLElement, state: ScrollState, distance: number): boolean {
  const { container, containerEl } = state;
  const { clientHeight, scrollHeight, scrollTop } = containerEl;

  if (container === el) {
    return scrollHeight - (clientHeight + scrollTop) <= distance;
  }

  // el 可能只是溢出的内容而非滚动容器，用 offsetTop 把 el 的底边换算过去
  const { clientTop, scrollHeight: height } = el;
  const offsetTop = getOffsetTopDistance(el, containerEl);
  return scrollTop + clientHeight >= offsetTop + clientTop + height - distance;
}

/**
 * 对应官方 v-infinite-scroll 指令。
 *
 * 用法：把同一 ref 挂到滚动元素上，
 *   const listRef = useRef<HTMLUListElement>(null);
 *   useInfiniteScroll(listRef, { onLoad: () => setCount((n) => n + 2) });
 *
 * 滚动容器由元素自身（overflow 非 visible）或最近的滚动祖先决定，与官方一致：
 * 元素自身可滚动时用「剩余滚动距离」判定，否则用 offsetTop 把元素底部换算到容器坐标系。
 * delay / immediate 只在挂载时生效（官方同样只在 mounted 时读取），改动会重新初始化监听。
 */
export function useInfiniteScroll<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: UseInfiniteScrollOptions,
): void {
  const { delay = DEFAULT_DELAY, immediate = true } = options;

  // 回调与配置用 ref 持有最新值：监听器只在挂载时建立，闭包里的初值会过期
  const onLoadRef = useRef(options.onLoad);
  const optionsRef = useRef(options);
  useEffect(() => {
    onLoadRef.current = options.onLoad;
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const container = getScrollContainer(el, true);
    if (!container) return;

    const containerEl =
      container === window ? document.documentElement : (container as HTMLElement);
    const state: ScrollState = {
      container,
      containerEl,
      lastScrollTop: containerEl.scrollTop,
    };

    const destroyObserver = () => {
      state.observer?.disconnect();
      state.observer = undefined;
    };

    const handleScroll = () => {
      const { disabled, distance = DEFAULT_DISTANCE } = optionsRef.current;
      const delta = containerEl.scrollTop - state.lastScrollTop;

      state.lastScrollTop = containerEl.scrollTop;

      // 官方语义：内容还没撑满（observer 仍在）、已禁用、或向上滚动时不触发
      if (state.observer || disabled || delta < 0) return;

      if (shouldLoad(el, state, distance)) {
        onLoadRef.current();
      }
    };

    // 对应官方 checkFull：内容撑不满时持续加载，撑满后销毁观察者
    const checkFull = () => {
      if (optionsRef.current.disabled || containerEl.clientHeight === 0) return;

      if (containerEl.scrollHeight <= containerEl.clientHeight) {
        onLoadRef.current();
      } else {
        destroyObserver();
      }
    };

    const scrollThrottle = createThrottle(handleScroll, delay);
    const checkThrottle = createThrottle(checkFull, CHECK_INTERVAL);

    if (immediate) {
      const observer = new MutationObserver(checkThrottle.invoke);
      state.observer = observer;
      observer.observe(el, { childList: true, subtree: true });
      checkFull();
    }

    container.addEventListener("scroll", scrollThrottle.invoke);

    return () => {
      container.removeEventListener("scroll", scrollThrottle.invoke);
      scrollThrottle.cancel();
      checkThrottle.cancel();
      destroyObserver();
    };
  }, [ref, delay, immediate]);
}
