"use client";

import { createElement, type CSSProperties, type ReactNode } from "react";
import { RowContext } from "./context";

export type RowJustify = "start" | "end" | "center" | "space-around" | "space-between" | "space-evenly";
export type RowAlign = "top" | "middle" | "bottom";

export interface RowProps {
  /** 栅格间隔，会同时作为 Col 的左右内边距 */
  gutter?: number;
  /** 水平排列方式 */
  justify?: RowJustify;
  /** 垂直对齐方式 */
  align?: RowAlign;
  /** 渲染的标签名，对应官方 tag */
  tag?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 对应官方 ElRow。
 *
 * 官方用「Row 负 margin + Col 左右 padding」抵消的方式实现间距，
 * 这样最左最右两列也能贴齐容器边缘。justify 为 start 时不加类（默认值）。
 */
export function ElRow({
  gutter = 0,
  justify = "start",
  align,
  tag = "div",
  className,
  style,
  children,
}: RowProps) {
  const classes = [
    "el-row",
    justify !== "start" && `is-justify-${justify}`,
    align && `is-align-${align}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // 负 margin 抵消 Col 的 padding，两侧不留空
  const mergedStyle: CSSProperties = gutter
    ? { ...style, marginLeft: `-${gutter / 2}px`, marginRight: `-${gutter / 2}px` }
    : (style ?? {});

  return (
    <RowContext.Provider value={{ gutter }}>
      {createElement(tag, { className: classes, style: mergedStyle }, children)}
    </RowContext.Provider>
  );
}
