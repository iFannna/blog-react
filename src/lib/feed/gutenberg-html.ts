import "server-only";

const BLOCK_COMMENT = /<!--\s*\/?wp:[\s\S]*?-->/g;
const SCRIPT = /<script[\s\S]*?<\/script>/gi;
const STYLE = /<style[\s\S]*?<\/style>/gi;

/**
 * Feed 侧不做区块渲染，只取保存内容里的静态 HTML。
 * 动态区块保存时就是空占位，因此在 Feed 中不产出内容。
 */
export function extractGutenbergHtml(content: string): string {
  return content
    .replace(BLOCK_COMMENT, "")
    .replace(SCRIPT, "")
    .replace(STYLE, "")
    .trim();
}
