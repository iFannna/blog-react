"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/* 与官方 @element-plus/utils 对齐的 DOM / 滚动工具                      */
/* ------------------------------------------------------------------ */

/** 滚动容器：window 或某个可滚动的元素。 */
type ScrollContainer = Window | HTMLElement;

/** 对应官方 AnchorLinkState，锚点链接把自己注册给 ElAnchor。 */
export interface AnchorLinkState {
  href: string;
  el: HTMLElement;
}

export type AnchorType = "default" | "underline";
export type AnchorDirection = "vertical" | "horizontal";

export interface AnchorContextValue {
  direction: AnchorDirection;
  /** 当前高亮的 href，空串表示未选中任何项 */
  currentAnchor: string;
  addLink: (state: AnchorLinkState) => void;
  removeLink: (href: string) => void;
  handleClick: (event: ReactMouseEvent<HTMLAnchorElement>, href?: string) => void;
}

/**
 * 对应官方 anchorKey。默认值给空实现，脱离 ElAnchor 使用时降级为普通链接，
 * 不会抛错打断整棵子树。
 */
export const AnchorContext = createContext<AnchorContextValue>({
  direction: "vertical",
  currentAnchor: "",
  addLink: () => {},
  removeLink: () => {},
  handleClick: () => {},
});

export function useAnchorContext() {
  return useContext(AnchorContext);
}

/** 对应官方 isWindow。 */
function isWindow(value: unknown): value is Window {
  return typeof window !== "undefined" && value === window;
}

/**
 * 对应官方 getElement：字符串按选择器解析，非法选择器返回 null 而不是抛错
 * （官方的 href 可能带空格，querySelector 会直接抛 SyntaxError）。
 */
function getElement(
  target?: string | HTMLElement | Window | null,
): HTMLElement | Window | null {
  if (!target || target === "") return null;
  if (typeof target === "string") {
    try {
      return document.querySelector<HTMLElement>(target);
    } catch {
      return null;
    }
  }
  return target;
}

/** 对应官方 getOffsetTop：累加 offsetParent 链上的 offsetTop。 */
function getOffsetTop(el: HTMLElement) {
  let offset = 0;
  let parent: HTMLElement | null = el;
  while (parent) {
    offset += parent.offsetTop;
    parent = parent.offsetParent as HTMLElement | null;
  }
  return offset;
}

/** 对应官方 getOffsetTopDistance。 */
function getOffsetTopDistance(el: HTMLElement, containerEl: HTMLElement) {
  return Math.abs(getOffsetTop(el) - getOffsetTop(containerEl));
}

/** 对应官方 getScrollElement：window 容器一律换算成 documentElement。 */
function getScrollElement(target: HTMLElement, container: ScrollContainer) {
  return isWindow(container) ? target.ownerDocument.documentElement : container;
}

/** 对应官方 getScrollTop。 */
function getScrollTop(container: ScrollContainer) {
  return isWindow(container) ? window.scrollY : container.scrollTop;
}

/** 与官方 packages/utils/easings.ts 的 easeInOutCubic 逐行一致。 */
function easeInOutCubic(t: number, b: number, c: number, d: number) {
  const cc = c - b;
  t /= d / 2;
  if (t < 1) return (cc / 2) * t * t * t + b;
  return (cc / 2) * ((t -= 2) * t * t + 2) + b;
}

/**
 * 对应官方 animateScrollTo。官方只用它滚 window，这里把容器扩展到元素，
 * 因为 ElAnchor 的 container 可以是任意可滚动元素。
 */
function animateScrollTo(
  container: ScrollContainer,
  from: number,
  to: number,
  duration: number,
  callback?: () => void,
) {
  const startTime = Date.now();
  let handle: number | undefined;

  const scroll = () => {
    const time = Date.now() - startTime;
    const nextScrollTop = easeInOutCubic(
      time > duration ? duration : time,
      from,
      to,
      duration,
    );

    if (isWindow(container)) {
      container.scrollTo(window.pageXOffset, nextScrollTop);
    } else {
      container.scrollTop = nextScrollTop;
    }

    if (time < duration) {
      handle = window.requestAnimationFrame(scroll);
    } else {
      callback?.();
    }
  };

  scroll();

  return () => {
    if (handle !== undefined) window.cancelAnimationFrame(handle);
  };
}

/* ------------------------------------------------------------------ */
/* ElAnchor                                                            */
/* ------------------------------------------------------------------ */

