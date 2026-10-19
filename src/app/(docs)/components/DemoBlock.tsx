"use client";

import { useState, type ReactNode } from "react";

interface DemoBlockProps {
  /** 示例说明，对应官方 :::demo 后面那行文字 */
  description?: ReactNode;
  /** 展示的源码文本 */
  source: string;
  /** 语言标签，官方是 vue，这里是 tsx */
  lang?: string;
  /** 实际渲染的示例 */
  children: ReactNode;
}

/**
 * 对应官方 docs 的 <Demo>：上方渲染示例，下方是源码区。
 * 源码区默认折叠到固定高度，底部有 sticky 的展开/收起条。
 */
export default function DemoBlock({
  description,
  source,
  lang = "tsx",
  children,
}: DemoBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // 剪贴板不可用（非安全上下文等）时静默失败，不打断阅读
    }
  };

  return (
    <div className="docs-example">
      <div className="docs-example__showcase">
        {description && <div className="docs-example__desc">{description}</div>}
        {children}
      </div>

      <div
        className={
          expanded
            ? "docs-example__source"
            : "docs-example__source is-folded"
        }
      >
        <button
          className="docs-example__copy"
          onClick={handleCopy}
          type="button"
          title="复制代码"
        >
          {copied ? "已复制" : "复制"}
        </button>
        <span className="docs-example__lang">{lang}</span>
        <pre className="docs-example__pre">
          <code>{source}</code>
        </pre>
      </div>

      <div
        className="docs-example__control"
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setExpanded((v) => !v);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 1024 1024"
          aria-hidden="true"
          style={{
            transform: expanded ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          <path fill="currentColor" d="M512 320 192 704h639.936z" />
        </svg>
        <span>{expanded ? "隐藏源代码" : "显示源代码"}</span>
      </div>
    </div>
  );
}
