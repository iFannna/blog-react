"use client";

import {
  useState,
  type CSSProperties,
  type DragEventHandler,
  type MouseEvent,
  type ReactNode,
} from "react";
import { ElIcon } from "../icon/ElIcon";
import { Close } from "../icons";
import { useTranslator } from "../config-provider/context";
import type { ComponentSize } from "../button/types";

export type TagType = "primary" | "success" | "info" | "warning" | "danger";
export type TagEffect = "dark" | "light" | "plain";

export interface TagProps {
  /** 主题类型 */
  type?: TagType;
  /** 是否可关闭 */
  closable?: boolean;
  /** 关闭动画时长（ms）。官方 disableTransitions 关闭全部动画时用 0 */
  disableTransitions?: boolean;
  /** 是否高亮边框 */
  hit?: boolean;
  /** 自定义背景色，对应官方 color */
  color?: string;
  size?: ComponentSize;
  /** 主题 */
  effect?: TagEffect;
  /** 是否圆角 */
  round?: boolean;
  className?: string;
  style?: CSSProperties;
  /** 原生 title，对应官方 Vue 组件的 attrs 透传 */
  title?: string;
  children?: ReactNode;
  /** 关闭时触发 */
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** 点击标签时触发 */
  onClick?: (event: MouseEvent<HTMLSpanElement>) => void;
  /** 关闭按钮的无障碍标签，缺省取 locale 的 el.tag.close */
  closeLabel?: string;
  /** 原生 draggable，官方由 attrs 透传；input-tag 拖拽需要 */
  draggable?: boolean;
  onDragStart?: DragEventHandler<HTMLSpanElement>;
  onDragOver?: DragEventHandler<HTMLSpanElement>;
  onDragEnd?: DragEventHandler<HTMLSpanElement>;
  onDrop?: DragEventHandler<HTMLSpanElement>;
}

/** 对应官方 ElTag。关闭动画由 el-zoom-in-center 过渡类实现。 */
export function ElTag({
  type = "primary",
  closable = false,
  disableTransitions = false,
  hit = false,
  color,
  size,
  effect = "light",
  round = false,
  className,
  style,
  title,
  children,
  onClose,
  onClick,
  closeLabel,
  draggable,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
}: TagProps) {
  const [leaving, setLeaving] = useState(false);
  const t = useTranslator();
  const resolvedCloseLabel = closeLabel ?? t("el.tag.close");

  const classes = [
    "el-tag",
    closable && "is-closable",
    `el-tag--${type || "primary"}`,
    size && `el-tag--${size}`,
    `el-tag--${effect}`,
    hit && "is-hit",
    round && "is-round",
    // 关闭动画：与官方 el-zoom-in-center 的收起阶段对应
    !disableTransitions && leaving && "el-zoom-in-center-leave-active",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    // 官方 ElTag 自身不做动画移除，是否卸载由使用方决定；
    // 这里先给出收起动画标记再回传事件，保持视觉与官方一致
    if (!disableTransitions) setLeaving(true);
    onClose?.(event);
  };

  return (
    <span
      className={classes}
      style={{ ...style, backgroundColor: color || undefined }}
      title={title}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
    >
      <span className="el-tag__content">{children}</span>
      {closable && (
        <button
          className="el-tag__close"
          type="button"
          aria-label={resolvedCloseLabel}
          onClick={(event) => {
            event.stopPropagation();
            handleClose(event);
          }}
        >
          <ElIcon>
            <Close />
          </ElIcon>
        </button>
      )}
    </span>
  );
}
