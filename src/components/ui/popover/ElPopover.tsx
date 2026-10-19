"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { ElTooltip } from "../tooltip/ElTooltip";
import type {
  TooltipExpose,
  TooltipTrigger,
  TooltipVirtualRef,
} from "../tooltip/ElTooltip";
import type { PopperEffect, PopperPlacement } from "../popper/use-popper";
import { addUnit } from "../utils";

export interface PopoverExpose {
  /** 立即隐藏，对应官方 hide() */
  hide: () => void;
  /** 立即显示 */
  show: () => void;
}

export interface PopoverProps {
  /** 标题 */
  title?: ReactNode;
  /** 内容 */
  content?: ReactNode;
  /** 宽度，默认 150 */
  width?: string | number;
  /** 弹出位置 */
  placement?: PopperPlacement;
  /** 主题，默认 light */
  effect?: PopperEffect;
  /** 触发方式，默认 click */
  trigger?: TooltipTrigger | TooltipTrigger[];
  /** 键盘触发键 */
  triggerKeys?: string[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 受控显示 */
  visible?: boolean;
  /** 显隐变化 */
  onVisibleChange?: (visible: boolean) => void;
  /** 显示延迟 */
  showAfter?: number;
  /** 隐藏延迟 */
  hideAfter?: number;
  /** 自定义 popper 类名 */
  popperClass?: string;
  /** 自定义 popper 样式 */
  popperStyle?: CSSProperties;
  /** 是否显示箭头 */
  showArrow?: boolean;
  /** 与触发元素的距离 */
  offset?: number;
  /** 是否可通过鼠标进入 */
  enterable?: boolean;
  /** 是否挂载到 appendTo */
  teleported?: boolean;
  /** 挂载目标 */
  appendTo?: string | HTMLElement;
  /** 不可见时是否保留 DOM，默认 true */
  persistent?: boolean;
  /** 动画名 */
  transition?: string;
  /** 虚拟触发 */
  virtualTriggering?: boolean;
  /** 虚拟触发参照物 */
  virtualRef?: TooltipVirtualRef | null;
  /** 层级 */
  zIndex?: number;
  /** 进入前触发，对应官方 before-enter */
  onBeforeEnter?: () => void;
  /** 进入后触发 */
  onAfterEnter?: () => void;
  /** 离开前触发 */
  onBeforeLeave?: () => void;
  /** 离开后触发 */
  onAfterLeave?: () => void;
  className?: string;
  children?: ReactElement;
}

const TRANSITION_DURATION_MS = 300;

/**
 * 对应官方 ElPopover。
 *
 * 官方 ElPopover 本质是 ElTooltip 的包装：透传 Tooltip 的属性，
 * 额外支持 title / width，并把默认触发方式改为 click。
 *
 * popperClass 的组成与官方一致：
 *   el-popover + 用户传入的 popperClass +（有 content 时）el-popover--plain
 * 「有 content 就加 --plain」是为了去掉默认内边距，让内容自己控制留白。
 */
export const ElPopover = forwardRef<PopoverExpose, PopoverProps>(
  function ElPopover(
    {
      title,
      content,
      width = 150,
      placement = "bottom",
      effect = "light",
      trigger = "click",
      triggerKeys,
      disabled = false,
      visible,
      onVisibleChange,
      showAfter = 0,
      hideAfter = 200,
      popperClass,
      popperStyle,
      showArrow = true,
      offset,
      enterable = true,
      teleported = true,
      appendTo,
      persistent = true,
      transition,
      virtualTriggering = false,
      virtualRef,
      zIndex,
      onBeforeEnter,
      onAfterEnter,
      onBeforeLeave,
      onAfterLeave,
      className,
      children,
    },
    ref,
  ) {
    const tooltipRef = useRef<TooltipExpose | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        hide: () => tooltipRef.current?.hide(),
        show: () => tooltipRef.current?.show(),
      }),
      [],
    );

    // Popover 的四个生命周期事件比 Tooltip 多一层语义，
    // 这里按显隐变化补发，时长与 theme-chalk 的过渡保持一致。
    // 受控时由 visible 变化驱动，非受控时由 onVisibleChange 驱动，避免重复触发
    const lifecycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const emitLifecycle = (next: boolean) => {
      if (lifecycleTimerRef.current) clearTimeout(lifecycleTimerRef.current);

      if (next) {
        onBeforeEnter?.();
        lifecycleTimerRef.current = setTimeout(
          () => onAfterEnter?.(),
          TRANSITION_DURATION_MS,
        );
      } else {
        onBeforeLeave?.();
        lifecycleTimerRef.current = setTimeout(
          () => onAfterLeave?.(),
          TRANSITION_DURATION_MS,
        );
      }
    };

    const isControlled = visible !== undefined;

    useEffect(() => {
      if (isControlled) emitLifecycle(visible);
      // eslint-disable-next-line react-hooks/exhaustive-deps -- 只在显隐值变化时发事件
    }, [visible, isControlled]);

    useEffect(
      () => () => {
        if (lifecycleTimerRef.current) clearTimeout(lifecycleTimerRef.current);
      },
      [],
    );

    const handleVisibleChange = (next: boolean) => {
      if (!isControlled) emitLifecycle(next);
      onVisibleChange?.(next);
    };

    const classes = [
      "el-popover",
      popperClass,
      // 官方：有 content 时加 --plain
      content !== undefined && content !== null && content !== "" && "el-popover--plain",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const mergedStyle: CSSProperties = {
      ...(width ? { width: addUnit(width) } : {}),
      ...popperStyle,
    };

    const hasTitle = title !== undefined && title !== null && title !== "";

    return (
      <ElTooltip
        ref={tooltipRef}
        content={
          <>
            {hasTitle && (
              <div className="el-popover__title" role="title">
                {title}
              </div>
            )}
            {content}
          </>
        }
        placement={placement}
        effect={effect}
        trigger={trigger}
        triggerKeys={triggerKeys}
        disabled={disabled}
        visible={visible}
        onVisibleChange={handleVisibleChange}
        showAfter={showAfter}
        hideAfter={hideAfter}
        popperClass={classes}
        popperStyle={mergedStyle}
        showArrow={showArrow}
        offset={offset}
        enterable={enterable}
        teleported={teleported}
        appendTo={appendTo}
        persistent={persistent}
        transition={transition}
        virtualTriggering={virtualTriggering}
        virtualRef={virtualRef}
        zIndex={zIndex}
      >
        {children}
      </ElTooltip>
    );
  },
);
