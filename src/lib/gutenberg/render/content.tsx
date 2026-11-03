import "server-only";

import {
  cloneElement,
  createElement,
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
  highlightTokens,
  type HighlightToken,
} from "@/lib/highlight";
import {
  getBlockGapCssValue,
  renderLayout,
  type RenderableAttributes,
} from "@/lib/gutenberg/render/layout";
import { renderDuotone } from "@/lib/gutenberg/render/duotone";
import {
  renderAspectRatio,
  renderBackground,
  renderBlockVisibility,
  renderGalleryViewportStyles,
  renderStateStyles,
} from "@/lib/gutenberg/render/style";
import {
  renderButtonWidth,
  renderChildLayout,
  renderChildStateLayout,
  renderPosition,
  renderTabsState,
} from "@/lib/gutenberg/render/support";
import {
  getBlockWrapper,
  getDynamicWrapper,
  getTermsForQuery,
  isDynamicBlockName,
  isWrapperlessDynamicBlock,
  readBoolean,
  readNumber,
  readString,
  renderDynamicBlock,
  isRecord,
  type DynamicBlockProps,
  type DynamicPostContext,
  type DynamicQueryContext,
  type DynamicRenderContext,
  type DynamicTermContext,
} from "./dynamic";
import { getRenderQueryPosts } from "@/services/gutenberg/render-data";
import { getArticlePrevNext } from "@/services/article";
import { articleHref } from "@/utils/article";
import { localePath } from "@/lib/locale";

export interface RenderCollector {
  css: string[];
  cssKeys: Set<string>;
  svgs: string[];
  duotoneIds: Set<string>;
  nextId: number;
}

interface ParsedBlock {
  name: string;
  attributes: Record<string, unknown>;
}

