"use client";

import type { CSSProperties } from "react";
import type { MenuProviderProps } from "./context";

/**
 * 对应官方 use-menu-color 的 TinyColor(color).shade(20)。
 *
 * shade(20) 等价于在 RGB 上向黑色线性混合 20%：
 * out = round(c * (1 - 0.2))。官方试剂用的是 tinycolor 的 mix，
 * 两者对 8 位整数通道结果一致，所以这里直接换算，不引依赖。
 */
export function shadeColor(color: string, amount = 20): string {
  const hex = color.trim().replace(/^#/, "");
  // 支持 #rgb / #rrggbb 两种写法，其余格式（rgb() 等）保持原值不动
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : hex;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) return color;

  const ratio = 1 - amount / 100;
  const channels = [0, 2, 4].map((offset) => {
    const value = Number.parseInt(full.slice(offset, offset + 2), 16);
    return Math.round(value * ratio)
      .toString(16)
      .padStart(2, "0");
  });

  return `#${channels.join("")}`;
}

/**
 * 对应官方 useMenuCssVar。
 *
 * 官方把 text-color / bg-color / hover-bg-color / active-color 以
 * `--el-menu-*` 内联变量写到 ul 上，子节点通过继承拿到；
 * `--el-menu-level` 决定纵向模式的左缩进层级。
 * 空字符串不写入，与官方 cssVarBlock 的 `if (object[key])` 一致。
 */
export function menuCssVar(
  props: MenuProviderProps,
  level: number,
): CSSProperties {
  const textColor = props.textColor ?? "";
  const backgroundColor = props.backgroundColor ?? "";
  const activeTextColor = props.activeTextColor ?? "";

  const style: Record<string, string> = {
    // 层级一定写入，包括 0
    "--el-menu-level": String(level),
  };

  if (textColor) {
    style["--el-menu-text-color"] = textColor;
    style["--el-menu-hover-text-color"] = textColor;
  }
  if (backgroundColor) {
    style["--el-menu-bg-color"] = backgroundColor;
    style["--el-menu-hover-bg-color"] = shadeColor(backgroundColor, 20);
  }
  if (activeTextColor) {
    style["--el-menu-active-color"] = activeTextColor;
  }

  return style as CSSProperties;
}

/** 把可选的 className 拼进类名数组。 */
export function joinClasses(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
