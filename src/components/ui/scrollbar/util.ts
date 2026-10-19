import type { CSSProperties } from "react";

/** 官方 thumb 里 bar 实例与 bar 实例之间的间隙（上下各 2px）。 */
export const GAP = 4;

/**
 * 官方 BAR_MAP：把「垂直 / 水平」两套 DOM 字段名收敛成一份配置，
 * 让上层的换算逻辑只写一遍。
 *
 * 字段类型写成字面量联合，这样 `el[bar.offset]` 这类下标访问在 TS 里也是可索引的。
 */
export interface BarMapItem {
  offset: "offsetHeight" | "offsetWidth";
  scroll: "scrollTop" | "scrollLeft";
  scrollSize: "scrollHeight" | "scrollWidth";
  size: "height" | "width";
  key: "vertical" | "horizontal";
  axis: "Y" | "X";
  client: "clientY" | "clientX";
  direction: "top" | "left";
}

export const BAR_MAP: Record<"vertical" | "horizontal", BarMapItem> = {
  vertical: {
    offset: "offsetHeight",
    scroll: "scrollTop",
    scrollSize: "scrollHeight",
    size: "height",
    key: "vertical",
    axis: "Y",
    client: "clientY",
    direction: "top",
  },
  horizontal: {
    offset: "offsetWidth",
    scroll: "scrollLeft",
    scrollSize: "scrollWidth",
    size: "width",
    key: "horizontal",
    axis: "X",
    client: "clientX",
    direction: "left",
  },
};

/** 对应官方 renderThumbStyle：把位移百分比换成 transform，尺寸按方向落到 height / width 上。 */
export function renderThumbStyle({
  move,
  size,
  bar,
}: {
  move: number;
  size: string;
  bar: BarMapItem;
}): CSSProperties {
  return {
    [bar.size]: size,
    transform: `translate${bar.axis}(${move}%)`,
  };
}