export function createRenderCollector(): RenderCollector {
  return {
    css: [],
    cssKeys: new Set(),
    svgs: [],
    duotoneIds: new Set(),
    nextId: 0,
  };
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
 * 读取元素前一个区块注释里的名称与属性。布局、duotone、position 等
 * 属性由编辑器在运行时补进 DOM，不写入保存内容，需要在这里还原。
 */
function readBlock(domNode: Element): ParsedBlock | null {
  let previous = domNode.prev;
  while (previous && previous.type === "text" && !previous.data.trim()) {
    previous = previous.prev;
  }
  if (!previous || previous.type !== "comment") {
    return null;
  }
  const data = typeof previous.data === "string" ? previous.data : "";
  const match = /^\s*wp:([\w/-]+)(?:\s+(\{[\s\S]*\}))?\s*\/?\s*$/.exec(data);
  if (!match) {
    return null;
  }
  let attributes: Record<string, unknown> = {};
  if (match[2]) {
    try {
      const parsed = JSON.parse(match[2]);
      if (parsed && typeof parsed === "object") {
        attributes = parsed as Record<string, unknown>;
      }
    } catch {
      return null;
    }
  }
  // 核心区块注释省略 core/ 前缀，例如 wp:button、wp:image。
  const name = match[1].includes("/") ? match[1] : `core/${match[1]}`;
  return { name, attributes };
}

function mergeClassName(existing: unknown, additions: string[]): string {
  const names = new Set(
    String(existing ?? "")
      .split(/\s+/)
      .filter(Boolean),
  );
  for (const addition of additions) {
    for (const name of addition.split(/\s+/).filter(Boolean)) {
      names.add(name);
    }
  }
  return [...names].join(" ");
}

function mergeStyle(
  existing: CSSProperties | undefined,
  addition: CSSProperties | undefined,
): CSSProperties | undefined {
  if (!addition || Object.keys(addition).length === 0) {
    return existing;
  }
  return { ...(existing ?? {}), ...addition };
}

function safeCssColor(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const color = value.trim();
  return color && !/[;{}<>]/.test(color) ? color : null;
}

/** 区块级 elements.link 颜色只在运行时生成，保存 HTML 里没有对应规则 */
function elementLinkColor(
  attributes: Record<string, unknown>,
): { color: string; hover?: string } | null {
  const style = isRecord(attributes.style) ? attributes.style : undefined;
  const elements = isRecord(style?.elements) ? style.elements : undefined;
  const link = isRecord(elements?.link) ? elements.link : undefined;
  if (!link) {
    return null;
  }
  const color = isRecord(link.color) ? safeCssColor(link.color.text) : null;
  const hoverRecord = isRecord(link[":hover"]) ? link[":hover"] : undefined;
  const hover = isRecord(hoverRecord?.color)
    ? safeCssColor(hoverRecord.color.text)
    : null;
  if (!color && !hover) {
    return null;
  }
  return {
    color: color || "inherit",
    hover: hover || undefined,
  };
}

function imageSource(node: ReactNode): string {
  if (Array.isArray(node)) {
    for (const child of node) {
      const src = imageSource(child);
      if (src) {
        return src;
      }
    }
    return "";
  }
  if (isValidElement(node) && node.type === "img") {
    return readString((node.props as { src?: unknown }).src);
  }
  return "";
}

/** 图片未开灯箱时，按 linkDestination 在渲染期补上链接包裹 */
function wrapImageLink(
  node: ReactNode,
  href: string,
  target: string,
  rel: string,
): ReactNode {
  if (Array.isArray(node)) {
    return node.map((child) => wrapImageLink(child, href, target, rel));
  }
  if (!isValidElement(node)) {
    return node;
  }
  if (node.type === "a") {
    return node;
  }
  if (node.type === "img") {
    return createElement(
      "a",
      {
        key: (node as ReactElement).key ?? undefined,
        href,
        target: target && target !== "_self" ? target : undefined,
        rel: rel || (target && target !== "_self" ? "noreferrer noopener" : undefined),
      },
      node,
    );
  }
  return node;
}

/** 把区块级样式应用到内部目标元素（button 链接、table、tab 按钮） */
function applyToChildren(
  node: ReactNode,
  tags: string[],
  className: string,
  style: CSSProperties,
): ReactNode {
  if (Array.isArray(node)) {
    return node.map((child) => applyToChildren(child, tags, className, style));
  }
  if (
    isValidElement(node) &&
    typeof node.type === "string" &&
    tags.includes(node.type)
  ) {
    const props = node.props as {
      className?: string;
      style?: CSSProperties;
    };
    return cloneElement(node as ReactElement<Record<string, unknown>>, {
      className:
        mergeClassName(props.className, className ? [className] : []) ||
        undefined,
      style: mergeStyle(props.style, style),
    });
  }
  return node;
}

function blockSuffix(blockName: string): string {
  return blockName.startsWith("core/")
    ? blockName.slice("core/".length)
    : blockName.replace(/\//g, "-");
}

function encodeInner(html: string): string {
  return Buffer.from(html, "utf8").toString("base64");
}

function decodeInner(value: string): string {
  if (!value) {
    return "";
  }
  try {
    return Buffer.from(value, "base64").toString("utf8");
  } catch {
    return "";
  }
}

const TERMS_QUERY_PATTERN =
  /<!--\s*wp:terms-query(?:\s+\{(?:(?!-->)[\s\S])*?\})?\s*-->([\s\S]*?)<!--\s*\/wp:terms-query\s*-->/g;
const NAVIGATION_PATTERN =
  /<!--\s*wp:navigation(?:\s+\{(?:(?!-->)[\s\S])*?\})?\s*-->([\s\S]*?)<!--\s*\/wp:navigation\s*-->/g;
const NAVIGATION_SUBMENU_PATTERN =
  /<!--\s*wp:navigation-submenu(?:\s+\{(?:(?!-->)[\s\S])*?\})?\s*-->([\s\S]*?)<!--\s*\/wp:navigation-submenu\s*-->/g;
// 查询循环保留内部模板，由 QueryBlock 按查询结果循环渲染
const QUERY_BLOCK_PATTERN =
  /<!--\s*wp:query(?:\s+\{(?:(?!-->)[\s\S])*?\})?\s*-->([\s\S]*?)<!--\s*\/wp:query\s*-->/g;
const SELF_CLOSING_BLOCK_PATTERN =
  /<!--\s*wp:([\w/-]+)(?:\s+\{(?:(?!-->)[\s\S])*?\})?\s*\/-->/g;

function markContainerBlock(match: string, inner: string): string {
  const open = /^<!--[\s\S]*?-->/.exec(match)?.[0] ?? match;
  return `${open}<div data-gb-dynamic="true" data-gb-inner="${encodeInner(
    inner,
  )}"></div>`;
}

/**
 * 空动态区块在保存内容里只剩注释，解析器会丢弃注释。
 * 在解析前插入占位元素，解析阶段再把占位元素换成服务端渲染结果。
 */
function markDynamicBlocks(content: string, depth: number): string {
  let marked = content;

  // 内部模板需要保留，循环渲染时每篇文章复用一次
  if (depth < 3) {
    marked = marked
      .replace(QUERY_BLOCK_PATTERN, markContainerBlock)
      .replace(TERMS_QUERY_PATTERN, markContainerBlock)
      .replace(NAVIGATION_PATTERN, markContainerBlock)
      .replace(NAVIGATION_SUBMENU_PATTERN, markContainerBlock);
  } else {
    // 嵌套过深时整段收起，避免子区块套用当前文章上下文串数据
    marked = marked.replace(QUERY_BLOCK_PATTERN, "");
  }

  return marked.replace(SELF_CLOSING_BLOCK_PATTERN, (match, rawName: string) => {
    const name = rawName.includes("/") ? rawName : `core/${rawName}`;
    if (!isDynamicBlockName(name) || name === "core/terms-query") {
      return match;
    }
    return `${match}<div data-gb-dynamic="true"></div>`;
  });
}

function extractTermTemplate(innerHtml: string): {
  attributes: Record<string, unknown>;
  content: string;
} {
  const match =
    /<!--\s*wp:term-template(?:\s+(\{(?:(?!-->)[\s\S])*?\}))?\s*-->([\s\S]*?)<!--\s*\/wp:term-template\s*-->/.exec(
      innerHtml,
    );
  if (!match) {
    return { attributes: {}, content: innerHtml };
  }
  let attributes: Record<string, unknown> = {};
  if (match[1]) {
    try {
      const parsed = JSON.parse(match[1]);
      if (isRecord(parsed)) {
        attributes = parsed;
      }
    } catch {
      attributes = {};
    }
  }
  return { attributes, content: match[2] };
}

interface TermsQueryProps extends DynamicBlockProps {
  innerHtml: string;
  collector: RenderCollector;
  depth: number;
}

/** 按术语查询条件循环渲染 term-template 内部区块 */
async function TermsQueryBlock({
  attributes,
  context,
  instanceId,
  innerHtml,
  collector,
  depth,
}: TermsQueryProps) {
  const query = isRecord(attributes.termQuery) ? attributes.termQuery : {};
  const taxonomy =
    readString(query.taxonomy) === "post_tag" ? "post_tag" : "category";
  const hideEmpty = readBoolean(query.hideEmpty, true);
  const include = Array.isArray(query.include)
    ? query.include
        .map((value) => readNumber(value, 0))
        .filter((value) => value > 0)
    : [];
  const order = readString(query.order) === "desc" ? -1 : 1;
  const orderBy = readString(query.orderBy) || "name";
  const perPage = readNumber(query.perPage, 10);

  let terms = await getTermsForQuery(taxonomy);
  if (hideEmpty) {
    terms = terms.filter((term) => term.count > 0);
  }

  if (include.length > 0) {
    const orderMap = new Map(include.map((id, index) => [id, index]));
    terms = terms
      .filter((term) => orderMap.has(term.id))
      .sort(
        (a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0),
      );
  } else if (orderBy === "count") {
    terms = [...terms].sort((a, b) => order * (a.count - b.count));
  } else if (orderBy === "term_id") {
    terms = [...terms].sort((a, b) => order * (a.id - b.id));
  } else {
    terms = [...terms].sort(
      (a, b) => order * a.name.localeCompare(b.name, context.locale),
    );
  }

  if (perPage > 0) {
    terms = terms.slice(0, perPage);
  }
  if (terms.length === 0) {
    return null;
  }

  const template = extractTermTemplate(innerHtml);
  const wrapper = getBlockWrapper("core/term-template", template.attributes, "ul");
  const classNames = new Set(wrapper.className.split(/\s+/).filter(Boolean));
  const layout = renderLayout(
    "core/term-template",
    template.attributes as RenderableAttributes,
    instanceId,
  );
  if (layout) {
    for (const name of layout.className.split(/\s+/).filter(Boolean)) {
      classNames.add(name);
    }
    if (layout.css && !collector.cssKeys.has(layout.css)) {
      collector.cssKeys.add(layout.css);
      collector.css.push(layout.css);
    }
  }

  const items = terms.map((term) => {
    const termContext: DynamicTermContext = {
      id: term.id,
      name: term.name,
      count: term.count,
      taxonomy,
    };
    const body = renderContentBody(
      template.content,
      { ...context, term: termContext },
      collector,
      { depth: depth + 1 },
    );
    return (
      <li key={term.id} className={`wp-block-term term-${term.id}`}>
        {body}
      </li>
    );
  });

  return (
    <ul className={[...classNames].join(" ")} style={wrapper.style} id={wrapper.id}>
      {items}
    </ul>
  );
}

interface ExtractedBlock {
  attributes: Record<string, unknown>;
  content: string;
  full: string;
  index: number;
}

function parseAttributesJson(raw: string | undefined): Record<string, unknown> {
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw);
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function extractContainerBlock(innerHtml: string, name: string): ExtractedBlock | null {
  const pattern = new RegExp(
    `<!--\\s*wp:${name}(?:\\s+(\\{(?:(?!-->)[\\s\\S])*?\\}))?\\s*-->([\\s\\S]*?)<!--\\s*\\/wp:${name}\\s*-->`,
  );
  const match = pattern.exec(innerHtml);
  if (!match) {
    return null;
  }
  return {
    attributes: parseAttributesJson(match[1]),
    content: match[2],
    full: match[0],
    index: match.index,
  };
}

function extractSelfClosingBlock(innerHtml: string, name: string): ExtractedBlock | null {
  const pattern = new RegExp(
    `<!--\\s*wp:${name}(?:\\s+(\\{(?:(?!-->)[\\s\\S])*?\\}))?\\s*\\/-->`,
  );
  const match = pattern.exec(innerHtml);
  if (!match) {
    return null;
  }
  return {
    attributes: parseAttributesJson(match[1]),
    content: "",
    full: match[0],
    index: match.index,
  };
}

/** 去掉保存内容里的外层包裹标签，QueryBlock 会按属性重新生成 */
function unwrapBlockWrapper(html: string, tagName: string): string {
  const tag = /^[a-z][a-z0-9-]*$/.test(tagName) ? tagName : "div";
  const pattern = new RegExp(`^\\s*<${tag}\\b[^>]*>([\\s\\S]*)<\\/${tag}>\\s*$`);
  const match = pattern.exec(html);
  return match ? match[1] : html;
}

function readIdList(value: unknown): number[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => readNumber(item, 0))
      .filter((item) => item > 0);
  }
  const raw = readString(value);
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((item) => Number.parseInt(item.trim(), 10))
    .filter((item) => Number.isFinite(item) && item > 0);
}

