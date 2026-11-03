import "server-only";
import { createRequire } from "node:module";
import {
  loadMarkdownHighlighter,
  renderMarkdownElement,
} from "@/components/blog/article/MarkdownContent";
import { extractGutenbergHtml } from "@/lib/feed/gutenberg-html";
import type { ArticleDetail } from "@/types/models";

const requireModule = createRequire(import.meta.url);
// Next 禁止路由处理器静态导入 react-dom/server，这里绕过打包检查把正文节点序列化成字符串
const { renderToStaticMarkup } = requireModule("react-dom/server") as typeof import("react-dom/server");

const RELATIVE_URL = /(src|href|poster)="(\/(?!\/)[^"]*)"/g;

/** 正文里的站内相对地址改成绝对地址，阅读器才能直接加载图片和跳转 */
export function absolutizeUrls(html: string, origin: string): string {
  return html.replace(
    RELATIVE_URL,
    (_match, attr: string, path: string) => `${attr}="${origin}${path}"`,
  );
}

export function absoluteUrl(origin: string, value: string | null): string {
  if (!value) return "";

  return value.startsWith("/") && !value.startsWith("//")
    ? `${origin}${value}`
    : value;
}

const SHIKI_VARS = /style="[^"]*--shiki-light:\s*([^;"]+)[^"]*"/g;

/** 站内靠 CSS 变量切换代码颜色，阅读器不解析变量，这里降级成直接颜色 */
function inlineShikiColors(html: string): string {
  return html.replace(
    SHIKI_VARS,
    (_match, color: string) => `style="color:${color.trim()}"`,
  );
}

/** 按正文格式产出 Feed 用的 HTML 字符串 */
export async function renderArticleHtml(article: ArticleDetail): Promise<string> {
  if (article.contentFormat === "gutenberg") {
    return extractGutenbergHtml(article.content);
  }

  const highlighter = await loadMarkdownHighlighter(article.content).catch(() => null);

  return inlineShikiColors(renderToStaticMarkup(renderMarkdownElement(article.content, highlighter)));
}

/** 从正文 HTML 提取纯文本，用于摘要缺失时兜底 */
export function htmlToPlainText(html: string, limit = 200): string {
  const text = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > limit ? `${text.slice(0, limit)}…` : text;
}
