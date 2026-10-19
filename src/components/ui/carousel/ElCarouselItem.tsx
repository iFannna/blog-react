"use client";

import type { CSSProperties, ReactNode } from "react";

/** 由 ElCarousel 计算并注入到每个 ElCarouselItem 的几何状态。 */
export interface CarouselItemLayout {
  /** 沿主轴的位移，px */
  translate: number;
  /** 卡片化时的缩放比例 */
  scale: number;
  /** 是否为当前激活项 */
  active: boolean;
  /** 卡片化时是否处于「舞台」内（与激活项相邻） */
  inStage: boolean;
  /** 是否处于位移动画中，决定加不加过渡 */
  animating: boolean;
  /** 卡片化时鼠标悬停在对应侧箭头，用于提亮同侧卡片蒙版 */
  hover: boolean;
}

export interface CarouselItemProps {
  /** 项名称，可在 setActiveItem 中代替下标使用 */
  name?: string;
  /** 对应指示器的文本内容 */
  label?: string | number;
  /** 由 ElCarousel 注入的几何状态 */
  layout?: CarouselItemLayout;
  /** 由 ElCarousel 注入：垂直方向 */
  isVertical?: boolean;
  /** 由 ElCarousel 注入：卡片化 */
  isCardType?: boolean;
  /** 由 ElCarousel 注入：点击卡片时请求切换 */
  onActivate?: () => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 对应官方 ElCarouselItem。
 *
 * 位移与缩放全部由父级 ElCarousel 计算后通过 layout 注入，
 * 这里只负责拼 transform 与切换类名，保持 DOM 与官方一致：
 *   div.el-carousel__item[.is-active][.is-animating][.el-carousel__item--card]
 *     > div.el-carousel__mask（仅卡片化且非激活时渲染）
 */
export function ElCarouselItem({
  layout,
  isVertical = false,
  isCardType = false,
  onActivate,
  className,
  style,
  children,
}: CarouselItemProps) {
  const {
    translate = 0,
    scale = 1,
    active = false,
    inStage = false,
    animating = false,
    hover = false,
  } = layout ?? {};

  const itemClasses = [
    "el-carousel__item",
    active && "is-active",
    inStage && "is-in-stage",
    hover && "is-hover",
    animating && "is-animating",
    isCardType && "el-carousel__item--card",
    isCardType && isVertical && "el-carousel__item--card-vertical",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // 官方只给位移 + 缩放两个函数，与顺序无关，保持同样的拼法
  const itemStyle: CSSProperties = {
    transform: `translate${isVertical ? "Y" : "X"}(${translate}px) scale(${scale})`,
    ...style,
  };

  return (
    <div
      className={itemClasses}
      style={itemStyle}
      onClick={() => {
        if (isCardType) onActivate?.();
      }}
    >
      {/* 卡片化时盖一层白色蒙版；官方用 v-show="!active"，激活项保留节点但隐藏 */}
      {isCardType && (
        <div
          className="el-carousel__mask"
          style={active ? { display: "none" } : undefined}
        />
      )}
      {children}
    </div>
  );
}
