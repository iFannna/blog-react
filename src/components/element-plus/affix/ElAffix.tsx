"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { addUnit } from "../utils";

export type AffixPosition = "top" | "bottom";

export interface AffixScrollPayload {
  scrollTop: number;
  fixed: boolean;
}

export interface AffixProps {
  /** 偏移距离，px */
  offset?: number;
  /** 固定位置：顶部 / 底部 */
  position?: AffixPosition;
  /** 目标容器选择器，设置后 affix 始终被约束在容器范围内，超出范围即隐藏 */
  target?: string;
  /** 固定时的 z-index */
  zIndex?: number | string;
  /** 是否把 affix 元素传送到 `appendTo` 指定的位置 */
  teleported?: boolean;
  /** 传送目标，选择器或元素 */
  appendTo?: string | HTMLElement;
  /** fixed 状态变化时触发 */
  onChange?: (fixed: boolean) => void;
  /** 滚动时触发 */
  onScroll?: (payload: AffixScrollPayload) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export interface AffixExpose {
  /** 手动更新 affix 状态 */
  update: () => void;
  /** 重新测量 root 的尺寸信息 */
  updateRoot: () => void;
}

/** 滚动容器：window 或某个可滚动祖先 */
type ScrollContainer = Window | HTMLElement;

interface AffixLayout {
  height: number;
  width: number;
  left: number;
}

/** 对应官方 getStyle：优先取内联样式，否则取计算样式。 */
function getStyle(element: HTMLElement, name: string): string {
  const inline = element.style.getPropertyValue(name);
  if (inline) return inline;
  return window.getComputedStyle(element).getPropertyValue(name) || "";
}

function isScroll(element: HTMLElement, vertical: boolean): boolean {
  const overflow = getStyle(element, vertical ? "overflow-y" : "overflow-x");
  return ["scroll", "auto", "overlay"].some((value) => overflow.includes(value));
}

/**
 * 对应官方 getScrollContainer(el, true)：向上寻找第一个可滚动祖先，
 * 走到文档根还没找到就回落到 window（此时按文档滚动处理）。
 */
function getScrollContainer(element: HTMLElement): ScrollContainer {
  let parent: HTMLElement | null = element;
  while (parent) {
    if (parent === document.documentElement || parent === document.body) {
      return window;
    }
    if (isScroll(parent, true)) return parent;
    parent = parent.parentNode as HTMLElement | null;
  }
  return window;
}

/**
 * 对应官方 ElAffix。
 *
 * 固定定位靠三样东西协作：
 *   - root 常驻文档流，固定时内联一份同宽高的占位，避免内容跳动
 *   - 内层 div 在固定时加 .el-affix--fixed（position: fixed）并内联 top/bottom/z-index
 *   - target 模式下用 getBoundingClientRect 实时算 translateY，让元素贴着容器底/顶停住
 *
 * 与官方一致，测量用 getBoundingClientRect，并且只在 scroll / resize / root 尺寸变化
 * 时重测，而不是每帧；状态没变化时不触发重渲染。
 */
export const ElAffix = forwardRef<AffixExpose, AffixProps>(function ElAffix(
  {
    offset = 0,
    position = "top",
    target = "",
    zIndex = 100,
    teleported = false,
    appendTo = "body",
    onChange,
    onScroll,
    className,
    style,
    children,
  },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const scrollContainerRef = useRef<ScrollContainer | null>(null);
  // 固定状态同步写一份 ref：滚动回调里要立刻读到最新值，不能等 state 提交
  const fixedRef = useRef(false);
  // updateRoot 需要「先取消固定再看自然尺寸」，用这个标记跨 effect 传递意图
  const pendingMeasureRef = useRef(false);

  const [fixed, setFixed] = useState(false);
  const [transform, setTransform] = useState(0);
  const [layout, setLayout] = useState<AffixLayout>({
    height: 0,
    width: 0,
    left: 0,
  });

  // 回调与 props 走 ref，滚动订阅只注册一次，不因回调/props 变化反复解绑
  const handlersRef = useRef({ onChange, onScroll });
  const optionsRef = useRef({ offset, position, target, zIndex });

  useEffect(() => {
    handlersRef.current = { onChange, onScroll };
  });

  useEffect(() => {
    optionsRef.current = { offset, position, target, zIndex };
  });

  /** 测量一次并重算 fixed / transform / 占位尺寸；返回本次的滚动信息。 */
  const update = useCallback((): AffixScrollPayload | null => {
    const rootEl = rootRef.current;
    const scrollContainer = scrollContainerRef.current;
    if (!rootEl || !scrollContainer) return null;

    const {
      offset: currentOffset,
      position: currentPosition,
      target: currentTarget,
    } = optionsRef.current;

    const scrollTop =
      scrollContainer instanceof Window
        ? document.documentElement.scrollTop
        : scrollContainer.scrollTop || 0;

    const rect = rootEl.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const rootHeightOffset = currentOffset + rect.height;
    const targetEl = targetRef.current;

    let nextFixed: boolean;
    let nextTransform = 0;

    if (currentPosition === "top") {
      if (currentTarget && targetEl) {
        // 容器底边越过时，用负 translateY 把元素顶回容器内部，直到完全隐藏
        const targetRect = targetEl.getBoundingClientRect();
        const difference = targetRect.bottom - rootHeightOffset;
        nextFixed = currentOffset > rect.top && targetRect.bottom > 0;
        nextTransform = difference < 0 ? difference : 0;
      } else {
        nextFixed = currentOffset > rect.top;
      }
    } else if (currentTarget && targetEl) {
      const targetRect = targetEl.getBoundingClientRect();
      const difference = windowHeight - targetRect.top - rootHeightOffset;
      nextFixed =
        windowHeight - currentOffset < rect.bottom &&
        windowHeight > targetRect.top;
      nextTransform = difference < 0 ? -difference : 0;
    } else {
      nextFixed = windowHeight - currentOffset < rect.bottom;
    }

    // 值没变时返回 prev，避免每次滚动都白渲染一次
    setLayout((prev) =>
      prev.height === rect.height &&
      prev.width === rect.width &&
      prev.left === rect.left
        ? prev
        : { height: rect.height, width: rect.width, left: rect.left },
    );
    setTransform(nextTransform);
    setFixed(nextFixed);

    // 对应官方 watch(fixed)：只有真正翻转时才抛 change
    if (nextFixed !== fixedRef.current) {
      fixedRef.current = nextFixed;
      handlersRef.current.onChange?.(nextFixed);
    }

    return { scrollTop, fixed: nextFixed };
  }, []);

  const updateRoot = useCallback(() => {
    if (!fixedRef.current) {
      update();
      return;
    }
    // 对应官方 updateRootRect：固定中 root 的宽高被内联样式钉住，量不到自然尺寸，
    // 所以先取消固定，等这一帧提交后 root 恢复自然尺寸，下一次 effect 再重测。
    pendingMeasureRef.current = true;
    fixedRef.current = false;
    setFixed(false);
  }, [update]);

  useImperativeHandle(ref, () => ({ update, updateRoot }), [update, updateRoot]);

  // 被 updateRoot 取消固定后，待 root 恢复自然尺寸再重测，update 会重新判定 fixed
  useEffect(() => {
    if (!pendingMeasureRef.current) return;
    pendingMeasureRef.current = false;
    update();
  }, [fixed, update]);

  useEffect(() => {
    const rootEl = rootRef.current;
    if (!rootEl) return;

    const scrollContainer = getScrollContainer(rootEl);
    scrollContainerRef.current = scrollContainer;

    const handleScroll = () => {
      const payload = update();
      // 对应官方 handleScroll：只有滚动才抛 scroll 事件
      if (payload) handlersRef.current.onScroll?.(payload);
    };
    const handleResize = () => update();

    if (scrollContainer instanceof Window) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    } else {
      scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    }
    window.addEventListener("resize", handleResize);
    // 未固定时 root 尺寸随内容变化（换行、文案变化）需要在这里感知
    const observer = new ResizeObserver(handleResize);
    observer.observe(rootEl);

    return () => {
      if (scrollContainer instanceof Window) {
        window.removeEventListener("scroll", handleScroll);
      } else {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [update]);

  // target / offset / position 变化时重新解析目标并立即重算；首次挂载也走这里
  useEffect(() => {
    if (target) {
      const found = document.querySelector<HTMLElement>(target);
      if (!found) {
        // 与官方 throwError 一致：目标不存在直接报错，避免静默不生效
        throw new Error(`[ElAffix] Target does not exist: ${target}`);
      }
      targetRef.current = found;
    } else {
      targetRef.current = document.documentElement;
    }
    update();
  }, [target, offset, position, update]);

  const teleportDisabled = !teleported || !fixed;

  const rootStyle: CSSProperties = {
    display: "flow-root",
    ...(fixed ? { height: `${layout.height}px`, width: `${layout.width}px` } : {}),
    ...style,
  };

  const affixStyle: CSSProperties = fixed
    ? {
        height: `${layout.height}px`,
        width: `${layout.width}px`,
        ...(position === "top" ? { top: addUnit(offset) } : {}),
        ...(position === "bottom" ? { bottom: addUnit(offset) } : {}),
        // 传送出去后元素脱离 root，left 必须由测量值补上；未传送时沿用静态位置即可
        ...(teleported ? { left: `${layout.left}px` } : {}),
        ...(transform ? { transform: `translateY(${transform}px)` } : {}),
        zIndex,
      }
    : {};

  const inner = (
    <div className={fixed ? "el-affix--fixed" : undefined} style={affixStyle}>
      {children}
    </div>
  );

  let content = inner;
  if (!teleportDisabled) {
    const container =
      typeof appendTo === "string"
        ? document.querySelector<HTMLElement>(appendTo) ?? document.body
        : appendTo;
    content = createPortal(inner, container);
  }

  return (
    <div
      ref={rootRef}
      className={["el-affix", className].filter(Boolean).join(" ")}
      style={rootStyle}
    >
      {content}
    </div>
  );
});
