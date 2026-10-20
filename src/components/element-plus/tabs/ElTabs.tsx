"use client";

import {
  Children,
  cloneElement,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { ElIcon } from "../icon/ElIcon";
import { Close, Plus } from "../icons";

export type TabPosition = "top" | "right" | "bottom" | "left";
export type TabsType = "" | "card" | "border-card";

export interface TabPaneProps {
  /** 面板标识，对应官方 name。省略时用下标 */
  name?: string | number;
  /** 标签标题 */
  label?: ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否可关闭 */
  closable?: boolean;
  /** 是否懒渲染（首次激活才挂载） */
  lazy?: boolean;
  /** 由父组件注入 */
  active?: boolean;
  index?: number;
  idPrefix?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * 对应官方 ElTabPane。
 * 仅作为 ElTabs 的子组件使用；active 由父组件注入。
 */
export function ElTabPane({
  name,
  lazy = false,
  active = false,
  index = 0,
  idPrefix = "el-tabs",
  className,
  children,
}: TabPaneProps) {
  const paneName = name ?? String(index);

  // lazy：首次激活后保持挂载（loadedOnce），等价于官方 keep-alive 的懒渲染行为
  const [loadedOnce, setLoadedOnce] = useState(false);
  if (active && !loadedOnce) setLoadedOnce(true);

  const shouldRender = active || !lazy || loadedOnce;
  const tabId = `${idPrefix}-tab-${paneName}`;
  const panelId = `${idPrefix}-pane-${paneName}`;

  return (
    <div
      className={["el-tab-pane", active && "active" /* v-show 由 CSS 控制 */, className]
        .filter(Boolean)
        .join(" ")}
      style={{ display: active ? undefined : "none" }}
      role="tabpanel"
      aria-hidden={!active}
      aria-labelledby={tabId}
      id={panelId}
    >
      {shouldRender ? children : null}
    </div>
  );
}

ElTabPane.displayName = "ElTabPane";

export interface TabsProps {
  /** 选中面板的 name，对应官方 v-model */
  value?: string | number;
  /** 非受控时的默认选中 name，对应官方 default-value */
  defaultValue?: string | number;
  /** 值变化 */
  onChange?: (name: string | number) => void;
  /** 点击 tab 的回调（已选中也会触发），对应官方 tab-click */
  onTabClick?: (name: string | number) => void;
  /** tab 被移除时触发 */
  onTabRemove?: (name: string | number) => void;
  /** tab 新增时触发 */
  onTabAdd?: () => void;
  /** 可增删时的统一回调，对应官方 edit 事件 */
  onEdit?: (name: string | number | undefined, action: "remove" | "add") => void;
  /** 自定义新增按钮图标，对应官方 add-icon 插槽 */
  addIcon?: ReactNode;
  /** 选项卡风格 */
  type?: TabsType;
  /** 位置 */
  tabPosition?: TabPosition;
  /** 是否可关闭 */
  closable?: boolean;
  /** 是否可通过加号新增（editable 的读态） */
  addable?: boolean;
  /** 是否可增删 */
  editable?: boolean;
  /** 切换前的钩子，返回 false 阻止 */
  beforeLeave?: (newName: string | number, oldName: string | number) => boolean | Promise<boolean>;
  /** 标签是否居中（水平位置有效） */
  stretch?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 对应官方 ElTabs。
 *
 * 激活条（el-tabs__active-bar）的定位与官方 getBarStyle 一致：
 * 量激活 tab 的 offsetLeft/clientWidth（扣除 padding），
 * 用 transform: translateX 定位，仅非 card 类型渲染。
 */
export function ElTabs({
  value: controlled,
  defaultValue,
  onChange,
  onTabClick,
  onTabRemove,
  onTabAdd,
  onEdit,
  addIcon,
  type = "",
  tabPosition = "top",
  closable = false,
  addable = false,
  editable = false,
  beforeLeave,
  stretch = false,
  className,
  style,
  children,
}: TabsProps) {
  const panes = Children.toArray(children).filter(
    (child): child is ReactElement<TabPaneProps> => {
      if (typeof child === "object" && child !== null && "type" in child) {
        const childType = (child as ReactElement).type;
        return (
          childType === ElTabPane ||
          (typeof childType === "function" &&
            (childType as { displayName?: string }).displayName === "ElTabPane")
        );
      }
      return false;
    },
  );

  const firstName = panes.length
    ? (panes[0].props.name ?? "0")
    : "";

  const [uncontrolled, setUncontrolled] = useState<string | number>(
    () => defaultValue ?? firstName,
  );
  const currentValue = controlled !== undefined ? controlled : uncontrolled;

  // useId 含冒号，拼接 DOM id 前剔除，保证 querySelector 可用
  const idPrefix = `el-tabs-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const navRef = useRef<HTMLDivElement>(null);
  const [barStyle, setBarStyle] = useState<CSSProperties>({});

  const isVertical = tabPosition === "left" || tabPosition === "right";
  const isCard = type === "card" || type === "border-card";

  const setCurrentValue = (next: string | number) => {
    if (next === currentValue) return;

    if (beforeLeave) {
      const result = beforeLeave(next, currentValue);
      if (result instanceof Promise) {
        result.then((ok) => {
          if (ok !== false) {
            setUncontrolled(next);
            onChange?.(next);
          }
        });
        return;
      }
      if (result === false) return;
    }

    setUncontrolled(next);
    onChange?.(next);
  };

  /** 对应官方 getBarStyle */
  const updateBar = () => {
    if (isCard) return;

    const nav = navRef.current;
    if (!nav) return;

    const activeTab = nav.querySelector<HTMLElement>(".el-tabs__item.is-active");
    if (!activeTab) return;

    const sizeName = isVertical ? "height" : "width";
    const sizeDir = isVertical ? "Y" : "X";
    const position = isVertical ? "Top" : "Left";

    let offset = activeTab[`offset${position}`];
    let tabSize = activeTab[`client${sizeName === "width" ? "Width" : "Height"}`];

    const styles = window.getComputedStyle(activeTab);
    if (!isVertical) {
      tabSize -=
        Number.parseFloat(styles.paddingLeft) +
        Number.parseFloat(styles.paddingRight);
      // 官方激活条对齐文字起点，而非 tab 元素的左边缘
      offset += Number.parseFloat(styles.paddingLeft);
    }

    const next = {
      [sizeName]: `${tabSize}px`,
      transform: `translate${sizeDir}(${offset}px)`,
    } as CSSProperties;

    // 值未变化时不 setState：这个 effect 每次渲染后都会跑，
    // 若无条件写入新对象会触发「渲染 → 写状态 → 再渲染」的无限循环
    const serialized = JSON.stringify(next);
    setBarStyle((prev) => (JSON.stringify(prev) === serialized ? prev : next));
  };

  useLayoutEffect(() => {
    updateBar();
  });

  const handleTabClick = (name: string | number, disabled: boolean) => {
    if (disabled) return;
    onTabClick?.(name);
    setCurrentValue(name);
  };

  const handleTabRemove = (name: string | number) => {
    onEdit?.(name, "remove");
    onTabRemove?.(name);
  };

  const handleTabAdd = () => {
    onEdit?.(undefined, "add");
    onTabAdd?.();
  };

  /** 对应官方 changeTab：方向键循环聚焦并选中相邻可用 tab */
  const handleNavKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let step = 0;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") step = -1;
    else if (event.key === "ArrowRight" || event.key === "ArrowDown") step = 1;
    else return;

    const tabList = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]:not(.is-disabled)'),
    );
    const currentIndex = tabList.indexOf(event.target as HTMLElement);
    if (currentIndex < 0 || tabList.length === 0) return;

    const nextIndex = (currentIndex + step + tabList.length) % tabList.length;
    const nextTab = tabList[nextIndex];
    event.preventDefault();
    nextTab.focus({ preventScroll: true });
    nextTab.click();
  };

  const rootClasses = [
    "el-tabs",
    `el-tabs--${tabPosition}`,
    type && `el-tabs--${type}`,
    stretch && "el-tabs--stretch",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // 与官方类名一致：纵向额外加 el-tabs__header-vertical，并始终带 is-<position>
  const headerClasses = [
    "el-tabs__header",
    isVertical && "el-tabs__header-vertical",
    `is-${tabPosition}`,
  ]
    .filter(Boolean)
    .join(" ");
  const navWrapClasses = ["el-tabs__nav-wrap", `is-${tabPosition}`].join(" ");
  const navClasses = [
    "el-tabs__nav",
    `is-${tabPosition}`,
    stretch && !isVertical && "is-stretch",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClasses} style={style}>
      <div className={headerClasses}>
        <div className={navWrapClasses} ref={navRef}>
          <div className="el-tabs__nav-scroll">
            <div
              className={navClasses}
              role="tablist"
              aria-orientation={isVertical ? "vertical" : "horizontal"}
              onKeyDown={handleNavKeyDown}
              style={{
                // 官方 navStyle 始终写入 translate，滚动偏移为 0 时即 identity matrix
                transform: `translate${isVertical ? "Y" : "X"}(-0px)`,
                ...(stretch && !isVertical ? { display: "flex" } : {}),
              }}
            >
              {/* 激活条：仅非 card 类型渲染 */}
              {!isCard && (
                <div
                  className={["el-tabs__active-bar", `is-${tabPosition}`].join(" ")}
                  style={barStyle}
                />
              )}

              {panes.map((pane, index) => {
                const props = pane.props;
                const paneName = props.name ?? String(index);
                const isActive = String(paneName) === String(currentValue);
                // 对应官方 isClosable：pane 显式设置优先，其次全局 closable / editable
                const tabClosable =
                  !props.disabled &&
                  ((props.closable ?? closable) ||
                    (props.closable !== false && editable));

                return (
                  <div
                    key={String(paneName)}
                    className={[
                      "el-tabs__item",
                      isActive && "is-active",
                      props.disabled && "is-disabled",
                      tabClosable && "is-closable",
                      // 官方用 ns.is(tabPosition)，即 is-top / is-bottom / is-left / is-right
                      `is-${tabPosition}`,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    role="tab"
                    aria-selected={isActive}
                    aria-disabled={props.disabled}
                    aria-controls={`${idPrefix}-pane-${paneName}`}
                    tabIndex={props.disabled ? undefined : isActive ? 0 : -1}
                    id={`${idPrefix}-tab-${paneName}`}
                    onClick={() => handleTabClick(paneName, props.disabled ?? false)}
                    onKeyDown={(event) => {
                      if (
                        tabClosable &&
                        (event.key === "Delete" || event.key === "Backspace")
                      ) {
                        event.preventDefault();
                        handleTabRemove(paneName);
                      }
                    }}
                  >
                    {props.label}

                    {tabClosable && (
                      <ElIcon
                        className="is-icon-close"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleTabRemove(paneName);
                        }}
                      >
                        <Close />
                      </ElIcon>
                    )}
                  </div>
                );
              })}

            </div>
          </div>
        </div>
        {(addable || editable) && (
          <div
            className={[
              "el-tabs__new-tab",
              isVertical && "el-tabs__new-tab-vertical",
            ]
              .filter(Boolean)
              .join(" ")}
            role="button"
            tabIndex={0}
            aria-label="添加选项卡"
            onClick={handleTabAdd}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleTabAdd();
              }
            }}
          >
            {addIcon ?? (
              <ElIcon className="is-icon-plus">
                <Plus />
              </ElIcon>
            )}
          </div>
        )}
      </div>

      <div className="el-tabs__content">
        {panes.map((pane, index) => {
          const props = pane.props;
          const paneName = props.name ?? String(index);
          const isActive = String(paneName) === String(currentValue);

          return cloneElement(pane, {
            key: String(paneName),
            active: isActive,
            index,
            idPrefix,
          });
        })}
      </div>
    </div>
  );
}
