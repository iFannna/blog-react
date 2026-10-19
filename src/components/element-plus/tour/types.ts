import type { CSSProperties, ReactNode } from "react";
import type { PopperPlacement } from "../popper/use-popper";

/** 对应官方 TourMask：false 关闭遮罩，对象形态可定制遮罩样式与填充色。 */
export type TourMask =
  | boolean
  | {
      style?: CSSProperties;
      color?: string;
    };

/** 对应官方 TourGap：遮罩与目标之间的透明间隙。 */
export interface TourGap {
  /** 间隙大小，传元组时依次为水平 / 垂直 */
  offset?: number | [number, number];
  /** 挖孔圆角 */
  radius?: number;
}

/**
 * 对应官方 TourBtnProps。官方把 VueNode / 事件处理器与 ButtonProps 混在一个对象里，
 * React 侧拆成 children / onClick 与 ButtonProps 的剩余字段。
 */
export interface TourBtnProps {
  /** 按钮文案 */
  children?: ReactNode;
  /** 追加在官方默认行为之后的点击回调 */
  onClick?: () => void;
}

/** tour 的 12 种方位，与官方 tourPlacements 一致。 */
export type TourPlacement = PopperPlacement;

/** 位置信息，对应官方 PosInfo。radius 已在 useTarget 阶段并入 gap.radius。 */
export interface PosInfo {
  left: number;
  top: number;
  width: number;
  height: number;
  radius: number;
}
