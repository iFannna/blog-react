import { isValidElement, type ReactNode } from "react";

interface HeadingProps {
  /** 标题层级 */
  level: 2 | 3 | 4;
  /** 锚点 id，省略时由文本推导 */
  id?: string;
  children: ReactNode;
}

/** 把 children 拍平成纯文本，用于在没有显式 id 时生成锚点。 */
function toText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (isValidElement(node)) {
    return toText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

/**
 * 带锚点的标题，对应官方 VitePress 的 .header-anchor。
 *
 * 官方由 VitePress 在构建期给每个标题末尾插入一个链接（# 由 ::before 生成），
 * 默认透明，悬停标题时淡入。正文里统一用本组件代替裸 h2/h3。
 */
export function Heading({ level, id, children }: HeadingProps) {
  const anchorId = id ?? toText(children).trim();
  const Tag = `h${level}` as "h2" | "h3" | "h4";

  return (
    <Tag id={anchorId}>
      {children}
      <a
        className="docs-anchor"
        href={`#${anchorId}`}
        aria-label={`Permalink to "${anchorId}"`}
      />
    </Tag>
  );
}
