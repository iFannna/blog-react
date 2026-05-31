"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "darkmode";

function applyTheme(isDark: boolean) {
  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );
}

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 初始化：从 localStorage 恢复主题
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const isDark = stored === "dark";
    setIsDarkMode(isDark);
    applyTheme(isDark);
  }, []);

  const toggleTheme = useCallback((event?: React.MouseEvent) => {
    // 防抖：800ms 内不允许重复切换
    if (timerRef.current) return;

    const clientX = event?.clientX ?? null;
    const clientY = event?.clientY ?? null;

    const doToggle = () => {
      setIsDarkMode((prev) => {
        const next = !prev;
        applyTheme(next);
        localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
        return next;
      });
    };

    // View Transitions API：圆形扩散动画
    if (
      typeof document.startViewTransition === "function" &&
      clientX !== null &&
      clientY !== null
    ) {
      const x = clientX;
      const y = clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        doToggle();
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];

        document.documentElement.animate(
          { clipPath },
          {
            duration: 800,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    } else {
      doToggle();
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
    }, 800);
  }, []);

  // 组件卸载时清理防抖 timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { isDarkMode, toggleTheme };
}
