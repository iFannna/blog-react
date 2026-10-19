"use client";

import type { CSSProperties, ReactNode } from "react";
import { ElDivider } from "../divider";
import { ElIcon } from "../icon/ElIcon";
import { BackIcon } from "./BackIcon";

export interface PageHeaderProps {
  /** 图标，默认内置 Back 箭头；传 "" 可隐藏图标 */
  icon?: ReactNode;
  /** 主标题，省略时回退到返回文案（对应官方 a11y 默认值） */
  title?: string;
  /** 标题右侧内容 */
  content?: string;
  /** 图标插槽，传入后作为整体替换默认图标（不再包 el-icon） */
  iconSlot?: ReactNode;
  /** 标题插槽 */
  titleSlot?: ReactNode;
  /** 内容插槽 */
  contentSlot?: ReactNode;
  /** 面包屑，对应官方 breadcrumb 插槽 */
  breadcrumb?: ReactNode;
  /** 右侧操作区，对应官方 extra 插槽 */
  extra?: ReactNode;
  /** 点击左侧返回区时触发 */
  onBack?: () => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** 官方 locale 的 el.pageHeader.title，中文包为「返回」 */
const DEFAULT_TITLE = "返回";

/** 判断插槽是否有效：undefined / null / false 视为未传。 */
function hasSlot(node: ReactNode) {
  return node !== undefined && node !== null && node !== false;
}

/**
 * 对应官方 ElPageHeader。
 *
 * 结构：.el-page-header[.is-contentful][.--has-breadcrumb][.--has-extra]
 *   > .el-page-header__breadcrumb（有面包屑时）
 *   > .el-page-header__header
 *       > .el-page-header__left
 *           > .el-page-header__back（role=button，点击触发 onBack）
 *               > .el-page-header__icon + .el-page-header__title
 *           > .el-divider--vertical
 *           > .el-page-header__content
 *       > .el-page-header__extra（有额外区时）
 *   > .el-page-header__main（有默认插槽时）
 */
export function ElPageHeader({
  icon = <BackIcon />,
  title,
  content = "",
  iconSlot,
  titleSlot,
  contentSlot,
  breadcrumb,
  extra,
  onBack,
  className,
  style,
  children,
}: PageHeaderProps) {
  const showBreadcrumb = hasSlot(breadcrumb);
  const showExtra = hasSlot(extra);
  const showMain = hasSlot(children);
  // 官方 v-if="icon || $slots.icon"：空串 icon 不渲染图标区
  const showIcon = hasSlot(iconSlot) || Boolean(icon);

  const classes = [
    "el-page-header",
    showMain && "is-contentful",
    showBreadcrumb && "el-page-header--has-breadcrumb",
    showExtra && "el-page-header--has-extra",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} style={style}>
      {showBreadcrumb && (
        <div className="el-page-header__breadcrumb">{breadcrumb}</div>
      )}

      <div className="el-page-header__header">
        <div className="el-page-header__left">
          <div
            className="el-page-header__back"
            role="button"
            tabIndex={0}
            onClick={() => onBack?.()}
          >
            {showIcon && (
              <div
                className="el-page-header__icon"
                aria-label={title || DEFAULT_TITLE}
              >
                {hasSlot(iconSlot) ? (
                  iconSlot
                ) : (
                  <ElIcon>{icon}</ElIcon>
                )}
              </div>
            )}
            <div className="el-page-header__title">
              {hasSlot(titleSlot) ? titleSlot : title || DEFAULT_TITLE}
            </div>
          </div>

          <ElDivider direction="vertical" />

          <div className="el-page-header__content">
            {hasSlot(contentSlot) ? contentSlot : content}
          </div>
        </div>

        {showExtra && <div className="el-page-header__extra">{extra}</div>}
      </div>

      {showMain && <div className="el-page-header__main">{children}</div>}
    </div>
  );
}
