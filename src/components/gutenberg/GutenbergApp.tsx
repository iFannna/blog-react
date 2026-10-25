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
      // 语言包必须先于编辑器模块求值，模块级 __() 常量才会是中文
      if (locale === "zh-CN") {
        await import("@/lib/gutenberg/locale/preload-zh.js");
      }
      const { bootGutenberg } = await import(
        "@/services/gutenberg/bootstrap.js"
      );
      await bootGutenberg(locale);
    })().catch((error) => {
      window.__gutenbergBooted = false;
      console.error("Gutenberg editor failed to start:", error);
    });
  }, [locale]);

  return <div id="editor" />;
}