function readTermIds(value: unknown): number[] {
  return Array.isArray(value)
    ? value.map((item) => readNumber(item, 0)).filter((item) => item > 0)
    : [];
}

interface QueryBlockProps extends DynamicBlockProps {
  innerHtml: string;
  collector: RenderCollector;
  depth: number;
}

/** 按查询属性取数并循环渲染文章模板 */
async function QueryBlock({
  attributes,
  context,
  instanceId,
  innerHtml,
  collector,
  depth,
}: QueryBlockProps) {
  const query = isRecord(attributes.query) ? attributes.query : {};
  const queryId = readNumber(attributes.queryId, 0);
  const perPage = Math.min(Math.max(readNumber(query.perPage, 10), 1), 100);
  const offset = Math.max(readNumber(query.offset, 0), 0);
  const pagesLimit = Math.max(readNumber(query.pages, 0), 0);
  const order = readString(query.order) === "asc" ? "asc" : "desc";
  const orderBy = readString(query.orderBy) === "title" ? "title" : "publish_at";
  const postType = readString(query.postType) || "post";
  const search = readString(query.search).trim();
  const taxQuery = isRecord(query.taxQuery) ? query.taxQuery : {};
  const include = isRecord(taxQuery.include) ? taxQuery.include : {};
  const excludeTerms = isRecord(taxQuery.exclude) ? taxQuery.exclude : {};
  const categoryIds = readTermIds(include.category);
  const tagIds = readTermIds(include.post_tag);
  const excludeCategoryIds = readTermIds(excludeTerms.category);
  const excludeTagIds = readTermIds(excludeTerms.post_tag);
  const authorIds = readIdList(query.author);
  const excludeIds = readIdList(query.exclude);
  if (readBoolean(query.excludeCurrent) && context.post) {
    excludeIds.push(context.post.id);
  }

  const template = extractContainerBlock(innerHtml, "post-template");
  if (!template) {
    return null;
  }
  const pagination = extractContainerBlock(innerHtml, "query-pagination");
  const noResults = extractContainerBlock(innerHtml, "query-no-results");
  const totalBlock = extractSelfClosingBlock(innerHtml, "query-total");
  const wrapperTagName = readString(attributes.tagName) || "div";
  const innerContent = unwrapBlockWrapper(innerHtml, wrapperTagName);
  const templateContent = template.content;

  const fullPost =
    templateContent.includes("wp:post-content") ||
    templateContent.includes("wp:post-time-to-read");
  const options = {
    page: Math.max(context.queryPages?.[`query-${queryId}-page`] ?? 1, 1),
    perPage,
    offset,
    orderBy,
    order,
    categoryIds,
    excludeCategoryIds,
    tagIds,
    excludeTagIds,
    authorIds,
    excludeIds,
    search,
    fullPost,
  };

  let result =
    postType === "post"
      ? await getRenderQueryPosts(options).catch(() => ({ posts: [], total: 0 }))
      : { posts: [], total: 0 };
  let page = options.page;
  let totalPages = perPage > 0 ? Math.ceil(result.total / perPage) : 0;
  if (pagesLimit > 0) {
    totalPages = Math.min(totalPages, pagesLimit);
  }
  if (totalPages > 0 && page > totalPages) {
    page = totalPages;
    result = await getRenderQueryPosts({ ...options, page }).catch(() => ({
      posts: [],
      total: 0,
    }));
  }

  const needsAdjacent = templateContent.includes("wp:post-navigation-link");
  const adjacents = needsAdjacent
    ? await Promise.all(
        result.posts.map((post) =>
          getArticlePrevNext(post.id).catch(() => null),
        ),
      )
    : [];

  const queryContext: DynamicQueryContext = {
    id: queryId,
    page,
    total: result.total,
    totalPages,
    perPage,
  };

  const items = result.posts.map((post, index) => {
    const postContext: DynamicPostContext = {
      id: post.id,
      title: post.title,
      link: localePath(
        context.locale,
        articleHref({
          id: post.id,
          year: post.year,
          month: post.month,
          day: post.day,
        }),
      ),
      year: post.year,
      month: post.month,
      day: post.day,
      summary: post.summary,
      coverImage: post.coverImage,
      content: post.content,
      contentFormat: post.contentFormat,
      publishAt: post.publishAt,
      author: {
        id: post.authorId,
        name: post.authorName,
        avatar: post.authorAvatar,
        description: post.authorDescription,
      },
      categories: post.categories,
      tags: post.tags,
      commentCount: post.commentCount,
      commentStatus: 1,
    };
    const body = renderContentBody(
      templateContent,
      {
        ...context,
        post: postContext,
        prevNext: adjacents[index] ?? null,
        query: queryContext,
      },
      collector,
      { depth: depth + 1 },
    );
    return (
      <li key={post.id} className={`wp-block-post post-${post.id}`}>
        {body}
      </li>
    );
  });

  const templateWrapper = getBlockWrapper("core/post-template", template.attributes, "ul");
  const templateClasses = new Set(
    templateWrapper.className.split(/\s+/).filter(Boolean),
  );
  const templateLayout = renderLayout(
    "core/post-template",
    template.attributes as RenderableAttributes,
    instanceId,
  );
  let templateCss = "";
  if (templateLayout) {
    for (const name of templateLayout.className.split(/\s+/).filter(Boolean)) {
      templateClasses.add(name);
    }
    // 异步组件执行时外层样式表已经输出，布局 CSS 直接随列表下发
    if (templateLayout.css && !collector.cssKeys.has(templateLayout.css)) {
      collector.cssKeys.add(templateLayout.css);
      templateCss = templateLayout.css;
    }
  }

  const hrefFor = (targetPage: number) => `?query-${queryId}-page=${targetPage}`;
  const isEnglish = context.locale === "en-US";
  const paginationNodes: ReactNode[] = [];
  if (pagination && totalPages > 1) {
    const arrow = readString(pagination.attributes.paginationArrow) || "none";
    const showLabel = readBoolean(pagination.attributes.showLabel, true);
    const previousBlock = extractSelfClosingBlock(
      pagination.content,
      "query-pagination-previous",
    );
    const numbersBlock = extractSelfClosingBlock(
      pagination.content,
      "query-pagination-numbers",
    );
    const nextBlock = extractSelfClosingBlock(pagination.content, "query-pagination-next");
    const arrowCharacters: Record<string, string> = {
      arrow: "→",
      chevron: "»",
    };

    const segments: Array<{ index: number; node: ReactNode }> = [];
    if (previousBlock && page > 1) {
      const arrowCharacter = arrowCharacters[arrow] ?? "";
      segments.push({
        index: previousBlock.index,
        node: (
          <a
            key="previous"
            className="wp-block-query-pagination-previous"
            href={hrefFor(page - 1)}
          >
            {arrowCharacter ? (
              <span
                className={`wp-block-query-pagination-previous-arrow is-arrow-${arrow}`}
                aria-hidden
              >
                {arrowCharacter === "→" ? "←" : "«"}
              </span>
            ) : null}
            {showLabel
              ? readString(previousBlock.attributes.label) ||
                (isEnglish ? "Previous page" : "上一页")
              : null}
          </a>
        ),
      });
    }
    if (numbersBlock) {
      const midSize = Math.max(readNumber(numbersBlock.attributes.midSize, 2), 0);
      const pages = new Set<number>([1, totalPages]);
      for (let target = page - midSize; target <= page + midSize; target += 1) {
        if (target >= 1 && target <= totalPages) {
          pages.add(target);
        }
      }
      const sorted = [...pages].sort((a, b) => a - b);
      const nodes: ReactNode[] = [];
      let previousPage = 0;
      for (const target of sorted) {
        if (previousPage && target - previousPage > 1) {
          nodes.push(
            <span key={`dots-${target}`} className="page-numbers dots">
              …
            </span>,
          );
        }
        nodes.push(
          target === page ? (
            <span key={target} aria-current="page" className="page-numbers current">
              {target}
            </span>
          ) : (
            <a key={target} className="page-numbers" href={hrefFor(target)}>
              {target}
            </a>
          ),
        );
        previousPage = target;
      }
      segments.push({ index: numbersBlock.index, node: nodes });
    }
    if (nextBlock && page < totalPages) {
      const arrowCharacter = arrowCharacters[arrow] ?? "";
      segments.push({
        index: nextBlock.index,
        node: (
          <a
            key="next"
            className="wp-block-query-pagination-next"
            href={hrefFor(page + 1)}
          >
            {showLabel
              ? readString(nextBlock.attributes.label) ||
                (isEnglish ? "Next page" : "下一页")
              : null}
            {arrowCharacter ? (
              <span
                className={`wp-block-query-pagination-next-arrow is-arrow-${arrow}`}
                aria-hidden
              >
                {arrowCharacter}
              </span>
            ) : null}
          </a>
        ),
      });
    }

    if (segments.length > 0) {
      const paginationWrapper = getBlockWrapper(
        "core/query-pagination",
        pagination.attributes,
        "nav",
      );
      paginationNodes.push(
        createElement(
          "nav",
          {
            key: "pagination",
            className: paginationWrapper.className,
            style: paginationWrapper.style,
            id: paginationWrapper.id,
          },
          segments
            .sort((a, b) => a.index - b.index)
            .map((segment) => segment.node),
        ),
      );
    }
  }

  const resultNodes: ReactNode[] = [];
  if (templateCss) {
    resultNodes.push(
      <style
        key="template-css"
        dangerouslySetInnerHTML={{ __html: templateCss }}
      />,
    );
  }
  if (result.posts.length > 0) {
    resultNodes.push(
      <ul
        key="posts"
        className={[...templateClasses].join(" ")}
        style={templateWrapper.style}
        id={templateWrapper.id}
      >
        {items}
      </ul>,
    );
  }
  if (paginationNodes.length > 0) {
    resultNodes.push(...paginationNodes);
  }
  if (result.total === 0 && noResults) {
    resultNodes.push(
      <Fragment key="no-results">
        {renderContentBody(
          noResults.content,
          { ...context, query: queryContext },
          collector,
          { depth: depth + 1 },
        )}
      </Fragment>,
    );
  }
  if (totalBlock) {
    const displayType =
      readString(totalBlock.attributes.displayType) || "total-results";
    if (displayType === "range") {
      const start = result.total > 0 ? offset + (page - 1) * perPage + 1 : 0;
      const end =
        result.total > 0 ? Math.min(start + result.posts.length - 1, result.total) : 0;
      resultNodes.push(
        <div key="total" className="wp-block-query-total">
          {isEnglish
            ? `Showing ${start}–${end} of ${result.total}`
            : `第 ${start}–${end} 篇，共 ${result.total} 篇`}
        </div>,
      );
    } else {
      resultNodes.push(
        <div key="total" className="wp-block-query-total">
          {isEnglish
            ? `${result.total} posts`
            : `共 ${result.total} 篇文章`}
        </div>,
      );
    }
  }

  let rest = innerContent;
  for (const segment of [template.full, pagination?.full, noResults?.full, totalBlock?.full]) {
    if (segment) {
      rest = rest.replace(segment, "");
    }
  }
  if (rest.trim()) {
    resultNodes.push(
      <Fragment key="rest">
        {renderContentBody(
          rest,
          { ...context, query: queryContext },
          collector,
          { depth: depth + 1 },
        )}
      </Fragment>,
    );
  }

  // 外层 wp-block-query 包裹与布局由通用 transform 按区块属性生成
  return <>{resultNodes}</>;
}

