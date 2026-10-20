"use client";

import { useContext, type CSSProperties, type ReactNode } from "react";
import { PopperContentContext } from "./popper-context";

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
  const context = useContext(PopperContentContext);

  // 定位来自 popper 的 arrow 修饰符；使用方传入的 style 仍可覆盖
  const mergedStyle: CSSProperties = {
    position: "absolute",
    ...context?.arrowStyle,
    ...style,
  };

  return (
    <div
      ref={context?.setArrowRef}
      className={["el-popper__arrow", className].filter(Boolean).join(" ")}
      style={mergedStyle}
      data-popper-arrow=""
    />
  );
}

export interface TooltipContentWrapperProps {
  children?: ReactNode;
}
