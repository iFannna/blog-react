import type { CSSProperties } from "react";
import {
  createHighlighterCore,
  type HighlighterCore,
  type LanguageInput,
  type ThemedToken,
} from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import githubLight from "@shikijs/themes/github-light";
import githubDark from "@shikijs/themes/github-dark";

export interface HighlightToken {
  content: string;
  style: CSSProperties;
}

type LanguageLoader = () => Promise<LanguageInput>;

const LANGUAGE_LOADERS: Record<string, LanguageLoader> = {
  vue: () => import("@shikijs/langs/vue").then((module) => module.default),
  tsx: () => import("@shikijs/langs/tsx").then((module) => module.default),
  typescript: () =>
    import("@shikijs/langs/typescript").then((module) => module.default),
  javascript: () =>
    import("@shikijs/langs/javascript").then((module) => module.default),
  bash: () => import("@shikijs/langs/bash").then((module) => module.default),
  html: () => import("@shikijs/langs/html").then((module) => module.default),
  css: () => import("@shikijs/langs/css").then((module) => module.default),
  json: () => import("@shikijs/langs/json").then((module) => module.default),
  go: () => import("@shikijs/langs/go").then((module) => module.default),
  java: () => import("@shikijs/langs/java").then((module) => module.default),
  python: () => import("@shikijs/langs/python").then((module) => module.default),
  sql: () => import("@shikijs/langs/sql").then((module) => module.default),
  yaml: () => import("@shikijs/langs/yaml").then((module) => module.default),
  xml: () => import("@shikijs/langs/xml").then((module) => module.default),
  markdown: () =>
    import("@shikijs/langs/markdown").then((module) => module.default),
  dockerfile: () =>
    import("@shikijs/langs/dockerfile").then((module) => module.default),
};

const LANGUAGE_ALIASES: Record<string, string> = {
  ts: "typescript",
  typescript: "typescript",
  tsx: "tsx",
  js: "javascript",
  javascript: "javascript",
  jsx: "tsx",
  vue: "vue",
  bash: "bash",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  html: "html",
  css: "css",
  json: "json",
  go: "go",
  golang: "go",
  java: "java",
  py: "python",
  python: "python",
  sql: "sql",
  mysql: "sql",
  yaml: "yaml",
  yml: "yaml",
  xml: "xml",
  md: "markdown",
  markdown: "markdown",
  dockerfile: "dockerfile",
  docker: "dockerfile",
};

/** 未知语言回退为纯文本，避免 Shiki 抛错中断整页渲染 */
export function normalizeCodeLang(lang?: string): string {
  if (!lang) return "text";
  return LANGUAGE_ALIASES[lang.toLowerCase()] ?? "text";
}

let highlighterPromise: Promise<HighlighterCore> | null = null;

// 与 Element Plus 官网一致：VitePress 默认的 Shiki + github-light/github-dark
export function getHighlighter(): Promise<HighlighterCore> {
  highlighterPromise ??= createHighlighterCore({
    themes: [githubLight, githubDark],
    langs: [],
    // JS 正则引擎避免加载 oniguruma wasm
    engine: createJavaScriptRegexEngine(),
  });
  return highlighterPromise;
}

async function ensureLanguage(highlighter: HighlighterCore, lang: string) {
  const resolved = normalizeCodeLang(lang);
  const loader = LANGUAGE_LOADERS[resolved];

  if (!loader || highlighter.getLoadedLanguages().includes(resolved)) return;

  await highlighter.loadLanguage(await loader());
}

export async function ensureLanguages(langs: string[]): Promise<HighlighterCore> {
  const highlighter = await getHighlighter();
  await Promise.all(langs.map((lang) => ensureLanguage(highlighter, lang)));
  return highlighter;
}

function toStyle(token: ThemedToken): CSSProperties {
  const style = { ...token.htmlStyle } as CSSProperties;

  if (token.fontStyle) {
    if (token.fontStyle & 1) style.fontStyle = "italic";
    if (token.fontStyle & 2) style.fontWeight = "bold";
    if (token.fontStyle & 4) style.textDecoration = "underline";
  }

  return style;
}

function plainTokens(source: string): HighlightToken[][] {
  return source.split("\n").map((line) => [{ content: line, style: {} }]);
}

/** 颜色写成 CSS 变量，由 CSS 按主题取值 */
export function highlightTokens(
  highlighter: HighlighterCore,
  source: string,
  lang?: string,
): HighlightToken[][] {
  const resolved = normalizeCodeLang(lang);

  if (resolved === "text") return plainTokens(source);

  try {
    const { tokens } = highlighter.codeToTokens(source, {
      lang: resolved,
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    });

    return tokens.map((line) =>
      line.map((token) => ({
        content: token.content,
        style: toStyle(token),
      })),
    );
  } catch {
    return plainTokens(source);
  }
}

export async function highlight(
  source: string,
  lang = "vue",
): Promise<HighlightToken[][]> {
  const highlighter = await ensureLanguages([lang]);
  return highlightTokens(highlighter, source, lang);
}
