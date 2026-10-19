import type { CSSProperties } from "react";

export type SplitterLayout = "horizontal" | "vertical";
export type CollapseType = "start" | "end";

/**
 * 面板注册到容器里的配置。
 * order 是首次注册时分配的顺序号，用于排定面板下标 —— 官方用 vnode 顺序排序，
 * 这里靠注册顺序还原，避免面板属性更新重注册时被打乱次序。
 */
export interface PanelConfig {
  uid: string;
  order: number;
  size?: number | string;
  min?: number | string;
  max?: number | string;
  resizable: boolean;
  collapsible: { start?: boolean; end?: boolean };
}

export type SplitterStyle = CSSProperties & {
  "--el-splitter-bar-offset"?: string;
};

export function isPct(value: string | number | undefined): value is string {
  return typeof value === "string" && value.endsWith("%");
}

export function isPx(value: string | number | undefined): value is string {
  return typeof value === "string" && value.endsWith("px");
}

export function getPct(value: string) {
  return Number(value.slice(0, -1)) / 100;
}

export function getPx(value: string) {
  return Number(value.slice(0, -2));
}

/** 把 min/max 之类的限值换算成 px，缺省时回退到 defaultLimit */
export function getLimitSize(
  value: string | number | undefined,
  containerSize: number,
  defaultLimit: number,
) {
  if (isPct(value)) return getPct(value) * containerSize;
  if (isPx(value)) return getPx(value);
  return value ?? defaultLimit;
}

/**
 * 与官方 getCollapsible 对齐。官方还接受 `{ start, end }` 对象按方向分别开关，
 * 这里只支持布尔整体开关。
 */
export function getCollapsible(
  collapsible?: boolean | { start?: boolean; end?: boolean },
) {
  // 对象形态按方向分别开关收起按钮，与官方 isObject 分支一致
  if (collapsible && typeof collapsible === "object") return collapsible;
  return { start: !!collapsible, end: !!collapsible };
}

/**
 * 与官方 isCollapsible 一致：当前面板可收起且还有尺寸，
 * 或下一个面板可收起且已被压成 0，才显示收起按钮。
 */
export function isCollapsible(
  panel: PanelConfig | undefined,
  size: number,
  nextPanel: PanelConfig | undefined,
  nextSize: number,
) {
  if (panel?.collapsible.end && size > 0) return true;
  if (nextPanel?.collapsible.start && nextSize === 0 && size > 0) return true;
  return false;
}

/**
 * 与官方 useSize 的多面板分配算法一致：
 * 显式尺寸先折算成百分比，总和超过 1 时按比例缩放，不足 1 时剩余空间均分给未指定尺寸的面板。
 * 容器尺寸尚未测量到时不参与计算，直接给 0，避免除零得到 NaN。
 */
export function computePxSizes(
  panels: PanelConfig[],
  containerSize: number,
): number[] {
  const count = panels.length;
  if (!count) return [];
  if (!containerSize) return panels.map(() => 0);

  const ptgList: (number | undefined)[] = [];
  let emptyCount = 0;

  for (let i = 0; i < count; i += 1) {
    const itemSize = panels[i].size;

    if (isPct(itemSize)) {
      ptgList[i] = getPct(itemSize);
    } else if (isPx(itemSize)) {
      ptgList[i] = getPx(itemSize) / containerSize;
    } else if (itemSize || itemSize === 0) {
      const num = Number(itemSize);
      if (!Number.isNaN(num)) ptgList[i] = num / containerSize;
    } else {
      emptyCount += 1;
      ptgList[i] = undefined;
    }
  }

  const totalPtg = ptgList.reduce<number>((acc, ptg) => acc + (ptg || 0), 0);

  if (totalPtg > 1 || !emptyCount) {
    const scale = totalPtg > 0 ? 1 / totalPtg : 0;
    return ptgList.map(
      (ptg) => (ptg === undefined ? 0 : ptg * scale) * containerSize,
    );
  }

  const avgRest = (1 - totalPtg) / emptyCount;
  return ptgList.map(
    (ptg) => (ptg === undefined ? avgRest : ptg) * containerSize,
  );
}

/**
 * 与官方 useResize 的 onMoving 一致：对一组尺寸算拖拽后的结果。
 * 夹取顺序依次为起始面板最小值、结束面板最小值、起始面板最大值、结束面板最大值，
 * 返回被夹取后的偏移量，调用方据此改写两个面板的尺寸。
 */
export function clampOffset(
  sizes: number[],
  index: number,
  offset: number,
  panels: PanelConfig[],
  containerSize: number,
) {
  const nextIndex = index + 1;
  const numSizes = [...sizes];

  const startMin = getLimitSize(panels[index].min, containerSize, 0);
  const endMin = getLimitSize(panels[nextIndex].min, containerSize, 0);
  const startMax = getLimitSize(panels[index].max, containerSize, containerSize);
  const endMax = getLimitSize(panels[nextIndex].max, containerSize, containerSize);

  let mergedOffset = offset;

  if (numSizes[index] + mergedOffset < startMin) {
    mergedOffset = startMin - numSizes[index];
  }
  if (numSizes[nextIndex] - mergedOffset < endMin) {
    mergedOffset = numSizes[nextIndex] - endMin;
  }
  if (numSizes[index] + mergedOffset > startMax) {
    mergedOffset = startMax - numSizes[index];
  }
  if (numSizes[nextIndex] - mergedOffset > endMax) {
    mergedOffset = numSizes[nextIndex] - endMax;
  }

  return { sizes: numSizes, offset: mergedOffset };
}
