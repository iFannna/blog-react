"use client";

import {
  Children,
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ElIcon } from "../icon/ElIcon";

export type TimelineMode =
  | "start"
  | "alternate"
  | "alternate-reverse"
  | "end";

const TimelineContext = createContext<TimelineMode>("start");

export type TimelineNodeType =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";
export type TimelineNodeSize = "normal" | "large";
export type TimelinePlacement = "top" | "bottom";

export interface TimelineItemProps {
  /** 时间戳文本 */
  timestamp?: ReactNode;
  /** 是否隐藏时间戳 */
  hideTimestamp?: boolean;
  /** 是否居中（内容在轴线两侧） */
  center?: boolean;
  /** 时间戳相对内容的位置 */
  placement?: TimelinePlacement;
  /** 节点类型 */
  type?: TimelineNodeType;
  /** 节点颜色，传入后覆盖 type 的配色 */
  color?: string;
  /** 节点尺寸 */
  size?: TimelineNodeSize;
  /** 自定义节点图标 */
  icon?: ReactNode;
  /** 完全自定义节点内容，对应官方 dot 插槽 */
  dot?: ReactNode;
  /** 是否空心节点 */
  hollow?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * 对应官方 ElTimelineItem。
 *
 * 结构：item 内含 tail（竖线）、node（圆点或图标）、wrapper（内容 + 时间戳）。
 * 时间戳在 bottom 位置时渲染在内容下方，否则在上方。
 */
export function ElTimelineItem({
  timestamp,
  hideTimestamp = false,
  center = false,
  placement = "bottom",
  type,
  color,
  size = "normal",
  icon,
  dot,
  hollow = false,
  className,
  children,
}: TimelineItemProps) {
  const mode = useContext(TimelineContext);

  const classes = [
    "el-timeline-item",
    center && "el-timeline-item__center",
    `is-${mode}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const nodeClasses = [
    "el-timeline-item__node",
    type && `el-timeline-item__node--${type}`,
    `el-timeline-item__node--${size}`,
    hollow && "is-hollow",
  ]
    .filter(Boolean)
    .join(" ");

  const nodeStyle: CSSProperties = { backgroundColor: color };

  const timestampNode =
    !hideTimestamp && timestamp !== undefined ? (
      <div
        className={[
          "el-timeline-item__timestamp",
          placement === "top" ? "is-top" : "is-bottom",
        ].join(" ")}
      >
        {timestamp}
      </div>
    ) : null;

  return (
    <li className={classes}>
      <div className="el-timeline-item__tail" />

      {dot !== undefined ? (
        <div className="el-timeline-item__dot">{dot}</div>
      ) : (
        <div className={nodeClasses} style={nodeStyle}>
          {icon && (
            <ElIcon className="el-timeline-item__icon">{icon}</ElIcon>
          )}
        </div>
      )}

      <div className="el-timeline-item__wrapper">
        {placement === "top" && timestampNode}
        <div className="el-timeline-item__content">{children}</div>
        {placement === "bottom" && timestampNode}
      </div>
    </li>
  );
}

export interface TimelineProps {
  /** 时间线与内容的相对位置 */
  mode?: TimelineMode;
  /** 是否反向排列子项 */
  reverse?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** 对应官方 ElTimeline：ul 容器，按 mode / reverse 排列子项。 */
export function ElTimeline({
  mode = "start",
  reverse = false,
  className,
  style,
  children,
}: TimelineProps) {
  const items = Children.toArray(children);
  const ordered = reverse ? [...items].reverse() : items;

  return (
    <TimelineContext.Provider value={mode}>
      <ul
        className={["el-timeline", `is-${mode}`, className]
          .filter(Boolean)
          .join(" ")}
        style={style}
      >
        {ordered}
      </ul>
    </TimelineContext.Provider>
  );
}
