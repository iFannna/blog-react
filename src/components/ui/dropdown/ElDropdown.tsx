"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import { ElTooltip } from "../tooltip/ElTooltip";
import type { TooltipVirtualRef } from "../tooltip/ElTooltip";
import { ElButton } from "../button";
import { ElButtonGroup } from "../button/ElButtonGroup";
import { ElIcon } from "../icon/ElIcon";
import { ArrowDown } from "../icons";
import { DropdownContext } from "./context";
import type { PopperPlacement, PopperEffect } from "../popper/use-popper";
import type { ComponentSize, ButtonType } from "../button/types";

export type DropdownTrigger = "hover" | "click" | "contextmenu";

export interface DropdownExpose {
  /** 打开菜单，对应官方 expose */
  handleOpen: () => void;
  /** 关闭菜单，对应官方 expose */
  handleClose: () => void;
  /** 切换菜单 */
  handleToggle: () => void;
}

export interface DropdownProps {
  /** 触发方式 */
  trigger?: DropdownTrigger | DropdownTrigger[];
  /** 键盘触发键 */
  triggerKeys?: string[];
  /** 主题 */
  effect?: PopperEffect;
  /** 按钮类型，仅 splitButton 时有效 */
  type?: ButtonType;
  /** 尺寸 */
  size?: ComponentSize;
  /** 弹出位置 */
  placement?: PopperPlacement;
  /** 是否使用分裂按钮 */
  splitButton?: boolean;
  /** 点击菜单项后是否关闭菜单 */
  hideOnClick?: boolean;
  /** 点击菜单项的回调，参数为该项的 command */
  onCommand?: (command: unknown) => void;
  /** 分裂按钮左半部分的点击回调 */
  onButtonClick?: (event: React.MouseEvent) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示箭头 */
  showArrow?: boolean;
  /** hover 触发的显示延迟 */
  showTimeout?: number;
  /** hover 触发的隐藏延迟 */
  hideTimeout?: number;
  /** 受控显示 */
  visible?: boolean;
  /** 显隐变化 */
  onVisibleChange?: (visible: boolean) => void;
  /** 弹层最大高度 */
  maxHeight?: number | string;
  /** 自定义 popper 类名 */
  popperClass?: string;
  /** 自定义 popper 样式 */
  popperStyle?: CSSProperties;
  /** 是否挂载到 appendTo */
  teleported?: boolean;
  /** 挂载目标 */
  appendTo?: string | HTMLElement;
  /** 不可见时是否保留 DOM，默认 true */
  persistent?: boolean;
  /** 浮层语义角色，默认 menu */
  role?: string;
  /** 虚拟触发 */
  virtualTriggering?: boolean;
  /** 虚拟触发参照物 */
  virtualRef?: TooltipVirtualRef | null;
  /** 触发元素的 tabindex */
  tabindex?: number;
  /** 层级 */
  zIndex?: number;
  /** 菜单内容，即 ElDropdownMenu */
  menu: ReactElement;
  className?: string;
  children?: ReactElement;
}

/**
 * 对应官方 ElDropdown。
 *
 * 关键参数与官方一致：
 * - popperClass 为 `el-dropdown__popper` + 用户类名
 * - fallbackPlacements 限定为 ['bottom', 'top']（官方在模板里写死）
 * - 通过 `pure` 去掉默认内边距，由菜单自己控制
 * - hover 触发时用 showTimeout / hideTimeout，其它触发方式延迟为 0
 * - 浮层动画为 el-zoom-in-top
 *
 * splitButton 模式的结构与官方一致：ElButtonGroup 包住
 * 主按钮（触发 onButtonClick）与 caret 按钮（负责弹出菜单）。
 * virtualTriggering 时不渲染默认触发器，菜单由 virtualRef 定位。
 */