function createTransform(
  collector: RenderCollector,
  context: DynamicRenderContext,
  depth: number,
) {
  const addCss = (css: string) => {
    if (!css || collector.cssKeys.has(css)) {
      return;
    }
    collector.cssKeys.add(css);
    collector.css.push(css);
  };

  return function applyBlockAttributes(
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

    const block = readBlock(domNode);
    if (!block) {
      return reactNode as ReactElement;
    }
    const id = ++collector.nextId;
    const isDynamicMarker = domNode.attribs["data-gb-dynamic"] === "true";

    const props = reactNode.props as {
      className?: string;
      style?: CSSProperties;
      children?: ReactNode;
    };
    const classNames: string[] = [];
    let style: CSSProperties | undefined = props.style;
    let styleChanged = false;
    let children = props.children;
    let childrenChanged = false;
    let dynamicTag: string | null = null;

    const attributes = block.attributes as RenderableAttributes;
    const extraProps: Record<string, string> = {};

    // 交互所需的运行期标记：accordion 自动收起、image 灯箱开关
    if (
      block.name === "core/accordion" &&
      typeof attributes.autoclose === "boolean"
    ) {
      extraProps["data-autoclose"] = attributes.autoclose ? "true" : "false";
    }
    const lightbox = attributes.lightbox;
    if (
      block.name === "core/image" &&
      lightbox &&
      typeof lightbox === "object" &&
      (lightbox as { enabled?: unknown }).enabled === true
    ) {
      extraProps["data-gb-lightbox"] = "true";
    }

    // metadata.blockVisibility 为 false 时前端不输出该区块
    const visibility = renderBlockVisibility(block.name, attributes as { metadata?: unknown });
    if (visibility?.hidden) {
      return "";
    }
    if (visibility?.className) {
      classNames.push(visibility.className);
      if (visibility.css) {
        addCss(visibility.css);
      }
    }

    if (isDynamicMarker) {
      if (isWrapperlessDynamicBlock(block.name)) {
        const rendered = renderDynamicNode(
          block.name,
          block.attributes,
          context,
          collector,
          id,
          decodeInner(domNode.attribs["data-gb-inner"] ?? ""),
          depth,
        );
        if (rendered === null || rendered === undefined) {
          return "";
        }
        const element = rendered as ReactElement;
        const key =
          (reactNode as ReactElement).key ?? (element as ReactElement).key;
        return key !== null && key !== undefined
          ? cloneElement(element, { key })
          : element;
      }
      const wrapper = getDynamicWrapper(block.name, block.attributes);
      if (!wrapper) {
        return "";
      }
      dynamicTag = wrapper.tag;
      classNames.push(wrapper.className);
      style = mergeStyle(style, wrapper.style);
      styleChanged = true;
      if (wrapper.id) {
        extraProps.id = wrapper.id;
      }
      children = renderDynamicNode(
        block.name,
        block.attributes,
        context,
        collector,
        id,
        decodeInner(domNode.attribs["data-gb-inner"] ?? ""),
        depth,
      );
      if (children === null || children === undefined) {
        return "";
      }
      childrenChanged = true;
    }

    const linkColor = elementLinkColor(block.attributes);
    if (linkColor) {
      const linkClass = `wp-container-link-${id}`;
      classNames.push(linkClass, "has-link-color");
      addCss(
        `.gutenberg-content .${linkClass} a[href]:not(.wp-block-button__link) { color: ${linkColor.color}; }`,
      );
      if (linkColor.hover) {
        addCss(
          `.gutenberg-content .${linkClass} a[href]:not(.wp-block-button__link):hover { color: ${linkColor.hover}; }`,
        );
      }
    }

    const layout = renderLayout(block.name, attributes, id);
    if (layout) {
      classNames.push(layout.className);
      if (layout.css) {
        addCss(layout.css);
      }
    }

    const duotone = renderDuotone(
      block.name,
      attributes as Parameters<typeof renderDuotone>[1],
    );
    if (duotone) {
      classNames.push(duotone.className);
      if (!collector.duotoneIds.has(duotone.id)) {
        collector.duotoneIds.add(duotone.id);
        addCss(duotone.css);
        collector.svgs.push(duotone.svg);
      }
    }

    const position = renderPosition(attributes, id);
    if (position) {
      classNames.push(position.className);
      addCss(position.css);
    }

    // background 在保存时整体跳过；button/table/tab-list 作用在内部元素上
    const background = renderBackground(block.name, attributes);
    if (background) {
      if (background.target === "wrapper") {
        if (background.className) {
          classNames.push(background.className);
        }
        style = mergeStyle(style, background.style);
        styleChanged = true;
      } else {
        const tags =
          background.target === "table"
            ? ["table"]
            : background.target === "tab-buttons"
              ? ["button"]
              : ["a", "button"];
        children = applyToChildren(
          children,
          tags,
          background.className,
          background.style,
        );
        childrenChanged = true;
      }
    }

    const aspectRatio = renderAspectRatio(attributes);
    if (aspectRatio) {
      style = mergeStyle(style, aspectRatio);
      styleChanged = true;
    }

    const stateStyles = renderStateStyles(
      block.name,
      attributes,
      `wp-container-state-${blockSuffix(block.name)}-${id}`,
    );
    if (stateStyles) {
      classNames.push(stateStyles.className);
      addCss(stateStyles.css);
    }

    const childLayout = renderChildLayout(attributes);
    if (childLayout) {
      style = mergeStyle(style, childLayout);
      styleChanged = true;
    }

    const childStateLayout = renderChildStateLayout(
      attributes as { style?: Record<string, unknown> },
      `wp-container-child-state-${id}`,
    );
    if (childStateLayout) {
      classNames.push(childStateLayout.className);
      addCss(childStateLayout.css);
    }

    if (block.name === "core/button") {
      const width = renderButtonWidth(attributes);
      if (width) {
        classNames.push(width.className);
        style = mergeStyle(style, width.style);
        styleChanged = true;
      }
    }

    if (block.name === "core/gallery") {
      const gap = getBlockGapCssValue(attributes, "column");
      if (gap) {
        style = mergeStyle(style, {
          "--gb-gallery-gap": gap,
        } as CSSProperties);
        styleChanged = true;
      }

      const galleryViewport = renderGalleryViewportStyles(
        attributes,
        `wp-container-gallery-state-${id}`,
      );
      if (galleryViewport) {
        classNames.push(galleryViewport.className);
        addCss(galleryViewport.css);
      }
    }

    if (block.name === "core/image") {
      const lightboxEnabled =
        isRecord(lightbox) && lightbox.enabled === true;
      if (!lightboxEnabled) {
        const destination = readString(attributes.linkDestination);
        // url 是 source 属性，只存在于保存后的 <img> 上，不在区块注释里
        const href =
          destination === "media"
            ? imageSource(children)
            : destination === "custom"
              ? readString(attributes.href)
              : "";
        if (href) {
          children = wrapImageLink(
            children,
            href,
            readString(attributes.linkTarget),
            readString(attributes.rel),
          );
          childrenChanged = true;
        }
      }
    }

    if (block.name === "core/tabs") {
      const tabsState = renderTabsState(
        attributes as { activeTabIndex?: unknown },
      );
      if (tabsState) {
        classNames.push(tabsState.className);
        addCss(tabsState.css);
      }
    }

    if (
      classNames.length === 0 &&
      !styleChanged &&
      !childrenChanged &&
      Object.keys(extraProps).length === 0
    ) {
      return reactNode as ReactElement;
    }

    const mergedClassName =
      mergeClassName(props.className, classNames) || undefined;
    // 重新创建的标签要沿用解析器分配的 key，否则同级数组里会出现无 key 的子项
    const key = (reactNode as ReactElement).key ?? undefined;

    if (dynamicTag) {
      return createElement(
        dynamicTag,
        {
          key,
          className: mergedClassName,
          style,
          ...extraProps,
        },
        children,
      );
    }

    return cloneElement(reactNode as ReactElement<Record<string, unknown>>, {
      className: mergedClassName,
      style,
      ...(childrenChanged ? { children } : {}),
      ...extraProps,
    });
  };
}

