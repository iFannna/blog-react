import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { isValidElement } from "react";
import { Heading } from "./Heading";
import {
  transformChildren,
  transformVersionTags,
} from "@/lib/docs/markdown-transforms";

/** 把 :::tip / :::warning / :::danger 容器块转成 callout 元素。 */
function parseCallouts(markdown: string): ReactNode[] {
  const lines = markdown.split("\n");
  const nodes: ReactNode[] = [];
  let buffer: string[] = [];
  let callout: { type: string; lines: string[] } | null = null;
  let key = 0;

  const flushBuffer = () => {
    if (buffer.length === 0) return;
    nodes.push(
      <MarkdownBody key={`md-${key++}`} markdown={buffer.join("\n")} />,
    );
    buffer = [];
  };

  for (const line of lines) {
    const open = line.match(/^:::(tip|warning|danger|info)\s*(.*)$/);

    if (callout) {
      if (line.trim() === ":::") {
        flushBuffer();
        nodes.push(
          <div
            className={`docs-callout docs-callout--${callout.type}`}
            key={`callout-${key++}`}
          >
            <MarkdownBody markdown={callout.lines.join("\n")} />
          </div>,
        );
        callout = null;
      } else {
        callout.lines.push(line);
      }
      continue;
    }

    if (open) {
      flushBuffer();
      callout = { type: open[1], lines: open[2] ? [open[2]] : [] };
      continue;
    }

    buffer.push(line);
  }

  if (callout) {
    flushBuffer();
    nodes.push(
      <div
        className={`docs-callout docs-callout--${callout.type}`}
        key={`callout-${key++}`}
      >
        <MarkdownBody markdown={callout.lines.join("\n")} />
      </div>,
    );
  }

  flushBuffer();
  return nodes;
}

function MarkdownBody({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // 表格单元格里的类型标记需要还原
        td: ({ children }) => <td>{transformChildren(children)}</td>,
        th: ({ children }) => <th>{transformChildren(children)}</th>,
        // 段落与列表项里也会有 ^(...) 版本标记
        p: ({ children }) => <p>{transformVersionTags(children)}</p>,
        li: ({ children }) => <li>{transformVersionTags(children)}</li>,
        // markdown 里的标题也带上锚点，与手写的 Heading 保持一致
        h2: ({ children }) => <Heading level={2}>{children}</Heading>,
        h3: ({ children }) => <Heading level={3}>{children}</Heading>,
        h4: ({ children }) => <Heading level={4}>{children}</Heading>,
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}

/**
 * 文档正文渲染器：先切分 ::: 容器块，其余交给 react-markdown。
 */
export default function DocsContent({ source }: { source: string }) {
  const blocks = parseCallouts(source);

  return (
    <>
      {blocks.map((block, index) =>
        isValidElement(block) ? (
          <div key={index}>{block}</div>
        ) : (
          <span key={index}>{block}</span>
        ),
      )}
    </>
  );
}
