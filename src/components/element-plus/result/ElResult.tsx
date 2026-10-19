"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  CircleCheckFilled,
  CircleCloseFilled,
  InfoFilled,
  WarningFilled,
} from "../icons";

export type ResultIconType = "primary" | "success" | "warning" | "info" | "error";

export interface ResultProps {
  /** 标题 */
  title?: ReactNode;
  /** 副标题 */
  subTitle?: ReactNode;
  /** 图标类型 */
  icon?: ResultIconType;
  className?: string;
  style?: CSSProperties;
  /** 自定义图标，对应官方 icon 插槽 */
  customIcon?: ReactNode;
  /** 底部操作区，对应官方 extra 插槽 */
  extra?: ReactNode;
}

/**
 * 与官方 result/src/result.ts 的 IconMap / IconComponentMap 一致。
 * className 直接加到 svg 上（官方即如此），由 `.el-result .icon-success`
 * 这类后代选择器提供配色。
 */
const ICON_MAP: Record<
  ResultIconType,
  { className: string; node: (props: { className: string }) => ReactNode }
> = {
  primary: {
    className: "icon-primary",
    node: (props) => <InfoFilled {...props} />,
  },
  success: {
    className: "icon-success",
    node: (props) => <CircleCheckFilled {...props} />,
  },
  warning: {
    className: "icon-warning",
    node: (props) => <WarningFilled {...props} />,
  },
  error: {
    className: "icon-error",
    node: (props) => <CircleCloseFilled {...props} />,
  },
  info: {
    className: "icon-info",
    node: (props) => <InfoFilled {...props} />,
  },
};

/** 对应官方 ElResult。 */
export function ElResult({
  title,
  subTitle,
  icon = "info",
  className,
  style,
  customIcon,
  extra,
}: ResultProps) {
  const classes = ["el-result", className].filter(Boolean).join(" ");

  const resolved = ICON_MAP[icon] ?? ICON_MAP.info;

  const hasTitle = title !== undefined && title !== null && title !== "";
  const hasSubTitle = subTitle !== undefined && subTitle !== null && subTitle !== "";

  return (
    <div className={classes} style={style}>
      <div className="el-result__icon">
        {/* 官方把 icon-{type} 类直接加在 svg 上（无包裹层）：配色由
            `.el-result .icon-success` 提供，尺寸由 `.el-result__icon svg` 提供 */}
        {customIcon ?? resolved.node({ className: resolved.className })}
      </div>

      {hasTitle && (
        <div className="el-result__title">
          {typeof title === "string" ? <p>{title}</p> : title}
        </div>
      )}

      {hasSubTitle && (
        <div className="el-result__subtitle">
          {typeof subTitle === "string" ? <p>{subTitle}</p> : subTitle}
        </div>
      )}

      {extra !== undefined && <div className="el-result__extra">{extra}</div>}
    </div>
  );
}
