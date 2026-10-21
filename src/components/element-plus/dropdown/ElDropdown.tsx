"use client";

import {
  cloneElement,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
} from "react";
import { ElTooltip } from "../tooltip/ElTooltip";
import type { TooltipVirtualRef } from "../tooltip/ElTooltip";
import { ElButton } from "../button";
import { ElButtonGroup } from "../button/ElButtonGroup";
import { ElIcon } from "../icon/ElIcon";
import { ArrowDown } from "../generated/icons";
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
    const rootRef = useRef<HTMLDivElement | null>(null);
    // 键盘打开菜单时由触发键决定焦点落在第一项还是最后一项，此时不再自动聚焦菜单根节点
    const keyboardFocusRef = useRef(false);

    /** 对应官方 focusElement(trigger)：关闭后焦点回到触发器 */
    const focusTrigger = useCallback(() => {
      const root = rootRef.current;
      if (!root) return;
      const target =
        root.querySelector<HTMLElement>(".el-dropdown-link") ??
        root.querySelector<HTMLElement>("[role='button']") ??
        root;
      target.focus({ preventScroll: true });
    }, []);

    /** 菜单项集合，对应官方 roving focus collection（跳过禁用项） */
    const getMenuItems = useCallback(
      () =>
        Array.from(
          popperRef.current?.querySelectorAll<HTMLElement>(
            ".el-dropdown-menu__item:not(.is-disabled)",
          ) ?? [],
        ),
      [],
    );

    const focusMenuItem = useCallback(
      (index: number) => {
        const items = getMenuItems();
        if (!items.length) return;
        const target = ((index % items.length) + items.length) % items.length;
        items[target].focus({ preventScroll: true });
      },
      [getMenuItems],
    );

    /** 对应官方 ElDropdownMenu 的 roving focus：上下切换、回车触发、Esc/Tab 关闭 */
    const handleMenuKeyDown = useCallback(
      (event: KeyboardEvent<HTMLUListElement>) => {
        const items = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            ".el-dropdown-menu__item:not(.is-disabled)",
          ),
        );
        const active = document.activeElement as HTMLElement | null;
        const index = active ? items.indexOf(active) : -1;

        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            if (items.length) items[(index + 1) % items.length].focus({ preventScroll: true });
            break;
          case "ArrowUp":
            event.preventDefault();
            if (items.length) {
              items[(index < 0 ? items.length - 1 : index - 1 + items.length) % items.length].focus({
                preventScroll: true,
              });
            }
            break;
          case "Enter":
          case " ":
          case "Spacebar": {
            const item = active?.closest<HTMLElement>(".el-dropdown-menu__item");
            if (item && event.currentTarget.contains(item)) {
              event.preventDefault();
              event.stopPropagation();
              item.click();
            }
            break;
          }
          case "Escape":
            event.preventDefault();
            event.stopPropagation();
            setVisible(false);
            focusTrigger();
            break;
          case "Tab":
            setVisible(false);
            break;
        }
      },
      [focusTrigger, setVisible],
    );

    /** 触发器键盘行为：与官方 triggerKeys 一致，ArrowDown/Enter/Space 打开，Esc 关闭 */
    const handleRootKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        // 浮层内容通过 portal 渲染，React 事件仍会冒泡到触发器，菜单内的按键交给菜单处理
        if (popperRef.current?.contains(event.target as Node)) return;

        if (!visible) {
          if (
            event.key === "ArrowDown" ||
            event.key === "ArrowUp" ||
            event.key === "Enter" ||
            event.key === " " ||
            event.key === "Spacebar"
          ) {
            event.preventDefault();
            keyboardFocusRef.current = true;
            setVisible(true);
            const target = event.key === "ArrowUp" ? -1 : 0;
            window.setTimeout(() => focusMenuItem(target), 0);
          }
          return;
        }

        if (event.key === "Escape") {
          event.preventDefault();
          setVisible(false);
          focusTrigger();
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          focusMenuItem(0);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          focusMenuItem(-1);
        }
      },
      [disabled, visible, setVisible, focusMenuItem, focusTrigger],
    );

    // 官方 show 时把焦点移到菜单内容（focusOnTarget），键盘打开时由触发键决定落点
    useEffect(() => {
      if (!visible) return;
      if (keyboardFocusRef.current) {
        keyboardFocusRef.current = false;
        return;
      }
      const id = window.requestAnimationFrame(() => {
        popperRef.current
          ?.querySelector<HTMLElement>(".el-dropdown-menu")
          ?.focus({ preventScroll: true });
      });
      return () => window.cancelAnimationFrame(id);
    }, [visible]);

    const handleItemClick = useCallback(
      (command: unknown, itemDisabled?: boolean) => {
        if (itemDisabled) return;
        onCommand?.(command);
        // 对应官方 hideOnClick
        if (hideOnClick) {
          setVisible(false);
          focusTrigger();
        }
      },
      [onCommand, hideOnClick, setVisible, focusTrigger],
    );

    // 每次渲染都换新对象会让菜单项全部重渲染，这里按依赖缓存
    const contextValue = useMemo(
      () => ({ handleItemClick, handleMenuKeyDown }),
      [handleItemClick, handleMenuKeyDown],
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
    ) : children ? (
      // 官方 ElOnlyChild 会把 role/tabindex 合并到触发元素上
      cloneElement(children as ReactElement<Record<string, unknown>>, {
        tabIndex: tabindex,
        role: "button",
      })
    ) : undefined;

    return (
      <DropdownContext.Provider value={contextValue}>
        <div
          ref={rootRef}
          className={classes}
          onKeyDown={handleRootKeyDown}
        >
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
