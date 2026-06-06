"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import React from "react";

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

const components: Components = {
  h1: ({ children }) => <h1 className="typo-heading-1">{children}</h1>,
  h2: ({ children }) => <h2 className="typo-heading-2">{children}</h2>,
  h3: ({ children }) => <h3 className="typo-heading-3">{children}</h3>,
  h4: ({ children }) => <h4 className="typo-heading-4">{children}</h4>,
  h5: ({ children }) => <h5 className="typo-heading-5">{children}</h5>,
  h6: ({ children }) => <h6 className="typo-heading-6">{children}</h6>,

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

  blockquote: ({ children }) => (
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

  ol: ({ children, ...props }) => (
    <ol className="typo-list" {...props}>
      {children}
    </ol>
  ),

  li: ({ children, ...props }) => <li {...props}>{children}</li>,

  input: ({ checked }) => {
    if (checked) {
      return (
        <span className="typo-checkbox typo-checkbox--checked">{CHECK_SVG}</span>
      );
    }
    return <span className="typo-checkbox" />;
  },

  table: ({ children }) => <table className="typo-table">{children}</table>,

  img: ({ src, alt }) => (
    <figure className="typo-image-center">
      <img src={src} alt={alt || ""} loading="lazy" decoding="async" />
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  ),

  pre: ({ children }) => {
    const codeEl = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.type === "code"
    );
    const codeProps = React.isValidElement(codeEl) ? (codeEl.props as { className?: string }) : null;
    const langMatch = codeProps?.className?.match(/language-(\w+)/);
    const lang = langMatch ? langMatch[1] : "";

    if (lang) {
      const displayName = lang.charAt(0).toUpperCase() + lang.slice(1);
      return (
        <div className="typo-code-wrapper">
          <span className="typo-code-lang">{displayName}</span>
          <pre className="typo-code-block">{children}</pre>
        </div>
      );
    }
    return <pre className="typo-code-block">{children}</pre>;
  },

  code: ({ className, children, ...props }) => {
    if (className?.includes("language-") || className?.includes("hljs")) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className="typo-inline-code" {...props}>
        {children}
      </code>
    );
  },
};

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
