"use client";

import {
  createContext,
  useContext,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ElIcon } from "../icon/ElIcon";
import { addUnit } from "../utils";
import type { ComponentSize } from "../button/types";

export type AvatarShape = "circle" | "square";
export type ObjectFit = "fill" | "contain" | "cover" | "none" | "scale-down";

interface AvatarGroupContextValue {
  size?: number | ComponentSize;
  shape?: AvatarShape;
}

export const AvatarGroupContext =
  createContext<AvatarGroupContextValue | null>(null);

export interface AvatarProps {
  /** 尺寸，数字按 px 处理，也可传尺寸名 */
  size?: number | ComponentSize;
  /** 形状 */
  shape?: AvatarShape;
  /** 图标，src 加载失败时回退显示 */
  icon?: ReactNode;
  /** 图片地址 */
  src?: string;
  /** 原生 alt */
  alt?: string;
  /** 原生 srcSet */
  srcSet?: string;
  /** 图片填充方式 */
  fit?: ObjectFit;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** 图片加载失败时触发，对应官方 error 事件 */
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

/** 对应官方 ElAvatar。 */
export function ElAvatar({
  size,
  shape,
  icon,
  src = "",
  alt,
  srcSet,
  fit = "cover",
  className,
  style,
  children,
  onError,
}: AvatarProps) {
  const group = useContext(AvatarGroupContext);
  const [hasLoadError, setHasLoadError] = useState(false);

  const resolvedSize = size ?? group?.size;
  const resolvedShape = shape ?? group?.shape ?? "circle";

  const isStringSize = typeof resolvedSize === "string";

  const classes = [
    "el-avatar",
    isStringSize && `el-avatar--${resolvedSize}`,
    icon && "el-avatar--icon",
    resolvedShape && `el-avatar--${resolvedShape}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // 数字尺寸走内联样式，尺寸名走类名，与官方一致
  const sizeStyle: CSSProperties = {
    ...(typeof resolvedSize === "number"
      ? { width: addUnit(resolvedSize), height: addUnit(resolvedSize) }
      : {}),
    ...style,
  };

  const showImg = (src || srcSet) && !hasLoadError;

  return (
    <span className={classes} style={sizeStyle}>
      {showImg ? (
        <img
          src={src}
          alt={alt}
          srcSet={srcSet}
          style={{ objectFit: fit }}
          onError={(event) => {
            setHasLoadError(true);
            onError?.(event);
          }}
        />
      ) : icon ? (
        <ElIcon>{icon}</ElIcon>
      ) : (
        children
      )}
    </span>
  );
}
