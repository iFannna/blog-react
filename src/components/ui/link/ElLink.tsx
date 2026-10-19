"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ElIcon } from "../icon/ElIcon";
import { useGlobalConfig } from "../config-provider/context";

export type LinkType =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "default";
export type LinkUnderline = "always" | "hover" | "never";

export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type" | "color"> {
  /** 链接类型 */
  type?: LinkType;
  /**
   * 下划线时机。
   * 官方仍兼容布尔写法（true → hover，false → never），已标记 3.0 移除，
   * React 侧不再复刻该兼容层。
   */
  underline?: LinkUnderline;
  /** 是否禁用 */
  disabled?: boolean;
  /** 图标，显示在文字左侧 */
  icon?: ReactNode;
  /** 自定义图标，对应官方 icon 插槽，显示在文字右侧 */
  children?: ReactNode;
  className?: string;
}

/** 对应官方 ElLink。type / underline 缺省时回落到全局配置。 */
export function ElLink({
  type,
  underline,
  disabled = false,
  href = "",
  target = "_self",
  icon,
  className,
  children,
  onClick,
  ...restProps
}: LinkProps) {
  // 官方：props.type ?? globalConfig?.type ?? 'default'；underline 同构
  const globalLinkConfig = useGlobalConfig("link");
  const resolvedType = type ?? globalLinkConfig?.type ?? "default";
  const resolvedUnderline = underline ?? globalLinkConfig?.underline ?? "hover";

  const classes = [
    "el-link",
    `el-link--${resolvedType}`,
    disabled && "is-disabled",
    resolvedUnderline === "always" && "is-underline",
    resolvedUnderline === "hover" && !disabled && "is-hover-underline",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      {...restProps}
      className={classes}
      // 禁用或无 href 时不下发链接属性，避免成为可聚焦的链接
      href={disabled || !href ? undefined : href}
      target={disabled || !href ? undefined : target}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
    >
      {icon && <ElIcon>{icon}</ElIcon>}
      {children !== undefined && (
        <span className="el-link__inner">{children}</span>
      )}
    </a>
  );
}
