import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { addUnit } from "../utils";

export interface IconProps {
  /** SVG 图标的尺寸，size x size。数字补 px，字符串原样 */
  size?: number | string;
  /** SVG 的 fill，落到 .el-icon 的 --color 上 */
  color?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 对应官方 ElIcon：一层 <i class="el-icon"> 包住 svg，
 * 尺寸和颜色通过 font-size 与 --color 下发，svg 里只要 fill="currentColor" 就能继承。
 */
export const ElIcon = forwardRef<
  HTMLElement,
  IconProps & Omit<React.HTMLAttributes<HTMLElement>, "color">
>(function ElIcon(
  { size, color, className, style, children, ...rest },
  ref,
) {
  const fontSize = addUnit(size);

  const mergedStyle: CSSProperties = { ...style };
  if (fontSize) mergedStyle.fontSize = fontSize;
  if (color) {
    // 官方把颜色写成 --color，图标 scss 里 color: var(--color) 消费
    (mergedStyle as Record<string, string>)["--color"] = color;
  }

  const mergedClassName = className ? `el-icon ${className}` : "el-icon";

  return (
    <i ref={ref} className={mergedClassName} style={mergedStyle} {...rest}>
      {children}
    </i>
  );
});
