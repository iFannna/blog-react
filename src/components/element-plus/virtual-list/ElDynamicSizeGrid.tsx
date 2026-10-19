"use client";

import type { Ref } from "react";

import { ElVirtualGrid } from "./ElVirtualGrid";
import { dynamicSizeGridCalculator } from "./dynamic-size-grid";

import type {
  GridCalculator,
  VirtualGridHandle,
  VirtualizedGridProps,
} from "./types";

export interface DynamicSizeGridProps<T = unknown>
  extends VirtualizedGridProps<T> {
  ref?: Ref<VirtualGridHandle>;
}

/** 对应官方 ElDynamicSizeGrid。columnWidth / rowHeight 必须是函数。 */
export function ElDynamicSizeGrid<T>({
  ref,
  ...props
}: DynamicSizeGridProps<T>) {
  return (
    <ElVirtualGrid
      {...props}
      ref={ref}
      calculator={dynamicSizeGridCalculator as GridCalculator<T>}
    />
  );
}
