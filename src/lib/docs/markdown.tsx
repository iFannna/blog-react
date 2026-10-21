import "server-only";

import path from "node:path";
import {
  Children,
  Fragment,
  isValidElement,
  type ReactNode,
} from "react";
import matter from "gray-matter";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { ElTag } from "@/components/element-plus/tag";
import DemoBlock from "@/app/(docs)/_components/DemoBlock";
import { Heading } from "@/app/(docs)/_components/Heading";
import {
  ensureLanguages,
  highlightTokens,
  type HighlightToken,
} from "@/lib/highlight";
import { loadDemo, type LoadedDemo } from "./demos";
import { DOCS_MESSAGES } from "./i18n";
import {
  transformChildren,
  transformVersionTags,
} from "./markdown-transforms";
import type { DocLocale } from "./types";

interface DocsMarkdownProps {
  source: string;
  locale: DocLocale;
  section: string;
  slug: string[];
}

interface ProseBlock {
  kind: "prose";
  markdown: string;
}

interface CalloutBlock {
  kind: "callout";
  type: string;
  title: string;
  markdown: string;
}

interface DemoSpecBlock {
  kind: "demo";
  description: string;
  demoPath: string;
}

type MarkdownBlock = ProseBlock | CalloutBlock | DemoSpecBlock;

interface RenderContext {
  locale: DocLocale;
  section: string;
  slug: string[];
}

const CONTAINER_OPEN = /^:::(demo|tip|warning|danger|info)\s*(.*)$/;

/**
 * 复刻 markdown-it-container：:::demo 的示例路径是容器内第一个非空行，
 * 其余容器（tip/warning/...）的同行文字是标题。
 */
function parseBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.split("\n");
  const blocks: MarkdownBlock[] = [];
  let buffer: string[] = [];
  let container: { type: string; title: string; lines: string[] } | null = null;

  const flushProse = () => {
    if (buffer.some((line) => line.trim() !== "")) {
      blocks.push({ kind: "prose", markdown: buffer.join("\n") });
    }
    buffer = [];
  };

  const closeContainer = () => {
    if (!container) return;

    if (container.type === "demo") {
      const demoPath = container.lines.find((line) => line.trim() !== "")?.trim() ?? "";
      blocks.push({
        kind: "demo",
        description: container.title,
        demoPath,
      });
    } else {
      blocks.push({
        kind: "callout",
        type: container.type,
        title: container.title,
        markdown: container.lines.join("\n"),
      });
    }

    container = null;
  };

  for (const line of lines) {
    if (container) {
      if (line.trim() === ":::") {
        closeContainer();
      } else {
        container.lines.push(line);
      }
      continue;
    }

    const open = line.match(CONTAINER_OPEN);

    if (open) {
      flushProse();
      container = { type: open[1], title: open[2] ?? "", lines: [] };
      continue;
    }

    buffer.push(line);
  }

  closeContainer();
  flushProse();
  return blocks;
}

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    return extractText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

function extractCode(children: ReactNode): { lang?: string; code: string } {
  const codeElement = Children.toArray(children).find(
    (child) => isValidElement(child) && child.type === "code",
  );

  if (!isValidElement(codeElement)) {
    return { code: extractText(children) };
  }

  const props = codeElement.props as {
    children?: ReactNode;
    className?: string;
  };
  const lang = /language-([\w-]+)/.exec(props.className ?? "")?.[1];

  return { lang, code: extractText(props.children) };
}

function renderTokens(tokens: HighlightToken[][]) {
  return tokens.map((line, lineIndex) => (
    <Fragment key={lineIndex}>
      {line.map((token, tokenIndex) => (
        <span key={tokenIndex} style={token.style}>
          {token.content}
        </span>
      ))}
      {lineIndex < tokens.length - 1 && "\n"}
    </Fragment>
  ));
}

/** 相对链接按当前文档所在目录解析，并去掉 .md 后缀 */
function rewriteHref(href: string | undefined, context: RenderContext): string | undefined {
  if (!href) return href;
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(href)) return href;

  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const target = hashIndex >= 0 ? href.slice(0, hashIndex) : href;

  if (!target) return href;

  const directory = `/${context.locale}/docs/${context.section}/${context.slug
    .slice(0, -1)
    .join("/")}`;
  const resolved = path.posix.normalize(`${directory}/${target}`);
  const withoutExtension = resolved.replace(/\.md$/, "").replace(/\/index$/, "");

  return `${withoutExtension}${hash}`;
}

function MarkdownElTag({
  round,
  type,
  effect,
  size,
  children,
}: Record<string, unknown> & { children?: ReactNode }) {
  return (
    <ElTag
      type={type as "primary" | "success" | "info" | "warning" | "danger" | undefined}
      effect={effect as "dark" | "light" | "plain" | undefined}
      size={size as "large" | "default" | "small" | undefined}
      round={round !== undefined && round !== "false"}
    >
      {children}
    </ElTag>
  );
}

