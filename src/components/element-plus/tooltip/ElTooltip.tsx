"use client";

import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { ElPopperContent } from "../popper/ElPopperContent";
import { ElPopperArrow } from "../popper/ElPopperArrow";
import type {
  PopperCoreConfig,
  PopperPlacement,
  PopperEffect,
} from "../popper/use-popper";

/** 同时支持回调 ref 与对象 ref。 */
function assignRef<T>(ref: Ref<T>, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as MutableRefObject<T | null>).current = value;
}

export type TooltipTrigger = "hover" | "click" | "focus" | "contextmenu";

/**
 * 虚拟触发元素。官方只要求实现 getBoundingClientRect，
 * 因此既可以是真实 DOM，也可以是跟随鼠标的普通对象。
 */
export type TooltipVirtualRef =
  | HTMLElement
  | { getBoundingClientRect: () => DOMRect | DOMRectReadOnly };

/** 对应官方 tooltip expose。 */
export interface TooltipExpose {
  /** 按 showAfter 延迟打开 */
  onOpen: () => void;
  /** 按 hideAfter 延迟关闭；传 0 立即关闭，对应官方 onClose(event, 0) */
  onClose: (delay?: number) => void;
  /** 立即打开 */
  show: () => void;
  /** 立即关闭 */
  hide: () => void;
  /** 切换显隐 */
  toggle: () => void;
  /** 重新计算浮层位置，虚拟触发时可主动调用 */
  updatePopper: () => void;
  /** 浮层根节点 */
  popperRef: HTMLDivElement | null;
}

export interface TooltipProps {
  /** 提示内容 */
  content?: ReactNode;
  /** 弹出位置 */
  placement?: PopperPlacement;
  /** 主题 */
  effect?: PopperEffect;
  /** 触发方式。数组时任一满足即触发 */
  trigger?: TooltipTrigger | TooltipTrigger[];
  /** 键盘触发键，对应官方 triggerKeys */
  triggerKeys?: string[];
  /** 是否禁用（禁用时不弹出） */
  disabled?: boolean;
  /** 是否受控显示。传入即以它为准，配合 onVisibleChange */
  visible?: boolean;
  /** 受控模式下的显隐变化 */
  onVisibleChange?: (visible: boolean) => void;
  /** 显示延迟（毫秒） */
  showAfter?: number;
  /** 隐藏延迟（毫秒） */
  hideAfter?: number;
  /** 自动关闭延迟（毫秒），0 表示不自动关 */
  autoClose?: number;
  /** 是否显示箭头 */
  showArrow?: boolean;
  /** 与触发元素的距离 */
  offset?: number;
  /** 翻转时的兜底方位列表，透传给 popper 的 flip 修饰符 */
  fallbackPlacements?: PopperPlacement[];
  /** popper.js 的原始配置 */
  popperOptions?: PopperCoreConfig["popperOptions"];
  /** 提示内容的自定义类名 */
  popperClass?: string;
  /** 提示内容的样式 */
  popperStyle?: CSSProperties;
  /** 是否可通过鼠标进入提示内容 */
  enterable?: boolean;
  /** 内容是否作为 HTML 字符串渲染 */
  rawContent?: boolean;
  /** 是否挂载到 appendTo（默认全局 popper 容器） */
  teleported?: boolean;
  /** 挂载目标选择器或元素 */
  appendTo?: string | HTMLElement;
  /** 不可见时是否保留 DOM */
  persistent?: boolean;
  /** 动画名，默认 el-fade-in-linear */
  transition?: string;
  /** 浮层的 aria-label */
  ariaLabel?: string;
  /** 层级 */
  zIndex?: number;
  /** 是否无样式，仅定位 */
  pure?: boolean;
  /** 浮层的 role，影响 aria 属性与可访问性语义 */
  role?: string;
  /** 虚拟触发。开启后不向 children 绑定触发事件 */
  virtualTriggering?: boolean;
  /** 虚拟触发参照物 */
  virtualRef?: TooltipVirtualRef | null;
  /** 布局变化后重算定位 */
  onUpdate?: (update: (() => void) | null) => void;
  /** 浮层内容根节点，对应官方 contentRef */
  contentRef?: Ref<HTMLDivElement>;
  /** 触发元素节点，避免覆盖子元素自身的 ref */
  triggerRef?: Ref<HTMLElement>;
  className?: string;
  children?: ReactElement;
}

