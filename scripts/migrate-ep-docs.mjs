/**
 * 把旧的 Element Plus 中文页面转换成通用 Markdown 文档。
 *
 * 旧页面正文是手写 JSX，API 表格是模板字符串；这里用 TypeScript AST
 * 读取顶层结构，生成 zh-CN 的 .md，并根据页面里的 import 与 DemoBlock
 * 生成 demo manifest。英文文档直接从官方仓库复制。
 *
 * 用法:
 *   node scripts/migrate-ep-docs.mjs button link text
 *   node scripts/migrate-ep-docs.mjs --all
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = process.cwd();
const officialDocs =
  process.env.ELEMENT_PLUS_SOURCE ||
  "D:/develop/code/project/element-plus";
const officialComponentDir = path.join(officialDocs, "docs/en-US/component");
const legacyDir = path.join(root, "src/app/(docs)/docs/element-plus/components");
const zhDir = path.join(root, "src/content/docs/zh-CN/element-plus/components");
const enDir = path.join(root, "src/content/docs/en-US/element-plus/components");
const demoDir = path.join(root, "src/content/demos/element-plus/components");

const GROUP_CN = {
  basic: "基础组件",
  configuration: "全局配置",
  form: "表单组件",
  data: "数据展示",
  navigation: "导航",
  feedback: "反馈组件",
  others: "其他",
};

const GROUP_EN = {
  basic: "Basic",
  configuration: "Configuration",
  form: "Form",
  data: "Data",
  navigation: "Navigation",
  feedback: "Feedback",
  others: "Others",
};

const componentJson = JSON.parse(
  fs.readFileSync(
    path.join(officialDocs, "docs/.vitepress/crowdin/en-US/pages/component.json"),
    "utf8",
  ),
);

const GROUP_BY_SLUG = new Map();
const ORDER_BY_SLUG = new Map();

for (const [group, config] of Object.entries(componentJson)) {
  (config.children || []).forEach((item, index) => {
    const slug = item.link.slice(1);
    GROUP_BY_SLUG.set(slug, group);
    ORDER_BY_SLUG.set(slug, (index + 1) * 10);
  });
}

GROUP_BY_SLUG.set("check-tag", "data");
ORDER_BY_SLUG.set("check-tag", 260);

const DEMO_MAPS = {
  link: {
    basic: "link/basic",
    disabled: "link/disabled",
    underline: "link/underline",
    icon: "link/with-icon",
  },
  text: {
    basic: "text/basic",
    sizes: "text/sizes",
    truncated: "text/truncated",
    mixed: "text/mixed",
    override: "text/override",
  },
  border: {
    border: "border/border",
    radius: "border/radius",
    shadow: "border/shadow",
  },
  space: {
    basic: "space/basic",
    vertical: "space/vertical-layout",
    controlSize: "space/control-size",
    customizedSize: "space/customized-size",
    alignment: "space/alignment",
    autoWrapping: "space/auto-wrapping",
    fill: "space/fill",
    fillRatio: "space/fill-ratio",
    literalSpacer: "space/literal-type-spacer",
    vnodeSpacer: "space/vnode-type-spacer",
  },
  scrollbar: {
    basic: "scrollbar/basic-usage",
    horizontal: "scrollbar/horizontal-scroll",
    maxHeight: "scrollbar/max-height",
    manual: "scrollbar/manual-scroll",
    infinite: "scrollbar/infinite-scroll",
  },
  splitter: {
    basic: "splitter/basic",
    vertical: "splitter/vertical",
    collapsible: "splitter/collapsible",
    disableDrag: "splitter/disableDrag",
    size: "splitter/size",
    lazy: "splitter/lazy",
  },
  layout: {
    basic: "layout/basic-layout",
    spacing: "layout/column-spacing",
    offset: "layout/column-offset",
    alignment: "layout/alignment",
    hybrid: "layout/hybrid-layout",
    responsive: "layout/responsive-layout",
  },
  container: {
    headerMain: "container/layout-hm",
    headerMainFooter: "container/layout-hmf",
    asideMain: "container/layout-am",
    asideHeaderMain: "container/layout-ham",
    asideHeaderMainFooter: "container/layout-hamf",
    headerAsideMain: "container/layout-ahm",
    headerAsideMainFooter: "container/layout-ahmf",
    example: "container/example",
  },
  alert: {
    basic: "alert/basic",
    theme: "alert/theme",
    customClose: "alert/close-button",
    description: "alert/description",
    icon: "alert/icon",
    center: "alert/center",
    closable: "alert/icon-description",
  },
  card: {
    basic: "card/basic",
    shadow: "card/shadow",
    slots: "card/simple",
    bodyStyle: "card/with-images",
  },
  checkbox: {
    basic: "checkbox/basic",
    disabled: "checkbox/disabled",
    group: "checkbox/grouping",
    indeterminate: "checkbox/intermediate",
    minMax: "checkbox/limitation",
    options: "checkbox/options",
    button: "checkbox/button-style",
    border: "checkbox/with-border",
  },
  collapse: {
    basic: "collapse/basic",
    accordion: "collapse/accordion",
    iconPosition: "collapse/custom-icon-position",
    customIcon: "collapse/custom-icon",
    customization: "collapse/customization",
    preventCollapsing: "collapse/prevent-collapsing",
  },
  divider: {
    basic: "divider/basic-usage",
    text: "divider/custom-content",
    vertical: "divider/vertical-divider",
    borderStyle: "divider/line-dashed",
  },
  empty: {
    basic: "empty/basic-usage",
    size: "empty/image-size",
    bottom: "empty/bottom-content",
    customImage: "empty/custom-image",
  },
  radio: {
    basic: "radio/basic-usage",
    disabled: "radio/disabled",
    options: "radio/options",
    button: "radio/radio-button",
    border: "radio/with-borders",
    sizes: "radio/sizes",
  },
  steps: {
    basic: "steps/basic",
    centered: "steps/centered",
    simple: "steps/simple",
    vertical: "steps/vertical",
    withDescription: "steps/with-description",
    withIcon: "steps/with-icon",
    withStatus: "steps/with-status",
  },
  switch: {
    basic: "switch/basic",
    customActionIcon: "switch/custom-action-icon",
    customActionSlot: "switch/custom-action-slot",
    icons: "switch/custom-icons",
    disabled: "switch/disabled",
    customValue: "switch/extended-value-types",
    loading: "switch/loading",
    beforeChange: "switch/prevent-switching",
    sizes: "switch/sizes",
    text: "switch/text-description",
  },
  tabs: {
    basic: "tabs/basic",
    card: "tabs/card-style",
    borderCard: "tabs/border-card",
    customLabel: "tabs/custom-tab",
    customAddIcon: "tabs/customized-add-button-icon",
    customizedTrigger: "tabs/customized-trigger",
    defaultValue: "tabs/default-value",
    dynamic: "tabs/dynamic-tabs",
    position: "tabs/tab-position",
  },
  text: {
    basic: "text/basic",
    sizes: "text/sizes",
    truncated: "text/truncated",
    mixed: "text/mixed",
    override: "text/override",
  },
  timeline: {
    basic: "timeline/basic",
    center: "timeline/center",
    customNode: "timeline/custom-node",
    customTimestamp: "timeline/custom-timestamp",
    mode: "timeline/mode",
    reverse: "timeline/reverse",
  },
  menu: {
    basic: "menu/basic",
    collapse: "menu/collapse",
    leftAndRight: "menu/left-and-right",
    popperOffset: "menu/popper-offset",
    vertical: "menu/vertical",
  },
};

// 官方文档里有、旧页面没有对应示例时，复用最接近的本地组件补齐英文文档
const EXTRA_DEMOS = {
  radio: [{ path: "radio/radio-group", sourceKey: "basic" }],
};

// DemoBlock 里的包装组件只提供上下文，示例本身是它的第一个子元素
const WRAPPER_COMPONENTS = new Set(["CalendarExampleLocale"]);

// 正文是组件展示而非普通文本，交给人工迁移
const MANUAL_SLUGS = new Set([
  "color",
  "icon",
  "overview",
  "typography",
]);

// 已经手工整理过中文文档，重新生成会丢掉补充内容
const PRESERVE_SLUGS = new Set(["button"]);

function officialDemoPaths(slug) {
  const file = path.join(officialComponentDir, `${slug}.md`);
  if (!fs.existsSync(file)) return [];

  const paths = [];
  let inside = false;

  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (!inside) {
      if (/^:::demo\b/.test(line)) inside = true;
      continue;
    }
    if (line.trim() === ":::") {
      inside = false;
      continue;
    }
    const value = line.trim();
    if (/^[\w-]+\/[\w-]+$/.test(value)) {
      paths.push(value);
      inside = false;
    }
  }

  return paths;
}

function demoPathFor(slug, sourceKey, index) {
  const mapped = DEMO_MAPS[slug]?.[sourceKey];
  if (mapped) return mapped;
  // 多数页面顺序与官方一致，按序号取官方路径；顺序不同的页面在 DEMO_MAPS 中显式声明
  return officialDemoPaths(slug)[index] ?? `${slug}/${sourceKey}`;
}

function decodeEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function normalizeText(text) {
  return decodeEntities(text).replace(/\s+/g, " ");
}

function parsePage(slug) {
  const filePath = path.join(legacyDir, slug, "page.tsx");
  const source = fs.readFileSync(filePath, "utf8");
  const sf = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const strings = new Map();
  const sources = new Map();
  const imports = new Map();
  let pageFn;

  for (const statement of sf.statements) {
    if (
      ts.isVariableStatement(statement) &&
      statement.declarationList.declarations.length === 1
    ) {
      const declaration = statement.declarationList.declarations[0];
      const name = declaration.name.getText(sf);
      const init = declaration.initializer;

      if (init && (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init))) {
        strings.set(name, init.text);
      }

      if (init && ts.isObjectLiteralExpression(init) && name === "SOURCES") {
        for (const property of init.properties) {
          if (
            ts.isPropertyAssignment(property) &&
            (ts.isStringLiteral(property.initializer) ||
              ts.isNoSubstitutionTemplateLiteral(property.initializer))
          ) {
            sources.set(property.name.getText(sf), property.initializer.text);
          }
        }
      }
    }

    if (ts.isImportDeclaration(statement)) {
      const specifier = statement.moduleSpecifier.text;
      if (!specifier.startsWith("@/components/element-plus/examples/")) {
        continue;
      }

      const clause = statement.importClause;
      if (!clause) continue;

      if (clause.name) {
        imports.set(clause.name.text, { specifier, exportName: undefined });
      }

      if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        for (const element of clause.namedBindings.elements) {
          imports.set(element.name.text, {
            specifier,
            exportName: (element.propertyName ?? element.name).text,
          });
        }
      }
    }

    if (
      ts.isFunctionDeclaration(statement) &&
      statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)
    ) {
      pageFn = statement;
    }
  }

  if (!pageFn) throw new Error(`${slug}: 找不到默认导出的页面函数`);

  let expression;
  const visit = (node) => {
    if (ts.isReturnStatement(node) && node.expression) {
      expression = node.expression;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(pageFn.body);

  let rootNode = expression;
  while (rootNode && ts.isParenthesizedExpression(rootNode)) {
    rootNode = rootNode.expression;
  }
  if (!rootNode) throw new Error(`${slug}: 找不到页面 JSX`);
  if (!ts.isJsxFragment(rootNode) && !ts.isJsxElement(rootNode)) {
    throw new Error(`${slug}: 页面返回值不是 JSX`);
  }

  const demoUsage = [];

  const attr = (node, name) => {
    const attributes = ts.isJsxElement(node)
      ? node.openingElement.attributes
      : node.attributes;
    for (const property of attributes.properties) {
      if (ts.isJsxAttribute(property) && property.name.getText(sf) === name) {
        return property.initializer;
      }
    }
    return undefined;
  };

  const attrText = (node, name) => {
    const init = attr(node, name);
    if (!init) return undefined;
    if (ts.isStringLiteral(init)) return init.text;
    if (ts.isJsxExpression(init) && init.expression) {
      const text = init.expression.getText(sf);
      if (
        ts.isStringLiteral(init.expression) ||
        ts.isNoSubstitutionTemplateLiteral(init.expression)
      ) {
        return init.expression.text;
      }
      if (ts.isNumericLiteral(init.expression)) return text;
      return text;
    }
    return undefined;
  };

  const resolveSource = (node) => {
    const init = attr(node, "source");
    if (!init) return undefined;
    if (ts.isStringLiteral(init)) return init.text;

    if (ts.isJsxExpression(init) && init.expression) {
      const expr = init.expression;
      if (ts.isNoSubstitutionTemplateLiteral(expr) || ts.isStringLiteral(expr)) {
        return expr.text;
      }
      if (ts.isPropertyAccessExpression(expr)) {
        const object = expr.expression.getText(sf);
        const property = expr.name.text;
        if (object === "SOURCES") return sources.get(property);
        return strings.get(object);
      }
      if (ts.isIdentifier(expr)) return strings.get(expr.text);
    }
    return undefined;
  };

  const tagName = (node) => {
    if (ts.isJsxElement(node)) return node.openingElement.tagName.getText(sf);
    if (ts.isJsxSelfClosingElement(node)) return node.tagName.getText(sf);
    return "";
  };

  const inline = (node) => {
    if (ts.isJsxText(node)) return normalizeText(node.text);
    if (ts.isJsxExpression(node)) {
      if (!node.expression) return "";
      if (
        ts.isStringLiteral(node.expression) ||
        ts.isNoSubstitutionTemplateLiteral(node.expression)
      ) {
        return node.expression.text;
      }
      if (ts.isNumericLiteral(node.expression)) return node.expression.text;
      return "";
    }
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = tagName(node);
      const children = ts.isJsxElement(node) ? node.children : [];
      const content = children.map(inline).join("");

      if (tag === "code") return `\`${content.trim()}\``;
      if (tag === "strong" || tag === "b") return `**${content.trim()}**`;
      if (tag === "em" || tag === "i") return `*${content.trim()}*`;
      if (tag === "br") return "\n";
      if (tag === "a") {
        const href = attrText(node, "href") ?? "";
        return `[${content.trim()}](${href})`;
      }
      if (tag === "img") {
        const src = attrText(node, "src") ?? "";
        const alt = attrText(node, "alt") ?? "";
        return `![${alt}](${src})`;
      }
      if (tag === "span" || tag === "div" || tag === "Fragment") return content;
      return content;
    }
    if (ts.isJsxFragment(node)) return node.children.map(inline).join("");
    return "";
  };

  const block = (node, blocks) => {
    if (ts.isJsxText(node)) return;
    if (ts.isJsxExpression(node)) {
      const text = inline(node);
      if (text.trim()) blocks.push({ type: "paragraph", text: text.trim() });
      return;
    }
    if (ts.isJsxFragment(node)) {
      for (const child of node.children) block(child, blocks);
      return;
    }
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = tagName(node);
      const children = ts.isJsxElement(node) ? node.children : [];

      if (/^h[1-6]$/.test(tag)) {
        const level = Number(tag[1]);
        blocks.push({
          type: "heading",
          level,
          text: children.map(inline).join("").trim(),
        });
        return;
      }

      if (tag === "Heading") {
        const level = Number(attrText(node, "level") ?? 2);
        blocks.push({
          type: "heading",
          level,
          text: children.map(inline).join("").trim(),
        });
        return;
      }

      if (tag === "p") {
        const text = children
          .map(inline)
          .join("")
          .trim();
        if (text) blocks.push({ type: "paragraph", text });
        return;
      }

      if (tag === "DemoBlock") {
        const sourceText = resolveSource(node) ?? "";
        const sourceKey =
          attr(node, "source")?.getText(sf).match(/SOURCES\.(\w+)/)?.[1] ?? "";
        let firstChild = children.find(
          (child) => ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child),
        );
        if (
          firstChild &&
          ts.isJsxElement(firstChild) &&
          WRAPPER_COMPONENTS.has(tagName(firstChild))
        ) {
          firstChild = firstChild.children.find(
            (child) => ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child),
          );
        }
        const heading = [...blocks]
          .reverse()
          .find((entry) => entry.type === "heading");
        demoUsage.push({
          sourceKey,
          component: firstChild ? tagName(firstChild) : undefined,
          heading: heading?.text,
          source: sourceText,
        });
        blocks.push({ type: "demo", sourceKey, demo: undefined });
        return;
      }

      if (tag === "DocsContent") {
        const sourceText = resolveSource(node);
        if (sourceText) blocks.push({ type: "raw", text: sourceText.trim() });
        return;
      }

      if (tag === "ul" || tag === "ol") {
        const items = children
          .filter(ts.isJsxElement)
          .map((child) => child.children.map(inline).join("").trim())
          .filter(Boolean);
        const list = items
          .map((item, index) => (tag === "ol" ? `${index + 1}. ${item}` : `- ${item}`))
          .join("\n");
        if (list) blocks.push({ type: "raw", text: list });
        return;
      }

      if (tag === "div" || tag === "span" || tag === "Fragment") {
        for (const child of children) block(child, blocks);
        return;
      }

      if (tag === "pre") {
        const codeNode = children.find(
          (child) => ts.isJsxElement(child) && tagName(child) === "code",
        );
        const codeChildren = codeNode ? codeNode.children : children;
        const text = codeChildren
          .map((child) => {
            if (
              ts.isJsxExpression(child) &&
              child.expression &&
              (ts.isStringLiteral(child.expression) ||
                ts.isNoSubstitutionTemplateLiteral(child.expression))
            ) {
              return child.expression.text;
            }
            return inline(child);
          })
          .join("")
          .trim();
        if (text) {
          const lang = text.startsWith(".") ? "css" : "";
          blocks.push({ type: "raw", text: `\`\`\`${lang}\n${text}\n\`\`\`` });
        }
        return;
      }

      // 复杂展示型页面（图标网格、排版示意）交给人工迁移
      throw new Error(`${slug}: 暂不支持 <${tag}> 区块，请手工迁移`);
    }
  };

  const blocks = [];
  block(rootNode, blocks);

  return { blocks, demoUsage, imports, strings };
}

function renderMarkdown(slug, parsed) {
  const group = GROUP_BY_SLUG.get(slug) ?? "basic";
  const titleBlock = parsed.blocks.find(
    (item) => item.type === "heading" && item.level === 1,
  );
  const title = titleBlock?.text ?? slug;
  const firstParagraph = parsed.blocks.find((item) => item.type === "paragraph");

  const lines = [];
  let previous;
  let demoIndex = 0;
  for (const item of parsed.blocks) {
    if (item.type === "heading") {
      lines.push(`${"#".repeat(item.level)} ${item.text}`, "");
    } else if (item.type === "paragraph") {
      // 紧跟在二级标题后、且后面就是示例的段落，按官方写法放进 :::demo 描述
      const index = parsed.blocks.indexOf(item);
      const next = parsed.blocks[index + 1];
      const isDemoIntro =
        next?.type === "demo" &&
        (previous === undefined ||
          (previous.type === "heading" && previous.level >= 2));

      if (!isDemoIntro) lines.push(item.text, "");
    } else if (item.type === "raw") {
      lines.push(item.text, "");
    } else if (item.type === "demo") {
      const path = demoPathFor(slug, item.sourceKey, demoIndex);
      demoIndex += 1;

      const index = parsed.blocks.indexOf(item);
      let description;
      const previousItem = parsed.blocks[index - 1];
      const beforePrevious = parsed.blocks[index - 2];
      if (
        previousItem?.type === "paragraph" &&
        (beforePrevious === undefined ||
          (beforePrevious.type === "heading" && beforePrevious.level >= 2))
      ) {
        description = previousItem.text;
      }

      if (description) {
        const offset = lines.lastIndexOf(description, lines.length - 1);
        if (offset >= 0) lines.splice(offset, 1);
      }

      lines.push(`:::demo${description ? ` ${description}` : ""}`, "", path ?? "", "", ":::", "");
    }
    previous = item;
  }

  const body = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  const frontmatter = [
    "---",
    `title: ${JSON.stringify(title)}`,
    firstParagraph ? `description: ${JSON.stringify(firstParagraph.text)}` : undefined,
    `group: ${GROUP_CN[group] ?? group}`,
    `order: ${ORDER_BY_SLUG.get(slug) ?? 1000}`,
    "---",
  ].filter(Boolean);

  return `${frontmatter.join("\n")}\n\n${body}\n`;
}

function resolveSourceFile(specifier) {
  const relative = `src/${specifier.replace("@/", "")}`;
  const candidates = [
    `${relative}.tsx`,
    `${relative}.ts`,
    `${relative}/index.tsx`,
    `${relative}/index.ts`,
  ];
  const found = candidates.find((candidate) =>
    fs.existsSync(path.join(root, candidate)),
  );
  if (!found) throw new Error(`无法解析 demo 模块: ${specifier}`);
  return found;
}

function renderManifest(slug, parsed) {
  const entries = [];
  const usedPaths = new Set();

  parsed.demoUsage.forEach((usage, index) => {
    if (!usage.component) return;
    const imported = parsed.imports.get(usage.component);
    if (!imported) return;

    const demoPath = demoPathFor(slug, usage.sourceKey, index);
    if (usedPaths.has(demoPath)) return;
    usedPaths.add(demoPath);

    const sourceFile = resolveSourceFile(imported.specifier);
    const fields = [
      `    load: () => import(${JSON.stringify(imported.specifier)}),`,
      imported.exportName
        ? `    exportName: ${JSON.stringify(imported.exportName)},`
        : undefined,
      `    sourceFile: ${JSON.stringify(sourceFile)},`,
    ].filter(Boolean);

    entries.push(`  ${JSON.stringify(demoPath)}: {\n${fields.join("\n")}\n  },`);
  });

  for (const extra of EXTRA_DEMOS[slug] ?? []) {
    if (usedPaths.has(extra.path)) continue;
    const usage = parsed.demoUsage.find(
      (item) => item.sourceKey === extra.sourceKey && item.component,
    );
    const imported = usage && parsed.imports.get(usage.component);
    if (!imported) continue;

    usedPaths.add(extra.path);
    const sourceFile = resolveSourceFile(imported.specifier);
    const fields = [
      `    load: () => import(${JSON.stringify(imported.specifier)}),`,
      imported.exportName
        ? `    exportName: ${JSON.stringify(imported.exportName)},`
        : undefined,
      `    sourceFile: ${JSON.stringify(sourceFile)},`,
    ].filter(Boolean);
    entries.push(`  ${JSON.stringify(extra.path)}: {\n${fields.join("\n")}\n  },`);
  }

  return `import type { DemoManifest } from "@/lib/docs/types";

const manifest: DemoManifest = {
${entries.join("\n")}
};

export default manifest;
`;
}

function copyEnglish(slug) {
  const official = path.join(officialComponentDir, `${slug}.md`);
  if (!fs.existsSync(official)) {
    console.warn(`  ! ${slug}: 官方仓库没有英文文档`);
    return;
  }

  // 个别官方文件带 BOM，会挡住 frontmatter 匹配
  const raw = fs.readFileSync(official, "utf8").replace(/^﻿/, "");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) throw new Error(`${slug}: 官方文档缺少 frontmatter`);

  const fields = match[1]
    .split("\n")
    .filter((line) => !line.startsWith("lang:"))
    .join("\n");
  const group = GROUP_BY_SLUG.get(slug) ?? "basic";
  const frontmatter = `${fields}\ngroup: ${GROUP_EN[group] ?? group}\norder: ${ORDER_BY_SLUG.get(slug) ?? 1000}`;

  fs.writeFileSync(
    path.join(enDir, `${slug}.md`),
    raw.replace(match[0], `---\n${frontmatter}\n---\n`),
  );
}

function main() {
  const args = process.argv.slice(2);
  const slugs = (
    args.includes("--all")
      ? fs
          .readdirSync(legacyDir)
          .filter((slug) => fs.existsSync(path.join(legacyDir, slug, "page.tsx")))
      : args
  ).filter(
    (slug) => !MANUAL_SLUGS.has(slug) && !PRESERVE_SLUGS.has(slug),
  );

  fs.mkdirSync(zhDir, { recursive: true });
  fs.mkdirSync(enDir, { recursive: true });
  fs.mkdirSync(demoDir, { recursive: true });

  const failed = [];

  for (const slug of slugs) {
    console.log(`- ${slug}`);

    try {
      const parsed = parsePage(slug);
      fs.writeFileSync(
        path.join(zhDir, `${slug}.md`),
        renderMarkdown(slug, parsed),
      );
      fs.writeFileSync(
        path.join(demoDir, `${slug}.ts`),
        renderManifest(slug, parsed),
      );
      copyEnglish(slug);
    } catch (error) {
      failed.push(slug);
      console.warn(`  ! ${error.message}`);
    }
  }

  if (failed.length > 0) {
    console.log(`\n需要手工迁移: ${failed.join(", ")}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export {
  DEMO_MAPS,
  GROUP_BY_SLUG,
  ORDER_BY_SLUG,
  officialComponentDir,
  officialDemoPaths,
  parsePage,
  renderManifest,
  renderMarkdown,
  copyEnglish,
};
