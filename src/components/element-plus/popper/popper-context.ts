"use client";

import { createContext, type CSSProperties, type RefCallback } from "react";

export interface PopperContentContextValue {
  /** popper 的 arrow 修饰符算出的箭头定位样式 */
  arrowStyle: CSSProperties;
  /** 把箭头节点交给 ElPopperContent 注册 arrow 修饰符 */
  setArrowRef: RefCallback<HTMLElement>;
}

export const PopperContentContext =
  createContext<PopperContentContextValue | null>(null);
