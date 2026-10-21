"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { DOCS_MESSAGES, type DocsMessages } from "@/lib/docs/i18n";
import type { DocLocale } from "@/lib/docs/types";

const DocsI18nContext = createContext<DocsMessages>(DOCS_MESSAGES["zh-CN"]);

/**
 * 文档 UI 文案与页面语言。
 *
 * 根布局的 <html lang> 是固定的，客户端按当前 locale 修正，
 * 让读屏器与浏览器翻译按正确的语言处理。
 */
export function I18nProvider({
  locale,
  children,
}: {
  locale: DocLocale;
  children: ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <DocsI18nContext.Provider value={DOCS_MESSAGES[locale]}>
      {children}
    </DocsI18nContext.Provider>
  );
}

export function useDocsMessages(): DocsMessages {
  return useContext(DocsI18nContext);
}
