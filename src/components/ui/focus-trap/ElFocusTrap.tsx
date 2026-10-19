"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import {
  focusFirstDescendant,
  focusableStack,
  getEdges,
  obtainAllFocusableElements,
  tryFocus,
  useFocusReason,
  type FocusLayer,
} from "./utils";

export interface FocusTrapProps {
  /** 是否启用焦点陷阱 */
  trapped?: boolean;
  /** Tab 到边界时是否循环回到另一端 */
  loop?: boolean;
  /** 陷阱容器。不传时用自身包裹的 div */
  focusTrapEl?: HTMLElement | null;
  /**
   * 陷阱激活时焦点落到哪里。
   * 'first' 表示第一个可聚焦元素，'container' 表示容器本身，
   * 也可传具体元素。
   */
  focusStartEl?: "first" | "container" | HTMLElement;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

/**
 * 对应官方 ElFocusTrap。
 *
 * 职责有三：
 * 1. Tab / Shift+Tab 在容器内循环（loop 开启时）
 * 2. 焦点被外部抢走时拉回来（trapped）
 * 3. 释放时把焦点还给进入前的元素
 *
 * 多层浮层共存时用 focusableStack 协调：新层入栈暂停旧层，
 * 旧层不会再抢焦点，避免叠加弹窗互相打架。
 */
export function ElFocusTrap({
  trapped = false,
  loop = false,
  focusTrapEl,
  focusStartEl = "first",
  className,
  style,
  children,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastFocusBeforeTrappedRef = useRef<HTMLElement | null>(null);
  const lastFocusAfterTrappedRef = useRef<HTMLElement | null>(null);
  const pausedRef = useRef(false);

  const focusReasonApi = useFocusReason();

  const getContainer = useCallback(
    () => focusTrapEl ?? containerRef.current,
    [focusTrapEl],
  );

  // 注册全局的焦点来源监听（mousedown / keydown）
  useEffect(() => {
    focusReasonApi.mount();
    return () => focusReasonApi.unmount();
  }, [focusReasonApi]);

  /**
   * Tab 键处理，与官方 onKeydown 一致：
   * 只有「容器内无可聚焦元素时按 Tab」或「在末端继续 Tab（loop 时绕回）」才干预。
   */
  const handleKeydown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!loop && !trapped) return;
      if (pausedRef.current) return;

      const { altKey, ctrlKey, metaKey, shiftKey } = event;
      if (event.key !== "Tab" || altKey || ctrlKey || metaKey) return;

      const container = focusTrapEl ?? containerRef.current;
      const currentFocusingEl = document.activeElement;
      if (!container || !currentFocusingEl) return;

      const [first, last] = getEdges(container);

      if (!first || !last) {
        // 容器内没有可聚焦元素：阻止焦点跑出去
        if (currentFocusingEl === container) event.preventDefault();
        return;
      }

      if (!shiftKey && currentFocusingEl === last) {
        event.preventDefault();
        if (loop) tryFocus(first, true);
      } else if (shiftKey && (currentFocusingEl === first || currentFocusingEl === container)) {
        event.preventDefault();
        if (loop) tryFocus(last, true);
      }
    },
    [loop, trapped, focusTrapEl],
  );

  /** 焦点跑出容器时拉回来 */
  const handleFocusIn = useCallback(
    (event: React.FocusEvent) => {
      const container = getContainer();
      if (!container) return;

      const target = event.target as HTMLElement | null;
      const relatedTarget = event.relatedTarget as HTMLElement | null;
      const isFocusedInTrap = target && container.contains(target);

      if (!trapped) {
        const isPrevFocusedInTrap =
          relatedTarget && container.contains(relatedTarget);
        if (!isPrevFocusedInTrap) lastFocusBeforeTrappedRef.current = relatedTarget;
      }

      if (pausedRef.current) return;

      if (trapped) {
        if (isFocusedInTrap) {
          lastFocusAfterTrappedRef.current = target;
        } else {
          tryFocus(lastFocusAfterTrappedRef.current, true);
        }
      }
    },
    [trapped, getContainer],
  );

  const handleFocusOut = useCallback(
    (event: React.FocusEvent) => {
      const container = getContainer();
      if (pausedRef.current || !container) return;

      if (!trapped) return;

      const relatedTarget = event.relatedTarget as HTMLElement | null;
      if (relatedTarget && !container.contains(relatedTarget)) {
        // 延后一拍：嵌套浮层可能接管焦点，先让它入栈暂停本层
        setTimeout(() => {
          if (!pausedRef.current && trapped) {
            tryFocus(lastFocusAfterTrappedRef.current, true);
          }
        }, 0);
      }
    },
    [trapped, getContainer],
  );

  /** 对应官方 startTrap */
  useEffect(() => {
    if (!trapped) return;

    const container = getContainer();
    if (!container) return;

    const layer: FocusLayer = {
      paused: false,
      pause() {
        layer.paused = true;
        pausedRef.current = true;
      },
      resume() {
        layer.paused = false;
        pausedRef.current = false;
      },
    };

    focusableStack.push(layer);

    const prevFocusedElement = container.contains(document.activeElement)
      ? lastFocusBeforeTrappedRef.current
      : document.activeElement;

    lastFocusBeforeTrappedRef.current = prevFocusedElement as HTMLElement | null;

    // 焦点本来就不在容器内，才需要主动拉进来
    if (!container.contains(prevFocusedElement)) {
      requestAnimationFrame(() => {
        let start = focusStartEl;

        if (typeof start !== "string") {
          tryFocus(start);
          if (document.activeElement !== start) start = "first";
        }

        if (start === "first") {
          focusFirstDescendant(obtainAllFocusableElements(container), true);
        }

        if (
          document.activeElement === prevFocusedElement ||
          start === "container"
        ) {
          tryFocus(container);
        }
      });
    }

    return () => {
      /**
       * 对应官方 stopTrap 的归还条件：
       * 键盘释放、或焦点本就不由用户操作引起、或焦点仍在容器内时，
       * 才把焦点还给进入前的元素，否则不抢用户当前的焦点。
       */
      const shouldRestore =
        focusReasonApi.focusReason.current === "keyboard" ||
        !focusReasonApi.isFocusCausedByUserEvent() ||
        container.contains(document.activeElement);

      if (shouldRestore) {
        tryFocus(lastFocusBeforeTrappedRef.current ?? document.body);
      }

      focusableStack.remove(layer);
      lastFocusBeforeTrappedRef.current = null;
      lastFocusAfterTrappedRef.current = null;
    };
    // focusStartEl 变化不应重跑陷阱，忽略其依赖
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trapped, focusTrapEl, getContainer, focusReasonApi]);

  // ESC 交给使用方处理（Dialog 用它关闭），这里只暴露键盘事件
  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
      onKeyDown={handleKeydown}
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
    >
      {children}
    </div>
  );
}
