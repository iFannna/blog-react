"use client";

import type { Ref } from "react";

import { ElVirtualGrid } from "./ElVirtualGrid";
import { fixedSizeGridCalculator } from "./fixed-size-grid";

import type {
  GridCalculator,
  VirtualGridHandle,
  VirtualizedGridProps,
} from "./types";

export interface FixedSizeGridProps<T = unknown>
  extends VirtualizedGridProps<T> {
  ref?: Ref<VirtualGridHandle>;
}

/** 对应官方 ElFixedSizeGrid。 */
export function ElFixedSizeGrid<T>({
  ref,
  ...props
}: FixedSizeGridProps<T>) {
  return (
    <ElVirtualGrid
      {...props}
      ref={ref}
      calculator={fixedSizeGridCalculator as GridCalculator<T>}
    />
  );
}