export const ElDropdown = forwardRef<DropdownExpose, DropdownProps>(
  function ElDropdown(
    {
      trigger = "hover",
      triggerKeys,
      effect = "light",
      type,
      size,
      placement = "bottom",
      splitButton = false,
      hideOnClick = true,
      onCommand,
      onButtonClick,
      disabled = false,
      showArrow = true,
      showTimeout = 150,
      hideTimeout = 150,
      visible: controlledVisible,
      onVisibleChange,
      maxHeight = "",
      popperClass,
      popperStyle,
      teleported = true,
      appendTo,
      persistent = true,
      role = "menu",
      virtualTriggering = false,
      virtualRef,
      tabindex = 0,
      zIndex,
      menu,
      className,
      children,
    },
    ref,
  ) {
    const [uncontrolledVisible, setUncontrolledVisible] = useState(false);
    const isControlled = controlledVisible !== undefined;
    const visible = isControlled ? controlledVisible : uncontrolledVisible;

    const setVisible = useCallback(
      (next: boolean) => {
        if (!isControlled) setUncontrolledVisible(next);
        onVisibleChange?.(next);
      },
      [isControlled, onVisibleChange],
    );

    const handleOpen = useCallback(() => setVisible(true), [setVisible]);
    const handleClose = useCallback(() => setVisible(false), [setVisible]);
    const handleToggle = useCallback(
      () => setVisible(!visible),
      [setVisible, visible],
    );

    useImperativeHandle(
      ref,
      () => ({ handleOpen, handleClose, handleToggle }),
      [handleOpen, handleClose, handleToggle],
    );

    const popperRef = useRef<HTMLDivElement | null>(null);

    const handleItemClick = useCallback(
      (command: unknown, itemDisabled?: boolean) => {
        if (itemDisabled) return;
        onCommand?.(command);
        // 对应官方 hideOnClick
        if (hideOnClick) setVisible(false);
      },
      [onCommand, hideOnClick, setVisible],
    );

    // 每次渲染都换新对象会让菜单项全部重渲染，这里按依赖缓存
    const contextValue = useMemo(
      () => ({ handleItemClick }),
      [handleItemClick],
    );

    const classes = [
      "el-dropdown",
      disabled && "is-disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const isHover =
      trigger === "hover" || (Array.isArray(trigger) && trigger.includes("hover"));

    const popperClasses = ["el-dropdown__popper", popperClass].filter(Boolean).join(" ");

    const menuStyle =
      maxHeight !== ""
        ? { maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight }
        : undefined;

    /** 触发元素：分裂按钮时是按钮组，虚拟触发时为空，否则是 children 本身 */
    const triggerNode = virtualTriggering ? (
      children
    ) : splitButton ? (
      <ElButtonGroup>
        <ElButton
          type={type}
          size={size}
          disabled={disabled}
          onClick={onButtonClick}
        >
          {children}
        </ElButton>
        <ElButton
          type={type}
          size={size}
          disabled={disabled}
          className="el-dropdown__caret-button"
          aria-label="展开菜单"
        >
          <ElIcon className="el-dropdown__icon">
            <ArrowDown />
          </ElIcon>
        </ElButton>
      </ElButtonGroup>
    ) : (
      children
    );

    return (
      <DropdownContext.Provider value={contextValue}>
        <div className={classes} tabIndex={tabindex}>
          <ElTooltip
            content={
              <div ref={popperRef} style={menuStyle}>
                {menu}
              </div>
            }
            placement={placement}
            effect={effect}
            trigger={disabled ? [] : (trigger as never)}
            triggerKeys={triggerKeys}
            visible={visible}
            onVisibleChange={setVisible}
            showAfter={isHover ? showTimeout : 0}
            hideAfter={isHover ? hideTimeout : 0}
            showArrow={showArrow}
            fallbackPlacements={["bottom", "top"]}
            popperClass={popperClasses}
            popperStyle={popperStyle}
            transition="el-zoom-in-top"
            teleported={teleported}
            appendTo={appendTo}
            persistent={persistent}
            role={role}
            virtualTriggering={virtualTriggering}
            virtualRef={virtualRef}
            zIndex={zIndex}
            pure
            enterable
          >
            {triggerNode}
          </ElTooltip>
        </div>
      </DropdownContext.Provider>
    );
  },
);