type TransitionPhase =
  | "enter-from"
  | "enter"
  | "leave-from"
  | "leave"
  | null;

/** 读取元素当前 transition 的最长 duration + delay，单位毫秒。 */
function getTransitionDurationMs(el: HTMLElement | null) {
  if (!el) return 0;

  const style = getComputedStyle(el);
  const toMs = (value: string) => {
    const num = parseFloat(value);
    if (Number.isNaN(num)) return 0;
    return value.trim().endsWith("ms") ? num : num * 1000;
  };

  const durations = style.transitionDuration.split(",");
  const delays = style.transitionDelay.split(",");

  return durations.reduce((max, duration, index) => {
    const delay = delays[index % delays.length] ?? "0s";
    return Math.max(max, toMs(duration) + toMs(delay));
  }, 0);
}

/**
 * 对应官方 ElTooltip。
 *
 * 显隐逻辑：受控（传了 visible）时完全由外部决定；非受控时按 trigger 处理。
 * 浮层生命周期做了三件官方同款的事：
 * - 打开时先挂载、再加 enter-from，下一帧移除以触发过渡
 * - 关闭时先播 leave-to，过渡结束才卸载（persistent 则始终保留 DOM）
 * - 虚拟触发时把参照物直接交给 popper，不要求真实子元素
 */
/**
 * 与官方 mergeProps 一致：子元素自带的同名事件先执行，再执行触发器事件。
 * React 的 cloneElement 会直接覆盖同名 prop，受控 demo 里子元素自己的
 * onMouseEnter 正因此被吞掉，必须手动合并。
 */
function mergeTriggerProps(
  child: ReactElement,
  triggerProps: Record<string, unknown>,
): Record<string, unknown> {
  const childProps = child.props as Record<string, unknown>;
  const merged = { ...triggerProps };

  for (const key of Object.keys(triggerProps)) {
    const triggerHandler = triggerProps[key];
    const childHandler = childProps[key];
    if (
      key.startsWith("on") &&
      typeof triggerHandler === "function" &&
      typeof childHandler === "function"
    ) {
      merged[key] = (...args: unknown[]) => {
        (childHandler as (...args: unknown[]) => void)(...args);
        (triggerHandler as (...args: unknown[]) => void)(...args);
      };
    }
  }

  return merged;
}

