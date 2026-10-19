/**
 * 校验 overview 图标产物与官方 SVG 的结构一致性。
 *
 * 用法:
 *   node scripts/check-overview-icons.mjs
 *   node scripts/check-overview-icons.mjs --groups form
 *   node scripts/check-overview-icons.mjs --slugs button,tag
 *   node scripts/check-overview-icons.mjs --registry
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
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
const requireRegistry = args.includes("--registry");

const nav = parseNavConfig();
const navGroups = groupsArg
  ? nav.filter((group) =>
      groupsArg
        .split(",")
        .map((key) => key.trim().toLowerCase())
        .includes(group.key),
    )
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
const expected = [];
const errors = [];
const unknown = [];

for (const slug of slugs) {
  const item = mapping.get(slug);
  if (!item) {
    unknown.push(slug);
    continue;
  }
  expected.push(item);
}

const checkedComponents = new Set();

for (const item of expected) {
  if (checkedComponents.has(item.component)) continue;
  checkedComponents.add(item.component);

  const outputPath = resolve(OUT_DIR, `${item.component}.tsx`);
  if (!existsSync(outputPath)) {
    errors.push(`缺少产物: ${item.component}.tsx（${item.slug}）`);
    continue;
  }

  const output = readFileSync(outputPath, "utf8");
  const outputSvg = extractSvg(output);
  if (!outputSvg) {
    errors.push(`${item.component}: 找不到 <svg> 根节点`);
    continue;
  }

  if (!output.includes(`export function ${item.component}(`)) {
    errors.push(`${item.component}: 缺少同名导出`);
  }
  if (!output.includes("SVGProps<SVGSVGElement>")) {
    errors.push(`${item.component}: 缺少 SVGProps 类型`);
  }

  const source = readTemplate(item.file);

  const sourceTags = collectTags(source);
  const outputTags = collectTags(outputSvg);
  if (sourceTags.join("\n") !== outputTags.join("\n")) {
    errors.push(`${item.component}: 元素顺序与源 SVG 不一致`);
  }

  const sourceAttrs = collectAttrs(source)
    .map((name) => (name === "style" ? "mask-type" : toJsxAttr(name)))
    .sort();
  const outputAttrs = collectAttrs(outputSvg).sort();
  if (sourceAttrs.join("\n") !== outputAttrs.join("\n")) {
    errors.push(`${item.component}: 属性集合与源 SVG 不一致`);
  }

  const rawSourceIds = collectIds(source);
  const sourceIds = rawSourceIds
    .map((id) => `${item.file}--${id}`)
    .sort();
  const outputIds = collectIds(outputSvg).sort();
  if (sourceIds.join("\n") !== outputIds.join("\n")) {
    errors.push(`${item.component}: SVG id 前缀不正确`);
  }

  // 官方源本身存在悬空引用（Figma 导出的 clip0_* / mask0_* 等），
  // 这里只要求原样保留，不替官方修图。
  const sourceIdSet = new Set(rawSourceIds);
  const sourceDangling = new Set(
    collectRefs(source).filter((ref) => !sourceIdSet.has(ref)),
  );
  const outputIdSet = new Set(outputIds);
  for (const ref of collectRefs(outputSvg)) {
    if (outputIdSet.has(ref)) continue;
    const unprefixed = ref.startsWith(`${item.file}--`)
      ? ref.slice(item.file.length + 2)
      : ref;
    if (sourceDangling.has(unprefixed)) continue;
    errors.push(`${item.component}: 引用了不存在的 id #${ref}`);
  }

  if (output.includes("<template")) {
    errors.push(`${item.component}: 残留 <template>`);
  }
  if (/\sclass=/.test(output)) {
    errors.push(`${item.component}: 残留 class 属性`);
  }
  if (/\sstyle="/.test(output)) {
    errors.push(`${item.component}: 残留内联 style`);
  }
  const kebabAttrs = collectAttrs(outputSvg).filter(
    (name) =>
      name.includes("-") &&
      name !== "mask-type" &&
      !name.startsWith("aria-") &&
      !name.startsWith("data-"),
  );
  if (kebabAttrs.length > 0) {
    errors.push(
      `${item.component}: 属性未转驼峰 (${[...new Set(kebabAttrs)].join(", ")})`,
    );
  }
}

checkGlobalIds();

if (requireRegistry) {
  checkRegistry();
}

if (unknown.length > 0) {
  console.log(`没有官方插画，跳过: ${unknown.join(", ")}`);
}

if (errors.length > 0) {
  console.error(`校验失败（${errors.length} 项）:`);
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log(`校验通过: ${checkedComponents.size} 个图标`);

function extractSvg(text) {
  const match = text.match(/<svg[\s\S]*<\/svg>/);
  return match ? match[0] : null;
}

function collectTags(markup) {
  return [...markup.matchAll(/<([a-zA-Z][\w-]*)/g)].map((match) => match[1]);
}

function collectAttrs(markup) {
  const names = [];
  for (const tag of markup.match(/<[a-zA-Z][^>]*>/g) || []) {
    for (const match of tag.matchAll(/\s([a-zA-Z_][\w:.-]*)=/g)) {
      names.push(match[1]);
    }
  }
  return names;
}

function collectIds(markup) {
  return [...markup.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
}

function collectRefs(markup) {
  return [
    ...[...markup.matchAll(/url\(#([^)]+)\)/g)].map((match) => match[1]),
    ...[...markup.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]),
  ];
}

function checkGlobalIds() {
  if (!existsSync(OUT_DIR)) return;

  // 分组校验时只看本组文件，避免并行 agent 读到其他组正在写入的半成品
  const expectedFiles = new Set(
    [...checkedComponents].map((component) => `${component}.tsx`),
  );
  const filtered = Boolean(groupsArg || slugsArg);
  const files = readdirSync(OUT_DIR)
    .filter((name) => name.endsWith(".tsx"))
    .filter((name) => !filtered || expectedFiles.has(name));

  const owners = new Map();
  for (const file of files) {
    const text = readFileSync(resolve(OUT_DIR, file), "utf8");
    const svg = extractSvg(text);
    if (!svg) continue;

    for (const id of collectIds(svg)) {
      const owner = owners.get(id);
      if (owner) {
        errors.push(`SVG id 重复: ${id}（${owner} / ${file}）`);
      } else {
        owners.set(id, file);
      }
    }
  }
}

function checkRegistry() {
  const registryPath = resolve(OUT_DIR, "index.ts");
  if (!existsSync(registryPath)) {
    errors.push("缺少注册表 index.ts");
    return;
  }

  const text = readFileSync(registryPath, "utf8");
  const imports = new Map();
  for (const match of text.matchAll(
    /import\s+\{\s*(\w+)\s*\}\s+from\s+["']\.\/([\w-]+)["']/g,
  )) {
    imports.set(match[1], match[2]);
  }

  const bodyStart = text.indexOf("OVERVIEW_ICONS");
  const body = bodyStart >= 0 ? text.slice(bodyStart) : "";
  const entries = new Map();
  for (const match of body.matchAll(
    /(?:^|\n)\s*["']?([\w-]+)["']?\s*:\s*(\w+)\s*,/g,
  )) {
    entries.set(match[1], match[2]);
  }

  for (const item of expected) {
    if (!entries.has(item.slug)) {
      errors.push(`注册表缺少: ${item.slug}`);
      continue;
    }
    if (entries.get(item.slug) !== item.component) {
      errors.push(
        `注册表映射错误: ${item.slug} -> ${entries.get(item.slug)}（期望 ${item.component}）`,
      );
    }
    if (imports.get(item.component) !== item.component) {
      errors.push(`注册表导入错误: ${item.component}`);
    }
  }

  for (const [, file] of imports) {
    if (!existsSync(resolve(OUT_DIR, `${file}.tsx`))) {
      errors.push(`注册表导入了不存在的文件: ${file}.tsx`);
    }
  }
}
