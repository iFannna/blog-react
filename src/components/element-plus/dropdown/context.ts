"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

/** 对应官方 dropdown tokens.ts 的 DROPDOWN_INJECTION_KEY。 */
export interface DropdownContextValue {
  /** 点击菜单项时调用，负责执行命令并关闭菜单 */
  handleItemClick: (command: unknown, disabled?: boolean) => void;
  /** 当前高亮的项 id，供键盘导航使用 */
  activeItemId?: string;
  setActiveItemId?: (id: string) => void;
}

export const DropdownContext = createContext<DropdownContextValue | null>(null);

export function useDropdownContext() {
  return useContext(DropdownContext);
}

/** 菜单项与按钮共用的 props，避免重复声明。 */
export interface DropdownItemSharedProps {
  /** 指令，点击时作为参数传给 onCommand */
  command?: unknown;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示分割线 */
  divided?: boolean;
  /** 图标 */
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}
