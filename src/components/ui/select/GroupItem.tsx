"use client";

import type { CSSProperties } from "react";

import type { SelectOptionType } from "./types";

export interface GroupItemProps {
  item: SelectOptionType;
  style?: CSSProperties;
  height?: number;
}

/** 对应官方 group-item.vue，行高随虚拟列表的估算尺寸同步。 */
export function GroupItem({ item, style, height }: GroupItemProps) {
  return (
    <div
      className="el-select-group__title"
      style={{ ...style, lineHeight: `${height ?? 0}px` }}
    >
      {String(item.label ?? "")}
    </div>
  );
}
