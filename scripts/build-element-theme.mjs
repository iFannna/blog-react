/**
 * 从 element-plus 官方源码编译 theme-chalk 样式为纯 CSS 产物。
 *
 * EP 的 SCSS 里只有 .el-* 类选择器和 :root 变量，没有全局元素重置，
 * 因此产物可以直接全局引入，不会与博客现有 globals.css 冲突。
 *
 * 用法: node scripts/build-element-theme.mjs
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "sass";

const __dirname = dirname(fileURLToPath(import.meta.url));

const EP_SOURCE = process.env.ELEMENT_PLUS_SOURCE || "D:/develop/code/project/element-plus";
const THEME_SRC = resolve(EP_SOURCE, "packages/theme-chalk/src");
const OUT_DIR = resolve(__dirname, "../src/styles/element-plus");

const TARGETS = [
  { entry: "index.scss", out: "index.css" },
  { entry: "dark/css-vars.scss", out: "dark.css" },
];

if (!existsSync(THEME_SRC)) {
  console.error(`找不到 theme-chalk 源码: ${THEME_SRC}`);
  console.error("请设置 ELEMENT_PLUS_SOURCE 环境变量指向 element-plus 仓库根目录。");
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

for (const { entry, out } of TARGETS) {
  const entryPath = resolve(THEME_SRC, entry);

  const result = compile(entryPath, {
    style: "expanded",
    loadPaths: [THEME_SRC],
    silenceDeprecations: ["import", "global-builtin", "color-functions"],
  });

  const outPath = resolve(OUT_DIR, out);
  writeFileSync(outPath, result.css, "utf8");

  const kb = (result.css.length / 1024).toFixed(1);
  console.log(`${out}: ${kb} KB`);
}
