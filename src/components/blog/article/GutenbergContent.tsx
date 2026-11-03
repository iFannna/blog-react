import type { ReactNode } from "react";
import type { HighlighterCore } from "shiki/core";
import { ensureLanguages } from "@/lib/highlight";
import {
  createRenderCollector,
  renderContentBody,
} from "@/lib/gutenberg/render/content";
import type { DynamicPostContext, DynamicRenderContext } from "@/lib/gutenberg/render/dynamic";
import type { PrevNext } from "@/types/models";
import GutenbergInteractions from "./GutenbergInteractions";

const CODE_LANGUAGE = /data-code-language="([^"]+)"/g;

interface GutenbergContentProps {
  content: string;
  locale?: string;
  post?: DynamicPostContext;
  prevNext?: PrevNext | null;
  searchParams?: Record<string, string | string[] | undefined>;
}

function readQueryPages(
  searchParams: Record<string, string | string[] | undefined> | undefined,
): Record<string, number> {
  const pages: Record<string, number> = {};
  if (!searchParams) {
    return pages;
  }
  for (const [key, value] of Object.entries(searchParams)) {
    if (!/^query-\d+-page$/.test(key)) {
      continue;
    }
    const raw = Array.isArray(value) ? value[0] : value;
    const parsed = Number.parseInt(raw ?? "", 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      pages[key] = parsed;
    }
  }
  return pages;
}

/**
 * Gutenberg 正文渲染：静态区块直接输出保存内容，动态区块在服务端
 * 还原包裹属性并读取 Go 数据。带 data-code-language 的代码块用 Shiki 着色。
 */
export default async function GutenbergContent({
  content = "",
  locale = "zh-CN",
  post,
  prevNext,
  searchParams,
}: GutenbergContentProps) {
  const languages = [...content.matchAll(CODE_LANGUAGE)].map(
    (match) => match[1],
  );
  // 语言包加载失败只影响代码着色，不应让整篇文章报错
  let highlighter: HighlighterCore | null = null;
  if (languages.length > 0) {
    highlighter = await ensureLanguages(languages).catch(() => null);
  }

  const collector = createRenderCollector();
  const context: DynamicRenderContext = {
    locale,
    post,
    prevNext,
    queryPages: readQueryPages(searchParams),
  };
  const body: ReactNode = renderContentBody(content, context, collector, {
    highlighter,
  });

  const css = collector.css.join("\n");
  const svg = collector.svgs.join("");

  return (
    <>
      {/* 区块库样式是 public 下的静态资源，只能手动挂载 */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel="stylesheet"
        href="/canvas/block-library.css"
        precedence="gutenberg-blocks"
      />
      {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      {svg && (
        <div
          className="gutenberg-content__svg-defs"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
      <GutenbergInteractions>{body}</GutenbergInteractions>
    </>
  );
}
