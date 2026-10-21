"use client";

import type { CSSProperties, ReactNode } from "react";
import { ElIcon } from "../icon/ElIcon";
import {
  Check,
  CircleCheck,
  CircleClose,
  Close,
  WarningFilled,
} from "../generated/icons";

export type ProgressType = "line" | "circle" | "dashboard";
export type ProgressStatus = "" | "success" | "exception" | "warning";
export type ProgressColor =
  | string
  | ((percentage: number) => string)
  | Array<string | { color: string; percentage: number }>;

export interface ProgressProps {
  /** 进度类型 */
  type?: ProgressType;
  /** 百分比，0-100 */
  percentage?: number;
  /** 当前状态 */
  status?: ProgressStatus;
  /** 条纹动画周期（秒） */
  duration?: number;
  /** 线宽，仅 line 类型有效 */
  strokeWidth?: number;
  /** 线帽 */
  strokeLinecap?: "butt" | "round" | "square";
  /** 文字是否显示在进度条内部 */
  textInside?: boolean;
  /** 环形进度条画布宽度 */
  width?: number;
  /** 是否显示文字 */
  showText?: boolean;
  /** 进度条颜色，支持单色、分段、函数 */
  color?: ProgressColor;
  /** 是否应用条纹动画 */
  striped?: boolean;
  /** 是否应用流动效果 */
  stripedFlow?: boolean;
  /** 是否为不确定进度 */
  indeterminate?: boolean;
  /** 文字格式化函数 */
  format?: (percentage: number) => string;
  className?: string;
  style?: CSSProperties;
  /** 自定义文字内容，对应官方默认插槽，参数为百分比 */
  children?: (percentage: number) => ReactNode;
}

const STATUS_COLOR_MAP: Record<string, string> = {
  success: "#13ce66",
  exception: "#ff4949",
  warning: "#e6a23c",
  default: "#20a0ff",
};

/** 对应官方 getColors：把简写数组补全成带 percentage 的分段，再按百分比升序。 */
function getColors(color: ProgressColor) {
  if (typeof color !== "object" || color === null) return [];

  const span = 100 / color.length;
  return color
    .map((item, index) =>
      typeof item === "string"
        ? { color: item, percentage: (index + 1) * span }
        : item,
    )
    .sort((a, b) => a.percentage - b.percentage);
}

function getCurrentColor(color: ProgressColor | undefined, percentage: number) {
  if (typeof color === "function") return color(percentage);
  if (typeof color === "string") return color;

  if (Array.isArray(color)) {
    for (const item of getColors(color)) {
      if (item.percentage > percentage) return item.color;
    }
    // 超出所有分段时取最后一段，与官方一致
    const colors = getColors(color);
    return colors.length > 0 ? colors[colors.length - 1].color : "";
  }

  return "";
}

/** 对应官方 ElProgress。 */
export function ElProgress({
  type = "line",
  percentage = 0,
  status = "",
  duration = 3,
  strokeWidth = 6,
  strokeLinecap = "round",
  textInside = false,
  width = 126,
  showText = true,
  color = "",
  striped = false,
  stripedFlow = false,
  indeterminate = false,
  format = (p) => `${p}%`,
  className,
  style,
  children,
}: ProgressProps) {
  const barColor = getCurrentColor(color, percentage);

  const barStyle: CSSProperties = {
    width: `${percentage}%`,
    animationDuration: `${duration}s`,
    // 渐变要写 background，否则写 backgroundColor，与官方一致
    ...(barColor.includes("gradient")
      ? { background: barColor }
      : { backgroundColor: barColor }),
  };

  // 相对线宽：把绝对线宽换算成 viewBox 100x100 里的比例
  const relativeStrokeWidth = ((strokeWidth / width) * 100).toFixed(1);

  const radius =
    type === "circle" || type === "dashboard"
      ? Number.parseInt(
          `${50 - Number.parseFloat(relativeStrokeWidth) / 2}`,
          10,
        )
      : 0;

  const isDashboard = type === "dashboard";

  const trackPath = `
          M 50 50
          m 0 ${isDashboard ? "" : "-"}${radius}
          a ${radius} ${radius} 0 1 1 0 ${isDashboard ? "-" : ""}${radius * 2}
          a ${radius} ${radius} 0 1 1 0 ${isDashboard ? "" : "-"}${radius * 2}
          `;

  const perimeter = 2 * Math.PI * radius;
  const rate = isDashboard ? 0.75 : 1;
  const strokeDashoffset = `${(-1 * perimeter * (1 - rate)) / 2}px`;

  const trailPathStyle: CSSProperties = {
    strokeDasharray: `${perimeter * rate}px, ${perimeter}px`,
    strokeDashoffset,
  };

  const circlePathStyle: CSSProperties = {
    strokeDasharray: `${perimeter * rate * (percentage / 100)}px, ${perimeter}px`,
    strokeDashoffset,
    transition:
      "stroke-dasharray 0.6s ease 0s, stroke 0.6s ease, opacity ease 0.6s",
  };

  const stroke = color
    ? getCurrentColor(color, percentage)
    : STATUS_COLOR_MAP[status] || STATUS_COLOR_MAP.default;

  const statusIcon = (() => {
    if (status === "warning") return <WarningFilled />;
    if (type === "line") {
      return status === "success" ? <CircleCheck /> : <CircleClose />;
    }
    return status === "success" ? <Check /> : <Close />;
  })();

  const progressTextSize =
    type === "line" ? 12 + strokeWidth * 0.4 : width * 0.111111 + 2;

  const content = format(percentage);
  const showInnerText = (showText || !!children) && textInside;
  const showOuterText =
    (showText || !!children) && !textInside;

  const classes = [
    "el-progress",
    `el-progress--${type}`,
    status && `is-${status}`,
    !showText && "el-progress--without-text",
    textInside && "el-progress--text-inside",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const innerClasses = [
    "el-progress-bar__inner",
    indeterminate && "el-progress-bar__inner--indeterminate",
    striped && "el-progress-bar__inner--striped",
    stripedFlow && "el-progress-bar__inner--striped-flow",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={style}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {type === "line" ? (
        <div className="el-progress-bar">
          <div
            className="el-progress-bar__outer"
            style={{ height: `${strokeWidth}px` }}
          >
            <div className={innerClasses} style={barStyle}>
              {showInnerText && (
                <div className="el-progress-bar__innerText">
                  {children ? children(percentage) : <span>{content}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="el-progress-circle"
          style={{ height: `${width}px`, width: `${width}px` }}
        >
          <svg viewBox="0 0 100 100">
            <path
              className="el-progress-circle__track"
              d={trackPath}
              stroke="var(--el-fill-color-light, #e5e9f2)"
              strokeLinecap={strokeLinecap}
              strokeWidth={relativeStrokeWidth}
              fill="none"
              style={trailPathStyle}
            />
            <path
              className="el-progress-circle__path"
              d={trackPath}
              stroke={stroke}
              fill="none"
              opacity={percentage ? 1 : 0}
              strokeLinecap={strokeLinecap}
              strokeWidth={relativeStrokeWidth}
              style={circlePathStyle}
            />
          </svg>
        </div>
      )}

      {showOuterText && (
        <div className="el-progress__text" style={{ fontSize: `${progressTextSize}px` }}>
          {children ? (
            children(percentage)
          ) : status ? (
            <ElIcon>{statusIcon}</ElIcon>
          ) : (
            <span>{content}</span>
          )}
        </div>
      )}
    </div>
  );
}
