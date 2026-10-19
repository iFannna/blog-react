/**
 * overview 图标转换器与校验器共用的路径、解析和属性处理。
 *
 * 图标源是官方 docs 里的手绘 SVG（Vue SFC），这里只做静态文本解析，
 * 不引入 Vue 运行时。
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const ROOT = resolve(__dirname, "../..");
export const NAV_CONFIG = resolve(
  ROOT,
  "src/app/(docs)/_components/nav-config.ts",
);
export const OUT_DIR =
  process.env.EP_OVERVIEW_ICONS_OUT ||
  resolve(ROOT, "src/components/element-plus/overview-icons");
export const SOURCE_DIR =
  process.env.EP_OVERVIEW_ICONS_SOURCE ||
  "D:/develop/code/project/element-plus/docs/.vitepress/vitepress/components/overview-icons";

/** 解析侧边栏配置，得到 [{ key, title, items: slug[] }]。 */
export function parseNavConfig() {
  const text = readFileSync(NAV_CONFIG, "utf8");
  const groups = [];

  for (const match of text.matchAll(
    /\{\s*title:\s*"([^"]+)",\s*items:\s*\[([\s\S]*?)\]\s*,?\s*\}/g,
  )) {
    groups.push({
      key: match[1].split(/\s+/)[0].toLowerCase(),
      title: match[1],
      items: [...match[2].matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]),
    });
  }

  return groups;
}

/**
 * 解析官方 index.ts，得到 slug -> { component, file }。
 * 官方存在复用：autocomplete -> OvInput、table-v2 / tree-v2 -> OvTable / OvTree。
 */
export function parseOfficialIndex() {
  const text = readFileSync(resolve(SOURCE_DIR, "index.ts"), "utf8");

  const fileByComponent = new Map();
  for (const match of text.matchAll(
    /import\s+(\w+)\s+from\s+['"]\.\/([\w-]+)\.vue['"]/g,
  )) {
    fileByComponent.set(match[1], match[2]);
  }

  const tailIndex = text.indexOf("export default");
  if (tailIndex < 0) {
    throw new Error(`官方 index.ts 结构异常: ${SOURCE_DIR}`);
  }

  const entries = new Map();
  for (const match of text
    .slice(tailIndex)
    .matchAll(/(?:^|\n)[ \t]*'?([\w-]+)'?[ \t]*:[ \t]*(\w+)[ \t]*,?/g)) {
    const [, slug, component] = match;
    const file = fileByComponent.get(component);
    if (!file) continue;
    entries.set(slug, { slug, component, file });
  }

  return entries;
}

/** ov-color-picker-panel -> OvColorPickerPanel */
export function componentName(file) {
  return file
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

/** SVG 属性名转 JSX 驼峰；data-* / aria-* 保持原样。 */
export function toJsxAttr(name) {
  if (name === "class") return "className";
  if (name === "style") return "style";
  // React 类型尚未声明 mask-type，保留连字符可直接透传为 SVG 属性
  if (name === "mask-type") return name;
  if (name.startsWith("aria-") || name.startsWith("data-")) return name;
  return name.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

/** 读取 SFC 的 template 内容。 */
export function readTemplate(file) {
  const text = readFileSync(resolve(SOURCE_DIR, `${file}.vue`), "utf8");
  const match = text.match(/<template>\s*([\s\S]*?)\s*<\/template>/);
  if (!match) {
    throw new Error(`找不到 template: ${file}.vue`);
  }
  return match[1].trim();
}
