"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";

/** 与 --el-transition-duration（0.3s）保持一致，过渡结束后再收尾。 */
const DURATION = 300;

/** 合并内部 ref 与外部传入的 ref，同时支持回调 ref 与对象 ref。 */
function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

interface SubMenuTransitionProps {
  /** 展开态。切换时按 max-height 补间 */
  visible: boolean;
  /** 参与过渡的 ul 类名 */
  className?: string;
  style?: CSSProperties;
  role?: string;
  children?: ReactNode;
}

/**
 * 对应官方 ElCollapseTransition 在菜单里的用法（纵向内联子菜单列表）。
 *
 * 官方用 Vue 的 transition 钩子把 max-height / padding / overflow 写到元素上；
 * React 没有等价钩子，这里在 visible 变化时复刻同样的两步：
 * 展开先置 0 再于下一帧设成 scrollHeight，收起则反向，
 * 过渡结束（--el-transition-duration，0.3s）后再还原内联样式。
 *
 * 列表始终留在 DOM 中，收起时只设 display: none：
 * 内联子菜单里的子项也因此保持在根菜单的注册表里，
 * 「子树中存在激活项则祖先高亮」的判断不会因为隐藏而丢项。
 */
export function SubMenuTransition({
  visible,
  className,
  style,
  role,
  children,
}: SubMenuTransitionProps) {
  const innerRef = useRef<HTMLUListElement>(null);
  const firstRender = useRef(true);
  // 收起动画期间仍需保持挂载；展开时由 visible 直接派生，无需同步 setState
  const [keepMounted, setKeepMounted] = useState(visible);
  const displayed = visible || keepMounted;

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    // 首次渲染不做动画，与官方 transition 的 appear 行为一致
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const clearInline = () => {
      el.style.maxHeight = "";
      el.style.overflow = "";
      el.style.paddingTop = "";
      el.style.paddingBottom = "";
    };

    if (visible) {
      el.style.overflow = "hidden";
      el.style.maxHeight = "0px";
      el.style.paddingTop = "0px";
      el.style.paddingBottom = "0px";

      const frame = requestAnimationFrame(() => {
        el.style.maxHeight = `${el.scrollHeight}px`;
        el.style.paddingTop = "";
        el.style.paddingBottom = "";
      });
      const timer = setTimeout(clearInline, DURATION);

      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(timer);
        clearInline();
      };
    }

    el.style.overflow = "hidden";
    el.style.maxHeight = `${el.scrollHeight}px`;

    const frame = requestAnimationFrame(() => {
      el.style.maxHeight = "0px";
      el.style.paddingTop = "0px";
      el.style.paddingBottom = "0px";
    });
    const timer = setTimeout(() => {
      clearInline();
      setKeepMounted(false);
    }, DURATION);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      clearInline();
    };
  }, [visible]);

  return (
    <ul
      ref={innerRef}
      className={className}
      style={displayed ? style : { ...style, display: "none" }}
      role={role}
    >
      {children}
    </ul>
  );
}

export interface MenuCollapseTransitionProps {
  /** 收起态。切换时整块菜单做一次透明度过渡 */
  collapsed: boolean;
  className?: string;
  style?: CSSProperties;
  role?: string;
  /** 根 ul 的引用，菜单需要它测量省略号与截断位置 */
  elementRef?: Ref<HTMLUListElement | null>;
  children?: ReactNode;
}

/**
 * 对应官方 ElMenuCollapseTransition：纵向模式下把根 `ul.el-menu` 包进
 * 一层过渡容器，收起/展开时整体做一次透明度过渡。
 *
 * 官方用 Vue 的 transition 钩子（onBeforeEnter 置 opacity 0.2、
 * onEnter 挂上 .el-opacity-transition 后推回 1），并在模板上给 ul 绑了
 * `key="String(collapse)"` 让切换时重挂载。React 里不需要重挂载
 * （菜单状态都在根组件手里），只复刻透明度那一段：
 * collapse 变化时把透明度从 0.2 推到 1，过渡结束再清掉内联值。
 *
 * Vue 的 transition 不产生额外 DOM，所以这里渲染的就是 ul 本身。
 */
export function MenuCollapseTransition({
  collapsed,
  className,
  style,
  role,
  elementRef,
  children,
}: MenuCollapseTransitionProps) {
  const innerRef = useRef<HTMLUListElement | null>(null);
  const prevCollapsed = useRef(collapsed);

  useEffect(() => {
    if (prevCollapsed.current === collapsed) return;
    prevCollapsed.current = collapsed;

    const el = innerRef.current;
    if (!el) return;

    el.style.opacity = "0.2";
    el.classList.add("el-opacity-transition");
    // 等下一帧再把透明度推回 1，让上面挂上的 transition 真正产生补间
    const frame = requestAnimationFrame(() => {
      el.style.opacity = "1";
    });
    const timer = setTimeout(() => {
      el.classList.remove("el-opacity-transition");
      el.style.opacity = "";
    }, DURATION);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      el.classList.remove("el-opacity-transition");
      el.style.opacity = "";
    };
  }, [collapsed]);

  const setRef = useCallback(
    (node: HTMLUListElement | null) => {
      innerRef.current = node;
      assignRef(elementRef, node);
    },
    [elementRef],
  );

  return (
    <ul ref={setRef} className={className} style={style} role={role}>
      {children}
    </ul>
  );
}
