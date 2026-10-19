"use client";

import {
  Children,
  Fragment,
  isValidElement,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ElAvatar, AvatarGroupContext, type AvatarShape } from "./ElAvatar";
import { ElTooltip } from "../tooltip";
import type { PopperEffect, PopperPlacement } from "../popper/use-popper";
import type { ComponentSize } from "../button/types";

export interface AvatarGroupProps {
  /** 统一尺寸，下发到组内 Avatar */
  size?: number | ComponentSize;
  /** 统一形状，下发到组内 Avatar */
  shape?: AvatarShape;
  /** 是否折叠超出的头像 */
  collapseAvatars?: boolean;
  /** 悬浮折叠头像时是否展示全部被折叠的头像 */
  collapseAvatarsTooltip?: boolean;
  /** 最多展示的头像数量 */
  maxCollapseAvatars?: number;
  /** 折叠提示的主题 */
  effect?: PopperEffect;
  /** 折叠提示的位置 */
  placement?: PopperPlacement;
  /** 折叠提示的自定义类名 */
  popperClass?: string;
  /** 折叠提示的自定义样式 */
  popperStyle?: CSSProperties;
  /** 折叠头像的类名 */
  collapseClass?: string;
  /** 折叠头像的样式 */
  collapseStyle?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

/** 对应官方 flattedChildren：展开 Fragment，只统计真实的头像节点。 */
function flattenChildren(children: ReactNode): ReactNode[] {
  const result: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
      result.push(...flattenChildren(child.props.children));
    } else {
      result.push(child);
    }
  });

  return result;
}

/**
 * 对应官方 ElAvatarGroup。
 *
 * 官方直接 clone 子节点计算可见数量；React 侧用 Children 展开后切片，
 * 折叠头像由 ElTooltip 包裹，行为与官方模板一致。
 */
export function ElAvatarGroup({
  size,
  shape,
  collapseAvatars = false,
  collapseAvatarsTooltip = false,
  maxCollapseAvatars = 1,
  effect = "light",
  placement = "top",
  popperClass,
  popperStyle,
  collapseClass,
  collapseStyle,
  className,
  children,
}: AvatarGroupProps) {
  const classes = ["el-avatar-group", className].filter(Boolean).join(" ");
  const avatars = flattenChildren(children);

  const showCollapseAvatar =
    collapseAvatars && avatars.length > maxCollapseAvatars;

  const visibleAvatars = showCollapseAvatar
    ? avatars.slice(0, maxCollapseAvatars)
    : avatars;
  const hiddenAvatars = showCollapseAvatar
    ? avatars.slice(maxCollapseAvatars)
    : [];

  return (
    <AvatarGroupContext.Provider value={{ size, shape }}>
      <div className={classes}>
        {visibleAvatars}
        {showCollapseAvatar && (
          <ElTooltip
            key="collapse-avatar"
            content={
              <div className="el-avatar-group__collapse-avatars">
                {hiddenAvatars}
              </div>
            }
            placement={placement}
            effect={effect}
            popperClass={popperClass}
            popperStyle={popperStyle}
            disabled={!collapseAvatarsTooltip}
          >
            <ElAvatar
              size={size}
              shape={shape}
              className={collapseClass}
              style={collapseStyle}
            >
              + {hiddenAvatars.length}
            </ElAvatar>
          </ElTooltip>
        )}
      </div>
    </AvatarGroupContext.Provider>
  );
}
