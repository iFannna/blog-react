import {
  BACKWARD,
  FORWARD,
  HORIZONTAL,
  LTR,
  RTL,
  RTL_OFFSET_NAG,
  RTL_OFFSET_POS_ASC,
  RTL_OFFSET_POS_DESC,
} from "./defaults";

import type { CSSProperties } from "react";
import type { Direction, LayoutDirection, RTLOffsetType } from "./types";

export const getScrollDir = (prev: number, cur: number) =>
  prev < cur ? FORWARD : BACKWARD;

export const isHorizontal = (dir?: LayoutDirection | string) =>
  dir === LTR || dir === RTL || dir === HORIZONTAL;

export const isRTL = (dir: Direction) => dir === RTL;

let cachedRTLResult: RTLOffsetType | null = null;

/** SSR 下没有 document，返回一个默认值，客户端首次滚动时会重新探测。 */
export function getRTLOffsetType(recalculate = false): RTLOffsetType {
  if (typeof document === "undefined") return RTL_OFFSET_NAG;

  if (cachedRTLResult === null || recalculate) {
    const outerDiv = document.createElement("div");
    const outerStyle = outerDiv.style;
    outerStyle.width = "50px";
    outerStyle.height = "50px";
    outerStyle.overflow = "scroll";
    outerStyle.direction = "rtl";

    const innerDiv = document.createElement("div");
    innerDiv.style.width = "100px";
    innerDiv.style.height = "100px";

    outerDiv.appendChild(innerDiv);
    document.body.appendChild(outerDiv);

    if (outerDiv.scrollLeft > 0) {
      cachedRTLResult = RTL_OFFSET_POS_DESC;
    } else {
      outerDiv.scrollLeft = 1;
      cachedRTLResult =
        outerDiv.scrollLeft === 0 ? RTL_OFFSET_NAG : RTL_OFFSET_POS_ASC;
    }

    document.body.removeChild(outerDiv);
  }

  return cachedRTLResult;
}

export interface RenderThumbStyleParams {
  bar: {
    size: "height" | "width";
    axis: "X" | "Y";
  };
  size: string;
  move: number;
}

export function renderThumbStyle(
  { move, size, bar }: RenderThumbStyleParams,
  layout: LayoutDirection,
): CSSProperties {
  const style: CSSProperties = {
    transform: `translate${bar.axis}(${move}px)`,
  };

  style[bar.size] = size;

  if (layout === "horizontal") {
    style.height = "100%";
  } else {
    style.width = "100%";
  }

  return style;
}

export const isNumeric = (value: unknown): value is number =>
  typeof value === "number" && !Number.isNaN(value);

/** 与官方 addUnit 等价，供 height/width/innerWidth 写入 style。 */
export const toUnit = (value: number | string | undefined) => {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
};
