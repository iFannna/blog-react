"use client";

import { createElement } from "react";
import { ButtonGroupContext } from "./context";
import type { ButtonGroupProps } from "./types";

/** 对应官方 ElButtonGroup：只负责把 size / type 通过 context 下发给组内按钮。 */
export function ElButtonGroup({
  size,
  type,
  direction = "horizontal",
  className,
  children,
  ...restProps
}: ButtonGroupProps) {
  // 官方无论横竖都会输出 --${direction} 修饰类
  const classes = [
    "el-button-group",
    `el-button-group--${direction}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ButtonGroupContext.Provider value={{ size, type }}>
      {createElement("div", { ...restProps, className: classes }, children)}
    </ButtonGroupContext.Provider>
  );
}
