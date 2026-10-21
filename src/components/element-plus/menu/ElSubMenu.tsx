"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ElTooltip } from "../tooltip";
import { ElIcon } from "../icon/ElIcon";
import { ArrowDown, ArrowRight } from "../generated/icons";
import { SubMenuTransition } from "./MenuCollapseTransition";
import {
  SubMenuContext,
  useMenuActions,
  useMenuState,
  useSubMenuContext,
  type SubMenuContextValue,
} from "./context";
import { useMenu } from "./use-menu";
import { joinClasses, menuCssVar } from "./utils";
import type { PopperPlacement } from "../popper/use-popper";

export interface SubMenuProps {
  /** 唯一标识，必填 */
  index: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 浮层自定义类名 */
  popperClass?: string;
  /** 浮层自定义样式 */
  popperStyle?: CSSProperties;
  /** 展开延时，缺省继承根菜单的 show-timeout */
  showTimeout?: number;
  /** 收起延时，缺省继承根菜单的 hide-timeout */
  hideTimeout?: number;
  /** 浮层是否挂载到 body，缺省时第一层为 true */
  teleported?: boolean;
  /** 与触发元素的间距，缺省继承根菜单的 popper-offset */
  popperOffset?: number;
  /** 展开态且子菜单收起时的图标 */
  expandCloseIcon?: ReactNode;
  /** 展开态且子菜单展开时的图标 */
  expandOpenIcon?: ReactNode;
  /** 收起态且子菜单收起时的图标 */
  collapseCloseIcon?: ReactNode;
  /** 收起态且子菜单展开时的图标 */
  collapseOpenIcon?: ReactNode;
  /** 标题内容 */
  title?: ReactNode;
  /** 省略号形态的图标，根菜单横向截断时使用 */
  ellipsisIcon?: ReactNode;
  /** 隐藏右侧箭头，省略号子菜单使用 */
  hideArrow?: boolean;
  /** 仅供根菜单内部标记：这是省略号子菜单，图标换成 More */
  hideOnEllipsis?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 对应官方 ElSubMenu。
 *
 * 两种形态由根菜单的 isMenuPopup 决定：
 * - 浮层（横向，或纵向折叠）：标题外包一层 ElTooltip（effect=light、pure、
 *   无箭头、显隐完全受控），内容为 `div.el-menu--popup-container > ul.el-menu--popup`。
 * - 内联（纵向展开）：标题 + MenuCollapseTransition 包住 `ul.el-menu--inline`。
 *
 * 层级与路径：官方沿组件 parent 链回溯，这里改用就近的 SubMenuContext，
 * 每层子菜单渲染自己的 Provider，孩子读到最近的一层。
 *
 * 悬停开合策略逐条对齐官方：横向 hover 模式、纵向折叠形态下悬停即开合，
 * 纵向展开与横向 click 模式只记录指针位置，开合交给点击。
 */
export const ElSubMenu = forwardRef<HTMLLIElement, SubMenuProps>(
  function ElSubMenu(
    {
      index,
      disabled = false,
      popperClass,
      popperStyle,
      showTimeout,
      hideTimeout,
      teleported,
      popperOffset,
      expandCloseIcon,
      expandOpenIcon,
      collapseCloseIcon,
      collapseOpenIcon,
      title,
      ellipsisIcon,
      hideArrow = false,
      hideOnEllipsis = false,
      className,
      style,
      children,
    },
    ref,
  ) {
    const state = useMenuState();
    const actions = useMenuActions();
    const parentSub = useSubMenuContext();
    const { indexPath, isFirstLevel } = useMenu(index);
    const indexPathKey = indexPath.join(" ");

    // 指针是否落在本子菜单的标题或浮层内容内
    const regionRef = useRef(false);
    // 是否有更深一层子菜单被悬停，作为收起计时器的豁免条件
    const childRef = useRef(false);

    const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const props = state?.props;
    const mode = props?.mode ?? "vertical";
    const collapse = props?.collapse ?? false;
    const opened = state ? state.openedMenus.includes(index) : false;

    // 注册到根菜单的注册表：供 default-active 展开路径与祖先高亮判断使用
    useEffect(() => {
      if (!actions) return;
      const item = { index, indexPath: indexPathKey.split(" ") };
      actions.addSubMenu(item);
      return () => actions.removeSubMenu(item);
    }, [actions, index, indexPathKey]);

    const clearShowTimer = useCallback(() => {
      if (showTimer.current) {
        clearTimeout(showTimer.current);
        showTimer.current = null;
      }
    }, []);

    const clearHideTimer = useCallback(() => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
    }, []);

    const subMenuShowTimeout = showTimeout ?? props?.showTimeout ?? 300;
    const subMenuHideTimeout = hideTimeout ?? props?.hideTimeout ?? 300;

    const openSelf = useCallback(() => {
      actions?.openMenu(index, indexPathKey.split(" "));
    }, [actions, index, indexPathKey]);

    const closeSelf = useCallback(() => {
      actions?.closeMenu(index, indexPathKey.split(" "));
    }, [actions, index, indexPathKey]);

    /**
     * 点击开合。官方在「横向 hover 模式 / 纵向折叠 / 禁用」时忽略点击，
     * 这些形态下开合交给悬停。
     */
    const handleClick = () => {
      if (!actions || !props) return;
      if (
        (props.menuTrigger === "hover" && mode === "horizontal") ||
        (collapse && mode === "vertical") ||
        disabled
      ) {
        return;
      }
      actions.handleSubMenuClick({ index, indexPath: indexPathKey.split(" ") });
    };

    // 悬停开合仅在这些形态下生效，其余形态只记录指针位置
    const hoverDrivesOpen = !(
      (props?.menuTrigger === "click" && mode === "horizontal") ||
      (!collapse && mode === "vertical") ||
      disabled
    );

    const handleMouseenter = (delay?: number) => {
      regionRef.current = true;
      // 通知父级：指针已进入它的子树，父级收起时要跳过
      if (parentSub) parentSub.mouseInChild.current = true;

      if (!hoverDrivesOpen) return;

      clearShowTimer();
      showTimer.current = setTimeout(openSelf, delay ?? subMenuShowTimeout);
    };

    const handleMouseleave = useCallback(
      (deepDispatch = false) => {
        regionRef.current = false;
        if (parentSub) parentSub.mouseInChild.current = false;

        if (!hoverDrivesOpen) return;

        clearShowTimer();
        clearHideTimer();
        hideTimer.current = setTimeout(() => {
          // 指针仍在自身区域或更深一层子菜单里时不收起
          if (!regionRef.current && !childRef.current) closeSelf();
        }, subMenuHideTimeout);

        // 浮层形态下最深一层离开时，把收起判断继续向上传递
        if (deepDispatch) parentSub?.handleMouseleave?.(true);
      },
      [
        clearHideTimer,
        clearShowTimer,
        closeSelf,
        hoverDrivesOpen,
        parentSub,
        subMenuHideTimeout,
      ],
    );

    useEffect(() => clearShowTimer, [clearShowTimer]);
    useEffect(() => clearHideTimer, [clearHideTimer]);

    const subMenuPopperOffset = popperOffset ?? props?.popperOffset ?? 6;
    const subMenuPopperClass = popperClass ?? props?.popperClass;
    const subMenuPopperStyle = popperStyle ?? props?.popperStyle;

    const isExpandedMode =
      (mode === "horizontal" && isFirstLevel) || (mode === "vertical" && !collapse);

    // 箭头图标：官方在同时提供成对图标时用它替代默认箭头，
    // 并把旋转写成 transform: none（图标本身已表达方向）
    const hasCustomIcon = isExpandedMode
      ? Boolean(expandCloseIcon && expandOpenIcon)
      : Boolean(collapseCloseIcon && collapseOpenIcon);

    const arrowIcon = isExpandedMode
      ? (opened ? expandOpenIcon : expandCloseIcon) ?? <ArrowDown />
      : (opened ? collapseOpenIcon : collapseCloseIcon) ?? <ArrowRight />;

    const arrowTransform = opened && !hasCustomIcon ? "rotateZ(180deg)" : "none";

    /**
     * 对应官方 active 计算：子树（含深层菜单项与子菜单）中存在激活项时高亮。
     * 本实现按 indexPath 前缀在根注册表里过滤，等价于官方读自己的注册表。
     */
    const active = useMemo(() => {
      if (!state) return false;
      const prefix = `${indexPathKey} `;
      const matches = (indexPath: string[]) =>
        `${indexPath.join(" ")} `.startsWith(prefix);
      return (
        Object.values(state.items).some(
          (item) => item.index === state.activeIndex && matches(item.indexPath),
        )
      );
    }, [state, indexPathKey]);

    const level = (parentSub?.level ?? 0) + 1;
    const ulStyle = useMemo(
      () => (props ? menuCssVar(props, level) : undefined),
      [props, level],
    );

    const subContextValue: SubMenuContextValue = useMemo(
      () => ({
        level,
        indexPath: indexPathKey.split(" "),
        isRoot: false,
        mouseInChild: childRef,
        // handleMouseleave 已用 useCallback 保持稳定，避免 Context 每次渲染换引用
        handleMouseleave,
      }),
      [handleMouseleave, level, indexPathKey],
    );

    const liClasses = joinClasses(
      "el-sub-menu",
      active && "is-active",
      opened && "is-opened",
      disabled && "is-disabled",
      hideArrow && "el-sub-menu__hide-arrow",
      className,
    );

    // 省略号子菜单同时保留 More 与（隐藏的）箭头节点，与官方 DOM 一致
    const titleIcon = hideOnEllipsis ? (
      <>
        <ElIcon className="el-sub-menu__icon-more">{ellipsisIcon}</ElIcon>
        <ElIcon
          className="el-sub-menu__icon-arrow"
          style={{ transform: arrowTransform }}
        >
          {arrowIcon}
        </ElIcon>
      </>
    ) : (
      <ElIcon
        className="el-sub-menu__icon-arrow"
        style={{ transform: arrowTransform }}
      >
        {arrowIcon}
      </ElIcon>
    );

    const titleNode = (
      <>
        {title}
        {titleIcon}
      </>
    );

    let body: ReactNode;

    if (state?.isMenuPopup) {
      const isTopLevelHorizontal = mode === "horizontal" && isFirstLevel;
      const currentPlacement: PopperPlacement = isTopLevelHorizontal
        ? "bottom-start"
        : "right-start";
      const fallbackPlacements: PopperPlacement[] = isTopLevelHorizontal
        ? [
            "bottom-start",
            "bottom-end",
            "top-start",
            "top-end",
            "right-start",
            "left-start",
          ]
        : [
            "right-start",
            "right",
            "right-end",
            "left-start",
            "bottom-start",
            "bottom-end",
            "top-start",
            "top-end",
          ];
      const appendToBody = teleported ?? isFirstLevel;

      body = (
        <ElTooltip
          visible={opened}
          effect="light"
          pure
          offset={subMenuPopperOffset}
          showArrow={false}
          popperClass={subMenuPopperClass}
          popperStyle={subMenuPopperStyle}
          placement={currentPlacement}
          fallbackPlacements={fallbackPlacements}
          trigger={[]}
          teleported={appendToBody}
          role="menu"
          content={
            <div
              className={joinClasses(
                `el-menu--${mode}`,
                "el-menu--popup-container",
                subMenuPopperClass,
              )}
              onMouseEnter={() => handleMouseenter(100)}
              onMouseLeave={() => handleMouseleave(true)}
            >
              <ul
                className={joinClasses(
                  "el-menu",
                  "el-menu--popup",
                  `el-menu--popup-${currentPlacement}`,
                )}
                style={ulStyle}
              >
                {children}
              </ul>
            </div>
          }
        >
          <div
            className="el-sub-menu__title el-tooltip__trigger el-tooltip__trigger"
            onClick={handleClick}
            onMouseEnter={() => handleMouseenter()}
            onMouseLeave={() => handleMouseleave()}
          >
            {titleNode}
          </div>
        </ElTooltip>
      );
    } else {
      body = (
        <>
          <div
            className="el-sub-menu__title"
            onClick={handleClick}
            onMouseEnter={() => handleMouseenter()}
            onMouseLeave={() => handleMouseleave()}
          >
            {titleNode}
          </div>
          <SubMenuTransition
            visible={opened}
            role="menu"
            className="el-menu el-menu--inline"
            style={ulStyle}
          >
            {children}
          </SubMenuTransition>
        </>
      );
    }

    return (
      <SubMenuContext.Provider value={subContextValue}>
        <li
          ref={ref}
          className={liClasses}
          style={style}
          role="menuitem"
          aria-haspopup
          aria-expanded={opened}
          onMouseEnter={() => handleMouseenter()}
          onMouseLeave={() => handleMouseleave()}
          onFocus={() => handleMouseenter()}
        >
          {body}
        </li>
      </SubMenuContext.Provider>
    );
  },
);
