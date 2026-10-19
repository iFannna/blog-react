"use client";

import { createContext, useContext } from "react";
import type {
  CSSProperties,
  MutableRefObject,
  ReactNode,
} from "react";

export type MenuMode = "horizontal" | "vertical";
export type MenuTrigger = "hover" | "click";
export type MenuPopperEffect = "dark" | "light" | (string & {});

/** 已注册的菜单项 / 子菜单，对应官方 MenuItemRegistered。 */
export interface MenuItemRegistered {
  index: string;
  indexPath: string[];
}

/** 点击菜单项时透出的数据，对应官方 MenuItemClicked。 */
export interface MenuItemClicked {
  index: string;
  indexPath: string[];
  route?: string | Record<string, unknown>;
}

/**
 * 根菜单下发给所有节点的 props 子集，对应官方 MenuProvider['props']。
 * 只保留被下层读取的字段，避免把回调等无关数据也挂到上下文上。
 */
export interface MenuProviderProps {
  mode: MenuMode;
  collapse: boolean;
  uniqueOpened: boolean;
  router: boolean;
  menuTrigger: MenuTrigger;
  closeOnClickOutside: boolean;
  persistent: boolean;
  popperEffect: MenuPopperEffect;
  popperClass?: string;
  popperStyle?: CSSProperties;
  popperOffset: number;
  showTimeout: number;
  hideTimeout: number;
  backgroundColor?: string;
  textColor?: string;
  activeTextColor?: string;
}

/**
 * 根菜单会变化的状态部分。
 *
 * 与 MenuActionsContext 拆开的原因：注册函数引用恒定，
 * 子组件只依赖 actions 就能注册；若把它和会变的 registry / openedMenus
 * 放在同一个 context 里，每次注册都会让 context 换新引用，
 * 子组件的注册 effect 重新执行，形成「注册 -> 重渲染 -> 再注册」的死循环。
 */
export interface MenuStateContextValue {
  props: MenuProviderProps;
  /** 已展开的子菜单 index 列表 */
  openedMenus: string[];
  /** 当前激活项的 index */
  activeIndex: string;
  /** 横向菜单或纵向折叠时为 true，子菜单走浮层形态 */
  isMenuPopup: boolean;
  /** 注册表版本号，注册表变化时自增 */
  version: number;
  /** 已注册菜单项的只读快照 */
  items: Record<string, MenuItemRegistered>;
  /** 已注册子菜单的只读快照 */
  subMenus: Record<string, MenuItemRegistered>;
}

/** 根菜单下发的操作，引用恒定。 */
export interface MenuActionsContextValue {
  addMenuItem: (item: MenuItemRegistered) => void;
  removeMenuItem: (item: MenuItemRegistered) => void;
  addSubMenu: (item: MenuItemRegistered) => void;
  removeSubMenu: (item: MenuItemRegistered) => void;
  openMenu: (index: string, indexPath: string[]) => void;
  closeMenu: (index: string, indexPath: string[]) => void;
  handleMenuItemClick: (item: MenuItemClicked) => void;
  handleSubMenuClick: (item: MenuItemRegistered) => void;
  /** 通知横向菜单重新计算省略号截断位置 */
  triggerResize: () => void;
}

/**
 * 每层子菜单向下提供的上下文，对应官方 SUB_MENU_INJECTION_KEY。
 *
 * 官方沿组件 parent 链推断层级，React 里改为就近的 Provider：
 * 每层子菜单渲染自己的 Provider，孩子读到最近的那一层。
 * 层级用于计算 `--el-menu-level`，指针标志用于收起判定。
 */
export interface SubMenuContextValue {
  /** 父级的层级，根菜单下的第一层为 0 */
  level: number;
  /** 父级的 indexPath，根菜单为 [] */
  indexPath: string[];
  /** 是否由根菜单提供（即当前是否第一层） */
  isRoot: boolean;
  /**
   * 「本子菜单内有更深一层被悬停」的标志。由子级在进入/离开自己的
   * 区域时写入，供本级的收起计时器读取，避免指针在浮层内移动时把上层关掉。
   */
  mouseInChild: MutableRefObject<boolean>;
  /** 鼠标离开回调，冒泡到上层子菜单时传 true */
  handleMouseleave?: (deepDispatch: boolean) => void;
}

export const MenuStateContext = createContext<MenuStateContextValue | null>(null);

export const MenuActionsContext =
  createContext<MenuActionsContextValue | null>(null);

export const SubMenuContext = createContext<SubMenuContextValue | null>(null);

export function useMenuState() {
  return useContext(MenuStateContext);
}

export function useMenuActions() {
  return useContext(MenuActionsContext);
}

export function useSubMenuContext() {
  return useContext(SubMenuContext);
}

/** 菜单项 / 子菜单标题插槽的内容类型。 */
export type MenuSlot = ReactNode;
