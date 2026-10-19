"use client";

import type { ReactNode } from "react";

export interface DropdownMenuProps {
  className?: string;
  children?: ReactNode;
}

/**
 * 对应官方 ElDropdownMenu。
 *
 * 官方的菜单由 ElScrollbar + ElRovingFocusGroup 包裹（提供滚动与键盘导航），
 * 二者尚未实现，这里用等价的 ul 结构承载，
 * 类名与官方一致：外层 el-dropdown-menu，内层 el-dropdown-menu__item 列表。
 */
export function ElDropdownMenu({ className, children }: DropdownMenuProps) {
  const classes = ["el-dropdown-menu", className].filter(Boolean).join(" ");

  return (
    <ul className={classes} role="menu">
      {children}
    </ul>
  );
}
