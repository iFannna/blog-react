import type { CSSProperties, ReactNode } from "react";
import parse from "html-react-parser";
import { getCSSRules, type Style } from "@/lib/gutenberg/style-engine";
import { localePath } from "@/lib/locale";
import { getIconByName } from "@/services/gutenberg/icons/catalog";
import GutenbergSocialLink from "@/components/blog/article/GutenbergSocialLink";
import {
  getRenderArchives,
  getRenderAuthors,
  getRenderCategories,
  getRenderLatestComments,
  getRenderLatestPosts,
  getRenderTags,
  type RenderTerm,
} from "@/services/gutenberg/render-data";
import { getSiteSetting } from "@/services/site";
import { articleHref } from "@/utils/article";
import { decodeEntities } from "@/utils/gutenberg/html-entities";
import { kebabCase } from "@/utils/gutenberg/kebab-case";
import { DEFAULT_AVATAR } from "@/utils/mock";
import type { PrevNext } from "@/types/models";

export interface DynamicPostContext {
  id: number;
  title: string;
  link: string;
  year: number;
  month: number;
  day: number;
  author: {
    id: number;
    name: string;
    avatar: string;
    description: string;
  };
  categories: Array<{ id: number; name: string }>;
  tags: Array<{ id: number; name: string }>;
  commentCount: number;
  commentStatus: number;
}

export interface DynamicTermContext {
  id: number;
  name: string;
  count: number;
  taxonomy: "category" | "post_tag";
}

export interface DynamicRenderContext {
  locale: string;
  post?: DynamicPostContext;
  prevNext?: PrevNext | null;
  term?: DynamicTermContext;
}

export interface DynamicBlockProps {
  attributes: Record<string, unknown>;
  context: DynamicRenderContext;
  instanceId: number;
  depth?: number;
  innerHtml?: string;
  renderNested?: (content: string, post?: DynamicPostContext) => ReactNode;
}

export interface DynamicWrapperProps {
  tag: string;
  className: string;
  style: CSSProperties;
  id?: string;
}

/** 已接入 Go 数据、保存内容为空的动态区块 */
export const DYNAMIC_BLOCK_NAMES = new Set([
  "core/archives",
  "core/avatar",
  "core/breadcrumbs",
  "core/calendar",
  "core/categories",
  "core/home-link",
  "core/icon",
  "core/latest-comments",
  "core/latest-posts",
  "core/navigation",
  "core/navigation-link",
  "core/navigation-submenu",
  "core/post-author-biography",
  "core/post-author-name",
  "core/post-comments-count",
  "core/post-comments-link",
  "core/post-navigation-link",
  "core/post-terms",
  "core/search",
  "core/site-logo",
  "core/site-tagline",
  "core/site-title",
  "core/social-link",
  "core/tag-cloud",
  "core/term-count",
  "core/term-name",
  "core/terms-query",
]);

export function isDynamicBlockName(name: string): boolean {
  return DYNAMIC_BLOCK_NAMES.has(name);
}

/**
 * 这些区块由渲染器自己输出最终标签，不能再套通用动态包裹，
 * 否则 <li>/<nav>/<form> 会被额外的 div 打断。
 */
const WRAPPERLESS_DYNAMIC_BLOCK_NAMES = new Set([
  "core/home-link",
  "core/navigation",
  "core/navigation-link",
  "core/navigation-submenu",
  "core/search",
  "core/social-link",
]);

export function isWrapperlessDynamicBlock(name: string): boolean {
  return WRAPPERLESS_DYNAMIC_BLOCK_NAMES.has(name);
}

const CORE_PREFIX = "core/";

function blockSuffix(blockName: string): string {
  return blockName.startsWith(CORE_PREFIX)
    ? blockName.slice(CORE_PREFIX.length)
    : blockName.replace(/\//g, "-");
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function readNumber(value: unknown, fallback = 0): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function readBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function articleLink(
  locale: string,
  article: { id: number; year: number; month: number; day: number },
): string {
  return localePath(locale, articleHref(article));
}

function termLink(locale: string, taxonomy: string, name: string): string {
  const segment = taxonomy === "post_tag" ? "tag" : "category";
  return localePath(locale, `/${segment}/${encodeURIComponent(name)}`);
}

function authorLink(locale: string, name: string): string {
  return localePath(locale, `/author/${encodeURIComponent(name)}`);
}

function formatDate(locale: string, year: number, month: number, day: number): string {
  if (!year || !month || !day) {
    return "";
  }
  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(year, month - 1, day));
  } catch {
    return `${year}-${pad(month)}-${pad(day)}`;
  }
}

function formatCommentDate(locale: string, value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) {
    return value;
  }
  return formatDate(locale, Number(match[1]), Number(match[2]), Number(match[3]));
}

function trimCharacters(value: string, length: number): string {
  const characters = Array.from(value.trim());
  return characters.length > length
    ? characters.slice(0, length).join("")
    : value.trim();
}

const STRINGS = {
  "zh-CN": {
    home: "首页",
    archive: "归档",
    archives: "归档",
    categories: "分类",
    tags: "标签",
    selectMonth: "选择月份",
    selectCategory: "选择分类",
    selectTag: "选择标签",
    noComments: "暂无评论",
    comment: "条评论",
    by: "作者：",
    on: "发表于",
    readMore: "阅读更多",
    previous: "上一篇",
    next: "下一篇",
    anonymous: "匿名",
    noTitle: "（无标题）",
  },
  "en-US": {
    home: "Home",
    archive: "Archive",
    archives: "Archives",
    categories: "Categories",
    tags: "Tags",
    selectMonth: "Select Month",
    selectCategory: "Select Category",
    selectTag: "Select Tag",
    noComments: "No comments",
    comment: "comments",
    by: "by ",
    on: "on",
    readMore: "Read more",
    previous: "Previous",
    next: "Next",
    anonymous: "Anonymous",
    noTitle: "(no title)",
  },
} as const;

function strings(locale: string) {
  return locale === "en-US" ? STRINGS["en-US"] : STRINGS["zh-CN"];
}