function createComponents(
  context: RenderContext,
  highlighter: Awaited<ReturnType<typeof ensureLanguages>>,
): Components {
  const components = {
    h2: ({ id, children }: { id?: string; children?: ReactNode }) => (
      <Heading level={2} id={id}>
        {transformVersionTags(children)}
      </Heading>
    ),
    h3: ({ id, children }: { id?: string; children?: ReactNode }) => (
      <Heading level={3} id={id}>
        {transformVersionTags(children)}
      </Heading>
    ),
    h4: ({ id, children }: { id?: string; children?: ReactNode }) => (
      <Heading level={4} id={id}>
        {transformVersionTags(children)}
      </Heading>
    ),
    table: ({ children }: { children?: ReactNode }) => (
      <div className="docs-table">
        <table>{children}</table>
      </div>
    ),
    td: ({ children }: { children?: ReactNode }) => (
      <td>{transformVersionTags(transformChildren(children))}</td>
    ),
    th: ({ children }: { children?: ReactNode }) => (
      <th>{transformVersionTags(transformChildren(children))}</th>
    ),
    p: ({ children }: { children?: ReactNode }) => (
      <p>{transformVersionTags(children)}</p>
    ),
    li: ({ children }: { children?: ReactNode }) => (
      <li>{transformVersionTags(children)}</li>
    ),
    a: ({ href, children, title }: { href?: string; children?: ReactNode; title?: string }) => {
      const rewritten = rewriteHref(href, context);
      const isExternal = rewritten ? /^https?:\/\//i.test(rewritten) : false;

      if (isExternal) {
        return (
          <a href={rewritten} title={title} target="_blank" rel="noreferrer">
            {children}
          </a>
        );
      }

      return (
        <a href={rewritten} title={title}>
          {children}
        </a>
      );
    },
    pre: ({ children }: { children?: ReactNode }) => {
      const { lang, code } = extractCode(children);
      const tokens = highlightTokens(highlighter, code, lang);

      return (
        <pre className="docs-code-block">
          <code>{renderTokens(tokens)}</code>
        </pre>
      );
    },
    "el-tag": MarkdownElTag,
  };

  return components as unknown as Components;
}

function MarkdownBody({
  markdown,
  components,
}: {
  markdown: string;
  components: Components;
}) {
  if (!markdown.trim()) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSlug]}
      components={components}
    >
      {markdown}
    </ReactMarkdown>
  );
}

/**
 * 通用文档正文：纯 Markdown + :::demo / :::tip 容器。
 * 代码块在服务端用 Shiki 高亮，示例按页面 manifest 动态加载。
 */
export default async function DocsMarkdown({
  source,
  locale,
  section,
  slug,
}: DocsMarkdownProps) {
  const { content } = matter(source);
  const blocks = parseBlocks(content);
  const messages = DOCS_MESSAGES[locale];

  const codeLanguages = [...content.matchAll(/^```([\w-]+)/gm)].map(
    (match) => match[1],
  );
  const highlighter = await ensureLanguages(codeLanguages);

  const demos = new Map<number, LoadedDemo>();
  await Promise.all(
    blocks.map(async (block, index) => {
      if (block.kind !== "demo" || !block.demoPath) return;

      const demo = await loadDemo(section, slug, block.demoPath);
      if (demo) demos.set(index, demo);
    }),
  );

  const context: RenderContext = { locale, section, slug };
  const components = createComponents(context, highlighter);

  return (
    <>
      {blocks.map((block, index) => {
        if (block.kind === "prose") {
          return (
            <MarkdownBody
              key={`prose-${index}`}
              markdown={block.markdown}
              components={components}
            />
          );
        }

        if (block.kind === "callout") {
          return (
            <div
              className={`docs-callout docs-callout--${block.type}`}
              key={`callout-${index}`}
            >
              <div className="docs-callout__title">
                <MarkdownBody
                  markdown={block.title || block.type.toUpperCase()}
                  components={components}
                />
              </div>
              <MarkdownBody
                markdown={block.markdown}
                components={components}
              />
            </div>
          );
        }

        const demo = demos.get(index);

        if (!demo) {
          return (
            <div className="docs-missing-demo" key={`demo-${index}`}>
              <span>{messages.missingDemo}</span>
              <code>{block.demoPath || "(empty)"}</code>
            </div>
          );
        }

        const Demo = demo.Component;

        if (demo.plain) {
          return (
            <Fragment key={`demo-${index}`}>
              {block.description && (
                <div className="docs-example__desc">
                  <MarkdownBody
                    markdown={block.description}
                    components={components}
                  />
                </div>
              )}
              <Demo />
            </Fragment>
          );
        }

        return (
          <DemoBlock
            key={`demo-${index}`}
            description={
              block.description ? (
                <MarkdownBody
                  markdown={block.description}
                  components={components}
                />
              ) : undefined
            }
            source={demo.source}
            lang={demo.lang}
          >
            <Demo />
          </DemoBlock>
        );
      })}
    </>
  );
}
