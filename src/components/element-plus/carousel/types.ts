import type { CSSProperties, ReactNode } from "react";

export type CarouselDirection = "horizontal" | "vertical";
export type CarouselTrigger = "hover" | "click";
export type CarouselArrow = "always" | "hover" | "never";
export type CarouselType = "" | "card";
export type CarouselIndicatorPosition = "" | "none" | "outside";

export interface CarouselProps {
  /** 初始激活项下标，从 0 开始 */
  initialIndex?: number;
  /** 轮播高度，设为 "auto" 时按激活项内容高度自适应 */
  height?: string;
  /** 指示器触发方式 */
  trigger?: CarouselTrigger;
  /** 是否自动切换 */
  autoplay?: boolean;
  /** 自动切换间隔，毫秒 */
  interval?: number;
  /** 指示器位置 */
  indicatorPosition?: CarouselIndicatorPosition;
  /** 箭头显示时机 */
  arrow?: CarouselArrow;
  /** 轮播类型，card 为卡片化 */
  type?: CarouselType;
  /** 卡片化时非激活项的缩放比例 */
  cardScale?: number;
  /** 是否循环播放 */
  loop?: boolean;
  /** 展示方向 */
  direction?: CarouselDirection;
  /** 鼠标悬停时是否暂停自动切换 */
  pauseOnHover?: boolean;
  /** 是否为切换过程加高斯模糊（对应官方 motion-blur） */
  motionBlur?: boolean;
  /** 激活项切换时触发，参数为新旧下标 */
  onChange?: (current: number, prev: number) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export interface CarouselExpose {
  /** 当前激活项下标 */
  activeIndex: number;
  /** 手动切换到指定项，支持下标或项的 name */
  setActiveItem: (index: string | number) => void;
  /** 切换到上一项 */
  prev: () => void;
  /** 切换到下一项 */
  next: () => void;
}
