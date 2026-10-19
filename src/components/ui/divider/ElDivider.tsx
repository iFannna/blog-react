"use client";

import type { CSSProperties, ReactNode } from "react";

export type DividerDirection = "horizontal" | "vertical";
export type ContentPosition = "left" | "center" | "right";
export type BorderStyle = "solid" | "dashed" | "dotted" | "double" | "groove"
  | "ridge" | "inset" | "outset" | "none" | "hidden";

export interface DividerProps {
  /** 方向 */
  direction?: DividerDirection;
  /** 自定义内容的位置，仅水平方向有效 */
  contentPosition?: ContentPosition;
  /** 分隔线样式 */
  borderStyle?: BorderStyle;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 对应官方 ElDivider。
 *
 * 官方用 ns.cssVar 把 border-style 写成 --el-border-style 变量，
 * 由 scss 里的 border 简写消费，这里沿用同一机制。
 */
export function ElDivider({
  direction = "horizontal",
  contentPosition = "center",
  borderStyle = "solid",
  className,
  style,
  children,
}: DividerProps) {
  const classes = [
    "el-divider",
    `el-divider--${direction}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle = {
    ...style,
    "--el-border-style": borderStyle,
  } as CSSProperties;

  // 竖线形态不渲染文字区，与官方模板的判断一致
  const hasText = children !== undefined && children !== null && direction !== "vertical";

  return (
    <div className={classes} style={mergedStyle} role="separator">
      {hasText && (
        <div className={`el-divider__text is-${contentPosition}`}>
          {children}
        </div>
      )}
    </div>
  );
}
