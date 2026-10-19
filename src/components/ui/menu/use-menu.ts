"use client";

import { useSubMenuContext } from "./context";

export interface UseMenuResult {
  /** 从根到自身的 index 链，对应官方 useMenu 的 indexPath */
  indexPath: string[];
  /** 父级的 indexPath，根菜单下的第一层为 [] */
  parentIndexPath: string[];
  /** 是否直接挂在根菜单下 */
  isFirstLevel: boolean;
}

/**
 * 对应官方 useMenu。
 *
 * 官方沿组件 parent 链回溯 ElMenu / ElSubMenu 收集 index；
 * React 没有 parent 链，改用就近的 SubMenuContext：
 * 该上下文由根菜单或上一层子菜单提供，天然表达层级关系。
 */
export function useMenu(currentIndex: string): UseMenuResult {
  const sub = useSubMenuContext();
  const parentIndexPath = sub?.indexPath ?? [];

  return {
    indexPath: [...parentIndexPath, currentIndex],
    parentIndexPath,
    isFirstLevel: !sub || sub.isRoot,
  };
}
