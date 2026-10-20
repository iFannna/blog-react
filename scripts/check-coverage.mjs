/**
 * 复刻覆盖率检查，作为进度的唯一来源。
 *
 * 对比官方 Element Plus 仓库与当前项目：
 * - 组件文档页是否存在
 * - 页面里的 <DemoBlock> 数量是否覆盖官方 docs/examples/<slug>/*.vue
 * - 侧边栏导航是否包含该条目
 * - barrel 是否导出对应组件目录
 * - 图标是否全部生成
 *
 * 用法:
 *   node scripts/check-coverage.mjs
 *   node scripts/check-coverage.mjs --json
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const EP =
  process.env.ELEMENT_PLUS_SOURCE || "D:/develop/code/project/element-plus";

const COMPONENT_JSON = `${EP}/docs/.vitepress/crowdin/en-US/pages/component.json`;
const EXAMPLES_DIR = `${EP}/docs/examples`;
const PAGES_DIR = `${ROOT}/src/app/(docs)/docs/element-plus/components`;
const CONTENT_DIR = `${ROOT}/src/content/docs`;
const UI_DIR = `${ROOT}/src/components/element-plus`;
const ICONS_DIR = `${UI_DIR}/icons`;
const BARREL = `${UI_DIR}/index.ts`;
const NAV = `${ROOT}/src/app/(docs)/_components/nav-config.ts`;

const read = (file) => readFileSync(file, "utf8");
const listDirs = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : [];
const listVue = (dir) =>
  existsSync(dir)
    ? readdirSync(dir).filter((file) => file.endsWith(".vue"))
    : [];

/** 统计 Markdown 里带示例路径的 :::demo 容器。 */
function countMarkdownDemos(source) {
  let count = 0;
  let inside = false;

  for (const line of source.split(/\r?\n/)) {
    if (!inside) {
      if (/^:::demo\b/.test(line)) inside = true;
      continue;
    }
    if (line.trim() === ":::") {
      inside = false;
      continue;
    }
    if (/^[\w-]+\/[\w-]+$/.test(line.trim())) {
      count += 1;
      inside = false;
    }
  }

  return count;
}

/** 文档页 slug 与组件目录不一致的特例。 */
const DIR_OVERRIDES = {
  layout: "row",
  "datetime-picker": "date-picker",
};

/** 这些页面只有样式/说明，没有对应组件目录。 */
const STYLE_PAGES = new Set(["overview", "border", "color", "typography"]);
const NO_OFFICIAL_DEMOS = new Set(["check-tag", "color"]);

/** 官方 component.json 没收录、但项目需要单独检查的模块。 */
const EXTRA_MODULES = [
  "countdown",
  "cascader-panel",
  "color-picker-panel",
  "date-picker-panel",
  "virtual-list",
  "auto-resizer",
];

const navSource = existsSync(NAV) ? read(NAV) : "";
const barrelSource = existsSync(BARREL) ? read(BARREL) : "";
const componentDirs = new Set(listDirs(UI_DIR));

const hasBarrel = (dir) => {
  if (dir === "icon") {
    return barrelSource.includes('from "./icon/ElIcon"');
  }
  return barrelSource.includes(`from "./${dir}"`);
};

const componentJson = JSON.parse(read(COMPONENT_JSON));
const rows = [];
const failures = [];

for (const [group, config] of Object.entries(componentJson)) {
  for (const item of config.children || []) {
    const slug = item.link.slice(1);
    const pageFile = `${PAGES_DIR}/${slug}/page.tsx`;
    const zhFile = `${CONTENT_DIR}/zh-CN/element-plus/components/${slug}.md`;
    const enFile = `${CONTENT_DIR}/en-US/element-plus/components/${slug}.md`;
    const markdownPage = existsSync(zhFile) || existsSync(enFile);
    const page = markdownPage || existsSync(pageFile);

    const dir = DIR_OVERRIDES[slug] || slug;
    const barrel = STYLE_PAGES.has(slug) ? null : hasBarrel(dir);
    const dirExists = STYLE_PAGES.has(slug) ? null : componentDirs.has(dir);
    const nav = navSource.includes(`slug: "${slug}"`);

    const officialDir = `${EXAMPLES_DIR}/${slug}`;
    const officialDemos = listVue(officialDir).length;
    const reactDemos = markdownPage
      ? countMarkdownDemos(read(existsSync(zhFile) ? zhFile : enFile))
      : existsSync(pageFile)
        ? (read(pageFile).match(/<DemoBlock/g) || []).length
        : 0;
    const demosComparable = !NO_OFFICIAL_DEMOS.has(slug) && officialDemos > 0;
    const demosOk = demosComparable ? reactDemos >= officialDemos : null;

    const row = {
      group,
      slug,
      page,
      dir: dirExists,
      barrel,
      nav,
      demos: demosComparable
        ? { react: reactDemos, official: officialDemos, ok: demosOk }
        : null,
    };
    rows.push(row);

    if (!page) failures.push(`${slug}: 缺少文档页`);
    if (dirExists === false) failures.push(`${slug}: 缺少组件目录 ${dir}`);
    if (barrel === false) failures.push(`${slug}: barrel 未导出 ./${dir}`);
    if (!nav) failures.push(`${slug}: 侧边栏缺少条目`);
    if (demosComparable && !demosOk) {
      failures.push(
        `${slug}: demo 数量 ${reactDemos}/${officialDemos}（页面 <DemoBlock> / 官方 .vue）`,
      );
    }
  }
}

