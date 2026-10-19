"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

const STORAGE_KEY = "darkmode";
const themeListeners = new Set<() => void>();

function applyTheme(isDark: boolean) {
  const root = document.documentElement;
  root.setAttribute("data-theme", isDark ? "dark" : "light");
  // Element Plus 的暗色变量挂在 html.dark 上，与博客的 data-theme 两套并存
  root.classList.toggle("dark", isDark);
}

function getStoredTheme() {
  if (typeof window === "undefined") return false;

  try {
    return localStorage.getItem(STORAGE_KEY) === "dark";
  } catch {
    return false;
  }
}

function emitThemeChange() {
  themeListeners.forEach((listener) => listener());
}

function subscribe(onStoreChange: () => void) {
  themeListeners.add(onStoreChange);

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    themeListeners.delete(onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function useTheme() {
  const isDarkMode = useSyncExternalStore(subscribe, getStoredTheme, () => false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    applyTheme(isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = useCallback((event?: React.MouseEvent) => {
    if (timerRef.current) return;

    const clientX = event?.clientX ?? null;
    const clientY = event?.clientY ?? null;

    const doToggle = () => {
      const next = !getStoredTheme();
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
      emitThemeChange();
    };

    if (
      typeof document.startViewTransition === "function" &&
      clientX !== null &&
      clientY !== null
    ) {
      const endRadius = Math.hypot(
        Math.max(clientX, window.innerWidth - clientX),
        Math.max(clientY, window.innerHeight - clientY),
      );

      const transition = document.startViewTransition(() => {
        doToggle();
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${clientX}px ${clientY}px)`,
              `circle(${endRadius}px at ${clientX}px ${clientY}px)`,
            ],
          },
          {
            duration: 800,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      });
    } else {
      doToggle();
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
    }, 800);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { isDarkMode, toggleTheme };
}