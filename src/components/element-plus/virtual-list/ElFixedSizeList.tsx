"use client";

import type { Ref } from "react";

import { ElVirtualList } from "./ElVirtualList";
import { fixedSizeListCalculator } from "./fixed-size-list";

import type {
  ListCalculator,
  VirtualizedListProps,
  VirtualListHandle,
} from "./types";

export interface FixedSizeListProps<T = unknown>
  extends VirtualizedListProps<T> {
  ref?: Ref<VirtualListHandle>;
}

/**
 * 对应官方 ElFixedSizeList。children 走 render prop：
 * `children({ data, index, isScrolling, style })`。
 */
export function ElFixedSizeList<T>({
  ref,
  ...props
}: FixedSizeListProps<T>) {
  return (
    <ElVirtualList
      {...props}
      ref={ref}
      calculator={fixedSizeListCalculator as ListCalculator<T>}
    />
  );
}
