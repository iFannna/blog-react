"use client";

import { Fragment, useRef, useState, type ReactNode } from "react";
import { ElTooltip } from "@/components/element-plus/tooltip";
import { message } from "@/components/element-plus/message";
import { CaretTop } from "@/components/element-plus/icons";
import type { HighlightToken } from "./highlight";

interface DemoBlockProps {
  /** 示例说明，对应官方 :::demo 后面那行文字 */
  description?: ReactNode;
  /** 展示的源码文本 */
  source: string;
  /** 实际渲染的示例 */
  children: ReactNode;
}

/* 官方底栏用的是 Remix 图标（i-ri-file-copy-line / i-ri-code-line），与 Element Plus 图标集不同 */

function FileCopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23 12L15.9289 19.0711L14.5147 17.6569L20.1716 12L14.5147 6.34317L15.9289 4.92896L23 12ZM3.82843 12L9.48528 17.6569L8.07107 19.0711L1 12L8.07107 4.92896L9.48528 6.34317L3.82843 12Z" />
    </svg>
  );
}

/**
 * 对应官方 docs 的 vp-demo：上方渲染示例，底栏提供复制代码与查看/隐藏源代码。
 */
export default function DemoBlock({
  description,
  source,
  children,
}: DemoBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const [tokens, setTokens] = useState<HighlightToken[][] | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const highlightStarted = useRef(false);

  // Shiki 体积不小，悬停/聚焦源码按钮时再按需加载，展开时通常已就绪
  const startHighlight = () => {
    if (highlightStarted.current) return;
    highlightStarted.current = true;

    void import("./highlight")
      .then(({ highlightVue }) => highlightVue(source))
      .then(setTokens)
      .catch(() => {
        highlightStarted.current = false;
      });
  };

  const handleCopy = async () => {
    if (!navigator.clipboard) {
      message.error("当前浏览器不支持自动复制！");
      return;
    }

    try {
      await navigator.clipboard.writeText(source);
      message.success("已复制！");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "复制失败");
    }
  };

  // 键盘收起后把焦点还给源码按钮，避免焦点随浮层卸载落回 body
  const hideSource = (restoreFocus: boolean) => {
    setExpanded(false);
    if (!restoreFocus) return;

    rootRef.current
      ?.querySelector<HTMLButtonElement>(".docs-example__op-btn--source")
      ?.focus();
  };

  const sourceLabel = expanded ? "隐藏源代码" : "查看源代码";

  return (
    <div className="docs-example" ref={rootRef}>
      <div className="docs-example__showcase">
        {description && <div className="docs-example__desc">{description}</div>}
        {children}
      </div>

      <div className="docs-example__divider" />

      <div className="docs-example__op-btns">
        <ElTooltip
          content="复制代码"
          showArrow={false}
          trigger={["hover", "focus"]}
          triggerKeys={[]}
        >
          <button
            type="button"
            className="docs-example__op-btn"
            aria-label="复制代码"
            onClick={handleCopy}
          >
            <FileCopyIcon />
          </button>
        </ElTooltip>

        <ElTooltip
          content={sourceLabel}
          showArrow={false}
          trigger={["hover", "focus"]}
          triggerKeys={[]}
        >
          <button
            type="button"
            className="docs-example__op-btn docs-example__op-btn--source"
            aria-label={sourceLabel}
            aria-expanded={expanded}
            onPointerEnter={startHighlight}
            onFocus={startHighlight}
            onClick={() => {
              startHighlight();
              setExpanded((value) => !value);
            }}
          >
            <CodeIcon />
          </button>
        </ElTooltip>
      </div>

      <div
        className={
          expanded ? "docs-example__source is-expanded" : "docs-example__source"
        }
        aria-hidden={!expanded}
      >
        <div className="docs-example__source-inner">
          <pre className="docs-example__pre">
            <code className="docs-example__code">
              {tokens
                ? tokens.map((line, lineIndex) => (
                    <Fragment key={lineIndex}>
                      {line.map((token, tokenIndex) => (
                        <span key={tokenIndex} style={token.style}>
                          {token.content}
                        </span>
                      ))}
                      {lineIndex < tokens.length - 1 && "\n"}
                    </Fragment>
                  ))
                : source}
            </code>
          </pre>
        </div>
      </div>

      {expanded && (
        <div
          className="docs-example__float-control"
          role="button"
          tabIndex={0}
          onClick={() => hideSource(false)}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " " ||
              event.key === "NumpadEnter"
            ) {
              event.preventDefault();
              hideSource(true);
            }
          }}
        >
          <CaretTop width={16} height={16} aria-hidden="true" />
          <span>隐藏源代码</span>
        </div>
      )}
    </div>
  );
}