export const ElTooltip = forwardRef<TooltipExpose, TooltipProps>(
  function ElTooltip(
    {
      content,
      placement = "bottom",
      effect = "dark",
      trigger = "hover",
      triggerKeys = ["Enter", "NumpadEnter", " "],
      disabled = false,
      visible: controlledVisible,
      onVisibleChange,
      showAfter = 0,
      hideAfter = 200,
      autoClose = 0,
      showArrow = true,
      offset = 12,
      fallbackPlacements,
      popperOptions,
      popperClass,
      popperStyle,
      enterable = true,
      rawContent = false,
      teleported = true,
      appendTo,
      persistent = false,
      transition = "el-fade-in-linear",
      ariaLabel,
      zIndex,
      pure = false,
      role = "tooltip",
      virtualTriggering = false,
      virtualRef,
      onUpdate,
      className,
      contentRef: externalContentRef,
      triggerRef: externalTriggerRef,
      children,
    },
    ref,
  ) {
    const [uncontrolledVisible, setUncontrolledVisible] = useState(false);
    const isControlled = controlledVisible !== undefined;
    const visible = isControlled ? controlledVisible : uncontrolledVisible;

    const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);
    // 指向浮层根节点，用于判断点击是否落在提示内容内
    const popperRef = useRef<HTMLDivElement | null>(null);
    const updateRef = useRef<(() => void) | null>(null);

    // 浮层挂载与过渡阶段。persistent 时挂载后不再卸载
    const mountedRef = useRef(false);
    const [mounted, setMounted] = useState(false);
    const [phase, setPhase] = useState<TransitionPhase>(null);

    // 两个定时器分开管理：显示延时与隐藏延时互不干扰
    const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const wasDisabledRef = useRef(disabled);

    const contentId = useId();

    // 外部（如 Cascader）需要触发元素做 clickoutside 与尺寸测量
    useEffect(() => {
      if (!externalTriggerRef) return;

      assignRef(externalTriggerRef, triggerEl);

      return () => assignRef(externalTriggerRef, null);
    }, [externalTriggerRef, triggerEl]);

    const triggers = useMemo(
      () => (Array.isArray(trigger) ? trigger : [trigger]),
      [trigger],
    );

    const clearTimers = useCallback(() => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
      showTimerRef.current = null;
      hideTimerRef.current = null;
      autoCloseTimerRef.current = null;
    }, []);

    const setVisible = useCallback(
      (next: boolean) => {
        if (!isControlled) setUncontrolledVisible(next);
        onVisibleChange?.(next);
      },
      [isControlled, onVisibleChange],
    );

    const open = useCallback(() => {
      if (disabled) return;
      clearTimers();

      showTimerRef.current = setTimeout(
        () => {
          setVisible(true);

          // 对应官方 autoClose：弹出后经过 N 毫秒自动关闭
          if (autoClose > 0) {
            autoCloseTimerRef.current = setTimeout(
              () => setVisible(false),
              autoClose,
            );
          }
        },
        // 受控模式忽略延迟，与官方一致
        isControlled ? 0 : showAfter,
      );
    }, [disabled, clearTimers, setVisible, autoClose, isControlled, showAfter]);

    const close = useCallback(
      (immediate = false) => {
        clearTimers();

        hideTimerRef.current = setTimeout(
          () => setVisible(false),
          immediate || isControlled ? 0 : hideAfter,
        );
      },
      [clearTimers, setVisible, isControlled, hideAfter],
    );

    const showImmediately = useCallback(() => {
      if (disabled) return;
      clearTimers();
      setVisible(true);
    }, [disabled, clearTimers, setVisible]);

    const hideImmediately = useCallback(() => {
      clearTimers();
      setVisible(false);
    }, [clearTimers, setVisible]);

    const toggle = useCallback(() => {
      if (visible) hideImmediately();
      else showImmediately();
    }, [visible, hideImmediately, showImmediately]);

    useImperativeHandle(
      ref,
      () => ({
        onOpen: open,
        onClose: (delay) => close(delay === 0),
        show: showImmediately,
        hide: hideImmediately,
        toggle,
        updatePopper: () => updateRef.current?.(),
        get popperRef() {
          return popperRef.current;
        },
      }),
      [open, close, showImmediately, hideImmediately, toggle],
    );

    // 卸载时清掉所有定时器
    useEffect(() => clearTimers, [clearTimers]);

    // 对应官方 watch(disabled)：切换到禁用时立即关闭，重新启用不会自动弹出
    useEffect(() => {
      if (disabled && !wasDisabledRef.current && visible) {
        clearTimers();
        setVisible(false);
      }
      wasDisabledRef.current = disabled;
    }, [disabled, visible, clearTimers, setVisible]);

    /**
     * 浮层过渡。与 Vue Transition 的类名时序一致：
     * enter-from → enter；leave-from → leave。
     * 关闭时保持挂载，等离场过渡结束后再卸载。
     */
    useEffect(() => {
      if (visible) {
        if (!mountedRef.current) {
          mountedRef.current = true;
          setMounted(true);
        }
        setPhase("enter-from");
        let frame = 0;
        const raf = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => setPhase("enter"));
        });
        return () => {
          cancelAnimationFrame(raf);
          if (frame) cancelAnimationFrame(frame);
        };
      }

      if (!mountedRef.current) return;

      if (persistent) {
        setPhase(null);
        return;
      }

      setPhase("leave-from");
      let frame = 0;
      const raf = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setPhase("leave"));
      });
      return () => {
        cancelAnimationFrame(raf);
        if (frame) cancelAnimationFrame(frame);
      };
    }, [visible, persistent]);

    // 过渡时长交给 CSS 决定，兼容自定义 transition 的任意时长
    useEffect(() => {
      if (phase !== "enter" && phase !== "leave") return;

      const timer = setTimeout(() => {
        if (phase === "leave") {
          mountedRef.current = false;
          setMounted(false);
          setPhase(null);
        } else {
          setPhase(null);
        }
      }, getTransitionDurationMs(popperRef.current));

      return () => clearTimeout(timer);
    }, [phase]);

    // 服务端渲染时没有 HTMLElement，构造函数本身也要先判存在
    const virtualElement =
      typeof HTMLElement !== "undefined" && virtualRef instanceof HTMLElement
        ? virtualRef
        : null;
    const referenceEl = virtualTriggering
      ? (virtualRef as HTMLElement | null | undefined) ?? null
      : triggerEl;

    // 虚拟触发时 popper 的参照物不在 children 里，点击外部判定要额外兼顾它
    useEffect(() => {
      if (!visible) return;
      if (!triggers.includes("click") && !triggers.includes("contextmenu")) return;

      const onDocClick = (event: MouseEvent) => {
        const target = event.target as Node;
        if (triggerEl?.contains(target)) return;
        if (virtualElement?.contains(target)) return;
        // 内容可进入时，点在内容里也不关
        if (enterable && popperRef.current?.contains(target)) return;
        close();
      };

      document.addEventListener("click", onDocClick);
      return () => document.removeEventListener("click", onDocClick);
    }, [visible, triggers, enterable, close, triggerEl, virtualElement]);

    // 虚拟触发元素不是 React 节点，只能在 DOM 上挂监听
    useEffect(() => {
      if (!virtualTriggering || isControlled || disabled || !virtualElement) {
        return;
      }

      const onEnter = () => open();
      const onLeave = () => close();
      const onClick = (event: MouseEvent) => {
        if (event.button !== 0) return;
        if (visible) close();
        else open();
      };
      const onFocus = () => open();
      const onBlur = () => close();
      const onContextMenu = (event: MouseEvent) => {
        event.preventDefault();
        if (visible) close();
        else open();
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (!triggerKeys.includes(event.key)) return;
        event.preventDefault();
        if (visible) close();
        else open();
      };

      if (triggers.includes("hover")) {
        virtualElement.addEventListener("mouseenter", onEnter);
        virtualElement.addEventListener("mouseleave", onLeave);
      }
      if (triggers.includes("click")) {
        virtualElement.addEventListener("click", onClick);
      }
      if (triggers.includes("focus")) {
        virtualElement.addEventListener("focus", onFocus);
        virtualElement.addEventListener("blur", onBlur);
      }
      if (triggers.includes("contextmenu")) {
        virtualElement.addEventListener("contextmenu", onContextMenu);
      }
      virtualElement.addEventListener("keydown", onKeyDown);

      return () => {
        virtualElement.removeEventListener("mouseenter", onEnter);
        virtualElement.removeEventListener("mouseleave", onLeave);
        virtualElement.removeEventListener("click", onClick);
        virtualElement.removeEventListener("focus", onFocus);
        virtualElement.removeEventListener("blur", onBlur);
        virtualElement.removeEventListener("contextmenu", onContextMenu);
        virtualElement.removeEventListener("keydown", onKeyDown);
      };
    }, [
      virtualTriggering,
      isControlled,
      disabled,
      virtualElement,
      triggers,
      triggerKeys,
      visible,
      open,
      close,
    ]);

    // 虚拟参照物变化（例如单例 tooltip 跟随鼠标/按钮）时重算位置
    useEffect(() => {
      if (!virtualTriggering) return;
      updateRef.current?.();
    }, [virtualTriggering, virtualRef]);

    // 把触发事件挂到子元素上，对应官方 ElTooltipTrigger
    const triggerProps: Record<string, unknown> = {};

    if (triggers.includes("hover")) {
      triggerProps.onMouseEnter = open;
      triggerProps.onMouseLeave = () => close();
    }
    if (triggers.includes("focus")) {
      triggerProps.onFocus = open;
      triggerProps.onBlur = () => close();
    }
    if (triggers.includes("click")) {
      triggerProps.onClick = () => {
        if (visible) close();
        else open();
      };
    }
    if (triggers.includes("contextmenu")) {
      triggerProps.onContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        if (visible) close();
        else open();
      };
    }
    triggerProps.onKeyDown = (event: React.KeyboardEvent) => {
      if (!triggerKeys.includes(event.key)) return;
      event.preventDefault();
      if (visible) close();
      else open();
    };

    // 对应官方 popper trigger 的 aria：tooltip 用 describedby，其它 role 用 popup 语义
    if (role === "tooltip") {
      if (visible) triggerProps["aria-describedby"] = contentId;
    } else {
      triggerProps["aria-haspopup"] = role;
      triggerProps["aria-expanded"] = visible;
      if (visible) triggerProps["aria-controls"] = contentId;
    }

    const child =
      isValidElement(children) && !virtualTriggering
        ? cloneElement(children as ReactElement<Record<string, unknown>>, {
            ...mergeTriggerProps(children, triggerProps),
            ref: (node: HTMLElement | null) => setTriggerEl(node),
          })
        : children;

    const hasContent = content !== undefined && content !== null && content !== "";

    // hover 触发时，鼠标移入内容要撤销触发器的离开定时器，否则 enterable 会失效
    const handleContentEnter = () => {
      if (!enterable || !triggers.includes("hover")) return;
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
      setVisible(true);
    };

    const handleContentLeave = () => {
      if (!triggers.includes("hover")) return;
      close();
    };

    const handleUpdate = useCallback(
      (update: (() => void) | null) => {
        updateRef.current = update;
        onUpdate?.(update);
      },
      [onUpdate],
    );

    const phaseClasses = [
      phase === "enter-from" &&
        `${transition}-enter-active ${transition}-enter-from`,
      phase === "enter" && `${transition}-enter-active ${transition}-enter-to`,
      phase === "leave-from" &&
        `${transition}-leave-active ${transition}-leave-from`,
      phase === "leave" &&
        `${transition}-leave-active ${transition}-leave-to`,
    ]
      .filter(Boolean)
      .join(" ");

    // 离场期间依然需要显示浮层，等过渡结束再由 mounted 卸载
    const contentVisible =
      visible || phase === "leave-from" || phase === "leave";

    return (
      <>
        {child}

        {hasContent && mounted && (
          <ElPopperContent
            referenceEl={referenceEl}
            placement={placement}
            effect={effect}
            offset={offset}
            fallbackPlacements={fallbackPlacements}
            popperOptions={popperOptions}
            popperClass={popperClass}
            popperStyle={popperStyle}
            zIndex={zIndex}
            role={role}
            pure={pure}
            className={[className, phaseClasses].filter(Boolean).join(" ")}
            teleported={teleported}
            appendTo={appendTo}
            persistent={persistent}
            visible={contentVisible || (mounted && !persistent)}
            ariaLabel={ariaLabel}
            ariaHidden={!visible}
            onMouseEnter={handleContentEnter}
            onMouseLeave={handleContentLeave}
            contentRef={popperRef}
            extraContentRef={externalContentRef}
            onUpdate={handleUpdate}
          >
            <div id={contentId}>
              {rawContent ? (
                <span dangerouslySetInnerHTML={{ __html: String(content) }} />
              ) : (
                content
              )}
            </div>
            {showArrow && <ElPopperArrow style={{ position: "absolute" }} />}
          </ElPopperContent>
        )}
      </>
    );
  },
);
