"use client";

import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";

export interface OverlayProps {
  /** 是否渲染遮罩。false 时只渲染一个无样式的容器 */
  mask?: boolean;
  /**
   * 是否自定义遮罩事件。true 时不接管 click/mousedown/mouseup，
   * 由使用方自行处理（对应官方 customMaskEvent）
   */
  customMaskEvent?: boolean;
  /** 遮罩类名 */
  overlayClass?: string;
  /** 层级 */
  zIndex?: number | string;
  /** 点击遮罩本身时触发 */
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 对应官方 ElOverlay。
 *
 * 关键在 useSameTarget 这套判定：只有在遮罩上 mousedown、且在同处 mouseup，
 * 后续的 click 才算「点了遮罩」。
 * 否则用户在弹层内部按下、拖到遮罩上松开也会误触发关闭。
 * 事件顺序是 mousedown → mouseup → click，因此判定要在 click 里做并随即重置。
 */
export function ElOverlay({
  mask = true,
  customMaskEvent = false,
  overlayClass,
  zIndex,
  onClick,
  className,
  style,
  children,
}: OverlayProps) {
  const mousedownTargetRef = useRef(false);
  const mouseupTargetRef = useRef(false);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    // 两个标记都为真才认为是点遮罩
    if (mousedownTargetRef.current && mouseupTargetRef.current) {
      onClick?.(event);
    }
    // 处理完立刻重置，避免下一次点击拿到旧状态
    mousedownTargetRef.current = false;
    mouseupTargetRef.current = false;
  };

  const handleMousedown = (event: MouseEvent<HTMLDivElement>) => {
    mousedownTargetRef.current = event.target === event.currentTarget;
  };

  const handleMouseup = (event: MouseEvent<HTMLDivElement>) => {
    mouseupTargetRef.current = event.target === event.currentTarget;
  };

  const maskClasses = ["el-overlay", overlayClass, className]
    .filter(Boolean)
    .join(" ");

  const mergedStyle: CSSProperties = { zIndex, ...style };

  if (!mask) {
    // 无遮罩时只渲染一个透明容器，不带 el-overlay 样式
    return (
      <div className={[overlayClass, className].filter(Boolean).join(" ")} style={mergedStyle}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={maskClasses}
      style={mergedStyle}
      onClick={customMaskEvent ? undefined : handleClick}
      onMouseDown={customMaskEvent ? undefined : handleMousedown}
      onMouseUp={customMaskEvent ? undefined : handleMouseup}
    >
      {children}
    </div>
  );
}
