"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ElIcon } from "../icon/ElIcon";
import { CaretTop } from "../icons";

export interface BacktopProps {
  /** 滚动距离达到该值后显示 */
  visibilityHeight?: number;
  /** 触发滚动的容器选择器，省略时为文档 */
  target?: string;
  /** 距右侧距离 */
  right?: number | string;
  /** 距底部距离 */
  bottom?: number | string;
  /** 点击回调 */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 对应官方 ElBacktop。
 *
 * 官方用 useThrottleFn(handleScroll, 300, true) 节流滚动监听，
 * React 侧用等价的「300ms 内只处理首次触发」实现（leading 节流）。
 */
export function ElBacktop({
  visibilityHeight = 200,
  target = "",
  right = 40,
  bottom = 40,
  onClick,
  className,
  style,
  children,
}: BacktopProps) {
  const [visible, setVisible] = useState(false);
  // 初始值不能写 document：useRef 的实参在服务端渲染时也会求值，会直接崩
  const scrollElRef = useRef<HTMLElement | null>(null);
  const lastRunRef = useRef(0);

  useEffect(() => {
    // 对应官方 onMounted：有 target 时监听该元素，否则监听 document
    let el: HTMLElement;
    let scrollSource: HTMLElement | Document;

    if (target) {
      const found = document.querySelector<HTMLElement>(target);
      if (!found) throw new Error(`ElBacktop: target does not exist: ${target}`);
      el = found;
      scrollSource = found;
    } else {
      el = document.documentElement;
      scrollSource = document;
    }

    scrollElRef.current = el;

    const handleScroll = () => {
      const now = Date.now();
      // leading 节流：距上次执行不足 300ms 时跳过
      if (now - lastRunRef.current < 300) return;
      lastRunRef.current = now;

      const effective = el === document.documentElement ? window.scrollY : el.scrollTop;
      setVisible(effective >= visibilityHeight);
    };

    // 初始判定一次，避免刷新后已在深处却不显示
    handleScroll();

    scrollSource.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollSource.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [target, visibilityHeight]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollElRef.current;
    if (!el || el === document.documentElement) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      el.scrollTo({ top: 0, behavior: "smooth" });
    }
    onClick?.(event);
  };

  if (!visible) return null;

  const unit = (value: number | string) =>
    typeof value === "number" ? `${value}px` : value;

  const mergedStyle: CSSProperties = {
    right: unit(right),
    bottom: unit(bottom),
    ...style,
  };

  return (
    <div
      className={["el-backtop", className].filter(Boolean).join(" ")}
      style={mergedStyle}
      onClick={handleClick}
    >
      {children ?? (
        <ElIcon className="el-backtop__icon">
          <CaretTop />
        </ElIcon>
      )}
    </div>
  );
}
