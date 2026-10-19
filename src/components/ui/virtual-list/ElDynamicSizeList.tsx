"use client";

import type { Ref } from "react";

import { ElVirtualList } from "./ElVirtualList";
import { dynamicSizeListCalculator } from "./dynamic-size-list";

import type {
  ListCalculator,
  VirtualizedListProps,
  VirtualListHandle,
} from "./types";

export interface DynamicSizeListProps<T = unknown>
  extends VirtualizedListProps<T> {
  ref?: Ref<VirtualListHandle>;
}

/**
 * 对应官方 ElDynamicSizeList。itemSize 必须是函数，按索引返回行高。
 */
export function ElDynamicSizeList<T>({
  ref,
  ...props
}: DynamicSizeListProps<T>) {
  return (
    <ElVirtualList
      {...props}
      ref={ref}
      calculator={dynamicSizeListCalculator as ListCalculator<T>}
    />
  );
}
