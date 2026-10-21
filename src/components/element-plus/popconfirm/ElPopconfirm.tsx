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
import { ElIcon } from "../icon/ElIcon";
import { ElButton } from "../button";
import { QuestionFilled } from "../generated/icons";
import { addUnit } from "../utils";
import type { PopperEffect, PopperPlacement } from "../popper/use-popper";

export interface PopconfirmExpose {
  /** 立即隐藏，对应官方 hide() */
  hide: () => void;
  /** 立即显示 */
  show: () => void;
}

/** 官方 actions 插槽的 React 形式：由使用方自定义按钮并复用内部关闭逻辑 */
export interface PopconfirmActionsHelpers {
  confirm: (event: React.MouseEvent) => void;
  cancel: (event: React.MouseEvent) => void;
}

export interface PopconfirmProps {
  /** 标题 */
  title?: ReactNode;
  /** 确认按钮文案 */
  confirmButtonText?: string;
  /** 取消按钮文案 */
  cancelButtonText?: string;
  /** 确认按钮类型 */
  confirmButtonType?: "primary" | "success" | "warning" | "danger" | "info" | "text";
  /** 取消按钮类型 */
  cancelButtonType?: "primary" | "success" | "warning" | "danger" | "info" | "text";
  /** 图标 */
  icon?: ReactNode;
  /** 图标颜色 */
  iconColor?: string;
  /** 是否隐藏图标 */
  hideIcon?: boolean;
  /** 弹出位置 */
  placement?: PopperPlacement;
  /** 主题 */
  effect?: PopperEffect;
  /** 触发方式，默认 click */
  trigger?: TooltipTrigger | TooltipTrigger[];
  /** 受控显示 */
  visible?: boolean;
  /** 显隐变化 */
  onVisibleChange?: (visible: boolean) => void;
  /** 显示延迟 */
  showAfter?: number;
  /** 隐藏延迟，默认 200 */
  hideAfter?: number;
  /** 点击确认 */
  onConfirm?: (event: React.MouseEvent) => void;
  /** 点击取消 */
  onCancel?: (event: React.MouseEvent) => void;
  /** 自定义按钮区域，对应官方 actions 插槽 */
  actions?: (helpers: PopconfirmActionsHelpers) => ReactNode;
  /** 宽度，默认 150 */
  width?: string | number;
  /** 自定义 popper 类名 */
  popperClass?: string;
  /** 是否挂载到 appendTo */
  teleported?: boolean;
  /** 挂载目标 */
  appendTo?: string | HTMLElement;
  /** 不可见时是否保留 DOM */
  persistent?: boolean;
  /** 虚拟触发 */
  virtualTriggering?: boolean;
  /** 虚拟触发参照物 */
  virtualRef?: TooltipVirtualRef | null;
  /** 层级 */
  zIndex?: number;
  className?: string;
  children?: ReactElement;
}

/**
 * 对应官方 ElPopconfirm。
 *
 * 官方是 ElTooltip 的包装，固定 trigger="click"、popperClass="el-popover"，
 * 并把 fallbackPlacements 限定为 ['bottom', 'top', 'right', 'left']
 * —— 即翻转时只在四个主方向间切换，不用 -start / -end 变体。
 *
 * 默认值取自官方：icon 为 QuestionFilled、iconColor 为 #f90、width 为 150、
 * 取消按钮为 text 类型、文案「确定」/「取消」（官方中文语言包）。
 *
 * 确认/取消必须走 tooltip 实例关闭，而不是只回调 onVisibleChange：
 * 非受控模式下没有外部状态可改，直接回调会让弹层关不掉。
 */
export const ElPopconfirm = forwardRef<PopconfirmExpose, PopconfirmProps>(
  function ElPopconfirm(
    {
      title,
      confirmButtonText = "确定",
      cancelButtonText = "取消",
      confirmButtonType = "primary",
      cancelButtonType = "text",
      icon,
      iconColor = "#f90",
      hideIcon = false,
      placement = "bottom",
      effect = "light",
      trigger = "click",
      visible,
      onVisibleChange,
      showAfter = 0,
      hideAfter = 200,
      onConfirm,
      onCancel,
      actions,
      width = 150,
      popperClass,
      teleported = true,
      appendTo,
      persistent = false,
      virtualTriggering = false,
      virtualRef,
      zIndex,
      className,
      children,
    },
    ref,
  ) {
    const tooltipRef = useRef<TooltipExpose | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        hide: () => tooltipRef.current?.hide(),
        show: () => tooltipRef.current?.show(),
      }),
      [],
    );

    // 对应官方 showPopper：弹出后让内容区获得焦点，便于键盘操作
    useEffect(() => {
      if (visible) rootRef.current?.focus();
    }, [visible]);

    const handleConfirm = (event: React.MouseEvent) => {
      onConfirm?.(event);
      tooltipRef.current?.hide();
    };

    const handleCancel = (event: React.MouseEvent) => {
      onCancel?.(event);
      tooltipRef.current?.hide();
    };

    const classes = ["el-popover", popperClass, className].filter(Boolean).join(" ");

    const style: CSSProperties = { width: addUnit(width) };

    return (
      <ElTooltip
        ref={tooltipRef}
        content={
          <div className="el-popconfirm" ref={rootRef} tabIndex={-1}>
            <div className="el-popconfirm__main">
              {!hideIcon && (
                <ElIcon className="el-popconfirm__icon" style={{ color: iconColor }}>
                  {icon ?? <QuestionFilled />}
                </ElIcon>
              )}
              {title}
            </div>

            <div className="el-popconfirm__action">
              {actions ? (
                actions({ confirm: handleConfirm, cancel: handleCancel })
              ) : (
                <>
                  <ElButton
                    size="small"
                    type={cancelButtonType === "text" ? undefined : cancelButtonType}
                    text={cancelButtonType === "text"}
                    onClick={handleCancel}
                  >
                    {cancelButtonText}
                  </ElButton>
                  <ElButton
                    size="small"
                    type={confirmButtonType === "text" ? undefined : confirmButtonType}
                    text={confirmButtonType === "text"}
                    onClick={handleConfirm}
                  >
                    {confirmButtonText}
                  </ElButton>
                </>
              )}
            </div>
          </div>
        }
        placement={placement}
        effect={effect}
        trigger={trigger}
        visible={visible}
        onVisibleChange={onVisibleChange}
        showAfter={showAfter}
        hideAfter={hideAfter}
        popperClass={classes}
        popperStyle={style}
        teleported={teleported}
        appendTo={appendTo}
        persistent={persistent}
        virtualTriggering={virtualTriggering}
        virtualRef={virtualRef}
        zIndex={zIndex}
        enterable
        // 与官方一致：翻转范围限定在四个主方向
        fallbackPlacements={["bottom", "top", "right", "left"]}
      >
        {children}
      </ElTooltip>
    );
  },
);
