"use client";

import {
  forwardRef,
  useEffect,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ElTooltip } from "../tooltip";
import { useMenuActions, useMenuState } from "./context";
import { useMenu } from "./use-menu";
import { joinClasses } from "./utils";

export interface MenuItemProps {
  /** 唯一标识，必填 */
  index: string;
  /** 点击时透出的路由信息，对应官方 route */
  route?: string | Record<string, unknown>;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义标题。收起形态下作为 tooltip 的内容 */
  title?: ReactNode;
  /** 点击回调，参数为该项的注册信息 */
  onClick?: (item: { index: string; indexPath: string[] }) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 对应官方 ElMenuItem。
 *
 * 结构：`li.el-menu-item`（is-active / is-disabled）内直接放内容；
 * 纵向收起、位于第一层且提供 title 时，内容改由 tooltip 承载，
 * 触发区包一层 `.el-menu-tooltip__trigger`，与官方模板一一对应。
 *
 * 激活态由根菜单的 activeIndex 比较得出；祖先子菜单的高亮由 ElSubMenu
 * 按 indexPath 前缀在注册表里自行判断。
 */
export const ElMenuItem = forwardRef<HTMLLIElement, MenuItemProps>(
  function ElMenuItem(
    {
      index,
      route,
      disabled = false,
      title,
      onClick,
      className,
      style,
      children,
    },
    ref,
  ) {
    const state = useMenuState();
    const actions = useMenuActions();
    const { indexPath, isFirstLevel } = useMenu(index);

    const active = state?.activeIndex === index;

    // 路径按值作为依赖，避免每次渲染重新注册整棵子树。
    const indexPathKey = indexPath.join(" ");
    useEffect(() => {
      if (!actions) return;
      const item = { index, indexPath: indexPathKey.split(" ") };
      actions.addMenuItem(item);
      return () => actions.removeMenuItem(item);
    }, [actions, index, indexPathKey]);

    const handleClick = () => {
      if (disabled) return;
      const item = { index, indexPath: indexPathKey.split(" "), route };
      actions?.handleMenuItemClick(item);
      onClick?.({ index, indexPath: indexPathKey.split(" ") });
    };

    // 官方条件：父级是 ElMenu + 根菜单收起 + 提供了 title
    const useTooltip = Boolean(state?.props.collapse && isFirstLevel && title);

    return (
      <li
        ref={ref}
        className={joinClasses(
          "el-menu-item",
          active && "is-active",
          disabled && "is-disabled",
          className,
        )}
        style={style}
        role="menuitem"
        tabIndex={-1}
        onClick={handleClick}
      >
        {useTooltip ? (
          <ElTooltip
            content={title}
            effect={state!.props.popperEffect}
            placement="right"
            fallbackPlacements={["left"]}
            popperClass={state!.props.popperClass}
            popperStyle={state!.props.popperStyle}
            trigger={["hover", "focus"]}
            teleported
          >
            <div className="el-menu-tooltip__trigger">{children}</div>
          </ElTooltip>
        ) : (
          <>
            {children}
            {title}
          </>
        )}
      </li>
    );
  },
);
