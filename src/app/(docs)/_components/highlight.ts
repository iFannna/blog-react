import type { CSSProperties } from "react";
import {
  createHighlighterCore,
  type HighlighterCore,
  type ThemedToken,
} from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import vue from "@shikijs/langs/vue";
import githubLight from "@shikijs/themes/github-light";
import githubDark from "@shikijs/themes/github-dark";

export interface HighlightToken {
  content: string;
  style: CSSProperties;
}

let highlighterPromise: Promise<HighlighterCore> | null = null;

// 与 Element Plus 官网一致：VitePress 默认的 Shiki + github-light/github-dark
function getHighlighter() {
  highlighterPromise ??= createHighlighterCore({
    themes: [githubLight, githubDark],
    langs: [vue],
    // JS 正则引擎避免在浏览器加载 oniguruma wasm
    engine: createJavaScriptRegexEngine(),
  });
  return highlighterPromise;
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

/** 来源文本都是 Vue 模板片段；颜色写成 CSS 变量，由 CSS 按主题取值 */
export async function highlightVue(source: string): Promise<HighlightToken[][]> {
  const highlighter = await getHighlighter();
  const { tokens } = highlighter.codeToTokens(source, {
    lang: "vue",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });

  return tokens.map((line) =>
    line.map((token) => ({
      content: token.content,
      style: toStyle(token),
    })),
  );
}
