import {
  Children,
  Fragment,
  isValidElement,
  type ReactNode,
} from "react";

/**
 * 官方 API 表格里的类型标记：
 *   ^[boolean]              -> <code>boolean</code>
 *   ^[enum]`'a' | 'b'`      -> <code class="api-typing">enum</code> + 提示按钮
 * 官方靠 VitePress 把这些注册成全局组件，这里在渲染前做文本替换。
 *
 * 提示按钮用 title 承载详情：服务端组件不引入客户端 Tooltip。
 * 交互弱于官方但信息完整。
 */
export function renderApiTyping(type: string, details?: string) {
  if (!details) return <code>{type}</code>;

  return (
    <span className="docs-api-typing">
      <code className="api-typing">{type}</code>
      <button
        className="docs-api-typing__trigger"
        type="button"
        title={details}
        aria-label={`Type details: ${details}`}
      >
        <svg width="14" height="14" viewBox="0 0 1024 1024" aria-hidden="true">
          <path
            fill="currentColor"
            d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 832a384 384 0 0 0 384-384 384 384 0 0 0-384-384 384 384 0 0 0-384 384 384 384 0 0 0 384 384m0-472a40 40 0 0 1 40 40v200a40 40 0 0 1-80 0V464a40 40 0 0 1 40-40m0-152a48 48 0 1 1 0 96 48 48 0 0 1 0-96"
          />
        </svg>
      </button>
    </span>
  );
}

/**
 * 把子节点里的 ^[...] 标记还原成元素。
 *
 * 关键：markdown 会把 ^[enum]`'a' | 'b'` 拆成两个兄弟节点 ——
 * 文本 "^[enum]" 和一个 <code> 元素。所以必须按节点数组处理，
 * 遇到标记时向后吃掉紧邻的 code 元素作为详情，而不是在单个字符串里找。
 */
export function transformChildren(children: ReactNode): ReactNode {
  const list = Children.toArray(children);
  const result: ReactNode[] = [];
  const pattern = /\^\[(\w+)\]/g;

  for (let i = 0; i < list.length; i++) {
    const child = list[i];

    if (typeof child !== "string" || !child.includes("^[")) {
      result.push(child);
      continue;
    }

    let lastIndex = 0;
    let match: RegExpExecArray | null;
    pattern.lastIndex = 0;

    while ((match = pattern.exec(child)) !== null) {
      if (match.index > lastIndex) {
        result.push(child.slice(lastIndex, match.index));
      }

      const type = match[1];
      const trailing = child.slice(match.index + match[0].length);

      // 标记后面只剩空白，且下一个兄弟是可渲染出文本的 code 元素时，
      // 把它当作类型详情并消费掉
      let details: string | undefined;
      const next = list[i + 1];

      if (
        trailing.trim() === "" &&
        isValidElement(next) &&
        (next.type === "code" || next.type === "span")
      ) {
        const inner = (next.props as { children?: ReactNode }).children;
        if (typeof inner === "string") {
          details = inner;
          i++;
        }
      }

      // 用 Fragment 而非包一层 span：^[boolean] 这类无详情标记要渲染成和官方一样的裸 <code>，
      // 多包一层会改变表格单元格里的 DOM 结构
      result.push(
        <Fragment key={`api-${result.length}`}>
          {renderApiTyping(type, details)}
        </Fragment>,
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < child.length) result.push(child.slice(lastIndex));
  }

  return result;
}

/** 版本标记 ^(2.2.0)，官方渲染成一个小标签。 */
export function transformVersionTags(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child !== "string") return child;

    const parts = child.split(/(\^\(\d[\d.]*\))/g);
    if (parts.length === 1) return child;

    return parts.map((part, index) => {
      const match = part.match(/^\^\((\d[\d.]*)\)$/);
      if (match) {
        return (
          <span className="docs-version-tag" key={index}>
            {match[1]}
          </span>
        );
      }
      return part;
    });
  });
}
