/**
 * 把 @element-plus/icons-vue 的全部图标定义提取成 React 组件。
 *
 * 官方图标包是 Vue 组件（dist 里是 defineComponent 调用），这里不做运行时桥接，
 * 只把 SVG 结构提取成等价 JSX，避免为了图标把 Vue 运行时拉进项目。
 *
 * 产物为生成代码，不要手改；图标全集直接来自 dist，不再维护手写名单。
 *
 * 用法: node scripts/build-element-icons.mjs
 */

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ICONS_SOURCE =
  process.env.EP_ICONS_SOURCE ||
  resolve(__dirname, "../node_modules/@element-plus/icons-vue/dist/index.js");
const OUT_DIR = resolve(__dirname, "../src/components/element-plus/icons");

function parseIcons(source) {
  const blocks = new Map();
  const markers = [...source.matchAll(/^\/\/ src\/components\/([\w-]+)\.vue$/gm)];

  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].index;
    const end = i + 1 < markers.length ? markers[i + 1].index : source.length;
    const block = source.slice(start, end);

    const name = block.match(/name: "([A-Za-z0-9]+)"/)?.[1];
    if (!name) continue;

    const paths = [...block.matchAll(/\bd: "([^"]+)"/g)].map((m) => m[1]);
    if (paths.length === 0) continue;

    blocks.set(name, paths);
  }

  return blocks;
}

function renderIcon(name, paths) {
  const lines = paths.map((d) => `      <path fill="currentColor" d="${d}" />`);

  return `import type { SVGProps } from "react";

export function ${name}(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      {...props}
    >
${lines.join("\n")}
    </svg>
  );
}
`;
}

const source = readFileSync(ICONS_SOURCE, "utf8");
const all = parseIcons(source);

if (all.size === 0) {
  console.error(
    `没有从图标包解析到任何图标，请检查 dist 结构: ${ICONS_SOURCE}`,
  );
  process.exit(1);
}

const names = [...all.keys()].sort((a, b) => a.localeCompare(b));

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

for (const name of names) {
  writeFileSync(resolve(OUT_DIR, `${name}.tsx`), renderIcon(name, all.get(name)), "utf8");
}

const barrel = `${names.map((name) => `export { ${name} } from "./${name}";`).join("\n")}\n`;
writeFileSync(resolve(OUT_DIR, "index.ts"), barrel, "utf8");

console.log(`生成 ${names.length} 个图标`);
