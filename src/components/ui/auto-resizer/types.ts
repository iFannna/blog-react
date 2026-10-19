import type { ReactNode } from "react";

export interface AutoResizeSize {
  width: number;
  height: number;
}

export interface AutoResizerProps {
  /** 官方声明但当前未参与计算，保留以对齐 API */
  disableWidth?: boolean;
  /** 官方声明但当前未参与计算，保留以对齐 API */
  disableHeight?: boolean;
  /** 尺寸变化回调，已扣除 padding */
  onResize?: (size: AutoResizeSize) => void;
  /** 作用域插槽的 React 映射 */
  children: (size: AutoResizeSize) => ReactNode;
}
