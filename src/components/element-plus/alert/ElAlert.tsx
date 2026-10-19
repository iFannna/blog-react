"use client";

import { useState, type ReactNode } from "react";
import { ElIcon } from "../icon/ElIcon";
import {
  CircleCloseFilled,
  Close,
  InfoFilled,
  SuccessFilled,
  WarningFilled,
} from "../icons";

export type AlertType = "primary" | "success" | "warning" | "error" | "info";
export type AlertEffect = "light" | "dark";

/** 对应官方 TypeComponentsMap 里 alert 用到的部分。 */
const TYPE_ICONS: Record<AlertType, ReactNode> = {
  primary: <InfoFilled />,
  success: <SuccessFilled />,
  warning: <WarningFilled />,
  error: <CircleCloseFilled />,
  info: <InfoFilled />,
};

export interface AlertProps {
  /** 标题，也可用 title 传入节点 */
  title?: ReactNode;
  /** 描述文字。传入后标题与描述会纵向排列 */
  description?: ReactNode;
  /** 主题类型 */
  type?: AlertType;
  /** 是否可关闭 */
  closable?: boolean;
  /** 自定义关闭按钮的文案，传入后替换默认的 × 图标 */
  closeText?: string;
  /** 是否显示图标 */
  showIcon?: boolean;
  /** 内容是否居中 */
  center?: boolean;
  /** 主题 */
  effect?: AlertEffect;
  className?: string;
  /** 关闭时触发，对应官方 close 事件 */
  onClose?: (event: React.MouseEvent<HTMLElement>) => void;
  /** 自定义图标，对应官方 icon 插槽 */
  icon?: ReactNode;
}

/**
 * 对应官方 ElAlert。
 *
 * 官方用 v-show 控制显隐，组件内部维护 visible 状态；
 * React 侧沿用该职责，关闭时先走动画再通知使用方。
 */
export function ElAlert({
  title,
  description,
  type = "info",
  closable = true,
  closeText = "",
  showIcon = false,
  center = false,
  effect = "light",
  className,
  onClose,
  icon,
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  const hasDesc = description !== undefined && description !== null && description !== "";

  const classes = [
    "el-alert",
    `el-alert--${type}`,
    center && "is-center",
    `is-${effect}`,
    // 关闭时打上淡出标记，与官方 el-alert-fade 过渡对应
    !visible && "el-alert-fade-leave-active",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (!visible) return null;

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    setVisible(false);
    onClose?.(event);
  };

  return (
    <div className={classes} role="alert">
      {showIcon && (
        <ElIcon className={hasDesc ? "el-alert__icon is-big" : "el-alert__icon"}>
          {icon ?? TYPE_ICONS[type]}
        </ElIcon>
      )}

      <div className="el-alert__content">
        {title !== undefined && title !== "" && (
          <span
            className={
              hasDesc ? "el-alert__title with-description" : "el-alert__title"
            }
          >
            {title}
          </span>
        )}

        {hasDesc && <p className="el-alert__description">{description}</p>}

        {closable &&
          (closeText ? (
            <div
              className="el-alert__close-btn is-customed"
              onClick={handleClose}
            >
              {closeText}
            </div>
          ) : (
            <ElIcon className="el-alert__close-btn" onClick={handleClose}>
              <Close />
            </ElIcon>
          ))}
      </div>
    </div>
  );
}
