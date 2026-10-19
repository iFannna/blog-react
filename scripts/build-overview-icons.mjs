/**
 * 把官方 overview 插画 SVG（Vue SFC）转成 React 组件。
 *
 * 产物为生成代码，不要手改；图标全集与映射直接来自官方 docs，
 * 不再维护手写名单。
 *
 * 用法:
 *   node scripts/build-overview-icons.mjs                 全量生成 + 注册表
 *   node scripts/build-overview-icons.mjs --groups form   只生成某一类
 *   node scripts/build-overview-icons.mjs --slugs button,tag
 *
 * 分组模式不会清理输出目录、也不会写注册表，便于多个 agent 并行。
 */

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  OUT_DIR,
  parseNavConfig,
  parseOfficialIndex,
  readTemplate,
  toJsxAttr,
} from "./lib/overview-icons.mjs";

const args = process.argv.slice(2);

function readArg(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

const groupsArg = readArg("--groups");
const slugsArg = readArg("--slugs");
const partial = Boolean(groupsArg || slugsArg);

const nav = parseNavConfig();
const groupKeys = groupsArg
  ? groupsArg
      .split(",")
      .map((key) => key.trim().toLowerCase())
      .filter(Boolean)
  : [];
const navGroups = groupsArg
  ? nav.filter((group) => groupKeys.includes(group.key))
  : nav;

if (groupsArg && navGroups.length === 0) {
  throw new Error(`没有匹配的分组: ${groupsArg}`);
}

let slugs = slugsArg
  ? slugsArg
      .split(",")
      .map((slug) => slug.trim())
      .filter(Boolean)
  : navGroups.flatMap((group) => group.items);

slugs = [...new Set(slugs)].filter((slug) => slug !== "overview");

const mapping = parseOfficialIndex();
const components = new Map();
const skipped = [];

for (const slug of slugs) {
  const item = mapping.get(slug);
  if (!item) {
    skipped.push(slug);
    continue;
  }
  components.set(item.component, item.file);
}

if (!partial) {
  rmSync(OUT_DIR, { recursive: true, force: true });
}
mkdirSync(OUT_DIR, { recursive: true });

for (const [component, file] of components) {
  const template = readTemplate(file);
  const jsx = convertTemplate(template, file);
  writeFileSync(
    resolve(OUT_DIR, `${component}.tsx`),
    renderComponent(component, jsx),
    "utf8",
  );
}

if (!partial) {
  const registrySlugs = slugs.filter((slug) => mapping.has(slug));
  writeFileSync(
    resolve(OUT_DIR, "index.ts"),
    renderRegistry(registrySlugs, mapping),
    "utf8",
  );
}

console.log(
  `生成 ${components.size} 个图标（${partial ? "分组模式" : "全量模式"}）`,
);
if (skipped.length > 0) {
  console.log(`跳过没有官方插画的组件: ${skipped.join(", ")}`);
}

function convertTemplate(template, file) {
  let markup = template.trim();

  // React 类型没有 maskType，但连字符属性会原样透传给 DOM，避免内联 style
  markup = markup.replace(
    /\sstyle="\s*mask-type:\s*alpha\s*;?\s*"/g,
    ' mask-type="alpha"',
  );
  if (/\sstyle="/.test(markup)) {
    throw new Error(`${file}: 存在未处理的 style 属性`);
  }

  markup = prefixIds(markup, file);
  markup = markup.replace(/<[a-zA-Z][^>]*>/g, convertTagAttributes);
  markup = injectProps(markup, file);

  return indent(markup, 4);
}

function convertTagAttributes(tag) {
  return tag.replace(
    /(\s)([a-zA-Z_][\w:.-]*)=/g,
    (match, space, name) => {
      const converted = toJsxAttr(name);
      return converted === name ? match : `${space}${converted}=`;
    },
  );
}

function prefixIds(markup, file) {
  const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  let result = markup;

  for (const id of ids) {
    const next = `${file}--${id}`;
    result = result.replaceAll(` id="${id}"`, ` id="${next}"`);
    result = result.replaceAll(`url(#${id})`, `url(#${next})`);
    result = result.replaceAll(`href="#${id}"`, `href="#${next}"`);
  }

  return result;
}

function injectProps(markup, file) {
  const end = markup.indexOf(">");
  if (end < 0 || markup[end - 1] === "/") {
    throw new Error(`${file}: svg 根节点结构异常`);
  }

  const head = markup.slice(0, end).trimEnd();
  const tail = markup.slice(end);
  return `${head}\n    {...props}${tail}`;
}

function indent(markup, spaces) {
  const pad = " ".repeat(spaces);
  return markup
    .split("\n")
    .map((line) => (line ? pad + line : line))
    .join("\n");
}

function renderComponent(component, jsx) {
  return `import type { SVGProps } from "react";

export function ${component}(props: SVGProps<SVGSVGElement>) {
  return (
${jsx}
  );
}
`;
}

function renderRegistry(slugs, mapping) {
  const sorted = [...slugs].sort((a, b) => a.localeCompare(b));
  const components = [
    ...new Set(sorted.map((slug) => mapping.get(slug).component)),
  ].sort((a, b) => a.localeCompare(b));

  const imports = components
    .map((component) => `import { ${component} } from "./${component}";`)
    .join("\n");

  const entries = sorted
    .map((slug) => {
      const key = /^[A-Za-z_$][\w$]*$/.test(slug)
        ? slug
        : JSON.stringify(slug);
      return `  ${key}: ${mapping.get(slug).component},`;
    })
    .join("\n");

  return `/**
 * 官方 overview 插画图标注册表（生成代码，不要手改）。
 *
 * slug 对应文档侧边栏的组件链接末段。
 */

import type { ComponentType, SVGProps } from "react";

${imports}

export type OverviewIcon = ComponentType<SVGProps<SVGSVGElement>>;

export const OVERVIEW_ICONS: Record<string, OverviewIcon> = {
${entries}
};

export function getOverviewIcon(slug: string): OverviewIcon | undefined {
  return OVERVIEW_ICONS[slug];
}
`;
}
