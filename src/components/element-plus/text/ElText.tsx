"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

export type TextType = "primary" | "success" | "info" | "warning" | "danger" | "";

export interface TextProps {
  /** 文本类型 */
  type?: TextType;
  /** 文本尺寸 */
  size?: "large" | "default" | "small" | "";
  /** 是否单行溢出省略 */
  truncated?: boolean;
  /** 最大行数，传入即启用多行省略 */
  lineClamp?: number | string;
  /** 渲染的标签名，对应官方 tag */
  tag?: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
  children?: ReactNode;
}

/**
 * 对应官方 ElText。
 *
 * 类名与官方 textKls 一致：类型修饰、尺寸修饰，以及 is-truncated / is-line-clamp
 * 两个状态类。官方没有 bold / italic / delete / underline 这些 prop，
 * 需要这些效果请用 Typography 组件或直接写样式。
 *
 * lineClamp 写成内联的 -webkit-line-clamp，配合 CSS 里的 display: -webkit-box 生效。
 */
export function ElText({
  type = "",
  size = "",
  truncated = false,
  lineClamp,
  tag = "span",
  className,
  style,
  title,
  children,
}: TextProps) {
  const textRef = useRef<HTMLElement>(null);

  const classes = [
    "el-text",
    type && `el-text--${type}`,
    size && `el-text--${size}`,
    truncated && "is-truncated",
    lineClamp !== undefined && "is-line-clamp",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle: CSSProperties =
    lineClamp !== undefined
      ? ({ ...style, WebkitLineClamp: String(lineClamp) } as CSSProperties)
      : (style ?? {});

  /**
   * 对应官方的 bindTitle：文本真的溢出时才补上原生 title，
   * 未溢出则移除，避免出现无意义的悬停提示。
   */
  useEffect(() => {
    const el = textRef.current;
    if (!el || title) return;

    const hasOverflow = truncated
      ? el.scrollWidth > el.offsetWidth
      : lineClamp !== undefined
        ? el.scrollHeight > el.offsetHeight
        : false;

    if (hasOverflow) {
      el.setAttribute("title", el.textContent ?? "");
    } else {
      el.removeAttribute("title");
    }
  }, [children, truncated, lineClamp, title]);

  const Tag = tag as ElementType;

  return (
    <Tag ref={textRef} className={classes} style={mergedStyle} title={title}>
      {children}
    </Tag>
  );
}
