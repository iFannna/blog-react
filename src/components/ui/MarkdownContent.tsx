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

/** 检测子元素中是否包含 checkbox input（用于判断任务列表） */
function isTaskList(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === "input"
  );
}

const components: Components = {
  h1: ({ children }) => <h1 className="typo-heading-1">{children}</h1>,
  h2: ({ children }) => <h2 className="typo-heading-2">{children}</h2>,
  h3: ({ children }) => <h3 className="typo-heading-3">{children}</h3>,
  h4: ({ children }) => <h4 className="typo-heading-4">{children}</h4>,
  h5: ({ children }) => <h5 className="typo-heading-5">{children}</h5>,
  h6: ({ children }) => <h6 className="typo-heading-6">{children}</h6>,

  hr: () => <hr className="typo-separator" />,

  blockquote: ({ children }) => (
    <blockquote className="typo-quote">{children}</blockquote>
  ),

  ul: ({ children, ...props }) => {
    if (isTaskList(children)) {
      return <ul className="typo-task-list">{children}</ul>;
    }
    return (
      <ul className="typo-list" {...props}>
        {children}
      </ul>
    );
  },

  ol: ({ children, ...props }) => (
    <ol className="typo-list" {...props}>
      {children}
    </ol>
  ),

  li: ({ children, ...props }) => {
    const childArray = React.Children.toArray(children);
    const hasCheckbox = childArray.some(
      (child) => React.isValidElement(child) && child.type === "input"
    );
    if (hasCheckbox) {
      const checkboxes = childArray.filter(
        (child) => React.isValidElement(child) && child.type === "input"
      );
      const textContent = childArray.filter(
        (child) => !(React.isValidElement(child) && child.type === "input")
      );
      return (
        <li {...props}>
          {checkboxes}
          <span>{textContent}</span>
        </li>
      );
    }
    return <li {...props}>{children}</li>;
  },

  // 任务列表 checkbox
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
    // 从子 <code> 的 className 提取语言标识
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
    // 带 language- 或 hljs 类的是代码块内的 code，直接透传
    if (className?.includes("language-") || className?.includes("hljs")) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    // 行内代码
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

// MarkdownContent 将 markdown 正文渲染为带排版样式的 React 元素
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