function renderDynamicNode(
  name: string,
  attributes: Record<string, unknown>,
  context: DynamicRenderContext,
  collector: RenderCollector,
  instanceId: number,
  innerHtml: string,
  depth: number,
): ReactNode {
  if (name === "core/terms-query") {
    return (
      <TermsQueryBlock
        attributes={attributes}
        context={context}
        instanceId={instanceId}
        innerHtml={innerHtml}
        collector={collector}
        depth={depth}
      />
    );
  }
  if (name === "core/query") {
    return (
      <QueryBlock
        attributes={attributes}
        context={context}
        instanceId={instanceId}
        innerHtml={innerHtml}
        collector={collector}
        depth={depth}
      />
    );
  }
  return renderDynamicBlock(name, {
    attributes,
    context,
    instanceId,
    depth,
    innerHtml,
    renderNested: (nestedContent, nestedPost) =>
      renderContentBody(
        nestedContent,
        { locale: context.locale, post: nestedPost },
        collector,
        { depth: depth + 1 },
      ),
  });
}

export interface RenderContentOptions {
  highlighter?: HighlighterCore | null;
  depth?: number;
}

/** 解析正文并把动态区块占位替换为服务端组件 */
export function renderContentBody(
  content: string,
  context: DynamicRenderContext,
  collector: RenderCollector,
  options: RenderContentOptions = {},
): ReactNode {
  const depth = options.depth ?? 0;
  try {
    const marked = markDynamicBlocks(content, depth);
    const parserOptions: HTMLReactParserOptions = {
      replace: options.highlighter ? createReplace(options.highlighter) : undefined,
      transform: createTransform(collector, context, depth),
    };
    return parse(marked, parserOptions);
  } catch {
    return <pre className="gutenberg-content__fallback">{content}</pre>;
  }
}
