"use client";

import { createElement, useContext, type CSSProperties, type ReactNode } from "react";
import { RowContext } from "./context";

/** 响应式断点配置，值是栅格数，或 { span, offset, pull, push }。 */
export type ColSizeObject = {
  span?: number;
  offset?: number;
  pull?: number;
  push?: number;
};
export type ColSize = number | ColSizeObject;

export interface ColProps {
  /** 栅格占位格数，共 24 格 */
  span?: number;
  /** 栅格左侧间隔格数 */
  offset?: number;
  /** 栅格向右移动格数 */
  pull?: number;
  /** 栅格向左移动格数 */
  push?: number;
  xs?: ColSize;
  sm?: ColSize;
  md?: ColSize;
  lg?: ColSize;
  xl?: ColSize;
  /** 渲染的标签名，对应官方 tag */
  tag?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const BREAKPOINTS = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * 对应官方 ElCol。
 *
 * 类名规则与官方 colKls 一致：
 * - span 直接用 `el-col-{n}`；offset/pull/push 仅在大于 0 时输出
 * - 断点属性：数字输出 `el-col-{bp}-{n}`，
 *   对象则 span 输出 `el-col-{bp}-{n}`、其余输出 `el-col-{bp}-{key}-{n}`
 */
export function ElCol({
  span = 24,
  offset,
  pull,
  push,
  xs,
  sm,
  md,
  lg,
  xl,
  tag = "div",
  className,
  style,
  children,
}: ColProps) {
  const { gutter } = useContext(RowContext);

  const sizeClasses: string[] = [];

  // 位置类：span 无条件输出，其余大于 0 才输出
  const positions = [
    ["span", span],
    ["offset", offset],
    ["pull", pull],
    ["push", push],
  ] as const;

  for (const [prop, value] of positions) {
    if (typeof value !== "number") continue;
    if (prop === "span") sizeClasses.push(`el-col-${value}`);
    else if (value > 0) sizeClasses.push(`el-col-${prop}-${value}`);
  }

  // 响应式断点
  const breakpointValues = { xs, sm, md, lg, xl };

  for (const bp of BREAKPOINTS) {
    const value = breakpointValues[bp];
    if (value === undefined) continue;

    if (typeof value === "number") {
      sizeClasses.push(`el-col-${bp}-${value}`);
      continue;
    }

    for (const [key, n] of Object.entries(value)) {
      if (typeof n !== "number") continue;
      sizeClasses.push(
        key === "span" ? `el-col-${bp}-${n}` : `el-col-${bp}-${key}-${n}`,
      );
    }
  }

  const classes = [
    "el-col",
    ...sizeClasses,
    gutter > 0 && "is-guttered",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle: CSSProperties = gutter
    ? { ...style, paddingLeft: `${gutter / 2}px`, paddingRight: `${gutter / 2}px` }
    : (style ?? {});

  return createElement(tag, { className: classes, style: mergedStyle }, children);
}