function commentCountText(locale: string, count: number): string {
  if (count <= 0) {
    return strings(locale).noComments;
  }
  if (locale === "en-US") {
    return count === 1 ? "1 comment" : `${count.toLocaleString("en-US")} comments`;
  }
  return `${count.toLocaleString("zh-CN")} 条评论`;
}

function reactStyleKey(key: string): string {
  if (!key.startsWith("-") || key.startsWith("--")) {
    return key;
  }
  const camel = key
    .slice(1)
    .replace(/-([a-z])/g, (_, character: string) => character.toUpperCase());
  return key.startsWith("-ms-")
    ? camel
    : camel.replace(/^[a-z]/, (character) => character.toUpperCase());
}

/** 把区块注释里的基础样式补成前台内联样式；背景与比例仍由通用渲染器处理 */
function inlineStyles(style: unknown): CSSProperties {
  if (!isRecord(style)) {
    return {};
  }
  const filtered: Record<string, unknown> = {};
  for (const group of [
    "color",
    "typography",
    "spacing",
    "border",
    "dimensions",
    "shadow",
  ]) {
    if (isRecord(style[group])) {
      filtered[group] = style[group];
    }
  }
  const output: Record<string, string> = {};
  for (const rule of getCSSRules(filtered as Style)) {
    output[reactStyleKey(rule.key)] = String(rule.value);
  }
  return output as CSSProperties;
}

function latestPostsLayout(attributes: Record<string, unknown>) {
  const layout = isRecord(attributes.layout) ? attributes.layout : undefined;
  const savedType = readString(layout?.type);
  const layoutType =
    savedType || (readString(attributes.postLayout) === "grid" ? "grid" : "default");
  const columnCount =
    readNumber(layout?.columnCount, 0) ||
    readNumber(attributes.columns, 0) ||
    3;
  return { layoutType, columnCount };
}

function wrapperTag(blockName: string, attributes: Record<string, unknown>): string {
  switch (blockName) {
    case "core/site-title": {
      const level = Math.min(Math.max(readNumber(attributes.level, 1), 0), 6);
      return level === 0 ? "p" : `h${level}`;
    }
    case "core/site-tagline":
    case "core/term-name": {
      const level = Math.min(Math.max(readNumber(attributes.level, 0), 0), 6);
      return level === 0 ? "p" : `h${level}`;
    }
    case "core/archives":
      return readBoolean(attributes.displayAsDropdown) ? "div" : "ul";
    case "core/categories":
      return readBoolean(attributes.displayAsDropdown) ? "div" : "ul";
    case "core/latest-posts":
      return "ul";
    case "core/latest-comments":
      return "ol";
    case "core/tag-cloud":
      return "p";
    case "core/breadcrumbs":
      return "nav";
    case "core/terms-query": {
      const tag = readString(attributes.tagName) || "div";
      return /^[a-z][a-z0-9-]*$/.test(tag) && !["script", "style"].includes(tag)
        ? tag
        : "div";
    }
    default:
      return "div";
  }
}

function colorClasses(attributes: Record<string, unknown>, classes: Set<string>) {
  const style = isRecord(attributes.style) ? attributes.style : undefined;
  const color = style && isRecord(style.color) ? style.color : undefined;
  const textColor = readString(attributes.textColor);
  const backgroundColor = readString(attributes.backgroundColor);
  const gradient = readString(attributes.gradient);

  if (textColor) {
    classes.add(`has-${kebabCase(textColor)}-color`);
  }
  if (backgroundColor && !gradient) {
    classes.add(`has-${kebabCase(backgroundColor)}-background-color`);
  }
  if (gradient) {
    classes.add(`has-${kebabCase(gradient)}-gradient-background`);
  }
  if (textColor || readString(color?.text)) {
    classes.add("has-text-color");
  }
  if (
    backgroundColor ||
    gradient ||
    readString(color?.background) ||
    readString(color?.gradient)
  ) {
    classes.add("has-background");
  }
  if (style && isRecord(style.elements)) {
    const link = isRecord(style.elements.link) ? style.elements.link : undefined;
    if (link && isRecord(link.color) && readString(link.color.text)) {
      classes.add("has-link-color");
    }
  }
}

function typographyClasses(attributes: Record<string, unknown>, classes: Set<string>) {
  const style = isRecord(attributes.style) ? attributes.style : undefined;
  const typography =
    style && isRecord(style.typography) ? style.typography : undefined;
  const fontSize = readString(attributes.fontSize);
  const fontFamily = readString(attributes.fontFamily);
  const textAlign = readString(typography?.textAlign);

  if (fontSize) {
    classes.add(`has-${kebabCase(fontSize)}-font-size`);
  }
  if (fontFamily) {
    classes.add(`has-${kebabCase(fontFamily)}-font-family`);
  }
  if (textAlign) {
    classes.add(`has-text-align-${kebabCase(textAlign)}`);
  }
}

function borderClasses(attributes: Record<string, unknown>, classes: Set<string>) {
  const style = isRecord(attributes.style) ? attributes.style : undefined;
  const border = style && isRecord(style.border) ? style.border : undefined;
  const borderColor = readString(attributes.borderColor);
  if (borderColor) {
    classes.add(`has-${kebabCase(borderColor)}-border-color`);
  }
  if (borderColor || readString(border?.color)) {
    classes.add("has-border-color");
  }
}

