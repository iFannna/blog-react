"use client";

import type { CSSProperties, ReactNode } from "react";

export interface ElPopperArrowProps {
  /** 箭头的定位样式，来自 popper 的 styles.arrow */
  style?: CSSProperties;
  className?: string;
}

/**
 * 对应官方 ElPopperArrow。
 *
 * 官方结构是 `<div class="el-popper__arrow" :style="arrowStyle" />`，
 * 箭头本体（三角形）由 CSS 的 `::before` 生成，
 * 颜色由父级 `.el-popper.is-dark` / `.is-light` 的规则决定。
 */
export function ElPopperArrow({ style, className }: ElPopperArrowProps) {
  return (
    <div
      className={["el-popper__arrow", className].filter(Boolean).join(" ")}
      style={style}
      data-popper-arrow=""
    />
  );
}

export interface TooltipContentWrapperProps {
  children?: ReactNode;
}
