"use client";

import { useAutoResize } from "./use-auto-resize";

import type { AutoResizerProps } from "./types";

/**
 * 对应官方 ElAutoResizer。
 *
 * 官方是 table-v2 内部的工具组件，DOM 固定为
 * `.el-auto-resizer`（100% × 100%）并向下传递测量结果。
 */
export function ElAutoResizer({ onResize, children }: AutoResizerProps) {
  const { sizer, width, height } = useAutoResize({ onResize });

  return (
    <div
      ref={sizer}
      className="el-auto-resizer"
      style={{ width: "100%", height: "100%" }}
    >
      {children({ width, height })}
    </div>
  );
}
