"use client";

import {
  useEffect,
  useState,
  useMemo,
  useRef,
  useSyncExternalStore,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { usePopper, type PopperCoreConfig, type PopperEffect } from "./use-popper";
import { useZIndex } from "./use-z-index";
import { resolveAppendTo } from "./popper-container";

export interface PopperContentProps extends PopperCoreConfig {
  /** 触发元素 */
  referenceEl?: HTMLElement | null;
  /** 主题 */
  effect?: PopperEffect;
  /** 是否无样式，仅定位 */
  pure?: boolean;
  /** 自定义类名 */
  popperClass?: string;
  /** 自定义样式 */
  popperStyle?: CSSProperties;
  /** 指定 z-index */
  zIndex?: number;
  /** 是否可见。不可见且 persistent=false 时返回 null */
  visible?: boolean;
  /** 是否挂载到 body（或 appendTo），对应官方 teleported */
  teleported?: boolean;
  /** 挂载目标，对应官方 appendTo */
  appendTo?: string | HTMLElement;
  /** 不可见时是否保留 DOM，对应官方 persistent */
  persistent?: boolean;
  /** 层级角色，影响 aria 属性 */
  role?: string;
  /** 浮层的 aria-label */
  ariaLabel?: string;
  /** 浮层的 aria-hidden */
  ariaHidden?: boolean;
  onMouseEnter?: (event: ReactMouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: ReactMouseEvent<HTMLDivElement>) => void;
  /** 是否将层级提升到最前 */
  focusOnShow?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** 浮层根节点的 ref，供使用方判断点击是否落在内容内 */
  contentRef?: Ref<HTMLDivElement>;
  /** 额外的浮层根节点 ref，Tooltip 需要同时持有内部与使用方两份 */
  extraContentRef?: Ref<HTMLDivElement>;
  /** 布局变化后重算定位。Slider 拖拽时滑块定位靠 CSS 过渡，popper 需要手动跟随。
   *  参数为 null 表示浮层已销毁或不可用 */
  onUpdate?: (update: (() => void) | null) => void;
}

/** SSR 下 mounted 恒为 false，客户端首帧后切换，避免 portal 造成 hydration 不一致。 */
const emptySubscribe = () => () => {};

/** 同时支持回调 ref 与对象 ref；独立函数避免在组件内直接改写 props。 */
function assignRef<T>(ref: Ref<T>, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

/**
 * 对应官方 ElPopperContent。
 *
 * 关键点：popper 的 applyStyles 修饰符被关闭（见 use-popper.ts），
 * 定位结果由本组件通过 inline style 写入，这样能与 React 的渲染合流。
 * data-popper-placement 属性来自 popper 的 state.attributes，
 * scss 靠它决定箭头方向，必须写上去。
 */
export function ElPopperContent({
  referenceEl,
  effect = "dark",
  pure = false,
  popperClass,
  popperStyle,
  zIndex: zIndexProp,
  visible = true,
  teleported = false,
  appendTo,
  persistent = false,
  role = "tooltip",
  ariaLabel,
  ariaHidden,
  onMouseEnter,
  onMouseLeave,
  className,
  style,
  children,
  contentRef: externalRef,
  extraContentRef,
  onUpdate,
  ...coreConfig
}: PopperContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  /**
   * SSR 阶段没有 document，createPortal 必须等客户端挂载后再执行，
   * 否则会与首屏 HTML 不一致并触发 hydration 警告。
   */
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  /**
   * ref 在首次渲染时是 null，usePopper 拿不到浮层元素。
   * 用一个 state 在挂载后触发一次重渲染，把真实元素交给 usePopper。
   */
  const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null);

  const { currentZIndex } = useZIndex(zIndexProp);

  // 对应官方 contentZIndex：传入 zIndex 就用它，否则取全局递增值
  const resolvedZIndex = zIndexProp ?? currentZIndex;

  const { styles, attributes, update } = usePopper({
    ...coreConfig,
    reference: referenceEl ?? null,
    popper: contentEl,
  });

  /**
   * update 每次渲染都是新函数，直接作为依赖会反复触发注册。
   * 用 ref 取最新值，注册回调只在浮层元素就绪/销毁时通知一次。
   */
  const updateRef = useRef(update);

  useEffect(() => {
    updateRef.current = update;
  }, [update]);

  // 官方 expose 了 updatePopper 供使用方在内容/位置变化后手动刷新，
  // Slider 拖拽期间即依赖它让 tooltip 跟住滑块
  useEffect(() => {
    if (!onUpdate) return;
    onUpdate(contentEl ? () => updateRef.current() : null);
    return () => onUpdate(null);
  }, [onUpdate, contentEl]);

  // 把节点同步给使用方的 ref，放在 effect 里避免渲染期修改 props
  useEffect(() => {
    if (!externalRef) return;

    assignRef(externalRef, contentEl);

    return () => assignRef(externalRef, null);
  }, [externalRef, contentEl]);

  useEffect(() => {
    if (!extraContentRef) return;

    assignRef(extraContentRef, contentEl);

    return () => assignRef(extraContentRef, null);
  }, [extraContentRef, contentEl]);

  const classes = useMemo(
    () =>
      [
        "el-popper",
        pure && "is-pure",
        `is-${effect}`,
        popperClass,
        className,
      ]
        .filter(Boolean)
        .join(" "),
    [pure, effect, popperClass, className],
  );

  // 官方 contentStyle 的顺序：zIndex → popper 定位 → 用户样式
  const mergedStyle = {
    zIndex: resolvedZIndex,
    ...(styles.popper as CSSProperties),
    ...popperStyle,
    ...style,
    // 对应官方 v-show：persistent 保留 DOM 时用 display:none 隐藏
    ...(!visible ? { display: "none" } : {}),
  } as CSSProperties;

  // popper 计算的 attributes 含 data-popper-placement，箭头依赖它
  const popperAttributes = attributes.popper ?? {};

  if (!visible && !persistent) return null;
  // teleported 时首屏不渲染，等客户端挂载后再 portal
  if (teleported && !mounted) return null;

  const content = (
    <div
      ref={(node) => {
        contentRef.current = node;
        setContentEl(node);
      }}
      className={classes}
      style={mergedStyle}
      tabIndex={-1}
      role={role}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...popperAttributes}
    >
      {children}
    </div>
  );

  if (!teleported) return content;

  const target = resolveAppendTo(appendTo);
  return target ? createPortal(content, target) : content;
}
