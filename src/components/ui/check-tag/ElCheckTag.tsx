"use client";

import type { CSSProperties, ReactNode } from "react";

export type CheckTagType =
  | "primary"
  | "success"
  | "info"
  | "warning"
  | "danger";

export interface CheckTagProps {
  /** 是否选中，对应官方 checked */
  checked?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 类型 */
  type?: CheckTagType;
  /** 选中态变化，对应官方 checked 的双向绑定 */
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 对应官方 ElCheckTag。
 *
 * 官方点击时同时 emit change 与 update:checked，React 侧合并为 onCheckedChange。
 * 禁用时不派发任何事件。
 */
export function ElCheckTag({
  checked = false,
  disabled = false,
  type = "primary",
  onCheckedChange,
  className,
  style,
  children,
}: CheckTagProps) {
  const classes = [
    "el-check-tag",
    checked && "is-checked",
    disabled && "is-disabled",
    `el-check-tag--${type || "primary"}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={classes}
      style={style}
      onClick={() => {
        if (disabled) return;
        onCheckedChange?.(!checked);
      }}
    >
      {children}
    </span>
  );
}
