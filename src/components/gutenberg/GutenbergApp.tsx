"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __gutenbergBooted?: boolean;
    __experimentalDataViewsMediaModal?: boolean;
  }
}

/**
 * 编辑器外壳：只负责挂载容器和引导参考工程的原生编辑器。
 * 所有区块、侧栏与画布逻辑都来自 src/components/gutenberg 与 src/styles/gutenberg。
 */
export function GutenbergApp({ locale }: { locale: string }) {
  useEffect(() => {
    if (window.__gutenbergBooted) return;
    window.__gutenbergBooted = true;
    window.__experimentalDataViewsMediaModal = true;

    void (async () => {
      const settingsModule = await import(
        "@/lib/gutenberg/fixtures/settings.js"
      );
      const settings = settingsModule.default as typeof settingsModule.default & {
        locale?: string;
        isRTL?: boolean;
      };

      if (locale === "zh-CN") {
        const { setupLocale } = await import("@/lib/gutenberg/locale/index.js");
        setupLocale(settings);
      } else {
        settings.locale = "en_US";
        settings.isRTL = false;
      }

      await import("@/services/gutenberg/bootstrap.js");
    })().catch((error) => {
      window.__gutenbergBooted = false;
      console.error("Gutenberg editor failed to start:", error);
    });
  }, [locale]);

  return <div id="editor" />;
}
