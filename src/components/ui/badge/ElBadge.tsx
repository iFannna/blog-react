"use client";

import type { CSSProperties, ReactNode } from "react";
import { addUnit } from "../utils";

export type BadgeType = "primary" | "success" | "warning" | "info" | "danger";

export interface BadgeProps {
  /** 显示值 */
  value?: string | number;
  /** 最大值，超出显示 {max}+，仅 value 为数字时生效 */
  max?: number;
  /** 是否显示为小圆点 */
  isDot?: boolean;
  /** 是否隐藏徽章 */
  hidden?: boolean;
  /** 徽章类型 */
  type?: BadgeType;
  /** value 为 0 时是否显示 */
  showZero?: boolean;
  /** 自定义圆点背景色 */
  color?: string;
  /** 徽章样式 */
  badgeStyle?: CSSProperties;
  /** 徽章类名 */
  badgeClass?: string;
  /** 徽章偏移量 [x, y] */
  offset?: [number, number];
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** 自定义徽章内容，对应官方 content 插槽，参数为计算后的值 */
  content?: (value: string) => ReactNode;
}

/** 对应官方 ElBadge。 */
export function ElBadge({
  value = "",
  max = 99,
  isDot = false,
  hidden = false,
  type = "danger",
  showZero = true,
  color,
  badgeStyle,
  badgeClass,
  offset = [0, 0],
  className,
  style,
  children,
  content,
}: BadgeProps) {
  const isNumber = (val: unknown): val is number =>
    typeof val === "number" && !Number.isNaN(val);

  // 与官方一致：仅当 value 与 max 都是数字时才做上限截断
  const computed = (() => {
    if (isDot) return "";
    if (isNumber(value) && isNumber(max)) {
      return max < value ? `${max}+` : `${value}`;
    }
    return `${value}`;
  })();

  const classes = ["el-badge", className].filter(Boolean).join(" ");

  const [offsetX, offsetY] = offset;

  const supClasses = [
    "el-badge__content",
    `el-badge__content--${type}`,
    // 有默认内容时徽章绝对定位到右上角
    !!children && "is-fixed",
    isDot && "is-dot",
    !showZero && value === 0 && "is-hide-zero",
    badgeClass,
  ]
    .filter(Boolean)
    .join(" ");

  const supStyle: CSSProperties = {
    backgroundColor: color,
    marginRight: addUnit(-offsetX),
    marginTop: addUnit(offsetY),
    ...badgeStyle,
  };

  // 官方用 el-zoom-in-center 过渡；无内容时整块不渲染
  const showSup = !hidden && (computed !== "" || isDot);

  return (
    <div className={classes} style={style}>
      {children}
      {showSup && (
        <sup className={supClasses} style={supStyle}>
          {content ? content(computed) : computed}
        </sup>
      )}
    </div>
  );
}
