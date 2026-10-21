"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { More } from "../generated/icons";
import { ElSubMenu } from "./ElSubMenu";
import { MenuCollapseTransition } from "./MenuCollapseTransition";
import {
  MenuActionsContext,
  MenuStateContext,
  SubMenuContext,
} from "./context";
import { joinClasses, menuCssVar } from "./utils";
import { useHorizontalEllipsis } from "./use-horizontal-ellipsis";
import type {
  MenuActionsContextValue,
  MenuItemClicked,
  MenuItemRegistered,
  MenuMode,
  MenuPopperEffect,
  MenuProviderProps,
  MenuStateContextValue,
  MenuTrigger,
  SubMenuContextValue,
} from "./context";

export interface MenuProps {
  /** 菜单展示形态 */
  mode?: MenuMode;
  /** 激活项的 index。父组件更新此值时同步切换激活项 */
  defaultActive?: string;
  /** 初始展开的子菜单 index 列表 */
  defaultOpeneds?: string[];
  /** 是否只保持一个子菜单展开 */
  uniqueOpened?: boolean;
  /** 是否启用路由模式，开启后 index 作为跳转路径 */
  router?: boolean;
  /** 子菜单触发方式，仅横向模式有效 */
  menuTrigger?: MenuTrigger;
  /** 是否收起，仅纵向模式有效 */
  collapse?: boolean;
  /** 是否开启收起过渡 */
  collapseTransition?: boolean;
  /** 横向模式是否开启省略号收起，默认开启 */
  ellipsis?: boolean;
  /** 自定义省略号图标 */
  ellipsisIcon?: ReactNode;
  /** 浮层与触发元素的间距，作用于所有子菜单 */
  popperOffset?: number;
  /** 收起态下 tooltip 的主题 */
  popperEffect?: MenuPopperEffect;
  /** 所有浮层的自定义类名 */
  popperClass?: string;
  /** 所有浮层的自定义样式 */
  popperStyle?: CSSProperties;
  /** 悬停展开延时 */
  showTimeout?: number;
  /** 悬停收起延时 */
  hideTimeout?: number;
  /** 浮层关闭后是否销毁 */
  persistent?: boolean;
  /** 点击菜单外是否收起全部子菜单 */
  closeOnClickOutside?: boolean;
  /** 已废弃，改用 CSS 变量 --el-menu-bg-color */
  backgroundColor?: string;
  /** 已废弃，改用 CSS 变量 --el-menu-text-color */
  textColor?: string;
  /** 已废弃，改用 CSS 变量 --el-menu-active-color */
  activeTextColor?: string;
  /** 选中项变化 */
  onSelect?: (index: string, indexPath: string[], item: MenuItemClicked) => void;
  /** 子菜单展开 */
  onOpen?: (index: string, indexPath: string[]) => void;
  /** 子菜单收起 */
  onClose?: (index: string, indexPath: string[]) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** 省略号子菜单固定使用的 index，对应官方 'sub-menu-more'。 */
const MORE_SUB_MENU_INDEX = "sub-menu-more";

const EMPTY_REGISTRY = {
  items: {} as Record<string, MenuItemRegistered>,
  subMenus: {} as Record<string, MenuItemRegistered>,
};

/**
 * 对应官方 ElMenu。
 *
 * 状态全部收敛在根菜单：openedMenus / activeIndex / 注册表。
 * 官方用 provide + reactive 下发，React 这里拆成两个 context：
 * - MenuStateContext：会变化的状态（展开项、激活项、注册表快照）
 * - MenuActionsContext：引用恒定的操作函数
 * 拆开是为了让子组件的注册 effect 只依赖后者，否则「注册 -> context
 * 换新引用 -> 重新注册」会打成死循环。
 *
 * 横向省略号对齐官方 calcSliceIndex：逐个累加顶层项宽度，超出可用宽度
 * （减去省略号按钮宽度）的部分收进 `sub-menu-more` 子菜单，该子菜单固定
 * 插在列表末尾并使用 More 图标。
 */
export interface MenuExpose {
  /** 展开指定子菜单及其祖先 */
  open: (index: string) => void;
  /** 收起指定子菜单 */
  close: (index: string) => void;
  /** 手动触发横向省略号重新测量 */
  handleResize: () => void;
  /** 设置激活项 */
  updateActiveIndex: (index: string) => void;
}

export const ElMenu = forwardRef<MenuExpose, MenuProps>(function ElMenu(
  {
    mode = "vertical",
    defaultActive = "",
    defaultOpeneds,
    uniqueOpened = false,
    router = false,
    menuTrigger = "hover",
    collapse = false,
    collapseTransition = true,
    ellipsis = true,
    ellipsisIcon,
    popperOffset = 6,
    popperEffect = "dark",
    popperClass,
    popperStyle,
    showTimeout = 300,
    hideTimeout = 300,
    persistent = true,
    closeOnClickOutside = false,
    backgroundColor,
    textColor,
    activeTextColor,
    onSelect,
    onOpen,
    onClose,
    className,
    style,
    children,
  },
  ref,
) {
  const menuRef = useRef<HTMLUListElement>(null);
  const moreSlotRef = useRef<HTMLLIElement>(null);

  // 收起态下不预展开任何子菜单，与官方对 default-openeds 的处理一致
  const [openedMenus, setOpenedMenus] = useState<string[]>(() =>
    defaultOpeneds && !collapse ? [...defaultOpeneds] : [],
  );
  const [activeIndex, setActiveIndex] = useState(defaultActive);
  const [registry, setRegistry] = useState(EMPTY_REGISTRY);

  const isMenuPopup = mode === "horizontal" || (mode === "vertical" && collapse);

  const itemsRef = useRef<Record<string, MenuItemRegistered>>({});
  const subMenusRef = useRef<Record<string, MenuItemRegistered>>({});
  const dirtyRef = useRef(false);
  // 指针是否落在某个子菜单内，closeOnClickOutside 需要它做豁免
  const mouseInChildRef = useRef(false);

  // 回调与最新状态放 ref，让注册、开合等函数保持恒定引用
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const openedMenusRef = useRef(openedMenus);
  openedMenusRef.current = openedMenus;
  const uniqueOpenedRef = useRef(uniqueOpened);
  uniqueOpenedRef.current = uniqueOpened;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const collapseRef = useRef(collapse);
  collapseRef.current = collapse;

  const props: MenuProviderProps = {
    mode,
    collapse,
    uniqueOpened,
    router,
    menuTrigger,
    closeOnClickOutside,
    persistent,
    popperEffect,
    popperClass,
    popperStyle,
    popperOffset,
    showTimeout,
    hideTimeout,
    backgroundColor,
    textColor,
    activeTextColor,
  };
  // 供 openMenu 等处读取最新 props，不参与渲染比较
  const propsRef = useRef(props);
  propsRef.current = props;

  // 注册只写 ref 并打脏标记；真正的 state 同步由下方 useLayoutEffect 统一完成。
  // 不能在这里 setState：子项挂载会触发横向省略号重算，重算又会移动子项，
  // 形成「挂载 -> 重算 -> 再挂载」的死循环。
  const addMenuItem = useRef((item: MenuItemRegistered) => {
    itemsRef.current[item.index] = item;
    dirtyRef.current = true;
  }).current;

  const removeMenuItem = useRef((item: MenuItemRegistered) => {
    delete itemsRef.current[item.index];
    dirtyRef.current = true;
  }).current;

  const addSubMenu = useRef((item: MenuItemRegistered) => {
    subMenusRef.current[item.index] = item;
    dirtyRef.current = true;
  }).current;

  const removeSubMenu = useRef((item: MenuItemRegistered) => {
    delete subMenusRef.current[item.index];
    dirtyRef.current = true;
  }).current;

  /**
   * 注册表的 ref 副本每轮渲染后同步成 state。
   * 用 useLayoutEffect 而非 setState 直写，是为了让「注册」这个副作用
   * 只发生在提交之后，避免在子组件渲染期间更新父组件状态。
   * 不传依赖数组：每次提交都要检查 dirty 标记，注册可能发生在任意一次子节点渲染后。
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (!dirtyRef.current) return;
    dirtyRef.current = false;
    setRegistry({
      items: { ...itemsRef.current },
      subMenus: { ...subMenusRef.current },
    });
  });

  const openMenu = useRef((index: string, indexPath: string[]): void => {
    setOpenedMenus((current) => {
      if (current.includes(index)) return current;
      // 唯一展开时先清掉不在该路径下的其余菜单
      const base = uniqueOpenedRef.current
        ? current.filter((item) => indexPath.includes(item))
        : current;
      return [...base, index];
    });
    onOpenRef.current?.(index, indexPath);
  }).current;

  const closeMenu = useRef((index: string, indexPath: string[]): void => {
    setOpenedMenus((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : current,
    );
    onCloseRef.current?.(index, indexPath);
  }).current;

  const handleSubMenuClick = useRef((item: MenuItemRegistered): void => {
    if (openedMenusRef.current.includes(item.index)) {
      closeMenu(item.index, item.indexPath);
    } else {
      openMenu(item.index, item.indexPath);
    }
  }).current;

  const handleMenuItemClick = useRef((item: MenuItemClicked): void => {
    // 横向或收起形态下点击菜单项要顺手关掉所有浮层
    if (modeRef.current === "horizontal" || collapseRef.current) {
      setOpenedMenus([]);
    }
    setActiveIndex(item.index);
    onSelectRef.current?.(item.index, item.indexPath, item);
  }).current;

  // defaultActive 变化时同步激活项，对应官方对 default-active 的 watch。
  // 未注册的索引视为空，避免高亮到一个不存在的项。
  const prevDefaultActive = useRef(defaultActive);
  useLayoutEffect(() => {
    if (defaultActive === prevDefaultActive.current) return;
    prevDefaultActive.current = defaultActive;
    setActiveIndex(itemsRef.current[defaultActive] ? defaultActive : "");
  }, [defaultActive]);

  // 纵向展开时，激活项所在路径上的子菜单自动展开（对应官方 initMenu）
  useLayoutEffect(() => {
    if (!activeIndex || mode === "horizontal" || collapse) return;
    const activeItem = itemsRef.current[activeIndex];
    if (!activeItem) return;
    activeItem.indexPath.forEach((index) => {
      const subMenu = subMenusRef.current[index];
      if (subMenu) openMenu(index, subMenu.indexPath);
    });
    // registry 变化代表有新项注册进来，需要重跑一次
  }, [activeIndex, mode, collapse, registry, openMenu]);

  // 收起时清空展开项，对应官方对 collapse 的 watch
  const prevCollapse = useRef(collapse);
  useLayoutEffect(() => {
    if (collapse && !prevCollapse.current) setOpenedMenus([]);
    prevCollapse.current = collapse;
  }, [collapse]);

  // 顶层节点的 index 列表与数量，顺序与 children 一致，供省略号测量使用
  const childArray = useMemo(
    () => (Array.isArray(children) ? children : [children]),
    [children],
  );
  const topIndexes = useMemo(
    () =>
      childArray
        .map((child) => {
          const childProps =
            child && typeof child === "object" && "props" in child
              ? (child as { props?: { index?: unknown } }).props
              : undefined;
          return typeof childProps?.index === "string" ? childProps.index : null;
        })
        .filter((value): value is string => Boolean(value)),
    [childArray],
  );

  const ellipsisEnabled = mode === "horizontal" && ellipsis;

  const { sliceIndex, handleResize: triggerResize } = useHorizontalEllipsis({
    enabled: ellipsisEnabled,
    menuRef,
    moreSlotRef,
    childCount: topIndexes.length,
  });

  useImperativeHandle(
    ref,
    () => ({
      open: (index: string) => {
        const subMenu = subMenusRef.current[index];
        if (!subMenu) return;
        subMenu.indexPath.forEach((item) =>
          openMenu(item, subMenu.indexPath),
        );
      },
      close: (index: string) => {
        setOpenedMenus((current) => current.filter((item) => item !== index));
      },
      handleResize: triggerResize,
      updateActiveIndex: (index: string) => {
        const items = itemsRef.current;
        const item =
          items[index] ||
          (activeIndex ? items[activeIndex] : undefined) ||
          (defaultActive ? items[defaultActive] : undefined);
        setActiveIndex(item?.index ?? index);
      },
    }),
    [activeIndex, defaultActive, openMenu, triggerResize],
  );

  // 点击菜单外收起全部子菜单，对应官方 closeOnClickOutside
  const handleDocumentMouseDown = useCallback((event: MouseEvent) => {
    const target = event.target as Node;
    if (menuRef.current?.contains(target)) return;
    // 指针停在某个子菜单里时（浮层挂在 body 上）不算「点击外部」
    if (mouseInChildRef.current) return;
    const opened = openedMenusRef.current;
    if (!opened.length) return;
    opened.forEach((index) => {
      const item = subMenusRef.current[index];
      onCloseRef.current?.(index, item?.indexPath ?? []);
    });
    setOpenedMenus([]);
  }, []);

  useLayoutEffect(() => {
    if (!closeOnClickOutside) return;
    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () => document.removeEventListener("mousedown", handleDocumentMouseDown);
  }, [closeOnClickOutside, handleDocumentMouseDown]);

  const stateValue: MenuStateContextValue = useMemo(
    () => ({
      props,
      openedMenus,
      activeIndex,
      isMenuPopup,
      version: resolveRegistryVersion(registry),
      items: registry.items,
      subMenus: registry.subMenus,
    }),
    // props 由下面逐项字段构成，依赖逐项列出即可
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      openedMenus,
      activeIndex,
      isMenuPopup,
      registry,
      mode,
      collapse,
      uniqueOpened,
      router,
      menuTrigger,
      closeOnClickOutside,
      persistent,
      popperEffect,
      popperClass,
      popperStyle,
      popperOffset,
      showTimeout,
      hideTimeout,
      backgroundColor,
      textColor,
      activeTextColor,
    ],
  );

  // 操作函数全部是恒定引用，这个 context 只创建一次
  const actionsValue: MenuActionsContextValue = useMemo(
    () => ({
      addMenuItem,
      removeMenuItem,
      addSubMenu,
      removeSubMenu,
      openMenu,
      closeMenu,
      handleMenuItemClick,
      handleSubMenuClick,
      triggerResize,
    }),
    // 全部是恒定引用的操作函数，只需创建一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /** 根节点下发给第一层子节点的层级上下文，isRoot 为真表示没有上层子菜单。 */
  const rootLevelValue: SubMenuContextValue = useMemo(
    () => ({
      level: 0,
      indexPath: [],
      isRoot: true,
      mouseInChild: mouseInChildRef,
    }),
    [],
  );

  const rootClasses = joinClasses(
    "el-menu",
    `el-menu--${mode}`,
    collapse && "el-menu--collapse",
    className,
  );

  const ulStyle = menuCssVar(props, 0);
  const visibleChildren =
    sliceIndex === -1 ? childArray : childArray.slice(0, sliceIndex);
  const moreChildren = sliceIndex === -1 ? [] : childArray.slice(sliceIndex);

  // 省略号子菜单直接作为 ul 的子节点渲染：ElSubMenu 本身就是 li，
  // 再包一层 li 会造成非法的 li 嵌套（React 水合报错）。
  // 未截断时不渲染，与官方一致；首次测量用默认宽度兜底。
  const ellipsisSlot = mode === "horizontal" &&
    sliceIndex !== -1 &&
    moreChildren.length > 0 && (
      <ElSubMenu
        ref={moreSlotRef}
        index={MORE_SUB_MENU_INDEX}
        hideArrow
        hideOnEllipsis
        ellipsisIcon={ellipsisIcon ?? <More />}
      >
        {moreChildren}
      </ElSubMenu>
    );

  // 纵向模式默认包一层收起过渡容器；key 随 collapse 变化，与官方一致重挂载。
  // 过渡容器渲染的就是 ul.el-menu 本身，DOM 与官方一致（无额外包裹节点）。
  const ulNode =
    collapseTransition && mode === "vertical" ? (
      <MenuCollapseTransition
        key={String(collapse)}
        collapsed={collapse}
        className={rootClasses}
        style={{ ...ulStyle, ...style }}
        role="menubar"
        elementRef={menuRef}
      >
        {visibleChildren}
        {ellipsisSlot}
      </MenuCollapseTransition>
    ) : (
      <ul
        ref={menuRef}
        role="menubar"
        className={rootClasses}
        style={{ ...ulStyle, ...style }}
      >
        {visibleChildren}
        {ellipsisSlot}
      </ul>
    );

  return (
    <MenuActionsContext.Provider value={actionsValue}>
      <MenuStateContext.Provider value={stateValue}>
        <SubMenuContext.Provider value={rootLevelValue}>
          {ulNode}
        </SubMenuContext.Provider>
      </MenuStateContext.Provider>
    </MenuActionsContext.Provider>
  );
});

/** 注册表快照本身充当版本号：内容相同的快照在依赖比较里也能被识别。 */
function resolveRegistryVersion(registry: {
  items: Record<string, MenuItemRegistered>;
  subMenus: Record<string, MenuItemRegistered>;
}): number {
  return Object.keys(registry.items).length + Object.keys(registry.subMenus).length;
}
