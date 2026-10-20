"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 测量一组顶层菜单项的宽度，算出横向菜单应该截断到第几项。
 *
 * 逻辑逐条对齐官方 menu.ts 的 calcSliceIndex：
 * 逐个累加 `offsetWidth + marginLeft + marginRight`，累加值超过
 * 「菜单可用宽度 - 省略号宽度」时停止，返回可见项数量；
 * 全部放得下时返回 -1（官方语义：不截断）。
 *
 * 官方在重算前先把截断数重置为 -1，等 nextTick 再测第二次，原因是
 * 截断后 DOM 里少了几项，直接量会偏小。这里沿用同一套两拍流程：
 * 第一次提交渲染为全展开，第二拍再测量并写回结果。
 */
export interface EllipsisResult {
  /** 可见项数量，-1 表示全部可见 */
  sliceIndex: number;
  /** 手动触发一次重算，对应官方 expose 的 handleResize */
  handleResize: () => void;
}

const DEFAULT_MORE_ITEM_WIDTH = 64;

interface Options {
  /** 是否启用（仅横向模式且 ellipsis 为真） */
  enabled: boolean;
  /** 根 ul 元素 */
  menuRef: React.RefObject<HTMLUListElement | null>;
  /** 省略号槽位元素，参与宽度预留 */
  moreSlotRef: React.RefObject<HTMLLIElement | null>;
  /** 顶层元素子节点数量，用于把省略号槽位排除在测量之外 */
  childCount: number;
}

/** 对应官方 calcMenuItemWidth：自身宽度 + 左右外边距。 */
function calcItemWidth(el: HTMLElement): number {
  const style = getComputedStyle(el);
  const marginLeft = Number.parseInt(style.marginLeft, 10);
  const marginRight = Number.parseInt(style.marginRight, 10);
  return (
    el.offsetWidth +
    (Number.isNaN(marginLeft) ? 0 : marginLeft) +
    (Number.isNaN(marginRight) ? 0 : marginRight) || 0
  );
}

export function useHorizontalEllipsis({
  enabled,
  menuRef,
  moreSlotRef,
  childCount,
}: Options): EllipsisResult {
  const [sliceIndex, setSliceIndex] = useState(-1);
  const [recalcToken, setRecalcToken] = useState(0);
  // 省略号宽度跨测量保留：首次渲染还没有省略号节点，用官方默认值兜底
  const moreWidthRef = useRef(DEFAULT_MORE_ITEM_WIDTH);

  /**
   * 先恢复完整列表再测量。测量必须基于未截断的 DOM，
   * 否则每轮都会把「省略号节点」当成普通项，截断数在两拍之间来回跳变。
   * 因此这个方法同时承担重置与触发两件事。
   */
  const handleResize = useCallback(() => {
    if (!enabled) return;
    setSliceIndex(-1);
    setRecalcToken((value) => value + 1);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const menu = menuRef.current;
    if (!menu) return;

    const moreEl = moreSlotRef.current;
    if (moreEl && moreEl.offsetWidth > 0) {
      moreWidthRef.current = calcItemWidth(moreEl) || DEFAULT_MORE_ITEM_WIDTH;
    }

    const children = Array.from(menu.childNodes)
      .filter((node): node is HTMLElement => node.nodeType === 1)
      // 省略号节点排在最后，按顶层项数量截断即可把它排除
      .slice(0, childCount);

    // 仍在截断态说明这次测量发生在旧 DOM 上，先展开再重测
    if (children.length < childCount) {
      setSliceIndex(-1);
      setRecalcToken((value) => value + 1);
      return;
    }

    const menuStyle = getComputedStyle(menu);
    const paddingLeft = Number.parseInt(menuStyle.paddingLeft, 10);
    const paddingRight = Number.parseInt(menuStyle.paddingRight, 10);
    const menuWidth =
      menu.clientWidth -
      (Number.isNaN(paddingLeft) ? 0 : paddingLeft) -
      (Number.isNaN(paddingRight) ? 0 : paddingRight);

    let calcWidth = 0;
    let nextSliceIndex = 0;
    children.forEach((item, index) => {
      calcWidth += calcItemWidth(item);
      if (calcWidth <= menuWidth - moreWidthRef.current) {
        nextSliceIndex = index + 1;
      }
    });

    // 全部放得下用 -1 表示，与官方 sliceIndex 的语义保持一致
    const resolved = nextSliceIndex === children.length ? -1 : nextSliceIndex;
    setSliceIndex((current) => (current === resolved ? current : resolved));
  }, [enabled, childCount, recalcToken, menuRef, moreSlotRef]);

  // 只有菜单自身尺寸变化时才重新测量；内容增减（截断导致的重挂载）
  // 不能反过来触发测量，否则会和截断结果形成死循环。
  useEffect(() => {
    if (!enabled) return;
    const menu = menuRef.current;
    if (!menu) return;

    const observer = new ResizeObserver(() => handleResize());
    observer.observe(menu);
    return () => observer.disconnect();
  }, [enabled, menuRef, handleResize]);

  // 首帧挂载后测一次
  useEffect(() => {
    if (!enabled) return;
    const frame = requestAnimationFrame(() => setRecalcToken((v) => v + 1));
    return () => cancelAnimationFrame(frame);
  }, [enabled]);

  return { sliceIndex: enabled ? sliceIndex : -1, handleResize };
}
