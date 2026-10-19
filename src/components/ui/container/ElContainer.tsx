"use client";

import {
  createElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

interface ContainerContextValue {
  /** 是否有 el-aside 子元素，决定默认布局方向 */
  registerAside: () => () => void;
  hasAside: boolean;
}

const ContainerContext = createContext<ContainerContextValue | null>(null);

export interface ContainerProps {
  /** 布局方向。不传时根据是否含有 Aside 自动判断 */
  direction?: "horizontal" | "vertical";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 对应官方 ElContainer。
 *
 * 官方靠遍历 vnode 的类名判断是否含 el-aside（Vue 的 vnode 能拿到完整类名），
 * React 里函数组件的 props.className 拿不到组件内部拼好的类名，
 * 因此改为由 Aside 通过 context 主动注册 —— 这是 React 里更可靠的做法。
 *
 * 方向规则与官方一致：显式 direction 优先，
 * 否则有 Aside 就横向（aside 在左），没有就纵向。
 */
export function ElContainer({
  direction,
  className,
  style,
  children,
}: ContainerProps) {
  const [asideCount, setAsideCount] = useState(0);

  const ctx = useMemo<ContainerContextValue>(
    () => ({
      hasAside: asideCount > 0,
      registerAside: () => {
        setAsideCount((n) => n + 1);
        return () => setAsideCount((n) => Math.max(0, n - 1));
      },
    }),
    [asideCount],
  );

  const isVertical = direction === "vertical" || (!direction && asideCount === 0);

  const classes = ["el-container", isVertical && "is-vertical", className]
    .filter(Boolean)
    .join(" ");

  return (
    <ContainerContext.Provider value={ctx}>
      {createElement("section", { className: classes, style }, children)}
    </ContainerContext.Provider>
  );
}

export interface AsideProps {
  /** 侧边栏宽度 */
  width?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** 对应官方 ElAside。挂载时向父级 Container 注册，用于决定布局方向。 */
export function ElAside({ width = "300px", className, style, children }: AsideProps) {
  const ctx = useContext(ContainerContext);

  useEffect(() => {
    if (!ctx) return;
    return ctx.registerAside();
  }, [ctx]);

  return createElement(
    "aside",
    {
      className: ["el-aside", className].filter(Boolean).join(" "),
      style: { width, ...style },
    },
    children,
  );
}

export interface HeaderProps {
  /** 顶栏高度 */
  height?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** 对应官方 ElHeader。 */
export function ElHeader({ height = "60px", className, style, children }: HeaderProps) {
  return createElement(
    "header",
    {
      className: ["el-header", className].filter(Boolean).join(" "),
      style: { height, ...style },
    },
    children,
  );
}

export interface FooterProps {
  /** 底栏高度 */
  height?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** 对应官方 ElFooter。 */
export function ElFooter({ height = "60px", className, style, children }: FooterProps) {
  return createElement(
    "footer",
    {
      className: ["el-footer", className].filter(Boolean).join(" "),
      style: { height, ...style },
    },
    children,
  );
}

export interface MainProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** 对应官方 ElMain。 */
export function ElMain({ className, style, children }: MainProps) {
  return createElement(
    "main",
    { className: ["el-main", className].filter(Boolean).join(" "), style },
    children,
  );
}
