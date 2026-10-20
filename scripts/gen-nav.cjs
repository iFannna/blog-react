// 生成脚本以 CommonJS 直接运行，不走项目打包，require 是预期写法
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");

const EP = "D:/develop/code/project/element-plus";
const ROOT = "D:/develop/code/project/blog-react-golang/blog-react";

const d = JSON.parse(
  fs.readFileSync(`${EP}/docs/.vitepress/crowdin/en-US/pages/component.json`, "utf8"),
);

const have = new Set(
  fs
    .readdirSync(`${ROOT}/src/app/(docs)/docs/element-plus/components`, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name),
);

const GROUP_CN = {
  overview: "Overview 组件总览",
  basic: "Basic 基础组件",
  configuration: "Configuration 全局配置",
  form: "Form 表单组件",
  data: "Data 数据展示",
  navigation: "Navigation 导航",
  feedback: "Feedback 反馈组件",
  others: "Others 其他",
};

/**
 * 官方 component.json 的 Data 分组漏了 check-tag（该项目已实现并有文档页），
 * 生成时补在 Tag 之后，避免每次重新生成都丢失。
 */
const EXTRA_ITEMS = {
  data: [{ link: "/check-tag", text: "Check Tag" }],
};

/**
 * 中文标题沿用官方中文文档的「英文 + 中文」写法（如 Button 按钮），
 * 迁移后的 zh-CN markdown frontmatter 就是该写法的唯一来源。
 * 去掉 VitePress 的 ^(beta) 标记，侧边栏不渲染这类徽标。
 */
function getZhTitle(slug) {
  const file = `${ROOT}/src/content/docs/zh-CN/element-plus/components/${slug}.md`;
  if (!fs.existsSync(file)) return null;

  const match = fs
    .readFileSync(file, "utf8")
    .match(/^title:\s*(.+)$/m);
  if (!match) return null;

  return match[1]
    .trim()
    .replace(/^(["'])(.*)\1$/, "$2")
    .replace(/\s+\^\([^)]*\)$/, "");
}

const lines = [];
for (const [k, g] of Object.entries(d)) {
  lines.push("  {");
  lines.push(`    title: ${JSON.stringify(GROUP_CN[k])},`);
  lines.push("    items: [");

  const children = [...(g.children || [])];
  const extras = EXTRA_ITEMS[k] || [];
  const tagIndex = children.findIndex((c) => c.link === "/tag");
  children.splice(tagIndex >= 0 ? tagIndex + 1 : children.length, 0, ...extras);

  for (const c of children) {
    const slug = c.link.slice(1);
    const zhTitle = getZhTitle(slug);
    const zhField = zhTitle ? `, titleZh: ${JSON.stringify(zhTitle)}` : "";
    lines.push(
      `      { slug: ${JSON.stringify(slug)}, title: ${JSON.stringify(c.text)}${zhField}, done: ${have.has(slug)} },`,
    );
  }
  lines.push("    ],");
  lines.push("  },");
}

const out = `/**
 * 文档站侧边栏导航。
 *
 * 分组与顺序、条目文案、归属组件全部对齐官方
 * docs/.vitepress/crowdin/en-US/pages/component.json。
 * titleZh 取自 zh-CN markdown frontmatter，即官方中文文档的「英文 + 中文」写法。
 * check-tag 在官方 JSON 中缺失，由生成器额外注入到 Data 分组。
 * done 表示该组件已有对应 page.tsx，缺失的实现会被置灰。
 */

export interface DocNavItem {
  /** 路由末段，对应 /docs/element-plus/components/[slug] */
  slug: string;
  /** 官方侧边栏里的英文标题 */
  title: string;
  /** 官方中文侧边栏标题，如 "Button 按钮"；无中文文档时省略 */
  titleZh?: string;
  /** 是否已实现 */
  done?: boolean;
}

export interface DocNavGroup {
  title: string;
  items: DocNavItem[];
}

export const DOC_NAV: DocNavGroup[] = [
${lines.join("\n")}
];

/** 扁平列表，用于按 slug 查标题。 */
export const DOC_NAV_FLAT: DocNavItem[] = DOC_NAV.flatMap((g) => g.items);

export function findNavItem(slug: string) {
  return DOC_NAV_FLAT.find((item) => item.slug === slug);
}
`;

fs.writeFileSync(`${ROOT}/src/app/(docs)/_components/nav-config.ts`, out, "utf8");
console.log("written");