export interface AnchorProps {
  /** 滚动容器：选择器、元素或 window，缺省为 window */
  container?: string | HTMLElement | Window | null;
  /** 锚点滚动的偏移量 */
  offset?: number;
  /** 元素开始触发锚点切换的偏移量 */
  bound?: number;
  /** 滚动动画时长，毫秒 */
  duration?: number;
  /** 是否显示滑块 */
  marker?: boolean;
  /** 锚点类型 */
  type?: AnchorType;
  /** 锚点方向 */
  direction?: AnchorDirection;
  /** 滚动到顶部时是否选中第一项 */
  selectScrollTop?: boolean;
  /** 当前锚点变化时触发，对应官方 change 事件 */
  onChange?: (href: string) => void;
  /** 点击链接时触发，对应官方 click 事件 */
  onClick?: (event: ReactMouseEvent<HTMLAnchorElement>, href?: string) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export interface AnchorExpose {
  /** 手动滚动到指定锚点位置，对应官方 scrollTo */
  scrollTo: (href?: string) => void;
}

/**
 * 对应官方 ElAnchor。
 *
 * 三件事协作：
 *   - 子链接通过 context 把 DOM 注册进 links，父组件据此算「当前该高亮谁」
 *   - 滚动监听用 rAF 节流，取每个锚点的触发点（距容器顶距离 - offset - bound），
 *     排序后找出 scrollTop 落在哪一段，落在哪段就高亮哪一项
 *   - marker 用 getBoundingClientRect 相对根元素定位，写 inline top/left，
 *     过渡交给 CSS 上的 transition
 *
 * 点击链接与官方一致不做 preventDefault：需要阻止默认行为的场景由使用方在
 * onClick 里自行调用，官方示例的滚动容器 demo 正是这么做的。
 * 动画期间 isScrolling 锁住高亮，避免滚动事件的最后一帧把高亮改回去。
 */
export const ElAnchor = forwardRef<AnchorExpose, AnchorProps>(function ElAnchor(
  {
    container,
    offset = 0,
    bound = 15,
    duration = 300,
    marker = true,
    type = "default",
    direction = "vertical",
    selectScrollTop = false,
    onChange,
    onClick,
    className,
    style,
    children,
  },
  ref,
) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const containerElRef = useRef<ScrollContainer | null>(null);
  /** href -> 链接 DOM，子组件挂载/卸载时增删 */
  const linksRef = useRef<Record<string, HTMLElement>>({});
  /** 动画期间为 true，此时忽略滚动带来的高亮切换 */
  const isScrollingRef = useRef(false);
  const currentScrollTopRef = useRef(0);
  const clearAnimateRef = useRef<(() => void) | null>(null);
  const currentTargetHrefRef = useRef("");
  /** 高亮的真值放在 ref 里，滚动回调要同步读到最新值 */
  const currentAnchorRef = useRef("");
  const markerSignatureRef = useRef("");
  const rafRef = useRef(0);

  // 长生命周期的回调只读 ref，避免每次 props 变化都重新绑定滚动监听
  const optionsRef = useRef({ offset, bound, duration, selectScrollTop, direction });
  const handlersRef = useRef({ onChange, onClick });

  const [currentAnchor, setCurrentAnchorState] = useState("");
  const [markerStyle, setMarkerStyle] = useState<CSSProperties>({});

  useEffect(() => {
    optionsRef.current = { offset, bound, duration, selectScrollTop, direction };
  });

  useEffect(() => {
    handlersRef.current = { onChange, onClick };
  });

  const setCurrentAnchor = useCallback((href: string) => {
    if (currentAnchorRef.current === href) return;
    currentAnchorRef.current = href;
    setCurrentAnchorState(href);
    handlersRef.current.onChange?.(href);
  }, []);

  const addLink = useCallback((state: AnchorLinkState) => {
    linksRef.current[state.href] = state.el;
  }, []);

  const removeLink = useCallback((href: string) => {
    delete linksRef.current[href];
  }, []);

  /** 对应官方 getCurrentHref：算出当前 scrollTop 落在哪个锚点的区间里。 */
  const getCurrentHref = useCallback(() => {
    const containerEl = containerElRef.current;
    if (!containerEl) return undefined;

    const {
      offset: currentOffset,
      bound: currentBound,
      selectScrollTop: currentSelectScrollTop,
    } = optionsRef.current;

    const scrollTop = getScrollTop(containerEl);
    const anchorTopList: { top: number; href: string }[] = [];

    for (const href of Object.keys(linksRef.current)) {
      const target = getElement(href);
      if (!target || isWindow(target)) continue;
      const scrollEle = getScrollElement(target, containerEl);
      const distance = getOffsetTopDistance(target, scrollEle);
      anchorTopList.push({ top: distance - currentOffset - currentBound, href });
    }

    // DOM 顺序未必等于位置顺序，按触发点升序才能正确取区间
    anchorTopList.sort((prev, next) => prev.top - next.top);

    for (let i = 0; i < anchorTopList.length; i++) {
      const item = anchorTopList[i];
      const next = anchorTopList[i + 1];

      if (i === 0 && scrollTop === 0) {
        return currentSelectScrollTop ? item.href : "";
      }
      if (item.top <= scrollTop && (!next || next.top > scrollTop)) {
        return item.href;
      }
    }

    return undefined;
  }, []);

  /** 对应官方 throttleByRaf(handleScroll)：一帧内只处理一次滚动。 */
  const handleScroll = useCallback(() => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = 0;

      const containerEl = containerElRef.current;
      if (containerEl) currentScrollTopRef.current = getScrollTop(containerEl);

      const currentHref = getCurrentHref();
      if (isScrollingRef.current || currentHref === undefined) return;
      setCurrentAnchor(currentHref);
    });
  }, [getCurrentHref, setCurrentAnchor]);

  const scrollToAnchor = useCallback((href: string) => {
    const containerEl = containerElRef.current;
    if (!containerEl) return;

    const target = getElement(href);
    if (!target || isWindow(target)) return;

    const { offset: currentOffset, duration: currentDuration } =
      optionsRef.current;

    if (clearAnimateRef.current) {
      // 目标相同则不打断正在进行的动画
      if (currentTargetHrefRef.current === href) return;
      clearAnimateRef.current();
    }

    currentTargetHrefRef.current = href;
    isScrollingRef.current = true;

    const scrollEle = getScrollElement(target, containerEl);
    const distance = getOffsetTopDistance(target, scrollEle);
    const max = scrollEle.scrollHeight - scrollEle.clientHeight;
    const to = Math.min(distance - currentOffset, max);

    clearAnimateRef.current = animateScrollTo(
      containerEl,
      currentScrollTopRef.current,
      to,
      currentDuration,
      () => {
        // 等节流的最后一帧跑完再解除锁定，否则滚动事件会把高亮改回去
        window.setTimeout(() => {
          isScrollingRef.current = false;
          currentTargetHrefRef.current = "";
        }, 20);
      },
    );
  }, []);

  const scrollTo = useCallback(
    (href?: string) => {
      if (!href) return;
      setCurrentAnchor(href);
      scrollToAnchor(href);
    },
    [scrollToAnchor, setCurrentAnchor],
  );

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, href?: string) => {
      handlersRef.current.onClick?.(event, href);
      scrollTo(href);
    },
    [scrollTo],
  );

  useImperativeHandle(ref, () => ({ scrollTo }), [scrollTo]);

  /** 对应官方 updateMarkerStyle：把 marker 定位到当前高亮项上。 */
  const updateMarkerStyle = useCallback(() => {
    const anchorEl = anchorRef.current;
    const markerEl = markerRef.current;
    const active = currentAnchorRef.current;

    let next: CSSProperties = {};
    if (anchorEl && markerEl && active) {
      const linkEl = linksRef.current[active];
      if (linkEl) {
        const anchorRect = anchorEl.getBoundingClientRect();
        const markerRect = markerEl.getBoundingClientRect();
        const linkRect = linkEl.getBoundingClientRect();

        if (optionsRef.current.direction === "horizontal") {
          next = {
            left: `${linkRect.left - anchorRect.left}px`,
            width: `${linkRect.width}px`,
            opacity: 1,
          };
        } else {
          next = {
            top: `${
              linkRect.top -
              anchorRect.top +
              (linkRect.height - markerRect.height) / 2
            }px`,
            opacity: 1,
          };
        }
      }
    }

    // 每次渲染后都会重算，值没变时不写 state，避免无限渲染
    const signature = JSON.stringify(next);
    if (signature !== markerSignatureRef.current) {
      markerSignatureRef.current = signature;
      setMarkerStyle(next);
    }
  }, []);

  // 无依赖：等效于官方 watch(currentAnchor) + watch(slots.default)，
  // 链接增删或高亮变化后都能重新量一次位置
  useEffect(() => {
    updateMarkerStyle();
  });

  const getContainer = useCallback(() => {
    const el = container == null ? null : getElement(container);
    if (!el || isWindow(el)) {
      containerElRef.current = window;
    } else {
      containerElRef.current = el;
    }
  }, [container]);

  /** 首次进入后无需再处理地址栏哈希 */
  const initializedRef = useRef(false);

  useEffect(() => {
    getContainer();

    const containerEl = containerElRef.current;
    if (!containerEl) return;

    containerEl.addEventListener("scroll", handleScroll, { passive: true });

    if (!initializedRef.current) {
      initializedRef.current = true;
      // 对应官方 onMounted：地址栏带哈希且目标存在时直接滚过去
      const hash = window.location.hash
        ? decodeURIComponent(window.location.hash)
        : "";
      const target = hash ? getElement(hash) : null;
      if (target && !isWindow(target)) {
        scrollTo(hash);
      } else {
        handleScroll();
      }
    } else {
      // container 变化后按新容器重算一次高亮
      handleScroll();
    }

    return () => {
      containerEl.removeEventListener("scroll", handleScroll);
    };
  }, [container, getContainer, handleScroll, scrollTo]);

  useEffect(() => {
    return () => {
      clearAnimateRef.current?.();
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const contextValue = useMemo<AnchorContextValue>(
    () => ({ direction, currentAnchor, addLink, removeLink, handleClick }),
    [direction, currentAnchor, addLink, removeLink, handleClick],
  );

  const rootClassName = [
    "el-anchor",
    type === "underline" && "el-anchor--underline",
    `el-anchor--${direction}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <AnchorContext.Provider value={contextValue}>
      <div ref={anchorRef} className={rootClassName} style={style}>
        {marker && (
          <div ref={markerRef} className="el-anchor__marker" style={markerStyle} />
        )}
        <div className="el-anchor__list">{children}</div>
      </div>
    </AnchorContext.Provider>
  );
});
