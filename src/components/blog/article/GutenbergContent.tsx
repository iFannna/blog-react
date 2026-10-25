import {
  cloneElement,
  Fragment,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import parse, {
  attributesToProps,
  Element,
  type DOMNode,
  type HTMLReactParserOptions,
} from "html-react-parser";
import type { HighlighterCore } from "shiki/core";
import {
  ensureLanguages,
  highlightTokens,
  type HighlightToken,
} from "@/lib/highlight";

const CODE_LANGUAGE = /data-code-language="([^"]+)"/g;

interface GutenbergContentProps {
  content: string;
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

function nodeText(node: unknown): string {
  if (!node || typeof node !== "object") {
    return "";
  }
  const current = node as {
    type?: string;
    data?: unknown;
    children?: unknown[];
  };
  if (current.type === "text") {
    return typeof current.data === "string" ? current.data : "";
  }
  if (Array.isArray(current.children)) {
    return current.children.map(nodeText).join("");
  }
  return "";
}

function createReplace(highlighter: HighlighterCore) {
  return function replaceCode(domNode: DOMNode): ReactElement | void {
    if (!(domNode instanceof Element) || domNode.name !== "pre") {
      return;
    }
    const language = domNode.attribs["data-code-language"];
    if (!language) {
      return;
    }
    const codeNode = domNode.children.find(
      (child): child is Element =>
        child instanceof Element && child.name === "code",
    );
    if (!codeNode) {
      return;
    }
    const label = language.charAt(0).toUpperCase() + language.slice(1);

    return (
      <div className="typo-code-wrapper">
        <span className="typo-code-lang">{label}</span>
        <pre {...attributesToProps(domNode.attribs, domNode.name)}>
          <code {...attributesToProps(codeNode.attribs, codeNode.name)}>
            {renderTokens(
              highlightTokens(highlighter, nodeText(codeNode), language),
            )}
          </code>
        </pre>
      </div>
    );
  };
}

/**
 * 读取元素前一个区块注释里的属性。布局类名（is-layout-flex 等）
 * 由编辑器运行时注入、不写入保存内容，需要在渲染时补回。
 */
function readBlockAttributes(domNode: Element): Record<string, unknown> | null {
  // 区块注释与元素之间通常隔着保存时产生的换行空白
  let previous = domNode.prev;
  while (previous && previous.type === "text" && !previous.data.trim()) {
    previous = previous.prev;
  }
  if (!previous || previous.type !== "comment") {
    return null;
  }
  const data = typeof previous.data === "string" ? previous.data : "";
  const match = /^\s*wp:[\w/-]+\s*(\{[\s\S]*\})\s*$/.exec(data);
  if (!match) {
    return null;
  }
  try {
    const attributes = JSON.parse(match[1]);
    return attributes && typeof attributes === "object" ? attributes : null;
  } catch {
    return null;
  }
}

const FLEX_JUSTIFY: Record<string, string> = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
  "space-between": "space-between",
};

const FLEX_ALIGN: Record<string, string> = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end",
};

/** 把保存的 layout 属性还原成容器类名与对齐方式 */
function applyLayoutStyles(
  reactNode: ReactNode,
  domNode: DOMNode,
): ReactElement | string {
  // transform 的返回值会替换节点，未命中的节点必须原样返回
  if (typeof reactNode === "string") {
    return reactNode;
  }
  if (!(domNode instanceof Element) || !isValidElement(reactNode)) {
    return reactNode as ReactElement;
  }
  const attributes = readBlockAttributes(domNode);
  const layout = attributes?.layout;
  if (!layout || typeof layout !== "object") {
    return reactNode;
  }

  const { type, justifyContent, alignItems } = layout as {
    type?: string;
    justifyContent?: string;
    alignItems?: string;
  };
  const className =
    type === "flex"
      ? "is-layout-flex"
      : type === "grid"
        ? "is-layout-grid"
        : "";
  if (!className) {
    return reactNode;
  }

  const props = reactNode.props as {
    className?: string;
    style?: CSSProperties;
  };
  const style = { ...(props.style ?? {}) };
  if (justifyContent && FLEX_JUSTIFY[justifyContent]) {
    style.justifyContent = FLEX_JUSTIFY[justifyContent];
  }
  if (alignItems && FLEX_ALIGN[alignItems]) {
    style.alignItems = FLEX_ALIGN[alignItems];
  }

  return cloneElement(reactNode as ReactElement<Record<string, unknown>>, {
    className: [props.className, className].filter(Boolean).join(" "),
    style,
  });
}

/**
 * Gutenberg 正文渲染：区块标记本身就是可渲染的 HTML，
 * 区块注释在解析时丢弃，动态区块保存为空自然不输出。
 * 带 data-code-language 的代码块在服务端用 Shiki 着色。
 */
export default async function GutenbergContent({
  content,
}: GutenbergContentProps) {
  const languages = [...content.matchAll(CODE_LANGUAGE)].map(
    (match) => match[1],
  );
  const highlighter =
    languages.length > 0 ? await ensureLanguages(languages) : null;

  let body: ReactNode;

  try {
    const options: HTMLReactParserOptions = {
      replace: highlighter ? createReplace(highlighter) : undefined,
      transform: applyLayoutStyles,
    };
    body = parse(content, options);
  } catch {
    body = <pre className="gutenberg-content__fallback">{content}</pre>;
  }

  return (
    <>
      {/* 区块库样式是 public 下的静态资源，只能手动挂载 */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel="stylesheet"
        href="/canvas/block-library.css"
        precedence="gutenberg-blocks"
      />
      <div className="gutenberg-content">{body}</div>
    </>
  );
}
