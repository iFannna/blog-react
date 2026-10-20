"use client";

import type { CSSProperties } from "react";
import { PictureFilled } from "../icons";

export type SkeletonVariant =
  | "circle"
  | "rect"
  | "h1"
  | "h3"
  | "text"
  | "caption"
  | "p"
  | "image"
  | "button";

export interface SkeletonItemProps {
  /** 骨架屏元素的类型 */
  variant?: SkeletonVariant;
  className?: string;
  style?: CSSProperties;
}

/**
 * 对应官方 ElSkeletonItem。
 * variant 决定尺寸与圆角，全部由 scss 里 .el-skeleton__{variant} 定义。
 */
export function ElSkeletonItem({
  variant = "text",
  className,
  style,
}: SkeletonItemProps) {
  const classes = ["el-skeleton__item", `el-skeleton__${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={style}>
      {variant === "image" && <PictureFilled />}
    </div>
  );
}
