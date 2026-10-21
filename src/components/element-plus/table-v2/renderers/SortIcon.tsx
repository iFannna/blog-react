"use client";

import { ElIcon } from "../../icon/ElIcon";
import { SortDown, SortUp } from "../../generated/icons";
import { SortOrder } from "../constants";

export interface SortIconProps {
  sortOrder: SortOrder;
  ariaLabel?: string;
  className?: string;
}

/** 对应官方 components/sort-icon.tsx。 */
export function SortIcon({ sortOrder, ariaLabel, className }: SortIconProps) {
  return (
    <button type="button" aria-label={ariaLabel} className={className}>
      <ElIcon size={14}>
        {sortOrder === SortOrder.ASC ? <SortUp /> : <SortDown />}
      </ElIcon>
    </button>
  );
}
