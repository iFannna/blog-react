"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type Phase = "shown" | "hidden" | "entering" | "leaving";

export interface CollapseTransitionProps {
  /** 目标显示态，对应官方 v-show */
  vShow: boolean;
  className?: string;
  role?: string;
  "aria-expanded"?: boolean;
  children: ReactNode;
}

/**
 * 对应官方 ElCollapseTransition，仅供树节点使用。
 *
 * 官方用 transition 的 enter/leave 钩子运行时量高度、写内联 max-height，
 * React 没有过渡钩子，这里改写成一个状态机：shown -> leaving -> hidden，
 * hidden -> entering -> shown。中间态的内联几何量由 layout effect + rAF 写入，
 * 允许内联样式是因为动画依赖运行时量出的真实高度，与激活条同理。
 *
 * 状态迁移一律在渲染期派生（React 推荐的 adjust-state-during-render 写法），
 * 避免在 effect 里同步 setState 造成级联渲染。
 */
export function CollapseTransition({
  vShow,
  className,
  role,
  "aria-expanded": ariaExpanded,
  children,
}: CollapseTransitionProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>(vShow ? "shown" : "hidden");

  if (vShow && (phase === "hidden" || phase === "leaving")) {
    setPhase("entering");
  } else if (!vShow && (phase === "shown" || phase === "entering")) {
    setPhase("leaving");
  }

  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (phase !== "entering" && phase !== "leaving") return;

    // 先落地起始值，下一帧再写终值，浏览器才有过渡
    if (phase === "entering") {
      el.style.maxHeight = "0";
      el.style.overflow = "hidden";
    } else {
      el.style.maxHeight = `${el.scrollHeight}px`;
      el.style.overflow = "hidden";
    }

    const frame = requestAnimationFrame(() => {
      if (phase === "entering") {
        el.style.maxHeight =
          el.scrollHeight !== 0 ? `${el.scrollHeight}px` : "0";
      } else {
        el.style.maxHeight = "0";
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== elRef.current) return;
    if (event.propertyName !== "max-height") return;

    const el = elRef.current;
    if (!el) return;
    el.style.maxHeight = "";
    el.style.overflow = "";
    if (phase === "entering") setPhase("shown");
    else if (phase === "leaving") setPhase("hidden");
  };

  const transitionClass =
    phase === "entering"
      ? "el-collapse-transition-enter-active"
      : phase === "leaving"
        ? "el-collapse-transition-leave-active"
        : undefined;

  const style: CSSProperties = {
    display: phase === "hidden" ? "none" : "block",
  };

  return (
    <div
      ref={elRef}
      className={[className, transitionClass].filter(Boolean).join(" ")}
      style={style}
      role={role}
      aria-expanded={ariaExpanded}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </div>
  );
}
