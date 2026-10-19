"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInfiniteScroll, type UseInfiniteScrollOptions } from "./useInfiniteScroll";

export interface InfiniteScrollProps {
  /** 列表内容 */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * useInfiniteScroll 的便捷包装。
 *
 * 官方是纯指令、不产出任何包装 DOM 与属性（theme-chalk 里 likewise 没有对应的
 * .el-infinite-scroll 规则），所以这里也只透传 className / style，不加额外语义属性。
 *
 * 需要同时拿到 DOM 节点、或滚动元素不是普通 div（如 ul + 自己的滚动样式）时，
 * 直接调 useInfiniteScroll(elRef, options) 更灵活。
 */
export function ElInfiniteScroll({
  children,
  onLoad,
  disabled,
  delay,
  distance,
  immediate,
  className,
  style,
}: InfiniteScrollProps & UseInfiniteScrollOptions) {
  const containerRef = useRef<HTMLDivElement>(null);

  useInfiniteScroll(containerRef, { onLoad, disabled, delay, distance, immediate });

  return (
    <div ref={containerRef} className={className} style={style}>
      {children}
    </div>
  );
}
