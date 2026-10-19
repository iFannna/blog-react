"use client";

import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from "react";
import { ElIcon } from "../icon/ElIcon";
import { ArrowRight } from "../icons";

export type CollapseActiveName = string | number;

export interface CollapseContextValue {
  activeNames: CollapseActiveName[];
  handleItemClick: (name: CollapseActiveName) => void;
}

export const CollapseContext = createContext<CollapseContextValue | null>(null);

export function useCollapseContext() {
  return useContext(CollapseContext);
}

export interface CollapseProps {
  /** 当前展开的面板。手风琴模式下是单值，否则为数组 */
  value?: CollapseActiveName | CollapseActiveName[];
  /** 值变化 */
  onChange?: (value: CollapseActiveName | CollapseActiveName[]) => void;
  /** 是否手风琴模式（同时只能展开一个） */
  accordion?: boolean;
  /** 展开图标位置 */
  expandIconPosition?: "left" | "right";
  /** 切换前的钩子，返回 false 或 reject 的 Promise 阻止切换 */
  beforeCollapse?: (name: CollapseActiveName) => boolean | Promise<boolean>;
  className?: string;
  children?: ReactNode;
}

function ensureArray(value: CollapseActiveName | CollapseActiveName[] | undefined) {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * 对应官方 ElCollapse。
 *
 * 切换逻辑与官方 useCollapse 一致：
 * - 手风琴：点已展开的面板则收起（activeNames 变为 ['']），否则只保留新面板
 * - 非手风琴：在数组里增删该项
 * 回传值在手风琴模式下取数组首项（可能是 ''），否则传整个数组。
 */
export function ElCollapse({
  value,
  onChange,
  accordion = false,
  expandIconPosition = "right",
  beforeCollapse,
  className,
  children,
}: CollapseProps) {
  const [activeNames, setActiveNames] = useState<CollapseActiveName[]>(
    () => ensureArray(value),
  );

  // 外部 value 变化时同步（对应官方的 watch）
  const [lastExternal, setLastExternal] = useState(value);
  if (value !== lastExternal) {
    setLastExternal(value);
    setActiveNames(ensureArray(value));
  }

  const handleChange = (name: CollapseActiveName) => {
    const next = accordion
      ? [activeNames[0] === name ? "" : name]
      : (() => {
          const names = [...activeNames];
          const index = names.indexOf(name);
          if (index > -1) names.splice(index, 1);
          else names.push(name);
          return names;
        })();

    setActiveNames(next);
    onChange?.(accordion ? (next[0] ?? "") : next);
  };

  const handleItemClick = (name: CollapseActiveName) => {
    if (!beforeCollapse) {
      handleChange(name);
      return;
    }

    const shouldChange = beforeCollapse(name);

    if (shouldChange instanceof Promise) {
      shouldChange
        .then((result) => {
          if (result !== false) handleChange(name);
        })
        .catch(() => {
          // 官方在此只做 debugWarn
        });
    } else if (shouldChange) {
      handleChange(name);
    }
  };

  const classes = [
    "el-collapse",
    `el-collapse-icon-position-${expandIconPosition}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <CollapseContext.Provider value={{ activeNames, handleItemClick }}>
      <div className={classes}>{children}</div>
    </CollapseContext.Provider>
  );
}

export interface CollapseItemRenderProps {
  isActive: boolean;
}

export interface CollapseItemProps {
  /** 面板标识，对应官方 name */
  name?: CollapseActiveName;
  /** 标题，可传函数以获取展开态，对应官方 title 插槽 */
  title?: ReactNode | ((props: CollapseItemRenderProps) => ReactNode);
  /** 是否禁用 */
  disabled?: boolean;
  /**
   * 自定义图标。传节点时包裹在官方 arrow 容器中；
   * 传函数时等价官方 icon 插槽，由调用方完全接管渲染。
   */
  icon?: ReactNode | ((props: CollapseItemRenderProps) => ReactNode);
  className?: string;
  children?: ReactNode;
}

/**
 * 对应官方 ElCollapseItem。
 *
 * 头部 role=button，支持 space / enter 键切换；
 * 箭头在展开时加 is-active（旋转 90 度由 CSS 提供）。
 */
export function ElCollapseItem({
  name,
  title,
  disabled = false,
  icon,
  className,
  children,
}: CollapseItemProps) {
  const ctx = useCollapseContext();
  const uid = useId();
  const itemName = name ?? uid;

  const isActive = ctx?.activeNames.includes(itemName) ?? false;

  const renderedTitle =
    typeof title === "function" ? title({ isActive }) : title;
  const renderedIcon =
    typeof icon === "function" ? (
      icon({ isActive })
    ) : (
      <ElIcon
        className={["el-collapse-item__arrow", isActive && "is-active"]
          .filter(Boolean)
          .join(" ")}
      >
        {icon ?? <ArrowRight />}
      </ElIcon>
    );

  const itemClasses = [
    "el-collapse-item",
    isActive && "is-active",
    disabled && "is-disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const headId = `el-collapse-head-${itemName}`;
  const contentId = `el-collapse-content-${itemName}`;

  const headerClasses = [
    "el-collapse-item__header",
    isActive && "is-active",
    disabled && "is-disabled",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={itemClasses}>
      <div
        id={headId}
        className={headerClasses}
        aria-expanded={isActive}
        aria-controls={contentId}
        aria-describedby={contentId}
        aria-disabled={disabled}
        tabIndex={disabled ? undefined : 0}
        role="button"
        onClick={() => {
          if (disabled) return;
          ctx?.handleItemClick(itemName);
        }}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            event.stopPropagation();
            ctx?.handleItemClick(itemName);
          }
        }}
      >
        <span className="el-collapse-item__title">{renderedTitle}</span>
        {renderedIcon}
      </div>

      {/* 与官方 v-show 一致：收起时仅隐藏，保留面板内部状态 */}
      <div
        id={contentId}
        role="region"
        className="el-collapse-item__wrap"
        style={{ display: isActive ? undefined : "none" }}
        aria-hidden={!isActive}
        aria-labelledby={headId}
      >
        <div className="el-collapse-item__content">{children}</div>
      </div>
    </div>
  );
}