/** 额外模块：只检查目录与 barrel。 */
const extraRows = EXTRA_MODULES.map((module) => {
  const exists = componentDirs.has(module);
  const barrel = hasBarrel(module);
  if (!exists) failures.push(`${module}: 缺少组件目录`);
  if (!barrel) failures.push(`${module}: barrel 未导出 ./${module}`);
  return { module, dir: exists, barrel };
});

/** 图标：解析官方 dist 的图标数量，与生成文件对比。 */
function countOfficialIcons() {
  const iconsSource = `${ROOT}/node_modules/@element-plus/icons-vue/dist/index.js`;
  if (!existsSync(iconsSource)) return 0;
  const source = read(iconsSource);
  const names = new Set();
  const markers = [...source.matchAll(/^\/\/ src\/components\/([\w-]+)\.vue$/gm)];

  for (const marker of markers) {
    const block = source.slice(marker.index, marker.index + 4000);
    const name = block.match(/name: "([A-Za-z0-9]+)"/)?.[1];
    if (name && /\bd: "/.test(block)) names.add(name);
  }

  return names.size;
}

const generatedIcons = existsSync(ICONS_DIR)
  ? readdirSync(ICONS_DIR).filter((file) => file.endsWith(".tsx")).length
  : 0;
const officialIcons = countOfficialIcons();

if (officialIcons > 0 && generatedIcons !== officialIcons) {
  failures.push(`图标数量 ${generatedIcons}/${officialIcons}`);
}

const report = {
  summary: {
    pages: rows.filter((row) => row.page).length,
    totalPages: rows.length,
    nav: rows.filter((row) => row.nav).length,
    demos: rows.reduce(
      (sum, row) => sum + (row.demos ? row.demos.react : 0),
      0,
    ),
    officialDemos: rows.reduce(
      (sum, row) => sum + (row.demos ? row.demos.official : 0),
      0,
    ),
    icons: { generated: generatedIcons, official: officialIcons },
    failures: failures.length,
  },
  rows,
  extraModules: extraRows,
  failures,
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const mark = (value) => (value === null ? "—" : value ? "✓" : "✗");
  const pad = (value, length) => String(value).padEnd(length);

  console.log(
    `${pad("Group", 14)}${pad("Slug", 22)}${pad("Page", 6)}${pad("Nav", 5)}${pad("Barrel", 8)}${pad("Demos", 10)}`,
  );
  console.log("-".repeat(65));

  for (const row of rows) {
    const demos = row.demos
      ? `${row.demos.react}/${row.demos.official}${row.demos.ok ? "" : " ✗"}`
      : "—";
    console.log(
      `${pad(row.group, 14)}${pad(row.slug, 22)}${pad(mark(row.page), 6)}${pad(mark(row.nav), 5)}${pad(mark(row.barrel), 8)}${pad(demos, 10)}`,
    );
  }

  console.log("\n额外模块:");
  for (const row of extraRows) {
    console.log(`  ${pad(row.module, 20)} dir=${mark(row.dir)} barrel=${mark(row.barrel)}`);
  }

  const { summary } = report;
  console.log(
    `\n页面 ${summary.pages}/${summary.totalPages}，导航 ${summary.nav}/${summary.totalPages}，` +
      `demo ${summary.demos}/${summary.officialDemos}，图标 ${summary.icons.generated}/${summary.icons.official}`,
  );

  if (failures.length > 0) {
    console.log(`\n缺失项 (${failures.length}):`);
    for (const failure of failures) console.log(`  - ${failure}`);
  } else {
    console.log("\n全部对齐官方。");
  }
}

process.exitCode = failures.length > 0 ? 1 : 0;
