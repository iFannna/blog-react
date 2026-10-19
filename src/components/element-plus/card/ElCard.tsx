"use client";

import type { CSSProperties, ReactNode } from "react";
import { useGlobalConfig } from "../config-provider/context";

export type CardShadow = "always" | "hover" | "never";

export interface CardProps {
  /** 标题，也可用 header 插槽传入节点 */
  header?: ReactNode;
  /** 页脚，也可用 footer 插槽传入节点 */
  footer?: ReactNode;
  /** 内容区样式，对应官方 bodyStyle */
  bodyStyle?: CSSProperties;
  /** 自定义头部类名 */
  headerClass?: string;
  /** 自定义内容区类名 */
  bodyClass?: string;
  /** 自定义页脚类名 */
  footerClass?: string;
  /** 阴影显示时机 */
  shadow?: CardShadow;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** 对应官方 ElCard。头部与页脚仅在传入内容时渲染，shadow 缺省时取全局配置。 */
export function ElCard({
  header,
  footer,
  bodyStyle,
  headerClass,
  bodyClass,
  footerClass,
  shadow,
  className,
  style,
  children,
}: CardProps) {
  // 对应官方 ns.is(`${shadow || globalConfig?.shadow || 'always'}-shadow`)
  const globalCardConfig = useGlobalConfig("card");

  const classes = [
    "el-card",
    `is-${shadow ?? globalCardConfig?.shadow ?? "always"}-shadow`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={style}>
      {header && (
        <div className={["el-card__header", headerClass].filter(Boolean).join(" ")}>
          {header}
        </div>
      )}
      <div
        className={["el-card__body", bodyClass].filter(Boolean).join(" ")}
        style={bodyStyle}
      >
        {children}
      </div>
      {footer && (
        <div className={["el-card__footer", footerClass].filter(Boolean).join(" ")}>
          {footer}
        </div>
      )}
    </div>
  );
}