/** 还原区块的包裹标签、基础 class 与内联支持样式 */
export function getBlockWrapper(
  blockName: string,
  attributes: Record<string, unknown>,
  tagOverride?: string,
): DynamicWrapperProps {
  const classes = new Set<string>([`wp-block-${blockSuffix(blockName)}`]);
  const className = readString(attributes.className);
  if (className) {
    for (const name of className.split(/\s+/).filter(Boolean)) {
      classes.add(name);
    }
  }
  const align = readString(attributes.align);
  if (["wide", "full", "left", "right", "center"].includes(align)) {
    classes.add(`align${align}`);
  }

  colorClasses(attributes, classes);
  typographyClasses(attributes, classes);
  borderClasses(attributes, classes);

  const style = isRecord(attributes.style) ? attributes.style : undefined;
  if (style && isRecord(style.dimensions) && readString(style.dimensions.aspectRatio)) {
    classes.add("has-aspect-ratio");
  }

  if (blockName === "core/archives") {
    classes.add(
      readBoolean(attributes.displayAsDropdown)
        ? "wp-block-archives-dropdown"
        : "wp-block-archives-list",
    );
  }
  if (blockName === "core/categories") {
    classes.add(
      readBoolean(attributes.displayAsDropdown)
        ? "wp-block-categories-dropdown"
        : "wp-block-categories-list",
    );
    const taxonomy = readString(attributes.taxonomy) || "category";
    classes.add(`wp-block-categories-taxonomy-${taxonomy}`);
  }
  if (blockName === "core/latest-posts") {
    classes.add("wp-block-latest-posts__list");
    const { layoutType, columnCount } = latestPostsLayout(attributes);
    if (layoutType === "grid") {
      classes.add("is-grid");
      classes.add(`columns-${columnCount}`);
    }
    if (readBoolean(attributes.displayPostDate)) {
      classes.add("has-dates");
    }
    if (readBoolean(attributes.displayAuthor)) {
      classes.add("has-author");
    }
  }
  if (blockName === "core/latest-comments") {
    if (readBoolean(attributes.displayAvatar, true)) {
      classes.add("has-avatars");
    }
    if (readBoolean(attributes.displayDate, true)) {
      classes.add("has-dates");
    }
    if (readString(attributes.displayContent) !== "none") {
      classes.add("has-excerpts");
    }
  }
  if (blockName === "core/site-logo" && !readNumber(attributes.width, 0)) {
    classes.add("is-default-size");
  }
  if (blockName === "core/post-terms") {
    const term = readString(attributes.term);
    if (term) {
      classes.add(`taxonomy-${term}`);
    }
  }

  const inline = inlineStyles(attributes.style);
  if (blockName === "core/breadcrumbs") {
    const separator = readString(attributes.separator) || "/";
    (inline as Record<string, string>)["--separator"] = `"${separator
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')}"`;
  }

  return {
    tag: tagOverride ?? wrapperTag(blockName, attributes),
    className: [...classes].join(" "),
    style: inline,
    id: readString(attributes.anchor) || undefined,
  };
}

/** 还原动态区块的包裹属性 */
export function getDynamicWrapper(
  blockName: string,
  attributes: Record<string, unknown>,
): DynamicWrapperProps | null {
  if (!isDynamicBlockName(blockName)) {
    return null;
  }
  return getBlockWrapper(blockName, attributes);
}

function parseFontSize(value: string): { quantity: number; unit: string } {
  const match = /^\s*([\d.]+)\s*([a-z%]+)\s*$/i.exec(value ?? "");
  if (!match) {
    return { quantity: 8, unit: "pt" };
  }
  return { quantity: Number(match[1]), unit: match[2] };
}

async function ArchiveContent({
  attributes,
  context,
  instanceId,
}: DynamicBlockProps) {
  const rawType = readString(attributes.type);
  const type: "yearly" | "monthly" | "daily" =
    rawType === "yearly" || rawType === "daily" ? rawType : "monthly";
  const displayAsDropdown = readBoolean(attributes.displayAsDropdown);
  const showLabel = readBoolean(attributes.showLabel, true);
  const showPostCounts = readBoolean(attributes.showPostCounts);
  const locale = context.locale;
  const label = strings(locale).archives;
  const selectId = `wp-block-archives-${instanceId}`;
  const items = await getRenderArchives(type).catch(() => []);

  const formatLabel = (item: { year: number; month?: number; day?: number }) => {
    try {
      const options: Intl.DateTimeFormatOptions = item.day
        ? { year: "numeric", month: "long", day: "numeric" }
        : item.month
          ? { year: "numeric", month: "long" }
          : { year: "numeric" };
      const date = new Date(item.year, (item.month || 1) - 1, item.day || 1);
      return new Intl.DateTimeFormat(locale, options).format(date);
    } catch {
      return [item.year, item.month && pad(item.month), item.day && pad(item.day)]
        .filter(Boolean)
        .join("-");
    }
  };

  if (displayAsDropdown) {
    return (
      <>
        <label
          className={showLabel ? "wp-block-archives-dropdown__label" : "screen-reader-text"}
          htmlFor={selectId}
        >
          {label}
        </label>
        <select id={selectId} defaultValue="" aria-label={label}>
          <option value="">{strings(locale).selectMonth}</option>
          {items.map((item) => {
            const value = localePath(
              locale,
              `/archive/${item.year}${item.month ? `/${pad(item.month)}` : ""}${
                item.day ? `/${pad(item.day)}` : ""
              }`,
            );
            return (
              <option
                key={`${item.year}-${item.month || 0}-${item.day || 0}`}
                value={value}
              >
                {formatLabel(item)}
                {showPostCounts ? ` (${item.count})` : ""}
              </option>
            );
          })}
        </select>
      </>
    );
  }

  return items.map((item) => (
    <li key={`${item.year}-${item.month || 0}-${item.day || 0}`}>
      <a
        href={localePath(
          locale,
          `/archive/${item.year}${item.month ? `/${pad(item.month)}` : ""}${
            item.day ? `/${pad(item.day)}` : ""
          }`,
        )}
      >
        {formatLabel(item)}
      </a>
      {showPostCounts ? ` (${item.count})` : ""}
    </li>
  ));
}

