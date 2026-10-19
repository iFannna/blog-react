"use client";

import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { joinClasses } from "./utils";

export interface MenuItemGroupProps {
  /** 分组标题 */
  title?: ReactNode;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 对应官方 ElMenuItemGroup。
 *
 * 结构固定为 `li.el-menu-item-group > div.el-menu-item-group__title + ul`。
 * 标题优先取 title，没有时不渲染标题节点（官方是空 div，这里同样保留
 * 以保证后续 `ul` 的相邻选择器与官方一致）。
 */
export const ElMenuItemGroup = forwardRef<HTMLLIElement, MenuItemGroupProps>(
  function ElMenuItemGroup({ title, className, style, children }, ref) {
    return (
      <li ref={ref} className={joinClasses("el-menu-item-group", className)} style={style}>
        <div className="el-menu-item-group__title">{title}</div>
        <ul>{children}</ul>
      </li>
    );
  },
);
