import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ElementType,
  ReactNode,
} from "react";

export const buttonTypes = [
  "default",
  "primary",
  "success",
  "warning",
  "info",
  "danger",
  /** @deprecated 官方将于 3.0.0 移除，改用 link */
  "text",
  "",
] as const;

export type ButtonType = (typeof buttonTypes)[number];

export const buttonNativeTypes = ["button", "submit", "reset"] as const;

export type ButtonNativeType = (typeof buttonNativeTypes)[number];

export type ComponentSize = "large" | "default" | "small";

export interface ButtonProps
  // 原生 type 与 color 被 EP 的语义占用，故排除
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  /**
   * tag 为 a 时需要的链接属性。
   * 原生 button 属性集合里没有 href / target / rel，官方 tag 示例会用到。
   */
  href?: AnchorHTMLAttributes<HTMLAnchorElement>["href"];
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
  download?: AnchorHTMLAttributes<HTMLAnchorElement>["download"];
  /** 按钮尺寸 */
  size?: ComponentSize;
  /** 按钮类型 */
  type?: ButtonType;
  /** 图标 */
  icon?: ReactNode;
  /** 原生 type 属性 */
  nativeType?: ButtonNativeType;
  /** 是否加载中 */
  loading?: boolean;
  /** 自定义加载图标 */
  loadingIcon?: ReactNode;
  /** 是否朴素按钮 */
  plain?: boolean;
  /** 是否文字按钮 */
  text?: boolean;
  /** 是否链接按钮 */
  link?: boolean;
  /** 文字按钮是否始终显示背景色 */
  bg?: boolean;
  /** 是否圆角按钮 */
  round?: boolean;
  /** 是否圆形按钮 */
  circle?: boolean;
  /** 是否虚线按钮 */
  dashed?: boolean;
  /** 自定义颜色，自动推导 hover / active 色 */
  color?: string;
  /** 暗色模式，会自动把 color 转成暗色系 */
  dark?: boolean;
  /** 两个汉字时自动插入空格 */
  autoInsertSpace?: boolean;
  /** 自定义渲染的标签 */
  tag?: string | ElementType;
}

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 控制组内按钮尺寸 */
  size?: ComponentSize;
  /** 控制组内按钮类型 */
  type?: ButtonType;
  /** 排列方向 */
  direction?: "horizontal" | "vertical";
  children?: ReactNode;
}