async function CalendarContent({ attributes, context }: DynamicBlockProps) {
  const locale = context.locale;
  const post = context.post;
  const attributeYear = readNumber(attributes.year, 0);
  const attributeMonth = readNumber(attributes.month, 0);
  const now = new Date();
  const year = attributeYear || post?.year || now.getFullYear();
  const month = attributeMonth || post?.month || now.getMonth() + 1;
  const items = await getRenderArchives("daily").catch(() => []);
  const countByDay = new Map<number, number>();
  for (const item of items) {
    if (item.year === year && item.month === month && item.day) {
      countByDay.set(item.day, item.count);
    }
  }

  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const offset = (firstDay.getDay() + 6) % 7;
  const cells: Array<number | null> = Array(offset).fill(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  const weeks: Array<Array<number | null>> = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  const weekdayLabels = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(
      new Date(2024, 0, 1 + index),
    ),
  );
  const weekdayTitles = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: "long" }).format(
      new Date(2024, 0, 1 + index),
    ),
  );
  const caption = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(new Date(year, month - 1, 1));
  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year &&
    today.getMonth() + 1 === month &&
    today.getDate() === day;

  return (
    <table className="wp-calendar-table">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {weekdayLabels.map((label, index) => (
            <th key={index} scope="col">
              <abbr title={weekdayTitles[index]}>{label}</abbr>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, weekIndex) => (
          <tr key={weekIndex}>
            {week.map((day, dayIndex) => {
              if (day === null) {
                return (
                  <td key={`${weekIndex}-${dayIndex}`} className="pad">
                    &nbsp;
                  </td>
                );
              }
              const count = countByDay.get(day) || 0;
              return (
                <td key={`${weekIndex}-${dayIndex}`} id={isToday(day) ? "today" : undefined}>
                  {count > 0 ? (
                    <a
                      href={localePath(
                        locale,
                        `/archive/${year}/${pad(month)}/${pad(day)}`,
                      )}
                    >
                      {day}
                    </a>
                  ) : (
                    day
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

async function CategoriesBlock({
  attributes,
  context,
  instanceId,
}: DynamicBlockProps) {
  const taxonomy =
    readString(attributes.taxonomy) === "post_tag" ? "post_tag" : "category";
  const displayAsDropdown = readBoolean(attributes.displayAsDropdown);
  const showPostCounts = readBoolean(attributes.showPostCounts);
  const showEmpty = readBoolean(attributes.showEmpty);
  const showLabel = readBoolean(attributes.showLabel, true);
  const locale = context.locale;
  const label =
    readString(attributes.label) ||
    (taxonomy === "post_tag" ? strings(locale).tags : strings(locale).categories);
  const selectId = `wp-block-categories-${instanceId}`;
  const terms = (
    taxonomy === "post_tag"
      ? await getRenderTags().catch(() => [])
      : await getRenderCategories().catch(() => [])
  ).filter((term) => showEmpty || term.count > 0);

  if (displayAsDropdown) {
    return (
      <>
        {showLabel ? (
          <label
            className="wp-block-categories__label"
            htmlFor={selectId}
            dangerouslySetInnerHTML={{ __html: label }}
          />
        ) : (
          <label className="screen-reader-text" htmlFor={selectId}>
            {label}
          </label>
        )}
        <select id={selectId} defaultValue="" aria-label={label}>
          <option value="">
            {taxonomy === "post_tag"
              ? strings(locale).selectTag
              : strings(locale).selectCategory}
          </option>
          {terms.map((term) => (
            <option
              key={term.id}
              className="level-0"
              value={termLink(locale, taxonomy, term.name)}
            >
              {decodeEntities(term.name)}
              {showPostCounts ? ` (${term.count})` : ""}
            </option>
          ))}
        </select>
      </>
    );
  }

  return terms.map((term) => (
    <li key={term.id} className={`cat-item cat-item-${term.id}`}>
      <a href={termLink(locale, taxonomy, term.name)}>
        {decodeEntities(term.name)}
      </a>
      {showPostCounts ? ` (${term.count})` : ""}
    </li>
  ));
}

async function TagCloudBlock({ attributes, context }: DynamicBlockProps) {
  const taxonomy =
    readString(attributes.taxonomy) === "category" ? "category" : "post_tag";
  const showTagCounts = readBoolean(attributes.showTagCounts);
  const numberOfTags = Math.min(Math.max(readNumber(attributes.numberOfTags, 45), 1), 100);
  const locale = context.locale;
  const terms = (
    taxonomy === "category"
      ? await getRenderCategories().catch(() => [])
      : await getRenderTags().catch(() => [])
  )
    .filter((term) => term.count > 0)
    .sort((a, b) => a.name.localeCompare(b.name, locale))
    .slice(0, numberOfTags);

  if (terms.length === 0) {
    return null;
  }

  const smallest = parseFontSize(readString(attributes.smallestFontSize) || "8pt");
  const largest = parseFontSize(readString(attributes.largestFontSize) || "22pt");
  const counts = terms.map((term) => Number(term.count) || 0);
  const minCount = Math.min(...counts);
  const maxCount = Math.max(...counts);
  const spread = maxCount - minCount;
  const fontStep = spread > 0 ? (largest.quantity - smallest.quantity) / spread : 0;

  return terms.map((term, index) => {
    const count = Number(term.count) || 0;
    const fontSize = smallest.quantity + (count - minCount) * fontStep;
    return (
      <a
        key={term.id}
        className={`tag-cloud-link tag-link-${term.id} tag-link-position-${index + 1}`}
        href={termLink(locale, taxonomy, term.name)}
        style={{ fontSize: `${Number(fontSize.toFixed(2))}${smallest.unit}` }}
      >
        {decodeEntities(term.name)}
        {showTagCounts ? <span className="tag-link-count">{` (${count})`}</span> : null}
      </a>
    );
  });
}

async function LatestPostsBlock({
  attributes,
  context,
  depth = 0,
  renderNested,
}: DynamicBlockProps) {
  const locale = context.locale;
  const postsToShow = Math.min(Math.max(readNumber(attributes.postsToShow, 5), 1), 100);
  const categories = Array.isArray(attributes.categories)
    ? attributes.categories
    : [];
  const categoryIds = categories
    .map((item) => (isRecord(item) ? readNumber(item.id, 0) : 0))
    .filter((id) => id > 0);
  const displayFeaturedImage = readBoolean(attributes.displayFeaturedImage);
  const displayPostContent = readBoolean(attributes.displayPostContent);
  const displayPostContentRadio =
    readString(attributes.displayPostContentRadio) === "full_post"
      ? "full_post"
      : "excerpt";
  const displayPostDate = readBoolean(attributes.displayPostDate);
  const displayAuthor = readBoolean(attributes.displayAuthor);
  const excerptLength = Math.max(readNumber(attributes.excerptLength, 55), 1);
  const featuredImageAlign = readString(attributes.featuredImageAlign);
  const featuredImageSizeWidth = readNumber(attributes.featuredImageSizeWidth, 0);
  const featuredImageSizeHeight = readNumber(attributes.featuredImageSizeHeight, 0);
  const addLinkToFeaturedImage = readBoolean(attributes.addLinkToFeaturedImage);
  const posts = await getRenderLatestPosts({
    perPage: postsToShow,
    categoryIds,
    authorId: readNumber(attributes.selectedAuthor, 0) || undefined,
    orderBy: readString(attributes.orderBy) || "date",
    order: readString(attributes.order) || "desc",
    fullPost: displayPostContent && displayPostContentRadio === "full_post",
  }).catch(() => []);

  return posts.slice(0, postsToShow).map((post) => {
    const title = decodeEntities(post.title).trim() || strings(locale).noTitle;
    const image = displayFeaturedImage && post.coverImage ? (
      <img
        src={post.coverImage}
        alt=""
        loading="lazy"
        decoding="async"
        style={{
          maxWidth: featuredImageSizeWidth || undefined,
          maxHeight: featuredImageSizeHeight || undefined,
        }}
      />
    ) : null;
    const featuredImage = image ? (
      <div
        className={`wp-block-latest-posts__featured-image${
          featuredImageAlign ? ` align${featuredImageAlign}` : ""
        }`}
      >
        {addLinkToFeaturedImage ? <a href={postLink(locale, post)}>{image}</a> : image}
      </div>
    ) : null;

    const summary = post.summary.trim();
    const excerpt = summary ? trimCharacters(summary, excerptLength) : "";
    const truncated = Array.from(summary).length > excerptLength;
    const excerptContent = displayPostContent && displayPostContentRadio === "excerpt" && excerpt ? (
      <div className="wp-block-latest-posts__post-excerpt">
        {excerpt}
        {truncated ? (
          <>
            {"… "}
            <a className="wp-block-latest-posts__read-more" href={postLink(locale, post)}>
              {strings(locale).readMore}
            </a>
          </>
        ) : null}
      </div>
    ) : null;

    return (
      <li key={post.id}>
        {featuredImage}
        <a className="wp-block-latest-posts__post-title" href={postLink(locale, post)}>
          {title}
        </a>
        {displayAuthor && post.authorName ? (
          <div className="wp-block-latest-posts__post-author">
            {`${strings(locale).by}${decodeEntities(post.authorName)}`}
          </div>
        ) : null}
        {displayPostDate ? (
          <time
            className="wp-block-latest-posts__post-date"
            dateTime={post.publishAt ? post.publishAt.replace(" ", "T") : undefined}
          >
            {formatDate(locale, post.year, post.month, post.day)}
          </time>
        ) : null}
        {excerptContent}
        {displayPostContent && displayPostContentRadio === "full_post" && post.content ? (
          post.contentFormat === "markdown" ? (
            <pre className="wp-block-latest-posts__post-full-content">
              {post.content}
            </pre>
          ) : renderNested && depth < 2 ? (
            <div className="wp-block-latest-posts__post-full-content">
              {renderNested(post.content, {
                id: post.id,
                title: post.title,
                link: postLink(locale, post),
                year: post.year,
                month: post.month,
                day: post.day,
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
              })}
            </div>
          ) : (
            <div
              className="wp-block-latest-posts__post-full-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )
        ) : null}
      </li>
    );
  });
}

function postLink(
  locale: string,
  post: { id: number; year: number; month: number; day: number },
): string {
  return articleLink(locale, post);
}

async function LatestCommentsBlock({ attributes, context }: DynamicBlockProps) {
  const locale = context.locale;
  const commentsToShow = Math.min(
    Math.max(readNumber(attributes.commentsToShow, 5), 1),
    100,
  );
  const displayAvatar = readBoolean(attributes.displayAvatar, true);
  const displayDate = readBoolean(attributes.displayDate, true);
  const displayContent = readString(attributes.displayContent) || "excerpt";
  const comments = await getRenderLatestComments(commentsToShow).catch(() => []);

  return comments.slice(0, commentsToShow).map((comment) => {
    const link = articleLink(locale, {
      id: comment.articleId,
      year: comment.year,
      month: comment.month,
      day: comment.day,
    });
    const authorName = comment.authorName || strings(locale).anonymous;
    return (
      <li key={comment.id} className="wp-block-latest-comments__comment">
        <article>
          <footer className="wp-block-latest-comments__comment-meta">
            {displayAvatar ? (
              <img
                className="avatar avatar-48 photo wp-block-latest-comments__comment-avatar"
                src={comment.authorAvatar || DEFAULT_AVATAR}
                alt={authorName}
                width={48}
                height={48}
                decoding="async"
              />
            ) : null}
            <a className="wp-block-latest-comments__comment-author" href={link}>
              {authorName}
            </a>
            {` ${strings(locale).on} `}
            <a className="wp-block-latest-comments__comment-link" href={link}>
              {decodeEntities(comment.articleTitle)}
            </a>
            {displayDate ? (
              <time
                className="wp-block-latest-comments__comment-date"
                dateTime={comment.createdAt ? comment.createdAt.replace(" ", "T") : undefined}
              >
                {formatCommentDate(locale, comment.createdAt)}
              </time>
            ) : null}
          </footer>
          {displayContent !== "none" ? (
            <div className="wp-block-latest-comments__comment-excerpt">
              <p>
                {displayContent === "full"
                  ? comment.content
                  : trimCharacters(comment.content, 100)}
              </p>
            </div>
          ) : null}
        </article>
      </li>
    );
  });
}

async function SiteTitleBlock({ attributes, context }: DynamicBlockProps) {
  const settings = await getSiteSetting().catch(() => null);
  const title = decodeEntities(settings?.site_name ?? "").trim();
  if (!title) {
    return null;
  }
  if (attributes.isLink === false) {
    return <>{title}</>;
  }
  return (
    <a
      href={localePath(context.locale, "/")}
      rel="home"
      target={readString(attributes.linkTarget) === "_blank" ? "_blank" : undefined}
    >
      {title}
    </a>
  );
}

async function SiteTaglineBlock() {
  const settings = await getSiteSetting().catch(() => null);
  const tagline = decodeEntities(settings?.site_desc ?? "").trim();
  if (!tagline) {
    return null;
  }
  return <>{tagline}</>;
}

async function SiteLogoBlock({ attributes, context }: DynamicBlockProps) {
  const settings = await getSiteSetting().catch(() => null);
  const logo = settings?.logo ?? "";
  if (!logo) {
    return null;
  }
  const width = readNumber(attributes.width, 0);
  const image = (
    <img
      className="custom-logo"
      src={logo}
      alt={settings?.site_name || "Logo"}
      width={width || undefined}
    />
  );
  const isLink = attributes.isLink !== false;
  if (!isLink) {
    return image;
  }
  return (
    <a
      href={localePath(context.locale, "/")}
      className="custom-logo-link"
      rel="home"
      target={readString(attributes.linkTarget) === "_blank" ? "_blank" : undefined}
    >
      {image}
    </a>
  );
}

async function AvatarBlock({ attributes, context }: DynamicBlockProps) {
  const post = context.post;
  const userId = readNumber(attributes.userId, 0);
  let target: { id: number; name: string; avatar: string } | null = null;
  if (post && (!userId || userId === post.author.id)) {
    target = { id: post.author.id, name: post.author.name, avatar: post.author.avatar };
  } else if (userId) {
    const authors = await getRenderAuthors().catch(() => []);
    const author = authors.find((item) => item.id === userId);
    if (author) {
      target = { id: author.id, name: author.name, avatar: author.avatar };
    }
  }
  if (!target) {
    return null;
  }

  const size = Math.max(readNumber(attributes.size, 96), 1);
  const image = (
    <img
      className={`avatar avatar-${size} photo wp-block-avatar__image`}
      src={target.avatar || DEFAULT_AVATAR}
      alt={target.name || "Avatar"}
      width={size}
      height={size}
    />
  );
  if (!readBoolean(attributes.isLink)) {
    return image;
  }
  return (
    <a
      href={authorLink(context.locale, target.name)}
      className="wp-block-avatar__link"
      target={readString(attributes.linkTarget) === "_blank" ? "_blank" : undefined}
    >
      {image}
    </a>
  );
}

function BreadcrumbsBlock({ attributes, context }: DynamicBlockProps) {
  const post = context.post;
  if (!post) {
    return null;
  }
  const locale = context.locale;
  const showHomeItem = readBoolean(attributes.showHomeItem, true);
  const showCurrentItem = readBoolean(attributes.showCurrentItem, true);
  const items: Array<{ label: string; path: string }> = [];
  if (showHomeItem) {
    items.push({ label: strings(locale).home, path: localePath(locale, "/") });
  }
  items.push({ label: strings(locale).archive, path: localePath(locale, "/archive") });
  if (post.year && post.month && post.day) {
    const base = `/archive/${post.year}`;
    items.push({ label: String(post.year), path: localePath(locale, base) });
    items.push({
      label: pad(post.month),
      path: localePath(locale, `${base}/${pad(post.month)}`),
    });
    items.push({
      label: pad(post.day),
      path: localePath(locale, `${base}/${pad(post.month)}/${pad(post.day)}`),
    });
  }

  return (
    <ol>
      {items.map((item) => (
        <li key={item.path}>
          <a href={item.path}>{item.label}</a>
        </li>
      ))}
      {showCurrentItem ? (
        <li>
          <span aria-current="page">{decodeEntities(post.title)}</span>
        </li>
      ) : null}
    </ol>
  );
}

function PostAuthorNameBlock({ attributes, context }: DynamicBlockProps) {
  const post = context.post;
  if (!post) {
    return null;
  }
  const name = decodeEntities(post.author.name);
  if (!name) {
    return null;
  }
  if (!readBoolean(attributes.isLink)) {
    return <>{name}</>;
  }
  return (
    <a
      href={authorLink(context.locale, post.author.name)}
      className="wp-block-post-author-name__link"
      rel="author"
      target={readString(attributes.linkTarget) === "_blank" ? "_blank" : undefined}
    >
      {name}
    </a>
  );
}

function PostAuthorBiographyBlock({ context }: DynamicBlockProps) {
  const biography = context.post?.author.description ?? "";
  if (!biography.trim()) {
    return null;
  }
  return <div dangerouslySetInnerHTML={{ __html: biography }} />;
}

function PostCommentsCountBlock({ context }: DynamicBlockProps) {
  if (!context.post) {
    return null;
  }
  return <>{context.post.commentCount}</>;
}

function PostCommentsLinkBlock({ context }: DynamicBlockProps) {
  const post = context.post;
  if (!post) {
    return null;
  }
  const link = post.link ? `${post.link}#comments` : "#comments";
  return <a href={link}>{commentCountText(context.locale, post.commentCount)}</a>;
}

function PostNavigationLinkBlock({ attributes, context }: DynamicBlockProps) {
  const post = context.post;
  const adjacent = context.prevNext;
  if (!post || !adjacent) {
    return null;
  }
  const isNext = readString(attributes.type) !== "previous";
  // 沿用接口语义：prev 是更新的一篇、next 是更早的一篇。
  const adjacentPost = isNext ? adjacent.next : adjacent.prev;
  if (!adjacentPost) {
    return null;
  }
  const arrow = readString(attributes.arrow) || "none";
  const arrowMap: Record<string, string> = {
    none: "",
    arrow: isNext ? "→" : "←",
    chevron: isNext ? "»" : "«",
  };
  const displayArrow = arrowMap[arrow] ?? "";
  const showTitle = readBoolean(attributes.showTitle);
  const linkLabel = readBoolean(attributes.linkLabel);
  const customLabel = readString(attributes.label);
  const defaultLabel = isNext ? strings(context.locale).next : strings(context.locale).previous;
  const label = customLabel || defaultLabel;
  const link = articleLink(context.locale, adjacentPost);
  const title = decodeEntities(adjacentPost.title);

  let content: ReactNode;
  if (!showTitle) {
    content = <a href={link}>{label}</a>;
  } else if (linkLabel) {
    content = (
      <a href={link}>
        {label}: {title}
      </a>
    );
  } else {
    content = (
      <>
        {label}: <a href={link}>{title}</a>
      </>
    );
  }

  return (
    <>
      {!isNext && displayArrow ? (
        <span
          className={`wp-block-post-navigation-link__arrow-previous is-arrow-${arrow}`}
        >
          {displayArrow}
        </span>
      ) : null}
      {content}
      {isNext && displayArrow ? (
        <span
          className={`wp-block-post-navigation-link__arrow-next is-arrow-${arrow}`}
          aria-hidden
        >
          {displayArrow}
        </span>
      ) : null}
    </>
  );
}

function PostTermsBlock({ attributes, context }: DynamicBlockProps) {
  const post = context.post;
  if (!post) {
    return null;
  }
  const taxonomy = readString(attributes.term);
  if (taxonomy !== "category" && taxonomy !== "post_tag") {
    return null;
  }
  const terms = taxonomy === "category" ? post.categories : post.tags;
  if (terms.length === 0) {
    return null;
  }
  const separator = readString(attributes.separator) || ", ";
  const prefix = readString(attributes.prefix);
  const suffix = readString(attributes.suffix);

  return (
    <>
      {prefix ? (
        <span
          className="wp-block-post-terms__prefix"
          dangerouslySetInnerHTML={{ __html: prefix }}
        />
      ) : null}
      {terms.map((term, index) => (
        <span key={term.id}>
          {index > 0 ? (
            <span className="wp-block-post-terms__separator">{separator}</span>
          ) : null}
          <a
            href={termLink(context.locale, taxonomy, term.name)}
            rel="tag"
          >
            {decodeEntities(term.name)}
          </a>
        </span>
      ))}
      {suffix ? (
        <span
          className="wp-block-post-terms__suffix"
          dangerouslySetInnerHTML={{ __html: suffix }}
        />
      ) : null}
    </>
  );
}

function TermNameBlock({ attributes, context }: DynamicBlockProps) {
  const term = context.term;
  if (!term) {
    return null;
  }
  const name = decodeEntities(term.name);
  if (!readBoolean(attributes.isLink)) {
    return <>{name}</>;
  }
  return <a href={termLink(context.locale, term.taxonomy, term.name)}>{name}</a>;
}

function TermCountBlock({ attributes, context }: DynamicBlockProps) {
  const term = context.term;
  if (!term) {
    return null;
  }
  const brackets: Record<string, [string, string]> = {
    none: ["", ""],
    round: ["(", ")"],
    square: ["[", "]"],
    curly: ["{", "}"],
    angle: ["<", ">"],
  };
  const [before, after] =
    brackets[readString(attributes.bracketType) || "round"] ?? brackets.round;
  return <>{`${before}${term.count}${after}`}</>;
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function IconBlock({ attributes }: DynamicBlockProps) {
  const record = getIconByName(readString(attributes.icon));
  if (!record) {
    return null;
  }
  const flips = [
    readBoolean(attributes.flipHorizontal) ? "is-flip-horizontal" : "",
    readBoolean(attributes.flipVertical) ? "is-flip-vertical" : "",
  ].filter(Boolean);
  const rotation = readNumber(attributes.rotation, 0);
  const ariaLabel = readString(attributes.ariaLabel);
  let svg = record.content;
  if (rotation) {
    // 图标自带 style，必须追加而不是再写一个 style 属性
    svg = /style="([^"]*)"/.test(svg)
      ? svg.replace(
          /style="([^"]*)"/,
          (_, inline: string) =>
            `style="${inline.replace(/;\s*$/, "")};rotate:${rotation}deg"`,
        )
      : svg.replace(/<svg\b/, `<svg style="rotate:${rotation}deg"`);
  }
  const extra: string[] = [];
  if (flips.length > 0) {
    extra.push(`class="${flips.join(" ")}"`);
  }
  if (ariaLabel) {
    extra.push(`role="img" aria-label="${escapeAttribute(ariaLabel)}"`);
  }
  if (extra.length) {
    svg = svg.replace(/<svg\b/, `<svg ${extra.join(" ")}`);
  }

  return <>{parse(svg)}</>;
}

function SocialLinkBlock({ attributes }: DynamicBlockProps) {
  return (
    <GutenbergSocialLink
      service={readString(attributes.service)}
      url={readString(attributes.url)}
      label={readString(attributes.label)}
      rel={readString(attributes.rel) || undefined}
    />
  );
}

function SearchIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M13.5 6a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM11.9 10.7a6 6 0 1 0-1.2 1.2l4.9 4.9 1.2-1.2-4.9-4.9Z" />
    </svg>
  );
}

function SearchBlock({ attributes, context, instanceId }: DynamicBlockProps) {
  const locale = context.locale;
  const isEnglish = locale === "en-US";
  const label = readString(attributes.label) || (isEnglish ? "Search" : "搜索");
  const placeholder = readString(attributes.placeholder);
  const buttonText =
    readString(attributes.buttonText) || (isEnglish ? "Search" : "搜索");
  const showLabel = readBoolean(attributes.showLabel, true);
  const buttonUseIcon = readBoolean(attributes.buttonUseIcon);
  const buttonPosition =
    readString(attributes.buttonPosition) || "button-outside";
  const width = readNumber(attributes.width, 0);
  const widthUnit = readString(attributes.widthUnit) || "%";
  const inputId = `wp-block-search-input-${instanceId}`;

  const classes = ["wp-block-search"];
  if (buttonPosition === "button-inside") {
    classes.push("wp-block-search__button-inside");
  }
  if (buttonUseIcon && buttonPosition !== "no-button") {
    classes.push("wp-block-search__icon-button");
  }
  if (buttonPosition === "button-only") {
    classes.push("wp-block-search__button-only");
  }

  const formStyle: CSSProperties | undefined = width
    ? { width: `${width}${widthUnit}` }
    : undefined;
  const hasButton = buttonPosition !== "no-button";

  return (
    <form
      role="search"
      method="get"
      action={localePath(locale, "/search")}
      className={classes.join(" ")}
      style={formStyle}
    >
      <label
        htmlFor={inputId}
        className={
          showLabel ? "wp-block-search__label" : "wp-block-search__label screen-reader-text"
        }
      >
        {label}
      </label>
      <div className="wp-block-search__inside-wrapper">
        <input
          id={inputId}
          className="wp-block-search__input"
          type="search"
          name="q"
          placeholder={placeholder}
        />
        {hasButton ? (
          <button
            type="submit"
            className={`wp-block-search__button${buttonUseIcon ? " has-icon" : ""}`}
            aria-label={buttonText}
          >
            {buttonUseIcon ? <SearchIcon /> : buttonText}
          </button>
        ) : null}
      </div>
    </form>
  );
}

function navigationHref(url: string): string {
  return url || "#";
}

function NavigationLinkBlock({ attributes }: DynamicBlockProps) {
  const label =
    readString(attributes.label) ||
    readString(attributes.title) ||
    navigationHref(readString(attributes.url));
  const opensInNewTab = readBoolean(attributes.opensInNewTab);
  const rel = readString(attributes.rel);

  return (
    <li className="wp-block-navigation-item">
      <a
        className="wp-block-navigation-item__content"
        href={navigationHref(readString(attributes.url))}
        target={opensInNewTab ? "_blank" : undefined}
        rel={opensInNewTab ? rel || "noreferrer noopener" : rel || undefined}
      >
        {decodeEntities(label)}
      </a>
    </li>
  );
}

function NavigationSubmenuBlock({
  attributes,
  context,
  innerHtml,
  renderNested,
}: DynamicBlockProps) {
  const label =
    readString(attributes.label) ||
    readString(attributes.title) ||
    navigationHref(readString(attributes.url));
  const children = renderNested
    ? renderNested(innerHtml ?? "", context.post)
    : null;

  return (
    <li className="wp-block-navigation-item has-child">
      <a
        className="wp-block-navigation-item__content"
        href={navigationHref(readString(attributes.url))}
      >
        {decodeEntities(label)}
        <span className="wp-block-navigation__submenu-icon" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" focusable="false">
            <path d="m2 4 4 4 4-4" fill="none" stroke="currentColor" />
          </svg>
        </span>
      </a>
      <ul className="wp-block-navigation__submenu-container">{children}</ul>
    </li>
  );
}

function HomeLinkBlock({ context }: DynamicBlockProps) {
  return (
    <li className="wp-block-navigation-item">
      <a
        className="wp-block-navigation-item__content"
        href={localePath(context.locale, "/")}
      >
        {strings(context.locale).home}
      </a>
    </li>
  );
}

function NavigationBlock({
  attributes,
  context,
  innerHtml,
  renderNested,
}: DynamicBlockProps) {
  const wrapper = getBlockWrapper("core/navigation", attributes);
  const classNames = new Set(wrapper.className.split(/\s+/).filter(Boolean));
  if (readString(attributes.orientation) === "vertical") {
    classNames.add("is-vertical");
  }
  const ariaLabel = readString(attributes.ariaLabel);
  const children = renderNested
    ? renderNested(innerHtml ?? "", context.post)
    : null;

  return (
    <nav
      className={[...classNames].join(" ")}
      style={wrapper.style}
      id={wrapper.id}
      aria-label={ariaLabel || undefined}
    >
      <ul className="wp-block-navigation__container">{children}</ul>
    </nav>
  );
}

/** 汇总术语查询使用的记录 */
export async function getTermsForQuery(
  taxonomy: "category" | "post_tag",
): Promise<RenderTerm[]> {
  return taxonomy === "category"
    ? getRenderCategories().catch(() => [])
    : getRenderTags().catch(() => []);
}

/** 根据区块名生成异步服务端组件元素 */
export function renderDynamicBlock(name: string, props: DynamicBlockProps): ReactNode {
  switch (name) {
    case "core/archives":
      return <ArchiveContent {...props} />;
    case "core/calendar":
      return <CalendarContent {...props} />;
    case "core/categories":
      return <CategoriesBlock {...props} />;
    case "core/tag-cloud":
      return <TagCloudBlock {...props} />;
    case "core/latest-posts":
      return <LatestPostsBlock {...props} />;
    case "core/latest-comments":
      return <LatestCommentsBlock {...props} />;
    case "core/site-title":
      return <SiteTitleBlock {...props} />;
    case "core/site-tagline":
      return <SiteTaglineBlock />;
    case "core/site-logo":
      return <SiteLogoBlock {...props} />;
    case "core/avatar":
      return <AvatarBlock {...props} />;
    case "core/breadcrumbs":
      return <BreadcrumbsBlock {...props} />;
    case "core/post-author-name":
      return <PostAuthorNameBlock {...props} />;
    case "core/post-author-biography":
      return <PostAuthorBiographyBlock {...props} />;
    case "core/post-comments-count":
      return <PostCommentsCountBlock {...props} />;
    case "core/post-comments-link":
      return <PostCommentsLinkBlock {...props} />;
    case "core/post-navigation-link":
      return <PostNavigationLinkBlock {...props} />;
    case "core/post-terms":
      return <PostTermsBlock {...props} />;
    case "core/term-name":
      return <TermNameBlock {...props} />;
    case "core/term-count":
      return <TermCountBlock {...props} />;
    case "core/icon":
      return <IconBlock {...props} />;
    case "core/social-link":
      return <SocialLinkBlock {...props} />;
    case "core/search":
      return <SearchBlock {...props} />;
    case "core/navigation":
      return <NavigationBlock {...props} />;
    case "core/navigation-link":
      return <NavigationLinkBlock {...props} />;
    case "core/navigation-submenu":
      return <NavigationSubmenuBlock {...props} />;
    case "core/home-link":
      return <HomeLinkBlock {...props} />;
    default:
      return null;
  }
}
