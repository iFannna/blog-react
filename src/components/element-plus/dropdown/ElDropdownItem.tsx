"use client";

import { useDropdownContext, type DropdownItemSharedProps } from "./context";
import { ElIcon } from "../icon/ElIcon";

export type DropdownItemProps = DropdownItemSharedProps;

/**
 * 对应官方 ElDropdownItem。
 *
 * 类名：el-dropdown-menu__item + is-disabled / el-dropdown-menu__item--divided。
 * 点击时把 command 交给父级 Dropdown 处理（由它决定是否关闭菜单）。
 */
export function ElDropdownItem({
  command,
  disabled = false,
  divided = false,
  icon,
  className,
  children,
}: DropdownItemProps) {
  const ctx = useDropdownContext();

  const classes = [
    "el-dropdown-menu__item",
    disabled && "is-disabled",
    divided && "el-dropdown-menu__item--divided",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li
      className={classes}
      tabIndex={-1}
      role="menuitem"
      aria-disabled={disabled}
      onClick={(event) => {
        // 阻止冒泡，避免触发外层的关闭逻辑
        event.stopPropagation();
        if (disabled) return;
        ctx?.handleItemClick(command, disabled);
      }}
    >
      {icon && <ElIcon>{icon}</ElIcon>}
      {children}
    </li>
  );
}
