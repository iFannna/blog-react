"use client";

import { useEffect, useRef, useState } from "react";

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
  /** 变化后重新测量的依赖（展开项、激活项、折叠态等） */
  dep: unknown;
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
  dep,
}: Options): EllipsisResult {
  const [sliceIndex, setSliceIndex] = useState(-1);
  const [recalcToken, setRecalcToken] = useState(0);
  // 省略号宽度跨测量保留：收起时它被 display: none 藏起来量不到，
  // 退回上一次量到的真实值（首帧则用官方的 64 兜底）
  const moreWidthRef = useRef(DEFAULT_MORE_ITEM_WIDTH);

  const handleResize = () => {
    if (!enabled) return;
    setSliceIndex(-1);
    setRecalcToken((value) => value + 1);
  };

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
      // 省略号槽位排在最后，按顶层项数量截断即可把它排除
      .slice(0, childCount);

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

    // 第一拍已在渲染中展开全部项，这里如果算出的结果没变化就不再 setState，
    // 避免「测量 -> 截断 -> 又测量」来回抖动
    const resolved = nextSliceIndex === children.length ? -1 : nextSliceIndex;
    setSliceIndex((current) => (current === resolved ? current : resolved));
  }, [enabled, childCount, recalcToken, dep, menuRef, moreSlotRef]);

  // 宽度变化时重新测量
  useEffect(() => {
    if (!enabled) return;
    const menu = menuRef.current;
    if (!menu) return;

    const observer = new ResizeObserver(() => handleResize());
    observer.observe(menu);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, menuRef]);

  // 首帧与依赖变化后各测一次
  useEffect(() => {
    if (!enabled) return;
    const frame = requestAnimationFrame(() => setRecalcToken((v) => v + 1));
    return () => cancelAnimationFrame(frame);
  }, [enabled]);

  return { sliceIndex: enabled ? sliceIndex : -1, handleResize };
}
