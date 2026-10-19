"use client";

import { Children, Fragment, type CSSProperties, type ReactNode } from "react";

export type SpaceSize = "small" | "default" | "large" | number;

export interface SpaceProps {
  /** 排列方向 */
  direction?: "horizontal" | "vertical";
  /** 间距，可传尺寸名、数字，或 [水平, 垂直] 元组 */
  size?: SpaceSize | [SpaceSize, SpaceSize];
  /** 交叉轴对齐方式，对应官方 alignment */
  alignment?: CSSProperties["alignItems"];
  /** 是否自动换行 */
  wrap?: boolean;
  /** 是否让子项填满整行 */
  fill?: boolean;
  /** 填满时单个子项的最小宽度百分比 */
  fillRatio?: number;
  /** 自定义间隔元素，对应官方 spacer */
  spacer?: ReactNode;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** 与官方 use-space.ts 的 SIZE_MAP 一致。 */
const SIZE_MAP = {
  small: 8,
  default: 12,
  large: 16,
} as const;

function resolveSizeValue(size: SpaceSize): number {
  if (typeof size === "number") return size;
  return SIZE_MAP[size] ?? SIZE_MAP.small;
}

/**
 * 对应官方 ElSpace。
 *
 * 官方用 flex 的 row-gap / column-gap 实现间距（而非给子项加 margin），
 * 这样首尾不会多出空白。换行或填满时横纵间距取同一个值。
 */
export function ElSpace({
  direction = "horizontal",
  size = "small",
  alignment = "center",
  wrap = false,
  fill = false,
  fillRatio = 100,
  spacer = null,
  className,
  style,
  children,
}: SpaceProps) {
  let horizontalSize = 0;
  let verticalSize = 0;

  if (Array.isArray(size)) {
    const [h = 0, v = 0] = size;
    horizontalSize = resolveSizeValue(h);
    verticalSize = resolveSizeValue(v);
  } else {
    const val = resolveSizeValue(size);

    // 换行或填满时，纵向也要留同样间距，否则行与行会贴在一起
    if ((wrap || fill) && direction === "horizontal") {
      horizontalSize = val;
      verticalSize = val;
    } else if (direction === "horizontal") {
      horizontalSize = val;
      verticalSize = 0;
    } else {
      verticalSize = val;
      horizontalSize = 0;
    }
  }

  const classes = [
    "el-space",
    `el-space--${direction}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const containerStyle: CSSProperties = {
    ...((wrap || fill) && { flexWrap: "wrap" }),
    alignItems: alignment,
    rowGap: `${verticalSize}px`,
    columnGap: `${horizontalSize}px`,
    ...style,
  };

  const itemStyle: CSSProperties = fill
    ? { flexGrow: 1, minWidth: `${fillRatio}%` }
    : {};

  const items = Children.toArray(children);

  return (
    <div className={classes} style={containerStyle}>
      {items.map((child, index) => (
        // 官方把每个子项包一层 .el-space__item，spacer 插在项之间
        <Fragment key={index}>
          <div className="el-space__item" style={itemStyle}>
            {child}
          </div>
          {spacer !== null && index < items.length - 1 && (
            <div className="el-space__item" style={itemStyle}>
              {spacer}
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
