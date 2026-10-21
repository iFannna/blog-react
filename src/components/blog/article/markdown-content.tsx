import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Children,
  Fragment,
  isValidElement,
  type ReactNode,
} from "react";
import type { HighlighterCore } from "shiki/core";
import {
  ensureLanguages,
  highlightTokens,
  type HighlightToken,
} from "@/lib/highlight";

const CHECK_SVG = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M2 6L5 9L10 3"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
  // 这里的 code 已被自定义 code 组件替换，无法用 type === "code" 判断
  const codeElement = Children.toArray(children).find((child) =>
    isValidElement(child),
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

function createComponents(highlighter: HighlighterCore): Components {
  const components = {
    h1: ({ children }: { children?: ReactNode }) => (
      <h1 className="typo-heading-1">{children}</h1>
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="typo-heading-2">{children}</h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="typo-heading-3">{children}</h3>
    ),
    h4: ({ children }: { children?: ReactNode }) => (
      <h4 className="typo-heading-4">{children}</h4>
    ),
    h5: ({ children }: { children?: ReactNode }) => (
      <h5 className="typo-heading-5">{children}</h5>
    ),
    h6: ({ children }: { children?: ReactNode }) => (
      <h6 className="typo-heading-6">{children}</h6>
    ),

    hr: () => <hr className="typo-separator" />,

    // react-markdown 会把 ![](url) 包在 <p> 内，但 img 组件返回 <figure>，
    // HTML 不允许 <p> 含 <figure>，所以检测到图片时去掉 <p> 包裹
    // node 是 hast 元素节点，通过它判断 <p> 内是否含 <img>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    p: ({ children, node }: any) => {
      const hasImg = node?.children?.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c: any) => c.tagName === "img"
      );
      if (hasImg) {
        return <>{children}</>;
      }
      return <p>{children}</p>;
    },

    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="typo-quote">{children}</blockquote>
    ),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ul: ({ children, node }: any) => {
      // remark-gfm 会给 task list 的 <li> 添加 class="task-list-item"
      const isTask = node?.children?.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c: any) => c.properties?.className?.includes("task-list-item")
      );
      if (isTask) {
        return <ul className="typo-task-list">{children}</ul>;
      }
      return <ul className="typo-list">{children}</ul>;
    },

    ol: ({ children, start }: { children?: ReactNode; start?: number }) => (
      <ol className="typo-list" start={start}>
        {children}
      </ol>
    ),

    li: ({ children, className }: { children?: ReactNode; className?: string }) => (
      <li className={className}>{children}</li>
    ),

    input: ({ checked }: { checked?: boolean }) => {
      if (checked) {
        return (
          <span className="typo-checkbox is-checked">{CHECK_SVG}</span>
        );
      }
      return <span className="typo-checkbox" />;
    },

    table: ({ children }: { children?: ReactNode }) => (
      <table className="typo-table">{children}</table>
    ),

    img: ({ src, alt }: { src?: string; alt?: string }) => (
      <figure className="typo-image-center">
        <img src={src} alt={alt || ""} loading="lazy" decoding="async" />
        {alt && <figcaption>{alt}</figcaption>}
      </figure>
    ),

    pre: ({ children }: { children?: ReactNode }) => {
      const { lang, code } = extractCode(children);
      const tokens = highlightTokens(highlighter, code, lang);
      const block = (
        <pre className="typo-code-block">
          <code>{renderTokens(tokens)}</code>
        </pre>
      );

      if (!lang) return block;

      const displayName = lang.charAt(0).toUpperCase() + lang.slice(1);
      return (
        <div className="typo-code-wrapper">
          <span className="typo-code-lang">{displayName}</span>
          {block}
        </div>
      );
    },

    code: ({ className, children }: { className?: string; children?: ReactNode }) => {
      if (className?.includes("language-")) {
        return <code className={className}>{children}</code>;
      }
      return <code className="typo-inline-code">{children}</code>;
    },
  };

  return components as unknown as Components;
}

const CODE_FENCE = /^\s{0,3}(?:```|~~~)\s*([\w+-]+)/gm;

interface MarkdownContentProps {
  content: string;
}

export default async function MarkdownContent({ content }: MarkdownContentProps) {
  const languages = [...content.matchAll(CODE_FENCE)].map((match) => match[1]);
  const highlighter = await ensureLanguages(languages);

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={createComponents(highlighter)}>
      {content}
    </ReactMarkdown>
  );
}
