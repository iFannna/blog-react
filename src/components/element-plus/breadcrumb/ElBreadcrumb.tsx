"use client";

import {
  createContext,
  useContext,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export interface BreadcrumbContextValue {
  separator?: string;
  separatorIcon?: ReactNode;
}

export const BreadcrumbContext = createContext<BreadcrumbContextValue>({});

export function useBreadcrumbContext() {
  return useContext(BreadcrumbContext);
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLDivElement> {
  /** 分隔符，默认 "/" */
  separator?: string;
  /** 图标分隔符，传入后忽略 separator */
  separatorIcon?: ReactNode;
  children?: ReactNode;
}

/** 对应官方 ElBreadcrumb。 */
export function ElBreadcrumb({
  separator = "/",
  separatorIcon,
  className,
  children,
  ...restProps
}: BreadcrumbProps) {
  return (
    <BreadcrumbContext.Provider value={{ separator, separatorIcon }}>
      <div
        className={["el-breadcrumb", className].filter(Boolean).join(" ")}
        aria-label="Breadcrumb"
        role="navigation"
        {...restProps}
      >
        {children}
      </div>
    </BreadcrumbContext.Provider>
  );
}

export interface BreadcrumbItemProps {
  /** 路由跳转目标，对应官方 to */
  to?: string;
  /** to 模式下是否 replace */
  replace?: boolean;
  /** 点击回调，对应官方 click 事件 */
  onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
  className?: string;
  children?: ReactNode;
}

/**
 * 对应官方 ElBreadcrumbItem。
 *
 * 结构与官方一致：item 内是 inner（有 to 时加 is-link）+ separator。
 * separator / separatorIcon 从父级 Breadcrumb 的 context 读取。
 */
export function ElBreadcrumbItem({
  to,
  onClick,
  className,
  children,
}: BreadcrumbItemProps) {
  const ctx = useBreadcrumbContext();

  return (
    <span className={["el-breadcrumb__item", className].filter(Boolean).join(" ")}>
      <span
        className={["el-breadcrumb__inner", to && "is-link"].filter(Boolean).join(" ")}
        role="link"
        onClick={onClick}
      >
        {children}
      </span>

      {ctx.separatorIcon ? (
        <span className="el-breadcrumb__separator" role="presentation">
          {ctx.separatorIcon}
        </span>
      ) : (
        <span className="el-breadcrumb__separator" role="presentation">
          {ctx.separator}
        </span>
      )}
    </span>
  );
}
